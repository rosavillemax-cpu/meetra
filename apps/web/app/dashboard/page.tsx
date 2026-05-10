import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { BookingCard } from '@/components/bookings/BookingCard'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return null
  }

  const userId = session.user.id

  const [upcomingBookings, eventTypes, totalBookings] = await Promise.all([
    prisma.booking.findMany({
      where: {
        hostId: userId,
        status: 'confirmed',
        startAt: { gte: new Date() }
      },
      include: {
        eventType: { select: { id: true, slug: true, title: true, color: true, durationMin: true } },
        host: { select: { id: true, handle: true, name: true, image: true } }
      },
      orderBy: { startAt: 'asc' },
      take: 5
    }),
    prisma.eventType.findMany({
      where: { userId, active: true },
      orderBy: { id: 'desc' },
      take: 4
    }),
    prisma.booking.count({
      where: { hostId: userId, status: 'confirmed' }
    })
  ])

  const pastBookingsCount = await prisma.booking.count({
    where: { hostId: userId, startAt: { lt: new Date() }, status: 'confirmed' }
  })

  return (
    <div className="dashboard-overview">
      <div className="welcome-strip">
        <div>
          <h1>Hoş geldin{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}!</h1>
          <p className="page-subtitle">Randevularınızı yönetin</p>
        </div>
        <Link href="/dashboard/event-types" className="create-btn">
          + Yeni randevu tipi
        </Link>
      </div>

      <section className="stats-grid">
        <StatCard
          label="Yaklaşan randevular"
          value={upcomingBookings.length}
          icon="◷"
        />
        <StatCard
          label="Toplam randevu"
          value={totalBookings}
          icon="◬"
        />
        <StatCard
          label="Randevu tipleri"
          value={eventTypes.length}
          icon="◎"
        />
        <StatCard
          label="Geçmiş randevular"
          value={pastBookingsCount}
          icon="◭"
        />
      </section>

      {upcomingBookings.length > 0 && (
        <section className="upcoming-section">
          <div className="section-header">
            <h2>Yaklaşan randevular</h2>
            <Link href="/dashboard/bookings" className="view-all">
              Tümünü gör →
            </Link>
          </div>
          <div className="bookings-grid">
            {upcomingBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      )}

      {eventTypes.length > 0 && (
        <section className="event-types-section">
          <div className="section-header">
            <h2>Randevu tiplerin</h2>
            <Link href="/dashboard/event-types" className="view-all">
              Yönet →
            </Link>
          </div>
          <div className="event-types-grid">
            {eventTypes.map(et => (
              <Link key={et.id} href={`/dashboard/event-types/${et.id}`} className="event-type-mini">
                <div className="et-color" style={{ background: et.color }} />
                <span className="et-title">{et.title}</span>
                <span className="et-duration">{et.durationMin} dk</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {upcomingBookings.length === 0 && eventTypes.length === 0 && (
        <section className="empty-state">
          <div className="empty-icon">◈</div>
          <h2>Henüz randevu tipin yok</h2>
          <p>Randevu tiplerinizi oluşturarak başlayın</p>
          <Link href="/dashboard/event-types" className="create-btn">
            İlk randevu tipini oluştur
          </Link>
        </section>
      )}

      <style>{`
        .dashboard-overview {
          padding: 2rem;
          max-width: 1200px;
        }
        .welcome-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(167,139,250,0.08) 0%, transparent 70%);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem 2rem;
          margin-bottom: 2rem;
        }
        .welcome-strip h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }
        .create-btn {
          padding: 0.625rem 1rem;
          background: var(--primary);
          color: white;
          border-radius: var(--radius);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          transition: opacity 0.15s;
        }
        .create-btn:hover {
          opacity: 0.9;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .section-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }
        .view-all {
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
        }
        .view-all:hover {
          color: var(--text-primary);
        }
        .upcoming-section,
        .event-types-section {
          margin-bottom: 2.5rem;
        }
        .bookings-grid {
          display: grid;
          gap: 1rem;
        }
        .event-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
        }
        .event-type-mini {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all 0.15s;
        }
        .event-type-mini:hover {
          border-color: var(--text-tertiary);
        }
        .et-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .et-title {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .et-duration {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius-lg);
        }
        .empty-icon {
          font-size: 3rem;
          opacity: 0.3;
          margin-bottom: 1rem;
        }
        .empty-state h2 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        }
        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 1.5rem;
        }
      `}</style>
    </div>
  )
}
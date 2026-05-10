import Link from 'next/link'
import { Calendar, Users, Layers, CheckCircle2, ArrowRight, Plus, Clock, Settings } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatCard } from '@/components/dashboard/StatCard'
import { BookingCard } from '@/components/bookings/BookingCard'
import { WeekStrip } from '@/components/dashboard/WeekStrip'
import type { BookingWithRelations } from '@/components/dashboard/WeekStrip'

function getGreeting(name: string | null | undefined, isReturning?: boolean) {
  const h = new Date().getHours()
  const timeGreeting = h < 12 ? 'Günaydın' : h < 18 ? 'İyi öğlenler' : 'İyi akşamlar'
  const namePart = name ? `, ${name.split(' ')[0]}!` : '!'
  const fullGreeting = isReturning ? `${timeGreeting}${namePart}` : `Hoş geldin${namePart}`
  return fullGreeting
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id

  const [upcomingBookings, eventTypes, totalBookings, pastBookingsCount] = await Promise.all([
    prisma.booking.findMany({
      where: { hostId: userId, status: 'confirmed', startAt: { gte: new Date() } },
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
      take: 6
    }),
    prisma.booking.count({ where: { hostId: userId, status: 'confirmed' } }),
    prisma.booking.count({ where: { hostId: userId, startAt: { lt: new Date() }, status: 'confirmed' } })
  ])

  const firstName = session.user.name?.split(' ')[0] ?? ''
  const todayStr = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })
  const isReturning = (session.user as any)?.isReturning
  const greeting = getGreeting(firstName, isReturning)

  return (
    <div className="page">

      {/* ─── Welcome ─── */}
      <div className="welcome">
        <div>
          <div className="greeting-pill">
            <span className="pulse-dot" />
            {greeting}
          </div>
          <h1>{firstName || 'Hoş geldin'}!</h1>
          <p className="date-str">{todayStr}</p>
        </div>
        <Link href="/dashboard/event-types" className="new-btn">
          <Plus size={14} strokeWidth={2.5} />
          Yeni randevu tipi
        </Link>
      </div>

      {/* ─── Stats ─── */}
      <div className="stats">
        <StatCard
          label="Yaklaşan"
          value={upcomingBookings.length}
          icon={<Calendar size={14} />}
          accent="var(--primary)"
          sparkIndex={0}
        />
        <StatCard
          label="Toplam randevu"
          value={totalBookings}
          icon={<Users size={14} />}
          accent="var(--success)"
          sparkIndex={1}
        />
        <StatCard
          label="Randevu tipleri"
          value={eventTypes.length}
          icon={<Layers size={14} />}
          accent="#60a5fa"
          sparkIndex={2}
        />
        <StatCard
          label="Geçmiş"
          value={pastBookingsCount}
          icon={<CheckCircle2 size={14} />}
          accent="var(--text-tertiary)"
          sparkIndex={3}
        />
      </div>

      {/* ─── Week strip (interactive, clickable) ─── */}
      <WeekStrip bookings={upcomingBookings as BookingWithRelations[]} />

      {/* ─── Body ─── */}
      <div className="body">

        {/* Upcoming bookings */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">
              <Clock size={14} className="ph-icon" />
              <span>Yaklaşan randevular</span>
            </div>
            <Link href="/dashboard/bookings" className="see-all">
              Tümü <ArrowRight size={11} />
            </Link>
          </div>

          {upcomingBookings.length > 0 ? (
            <div className="booking-rows">
              {upcomingBookings.map(b => (
                <BookingCard key={b.id} booking={b as Parameters<typeof BookingCard>[0]['booking']} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <svg viewBox="0 0 96 96" fill="none" className="empty-art">
                <rect x="12" y="22" width="72" height="62" rx="6" stroke="currentColor" strokeWidth="1.5" />
                <line x1="12" y1="38" x2="84" y2="38" stroke="currentColor" strokeWidth="1.5" />
                <line x1="30" y1="12" x2="30" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="66" y1="12" x2="66" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="22" y="46" width="13" height="10" rx="2" fill="currentColor" opacity="0.25" />
                <rect x="41" y="46" width="13" height="10" rx="2" fill="currentColor" opacity="0.12" />
                <rect x="60" y="46" width="13" height="10" rx="2" fill="currentColor" opacity="0.12" />
                <rect x="22" y="62" width="13" height="10" rx="2" fill="currentColor" opacity="0.12" />
                <rect x="41" y="62" width="13" height="10" rx="2" fill="currentColor" opacity="0.25" />
                <rect x="60" y="62" width="13" height="10" rx="2" fill="currentColor" opacity="0.12" />
                <rect x="22" y="78" width="13" height="10" rx="2" fill="currentColor" opacity="0.12" />
                <rect x="41" y="78" width="13" height="10" rx="2" fill="currentColor" opacity="0.12" />
                <rect x="22" y="46" width="13" height="10" rx="2" stroke="currentColor" strokeOpacity="0.4" />
              </svg>
              <p className="empty-title">Randevu yok</p>
              <p className="empty-sub">Yaklaşan randevunuz bulunmuyor.<br />İlk randevunuzu almak için müsaitlik ayarlarından başlayın.</p>
              <Link href="/dashboard/event-types" className="empty-cta">
                Randevu tipi oluştur →
              </Link>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <aside className="sidebar-col">

          {/* Event types */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Layers size={14} className="ph-icon" />
                <span>Randevu tiplerin</span>
              </div>
              <Link href="/dashboard/event-types" className="see-all">
                Yönet <ArrowRight size={11} />
              </Link>
            </div>

            {eventTypes.length > 0 ? (
              <div className="et-list">
                {eventTypes.map(et => (
                  <Link key={et.id} href="/dashboard/event-types" className="et-row">
                    <span className="et-dot" style={{ background: et.color }} />
                    <span className="et-name">{et.title}</span>
                    <span className="et-dur">{et.durationMin}dk</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="et-empty">
                <p>Henüz randevu tipin yok</p>
                <Link href="/dashboard/event-types" className="et-cta">
                  <Plus size={12} />
                  Oluştur
                </Link>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <span>Hızlı erişim</span>
              </div>
            </div>
            <div className="ql-list">
              <Link href="/dashboard/availability" className="ql-item">
                <div className="ql-icon"><Calendar size={13} /></div>
                <span>Müsaitlik ayarla</span>
                <ArrowRight size={11} className="ql-arrow" />
              </Link>
              <Link href="/dashboard/settings" className="ql-item">
                <div className="ql-icon"><Settings size={13} /></div>
                <span>Profili düzenle</span>
                <ArrowRight size={11} className="ql-arrow" />
              </Link>
              <Link href="/dashboard/bookings" className="ql-item">
                <div className="ql-icon"><Users size={13} /></div>
                <span>Tüm randevular</span>
                <ArrowRight size={11} className="ql-arrow" />
              </Link>
            </div>
          </div>

        </aside>
      </div>

      <style>{`
        .page {
          padding: 2rem;
          max-width: 1200px;
        }

        /* Welcome */
        .welcome {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1.75rem;
          border-bottom: 1px solid var(--border);
          gap: 1rem;
        }
        .greeting-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.65rem;
          background: var(--primary-bg);
          border: 1px solid rgba(167,139,250,0.25);
          border-radius: 999px;
          font-size: 0.725rem;
          font-weight: 500;
          color: var(--primary);
          margin-bottom: 0.625rem;
        }
        .pulse-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--primary);
          animation: pulse 2.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(0.8); }
        }
        .welcome h1 {
          font-size: 1.875rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 0.2rem;
          color: var(--text-primary);
        }
        .date-str {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          margin: 0;
        }
        .new-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.6rem 1.125rem;
          background: var(--primary);
          color: #fff;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .new-btn:hover { opacity: 0.88; }

        /* Stats */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        /* Body */
        .body {
          display: grid;
          grid-template-columns: 1fr 268px;
          gap: 1.25rem;
          align-items: start;
        }

        /* Panels */
        .panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          margin-bottom: 1.25rem;
        }
        .panel:last-child { margin-bottom: 0; }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.125rem;
          border-bottom: 1px solid var(--border);
        }
        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .ph-icon { color: var(--text-tertiary); }
        .see-all {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.15s;
        }
        .see-all:hover { color: var(--primary); }

        /* Bookings */
        .booking-rows { display: flex; flex-direction: column; }

        /* Empty state */
        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 2rem;
          text-align: center;
          gap: 0.5rem;
        }
        .empty-art {
          width: 80px;
          height: 80px;
          color: var(--text-tertiary);
          opacity: 0.55;
          margin-bottom: 0.5rem;
        }
        .empty-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin: 0;
        }
        .empty-sub {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          margin: 0 0 0.5rem;
        }
        .empty-cta {
          font-size: 0.8125rem;
          color: var(--primary);
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .empty-cta:hover { opacity: 0.8; }

        /* Event types */
        .et-list { display: flex; flex-direction: column; }
        .et-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.6875rem 1.125rem;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .et-row:last-child { border-bottom: none; }
        .et-row:hover { background: rgba(255,255,255,0.03); }
        .et-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .et-name {
          flex: 1;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .et-dur {
          font-size: 0.725rem;
          color: var(--text-tertiary);
          font-variant-numeric: tabular-nums;
        }
        .et-empty {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.125rem;
        }
        .et-empty p { font-size: 0.8125rem; color: var(--text-tertiary); margin: 0; }
        .et-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.7rem;
          background: var(--primary);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .et-cta:hover { opacity: 0.88; }

        /* Quick links */
        .ql-list { display: flex; flex-direction: column; }
        .sidebar-col {
          position: sticky;
          top: 1.5rem;
          align-self: start;
        }
        .ql-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.6875rem 1.125rem;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: all 0.15s;
        }
        .ql-item:last-child { border-bottom: none; }
        .ql-item:hover { background: rgba(255,255,255,0.03); color: var(--text-primary); }
        .ql-icon {
          width: 24px;
          height: 24px;
          border-radius: 5px;
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          flex-shrink: 0;
        }
        .ql-item:hover .ql-icon { color: var(--primary); }
        .ql-arrow { margin-left: auto; color: var(--text-tertiary); opacity: 0; transition: opacity 0.15s; }
        .ql-item:hover .ql-arrow { opacity: 1; }

        /* Responsive */
        @media (max-width: 960px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .body { grid-template-columns: 1fr; }
          .sidebar-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
          .sidebar-col .panel { margin-bottom: 0; }
        }
        @media (max-width: 640px) {
          .page { padding: 1.25rem; }
          .welcome { flex-direction: column; align-items: flex-start; }
          .stats { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .sidebar-col { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

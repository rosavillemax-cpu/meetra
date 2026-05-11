'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Plus,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  ChevronRight,
  CalendarPlus
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { BookingCard } from '@/components/bookings/BookingCard'
import type { Booking, EventType } from '@prisma/client'

type BookingWithRelations = Booking & {
  eventType: Pick<EventType, 'id' | 'slug' | 'title' | 'color' | 'durationMin'>
  host: { id: string; handle: string; name: string | null; image: string | null }
}

type EventTypeWithCount = EventType & { _count?: { bookings: number } }

export default function DashboardClient({
  userName,
  initialBookings,
  initialEventTypes,
  totalBookings,
  pastBookingsCount
}: {
  userName: string | null | undefined
  initialBookings: BookingWithRelations[]
  initialEventTypes: EventTypeWithCount[]
  totalBookings: number
  pastBookingsCount: number
}) {
  const [upcomingBookings] = useState(initialBookings)
  const [eventTypes] = useState(initialEventTypes)

  const firstName = userName?.split(' ')[0] || null

  return (
    <div className="dashboard-overview">
      <header className="page-header">
        <div className="header-content">
          <h1>Hello{firstName ? `, ${firstName}` : ''}!</h1>
          <p className="page-subtitle">Manage your bookings and set your availability</p>
        </div>
        <Link href="/dashboard/event-types" className="create-btn">
          <Plus size={18} strokeWidth={2} />
          <span>New event type</span>
        </Link>
      </header>

      <section className="stats-grid">
        <StatCard label="Upcoming" value={upcomingBookings.length} icon="calendar" />
        <StatCard label="Total bookings" value={totalBookings} icon="check" />
        <StatCard label="Event types" value={eventTypes.length} icon="users" />
        <StatCard label="Past bookings" value={pastBookingsCount} icon="clock" />
      </section>

      {upcomingBookings.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Upcoming bookings</h2>
            <Link href="/dashboard/bookings" className="view-all">
              View all <ChevronRight size={16} strokeWidth={2} />
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
        <section className="section">
          <div className="section-header">
            <h2>Your event types</h2>
            <Link href="/dashboard/event-types" className="view-all">
              Manage <ChevronRight size={16} strokeWidth={2} />
            </Link>
          </div>
          <div className="event-types-grid">
            {eventTypes.map(et => (
              <Link key={et.id} href="/dashboard/event-types" className="event-type-mini">
                <div className="et-color" style={{ background: et.color }} />
                <span className="et-title">{et.title}</span>
                <span className="et-duration">{et.durationMin}min</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {upcomingBookings.length === 0 && eventTypes.length === 0 && (
        <section className="empty-state">
          <div className="empty-icon">
            <CalendarPlus size={48} strokeWidth={1.25} />
          </div>
          <h2>You don&apos;t have any event types yet</h2>
          <p>Create your first event type to get started</p>
          <Link href="/dashboard/event-types" className="create-btn primary">
            <Plus size={18} strokeWidth={2} />
            <span>Create first event type</span>
          </Link>
        </section>
      )}

      <style jsx>{`
        .dashboard-overview {
          padding: 2.5rem;
          max-width: 1200px;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1.5rem;
        }
        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.375rem;
          letter-spacing: -0.03em;
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }
        .create-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          color: white;
          border-radius: var(--radius);
          text-decoration: none;
          font-size: 0.9375rem;
          font-weight: 600;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .create-btn:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
        }
        .create-btn:active {
          transform: translateY(0);
        }
        .create-btn.primary {
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .section {
          margin-bottom: 3rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }
        .section-header h2 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .view-all {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.15s ease;
        }
        .view-all:hover {
          color: var(--primary);
        }
        .bookings-grid {
          display: grid;
          gap: 1rem;
        }
        .event-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }
        .event-type-mini {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 1rem 1.25rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .event-type-mini:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-sm);
        }
        .et-color {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .et-title {
          flex: 1;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .et-duration {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius-lg);
          max-width: 480px;
          margin: 2rem auto;
        }
        .empty-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: var(--text-tertiary);
        }
        .empty-state h2 {
          font-size: 1.375rem;
          margin: 0 0 0.625rem;
          letter-spacing: -0.02em;
        }
        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 2rem;
          font-size: 1rem;
        }
      `}</style>
    </div>
  )
}
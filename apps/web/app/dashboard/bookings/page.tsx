'use client'

import { useState, useEffect } from 'react'
import { Calendar, Filter, LayoutList } from 'lucide-react'
import { BookingCard } from '@/components/bookings/BookingCard'
import { CalendarView } from '@/components/bookings/CalendarView'
import type { BookingWithRelations } from '@/components/bookings/BookingCard'

type FilterType = 'upcoming' | 'past' | 'cancelled' | 'all'
type ViewType = 'list' | 'calendar'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('upcoming')
  const [view, setView] = useState<ViewType>('calendar')
  const [hostId, setHostId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setHostId(data.id)
        }
      })
  }, [])

  useEffect(() => {
    if (!hostId) return

    const params = new URLSearchParams({ hostId })
    if (filter === 'upcoming') params.set('upcoming', 'true')
    else if (filter === 'past') params.set('upcoming', 'false')
    else if (filter === 'cancelled') params.set('status', 'cancelled')

    fetch(`/api/bookings?${params}`)
      .then(r => r.json())
      .then(data => {
        setBookings(data)
        setLoading(false)
      })
  }, [hostId, filter])

  const handleCancel = async (booking: BookingWithRelations) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    await fetch(`/api/bookings/${booking.id}?token=${booking.id}`, { method: 'DELETE' })
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b))
  }

  return (
    <div className="bookings-page">
      <header className="page-header">
        <div className="header-left">
          <h1>Bookings</h1>
          <p className="page-subtitle">View all your bookings</p>
        </div>
        <div className="header-right">
          <div className="filter-bar">
            <span className="filter-icon"><Filter size={16} /></span>
            {(['upcoming', 'past', 'cancelled', 'all'] as FilterType[]).map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'upcoming' ? 'Upcoming' : f === 'past' ? 'Past' : f === 'cancelled' ? 'Cancelled' : 'All'}
              </button>
            ))}
          </div>
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <LayoutList size={16} />
            </button>
            <button
              className={`view-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
              title="Calendar view"
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <p>No bookings yet</p>
        </div>
      ) : view === 'calendar' ? (
        <CalendarView bookings={bookings} />
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .bookings-page {
          padding: 2rem;
          max-width: 1200px;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .header-left {
          flex-shrink: 0;
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .view-toggle {
          display: flex;
          gap: 0.25rem;
          background: var(--surface-hover);
          padding: 0.25rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          flex-shrink: 0;
        }
        .view-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .view-btn:hover {
          color: var(--text-secondary);
        }
        .view-btn.active {
          background: var(--surface);
          color: var(--primary);
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem;
          background: var(--surface-hover);
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .filter-icon {
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          padding: 0 0.25rem;
        }
        .filter-btn {
          padding: 0.375rem 0.625rem;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.15s;
          font-weight: 500;
          white-space: nowrap;
        }
        .filter-btn:hover {
          color: var(--text-primary);
        }
        .filter-btn.active {
          background: var(--surface);
          color: var(--primary);
          box-shadow: 0 1px 2px rgba(0,0,0,0.06);
        }
        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-tertiary);
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-tertiary);
        }
        .empty-state p {
          margin-top: 0.5rem;
        }
        .bookings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .page-header {
            flex-direction: column;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
        }
        @media (max-width: 640px) {
          .bookings-page {
            padding: 1rem;
          }
          .filter-bar {
            flex-wrap: wrap;
            gap: 0.25rem;
          }
          .filter-btn {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
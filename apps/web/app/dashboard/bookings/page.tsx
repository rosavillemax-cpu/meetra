'use client'

import { useState, useEffect } from 'react'
import { Calendar, Filter } from 'lucide-react'
import { BookingCard } from '@/components/bookings/BookingCard'

type BookingWithRelations = {
  id: string
  startAt: Date
  endAt: Date
  status: string
  guestName: string
  guestEmail: string
  eventType: { id: string; slug: string; title: string; color: string; durationMin: number }
  host: { id: string; handle: string; name: string; image: string }
}

type FilterType = 'upcoming' | 'past' | 'cancelled' | 'all'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('upcoming')
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
    if (!confirm('Bu randevuyu iptal etmek istediğinize emin misiniz?')) return

    await fetch(`/api/bookings/${booking.id}?token=${booking.id}`, { method: 'DELETE' })
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'cancelled' } : b))
  }

  return (
    <div className="bookings-page">
      <header className="page-header">
        <div>
          <h1>Randevular</h1>
          <p className="page-subtitle">Tüm randevularınızı görüntüleyin</p>
        </div>
      </header>

      <div className="filter-bar">
        <Filter size={16} />
        {(['upcoming', 'past', 'cancelled', 'all'] as FilterType[]).map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'upcoming' ? 'Yaklaşan' : f === 'past' ? 'Geçmiş' : f === 'cancelled' ? 'İptal edilen' : 'Tümü'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <p>Henüz randevu yok</p>
        </div>
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
          max-width: 800px;
        }
        .page-header {
          margin-bottom: 1.5rem;
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
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
          color: var(--text-tertiary);
        }
        .filter-btn {
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-btn:hover {
          background: var(--surface-hover);
        }
        .filter-btn.active {
          background: var(--primary-bg);
          border-color: var(--primary);
          color: var(--primary);
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
      `}</style>
    </div>
  )
}
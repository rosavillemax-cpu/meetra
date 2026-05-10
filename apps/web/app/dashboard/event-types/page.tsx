'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { EventTypeCard } from '@/components/event-types/EventTypeCard'
import { CreateEventTypeModal } from '@/components/event-types/CreateEventTypeModal'
import type { EventType } from '@prisma/client'

type EventTypeWithCount = EventType & {
  _count?: { bookings: number }
  user?: { handle: string }
}

export default function EventTypesPage() {
  const [eventTypes, setEventTypes] = useState<EventTypeWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setUserId(data.id)
        }
      })
  }, [])

  useEffect(() => {
    if (!userId) return

    fetch(`/api/event-types?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        setEventTypes(data)
        setLoading(false)
      })
  }, [userId])

  const handleCreate = async (data: {
    title: string
    slug: string
    description?: string
    durationMin: number
    color: string
  }) => {
    if (!userId) return

    const res = await fetch('/api/event-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId })
    })

    if (res.ok) {
      const newEventType = await res.json()
      setEventTypes(prev => [newEventType, ...prev])
    }
  }

  const handleDelete = async (eventType: EventType) => {
    if (!confirm('Bu randevu tipini silmek istediğinize emin misiniz?')) return

    const res = await fetch(`/api/event-types/${eventType.id}`, { method: 'DELETE' })
    if (res.ok) {
      setEventTypes(prev => prev.filter(et => et.id !== eventType.id))
    }
  }

  return (
    <div className="event-types-page">
      <header className="page-header">
        <div>
          <h1>Randevu Tipleri</h1>
          <p className="page-subtitle">Randevu tiplerinizi oluşturun ve yönetin</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="create-btn">
          <Plus size={16} />
          Yeni randevu tipi
        </button>
      </header>

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : eventTypes.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 96 96" fill="none" className="empty-icon">
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
            <path d="M38 72 L40 68 L42 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M54 72 L56 68 L58 72" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h2>Henüz randevu tipi yok</h2>
          <p>Randevu tiplerinizi oluşturduğunuzda burada görünecek</p>
          <button onClick={() => setShowCreateModal(true)} className="create-btn empty-btn">
            <Plus size={16} />
            Oluştur
          </button>
        </div>
      ) : (
        <div className="event-types-grid">
          {eventTypes.map(eventType => (
            <EventTypeCard
              key={eventType.id}
              eventType={eventType}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateEventTypeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
      />

      <style jsx>{`
        .event-types-page {
          padding: 2rem;
          max-width: 1000px;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 2rem;
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
        .create-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.625rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .create-btn:hover {
          opacity: 0.9;
        }
        .loading {
          text-align: center;
          padding: 3rem;
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
          width: 72px;
          height: 72px;
          color: var(--text-tertiary);
          opacity: 0.4;
          margin-bottom: 1.25rem;
        }
        .empty-state h2 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        }
        .empty-state p {
          color: var(--text-secondary);
          margin: 0 0 1.75rem;
          font-size: 0.875rem;
        }
        .empty-btn {
          padding: 0.75rem 1.5rem !important;
          font-size: 0.9375rem !important;
        }
        .event-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  )
}
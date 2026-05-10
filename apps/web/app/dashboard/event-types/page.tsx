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
          <div className="empty-icon">◬</div>
          <h2>Henüz randevu tipi yok</h2>
          <p>İlk randevu tipinizi oluşturun</p>
          <button onClick={() => setShowCreateModal(true)} className="create-btn">
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
        .event-types-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  )
}
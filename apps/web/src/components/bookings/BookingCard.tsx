'use client'

import { useState } from 'react'
import { Calendar, Clock, User, MoreVertical, X, Check } from 'lucide-react'
import type { Booking, EventType, User as PrismaUser } from '@prisma/client'

type BookingWithRelations = Booking & {
  eventType: Pick<EventType, 'id' | 'slug' | 'title' | 'color' | 'durationMin'>
  host: Pick<PrismaUser, 'id' | 'handle' | 'name' | 'image'>
}

interface BookingCardProps {
  booking: BookingWithRelations
  onCancel?: (booking: BookingWithRelations) => void
  showHost?: boolean
}

export function BookingCard({ booking, onCancel, showHost = false }: BookingCardProps) {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(new Date(date))
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    confirmed: { bg: 'var(--success-bg)', text: 'var(--success)', label: 'Onaylandı' },
    pending: { bg: 'var(--warning-bg)', text: 'var(--warning)', label: 'Bekliyor' },
    cancelled: { bg: 'var(--error-bg)', text: 'var(--error)', label: 'İptal edildi' },
  }

  const status = statusColors[booking.status] || statusColors.confirmed
  const isPast = new Date(booking.endAt) < new Date()
  const isCancelled = booking.status === 'cancelled'

  return (
    <div className={`booking-card ${isPast ? 'past' : ''} ${isCancelled ? 'cancelled' : ''}`}>
      <div className="booking-header">
        <div
          className="event-color"
          style={{ background: booking.eventType.color }}
        />
        <div className="booking-info">
          <h4>{booking.eventType.title}</h4>
          {showHost && booking.host && (
            <span className="host-name">{booking.host.name}</span>
          )}
        </div>
        <div className="booking-status" style={{ background: status.bg, color: status.text }}>
          {status.label}
        </div>
      </div>

      <div className="booking-datetime">
        <div className="datetime-item">
          <Calendar size={14} />
          <span>{formatDate(booking.startAt)}</span>
        </div>
        <div className="datetime-item">
          <Clock size={14} />
          <span>{formatTime(booking.startAt)} - {formatTime(booking.endAt)}</span>
        </div>
      </div>

      <div className="booking-guest">
        <User size={14} />
        <span>{booking.guestName}</span>
        <span className="guest-email">{booking.guestEmail}</span>
      </div>

      {!isPast && !isCancelled && (
        <div className="booking-actions">
          <button
            onClick={() => onCancel?.(booking)}
            className="cancel-btn"
          >
            <X size={14} />
            İptal et
          </button>
        </div>
      )}

      <style jsx>{`
        .booking-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
        }
        .booking-card.past {
          opacity: 0.6;
        }
        .booking-card.cancelled {
          opacity: 0.5;
        }
        .booking-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .event-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 0.35rem;
          flex-shrink: 0;
        }
        .booking-info {
          flex: 1;
          min-width: 0;
        }
        .booking-info h4 {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0;
        }
        .host-name {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .booking-status {
          font-size: 0.6875rem;
          padding: 0.1875rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 500;
          text-transform: uppercase;
        }
        .booking-datetime {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .datetime-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
        .booking-guest {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .guest-email {
          color: var(--text-tertiary);
          margin-left: 0.25rem;
        }
        .booking-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cancel-btn:hover {
          background: var(--error-bg);
          border-color: var(--error);
          color: var(--error);
        }
      `}</style>
    </div>
  )
}
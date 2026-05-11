'use client'

import { useState } from 'react'
import { Copy, Link2, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import type { EventType } from '@prisma/client'

interface EventTypeCardProps {
  eventType: EventType & {
    _count?: { bookings: number }
    user?: { handle: string }
  }
  onEdit?: (eventType: EventType) => void
  onDelete?: (eventType: EventType) => void
}

export function EventTypeCard({ eventType, onEdit, onDelete }: EventTypeCardProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const copyLink = async () => {
    const url = `${window.location.origin}/${eventType.user?.handle || 'u'}/${eventType.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="event-type-card">
      <div className="card-header">
        <div className="color-dot" style={{ background: eventType.color }} />
        <div className="card-title">
          <h3>{eventType.title}</h3>
          <span className="card-duration">{eventType.durationMin}min</span>
        </div>
        <div className="card-menu">
          <button onClick={() => setShowMenu(!showMenu)} className="menu-btn">
            <MoreVertical size={16} />
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={() => { onEdit?.(eventType); setShowMenu(false); }}>
                <Pencil size={14} /> Edit
              </button>
              <button onClick={() => { onDelete?.(eventType); setShowMenu(false); }} className="danger">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {eventType.description && (
        <p className="card-description">{eventType.description}</p>
      )}

      <div className="card-footer">
        <div className="card-stats">
          <span className="stat">
            <Link2 size={12} /> {eventType._count?.bookings || 0} bookings
          </span>
        </div>
        <div className="card-actions">
          <button onClick={copyLink} className="copy-btn">
            <Copy size={14} />
            {copied ? 'Copied!' : 'Copy link'}
          </button>
        </div>
      </div>

      {!eventType.active && <div className="inactive-badge">Inactive</div>}

      <style jsx>{`
        .event-type-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
          position: relative;
        }
        .card-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 0.35rem;
          flex-shrink: 0;
        }
        .card-title {
          flex: 1;
          min-width: 0;
        }
        .card-title h3 {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-primary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-duration {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .card-menu {
          position: relative;
        }
        .menu-btn {
          padding: 0.25rem;
          border-radius: var(--radius);
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
        }
        .menu-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0.25rem;
          min-width: 120px;
          z-index: 10;
        }
        .menu-dropdown button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: none;
          background: transparent;
          color: var(--text-primary);
          font-size: 0.875rem;
          cursor: pointer;
          border-radius: var(--radius);
        }
        .menu-dropdown button:hover {
          background: var(--surface-hover);
        }
        .menu-dropdown button.danger {
          color: var(--error);
        }
        .card-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 1rem;
          line-height: 1.5;
        }
        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .card-stats {
          display: flex;
          gap: 1rem;
        }
        .stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.4rem 0.875rem;
          border-radius: var(--radius);
          border: 1px solid var(--primary);
          background: var(--primary-bg);
          color: var(--primary);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .copy-btn:hover {
          background: var(--primary);
          color: #fff;
        }
        .inactive-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          font-size: 0.625rem;
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          background: var(--warning-bg);
          color: var(--warning);
          text-transform: uppercase;
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}
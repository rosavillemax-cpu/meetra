'use client'

import { Link2, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface EventTypeLink {
  id: string
  slug: string
  title: string
  color: string
  durationMin: number
}

interface BookingLinksListProps {
  handle: string
  eventTypes: EventTypeLink[]
}

export function BookingLinksList({ handle, eventTypes }: BookingLinksListProps) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div className="panel-title">
          <Link2 size={14} className="ph-icon" />
          <span>Booking links</span>
        </div>
      </div>
      <div className="et-links-list">
        {eventTypes.map(et => (
          <EventTypeLinkRow key={et.id} handle={handle} eventType={et} />
        ))}
      </div>

      <style jsx>{`
        .et-links-list :global(.et-link-row) {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.6875rem 1.125rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .et-links-list :global(.et-link-row:last-child) {
          border-bottom: none;
        }
        .et-links-list :global(.et-link-dot) {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .et-links-list :global(.et-link-name) {
          flex: 1;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .et-links-list :global(.et-link-copy) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: var(--text-tertiary);
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .et-links-list :global(.et-link-copy:hover) {
          background: rgba(255,255,255,0.06);
          color: var(--primary);
        }
        .et-links-list :global(.et-link-copy.copied) {
          color: var(--success);
        }
        .et-links-list :global(.et-link-open) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 5px;
          color: var(--text-tertiary);
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .et-links-list :global(.et-link-open:hover) {
          color: var(--primary);
        }
      `}</style>
    </div>
  )
}

function EventTypeLinkRow({ handle, eventType }: { handle: string; eventType: EventTypeLink }) {
  const [copied, setCopied] = useState(false)

  const bookingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${handle}/${eventType.slug}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="et-link-row">
      <span className="et-link-dot" style={{ background: eventType.color }} />
      <span className="et-link-name" title={eventType.title}>
        {eventType.title}
      </span>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="et-link-open"
        title="Open booking page"
      >
        <ExternalLink size={11} />
      </a>
      <button
        className={`et-link-copy ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? <Check size={11} /> : <Link2 size={11} />}
      </button>
    </div>
  )
}
'use client'

import { Link2, Check, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface BookingLinkCardProps {
  handle: string
}

export function BookingLinkCard({ handle }: BookingLinkCardProps) {
  const [copied, setCopied] = useState(false)

  const bookingUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${handle}`

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
    <div className="booking-link-card">
      <div className="blc-header">
        <div className="blc-icon"><Link2 size={14} /></div>
        <span className="blc-title">Your booking link</span>
      </div>
      <p className="blc-desc">Share this link so people can book time with you.</p>
      <div className="blc-url-row">
        <span className="blc-url">{bookingUrl}</span>
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="blc-open"
          title="Open booking page"
        >
          <ExternalLink size={11} />
        </a>
      </div>
      <button className="blc-copy-btn" onClick={handleCopy}>
        {copied ? <><Check size={12} /> Copied!</> : <><Link2 size={12} /> Copy link</>}
      </button>

      <style jsx>{`
        .booking-link-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.125rem;
          margin-bottom: 1.25rem;
        }
        .blc-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.375rem;
        }
        .blc-icon {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: var(--primary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }
        .blc-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .blc-desc {
          font-size: 0.8rem;
          color: var(--text-tertiary);
          margin: 0 0 0.875rem;
        }
        .blc-url-row {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.75rem;
        }
        .blc-url {
          flex: 1;
          font-size: 0.775rem;
          color: var(--text-secondary);
          font-family: 'DM Mono', monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .blc-open {
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .blc-open:hover { color: var(--primary); }
        .blc-copy-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.625rem 1rem;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
          font-family: inherit;
        }
        .blc-copy-btn:hover { opacity: 0.88; }
      `}</style>
    </div>
  )
}
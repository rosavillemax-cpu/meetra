'use client'

import { Link2, Check } from 'lucide-react'
import { useState } from 'react'

interface CopyBookingLinkProps {
  handle: string
}

export function CopyBookingLink({ handle }: CopyBookingLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/${handle}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button className="ql-item copy-link-item" onClick={handleCopy}>
      <div className="ql-icon"><Link2 size={13} /></div>
      <span>{copied ? 'Link copied!' : 'Copy booking link'}</span>
      <div className="ql-check">{copied ? <Check size={11} /> : null}</div>
      <style jsx>{`
        .copy-link-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.6875rem 1.125rem;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          transition: all 0.15s;
          background: transparent;
          border-radius: 0;
          font-family: inherit;
          cursor: pointer;
          text-align: left;
        }
        .copy-link-item:hover { background: rgba(255,255,255,0.03); color: var(--text-primary); }
        .copy-link-item:last-child { border-bottom: none; }
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
        .copy-link-item:hover .ql-icon { color: var(--primary); }
        .ql-check { margin-left: auto; color: var(--success); }
      `}</style>
    </button>
  )
}
'use client'

import type { ReactNode } from 'react'

const SPARKS = [
  'M0,18 L7,15 L14,16 L21,11 L28,13 L35,9 L42,11 L49,7 L56,9 L64,5',
  'M0,19 L7,17 L14,18 L21,14 L28,15 L35,11 L42,12 L49,8 L56,10 L64,6',
  'M0,16 L7,14 L14,15 L21,12 L28,14 L35,11 L42,12 L49,9 L56,11 L64,8',
  'M0,17 L7,16 L14,17 L21,13 L28,15 L35,12 L42,13 L49,10 L56,12 L64,9',
]

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
  accent?: string
  sparkIndex?: number
}

export function StatCard({ label, value, icon, accent = 'var(--primary)', sparkIndex = 0 }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="icon-chip">{icon}</div>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      <svg className="sparkline" viewBox="0 0 64 20" fill="none" preserveAspectRatio="none">
        <path
          d={SPARKS[sparkIndex % SPARKS.length]}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="spark-path"
        />
      </svg>

      <style jsx>{`
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-top: 2px solid ${accent};
          border-radius: var(--radius);
          padding: 1.125rem 1.25rem 0.875rem;
          position: relative;
          transition: border-color 0.2s;
        }
        .stat-card:hover {
          border-color: rgba(255,255,255,0.1);
          border-top-color: ${accent};
        }
        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .icon-chip {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${accent};
          background: rgba(255,255,255,0.06);
          flex-shrink: 0;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.04em;
          margin-bottom: 0.875rem;
        }
        .sparkline {
          width: 100%;
          height: 20px;
          color: ${accent};
          display: block;
          opacity: 0.45;
        }
        .spark-path {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: draw-spark 1.2s ease-out forwards;
        }
        @keyframes draw-spark {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  )
}

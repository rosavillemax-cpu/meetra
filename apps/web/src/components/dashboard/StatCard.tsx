'use client'

interface StatCardProps {
  label: string
  value: string | number
  trend?: { value: number; label: string }
  icon?: string
}

export function StatCard({ label, value, trend, icon }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        {icon && <span className="stat-icon">{icon}</span>}
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trend.value >= 0 ? 'positive' : 'negative'}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          <span className="trend-label">{trend.label}</span>
        </div>
      )}

      <style jsx>{`
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
        }
        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .stat-icon {
          font-size: 1rem;
          color: var(--primary);
        }
        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .stat-value {
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
        }
        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }
        .stat-trend.positive {
          color: var(--success);
        }
        .stat-trend.negative {
          color: var(--error);
        }
        .trend-label {
          color: var(--text-tertiary);
          margin-left: 0.25rem;
        }
      `}</style>
    </div>
  )
}
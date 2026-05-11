'use client'

export function BookingSkeleton() {
  return (
    <div className="booking-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-color" />
        <div className="skeleton-info">
          <div className="skeleton-line short" />
        </div>
        <div className="skeleton-badge" />
      </div>
      <div className="skeleton-datetime">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
      <div className="skeleton-guest">
        <div className="skeleton-line" />
      </div>
      <style jsx>{`
        .booking-skeleton {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1rem 1.25rem;
        }
        .skeleton-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .skeleton-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--surface2);
          animation: pulse 1.5s infinite;
        }
        .skeleton-info {
          flex: 1;
        }
        .skeleton-line {
          height: 12px;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-line.short {
          width: 60%;
        }
        .skeleton-badge {
          width: 60px;
          height: 20px;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-datetime {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .skeleton-datetime .skeleton-line {
          width: 100px;
        }
        .skeleton-guest {
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .skeleton-guest .skeleton-line {
          width: 150px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export function EventTypeSkeleton() {
  return (
    <div className="event-type-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-color" />
        <div className="skeleton-info">
          <div className="skeleton-line" />
          <div className="skeleton-line short" />
        </div>
      </div>
      <div className="skeleton-meta">
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
      <style jsx>{`
        .event-type-skeleton {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }
        .skeleton-header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .skeleton-color {
          width: 40px;
          height: 40px;
          border-radius: var(--radius);
          background: var(--surface2);
          animation: pulse 1.5s infinite;
        }
        .skeleton-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .skeleton-line {
          height: 14px;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-line.short {
          width: 50%;
        }
        .skeleton-meta {
          display: flex;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .skeleton-meta .skeleton-line {
          height: 12px;
          width: 80px;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}

export function CalendarSkeleton() {
  const days = Array(35).fill(null)
  return (
    <div className="calendar-skeleton">
      <div className="skeleton-layout">
        <div className="skeleton-sidebar">
          <div className="skeleton-header">
            <div className="skeleton-line" />
            <div className="skeleton-nav">
              <div className="skeleton-btn" />
              <div className="skeleton-btn" />
            </div>
          </div>
          <div className="skeleton-grid">
            {Array(7).fill(null).map((_, i) => (
              <div key={`header-${i}`} className="skeleton-day-header" />
            ))}
            {days.map((_, i) => (
              <div key={`day-${i}`} className="skeleton-day-cell" />
            ))}
          </div>
        </div>
        <div className="skeleton-detail">
          <div className="skeleton-detail-header">
            <div className="skeleton-line" />
            <div className="skeleton-btn" />
          </div>
          <div className="skeleton-meetings">
            {Array(3).fill(null).map((_, i) => (
              <div key={`meeting-${i}`} className="skeleton-meeting">
                <div className="skeleton-meeting-color" />
                <div className="skeleton-meeting-body">
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .calendar-skeleton {
          width: 100%;
          max-width: 1100px;
        }
        .skeleton-layout {
          display: grid;
          grid-template-columns: 42% 58%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .skeleton-sidebar {
          padding: 1.25rem 1rem;
          border-right: 1px solid var(--border);
        }
        .skeleton-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          padding: 0 0.5rem;
        }
        .skeleton-header .skeleton-line {
          width: 120px;
          height: 16px;
        }
        .skeleton-nav {
          display: flex;
          gap: 0.5rem;
        }
        .skeleton-btn {
          width: 32px;
          height: 32px;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 3px;
          padding: 0.5rem 0;
        }
        .skeleton-day-header {
          aspect-ratio: 1;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-day-cell {
          aspect-ratio: 1;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-detail {
          padding: 1.25rem 1.5rem;
        }
        .skeleton-detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }
        .skeleton-detail-header .skeleton-line {
          width: 150px;
          height: 18px;
        }
        .skeleton-meetings {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .skeleton-meeting {
          display: flex;
          background: var(--surface2);
          border-radius: var(--radius);
          overflow: hidden;
          animation: pulse 1.5s infinite;
        }
        .skeleton-meeting-color {
          width: 4px;
          background: var(--surface-hover);
        }
        .skeleton-meeting-body {
          flex: 1;
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .skeleton-meeting-body .skeleton-line {
          height: 12px;
          background: var(--surface-hover);
          border-radius: var(--radius-sm);
        }
        .skeleton-meeting-body .skeleton-line.short {
          width: 60%;
        }
        .skeleton-line {
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 900px) {
          .skeleton-layout {
            grid-template-columns: 1fr;
          }
          .skeleton-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
        }
      `}</style>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">
      <div className="skeleton-stats">
        {Array(4).fill(null).map((_, i) => (
          <div key={i} className="skeleton-stat">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>
        ))}
      </div>
      <div className="skeleton-section">
        <div className="skeleton-section-header">
          <div className="skeleton-line" />
          <div className="skeleton-btn" />
        </div>
        <div className="skeleton-cards">
          {Array(3).fill(null).map((_, i) => (
            <EventTypeSkeleton key={i} />
          ))}
        </div>
      </div>
      <style jsx>{`
        .dashboard-skeleton {
          padding: 2rem;
          max-width: 1200px;
        }
        .skeleton-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .skeleton-stat {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .skeleton-stat .skeleton-line {
          height: 14px;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-stat .skeleton-line.short {
          width: 50%;
        }
        .skeleton-section {
          margin-bottom: 2rem;
        }
        .skeleton-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .skeleton-section-header .skeleton-line {
          width: 150px;
          height: 20px;
          background: var(--surface2);
          border-radius: var(--radius-sm);
          animation: pulse 1.5s infinite;
        }
        .skeleton-btn {
          width: 120px;
          height: 36px;
          background: var(--surface2);
          border-radius: var(--radius);
          animation: pulse 1.5s infinite;
        }
        .skeleton-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
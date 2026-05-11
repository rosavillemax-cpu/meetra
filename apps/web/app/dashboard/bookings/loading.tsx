import { CalendarSkeleton } from '@/components/skeletons'

export default function BookingsLoading() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          height: '28px',
          width: '120px',
          background: 'var(--surface2)',
          borderRadius: '4px',
          marginBottom: '8px',
          animation: 'pulse 1.5s infinite'
        }} />
        <div style={{
          height: '16px',
          width: '200px',
          background: 'var(--surface2)',
          borderRadius: '4px',
          animation: 'pulse 1.5s infinite'
        }} />
      </div>
      <CalendarSkeleton />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
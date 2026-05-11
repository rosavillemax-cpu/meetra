import { EventTypeSkeleton } from '@/components/skeletons'

export default function EventTypesLoading() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{
            height: '28px',
            width: '150px',
            background: 'var(--surface2)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '0.5rem',
            animation: 'pulse 1.5s infinite'
          }} />
          <div style={{
            height: '16px',
            width: '220px',
            background: 'var(--surface2)',
            borderRadius: 'var(--radius-sm)',
            animation: 'pulse 1.5s infinite'
          }} />
        </div>
        <div style={{
          height: '40px',
          width: '140px',
          background: 'var(--surface2)',
          borderRadius: 'var(--radius)',
          animation: 'pulse 1.5s infinite'
        }} />
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1rem'
      }}>
        {Array(6).fill(null).map((_, i) => (
          <EventTypeSkeleton key={i} />
        ))}
      </div>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
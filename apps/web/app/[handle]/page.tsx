import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ handle: string }>
}

function getBaseUrl() {
  // Server-side: use absolute URL from AUTH_URL or VERCEL_URL
  if (process.env.AUTH_URL) {
    return process.env.AUTH_URL.trim()
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  // Local dev
  return 'http://localhost:3000'
}

async function getUser(handle: string) {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/api/users/${handle}`, {
    cache: 'no-store'
  })
  if (!res.ok) return null
  return res.json()
}

export default async function UserPage({ params }: PageProps) {
  const { handle } = await params

  // Prevent reserved paths from being treated as user handles
  const RESERVED = ['api', 'auth', 'dashboard', 'confirmation', 'favicon.ico', '_next']
  if (RESERVED.includes(handle)) {
    notFound()
  }
  const user = await getUser(handle)

  if (!user) {
    notFound()
  }

  return (
    <div className="container" style={{ paddingTop: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          {user.handle.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.handle}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user.eventTypes?.length || 0} event types
        </p>
      </div>

      <div style={{
        borderTop: '1px solid var(--border)',
        paddingTop: '2rem'
      }}>
        <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Event Types
        </h2>

        {(!user.eventTypes || user.eventTypes.length === 0) ? (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            No event types created yet.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1px',
            background: 'var(--border)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden'
          }}>
            {user.eventTypes.map((eventType: {
              id: string
              slug: string
              title: string
              description: string | null
              durationMin: number
              color: string
            }) => (
              <Link
                key={eventType.id}
                href={`/${handle}/${eventType.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem 1.5rem',
                  background: 'var(--surface)',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: eventType.color || '#000'
                  }} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{eventType.title}</div>
                    {eventType.description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {eventType.description}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.875rem' }}>
                    {eventType.durationMin} min
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CancelPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const [loading, setLoading] = useState(true)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    params.then(async ({ id }) => {
      if (!token) {
        setError('Missing cancellation token')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/bookings/${id}?token=${token}`, {
          method: 'DELETE'
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to cancel booking')
        }

        setCancelled(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    })
  }, [params, token])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Cancelling booking...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)'
      }}>
        <div style={{
          maxWidth: 400,
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--error-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem'
          }}>
            ✕
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Cancellation Failed</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary)',
              color: 'white',
              borderRadius: 'var(--radius)',
              textDecoration: 'none'
            }}
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (cancelled) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--background)'
      }}>
        <div style={{
          maxWidth: 400,
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--success-bg)',
            border: '2px solid var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem',
            color: 'var(--success)'
          }}>
            ✓
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Booking Cancelled</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Your booking has been cancelled successfully.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius)',
              textDecoration: 'none'
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return null
}

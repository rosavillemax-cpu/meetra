'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
        Something went wrong
      </h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        We encountered an unexpected error.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 20px',
            background: '#6332E5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Try again
        </button>
        <Link href="/" style={{
          padding: '10px 20px',
          background: '#f3f4f6',
          color: '#333',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500
        }}>
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

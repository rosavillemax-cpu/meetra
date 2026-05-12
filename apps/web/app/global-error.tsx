'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '40px 20px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>
            Application Error
          </h1>
          <p style={{ color: '#666', margin: '16px 0 32px' }}>
            The application crashed. Please reload the page.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              background: '#6332E5',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  )
}

'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <html lang="en">
          <body>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '2rem',
              fontFamily: 'system-ui, sans-serif',
            }}>
              <div style={{ textAlign: 'center', maxWidth: '400px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  margin: '0 auto 1.5rem',
                  borderRadius: '50%',
                  background: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Something went wrong</h1>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>We&apos;re sorry, but something unexpected happened. Please try again.</p>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Reload page
                </button>
              </div>
            </div>
          </body>
        </html>
      )
    }

    return this.props.children
  }
}

export { GlobalErrorBoundary }
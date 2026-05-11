'use client'

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-fallback">
          <div className="error-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h2>Something went wrong</h2>
            <p>We&apos;re sorry, but something unexpected happened.</p>
            <button onClick={() => window.location.reload()}>
              Try again
            </button>
          </div>
          <style jsx>{`
            .error-fallback {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 200px;
              padding: 2rem;
              background: var(--surface);
              border: 1px solid var(--border);
              border-radius: var(--radius-lg);
            }
            .error-content {
              text-align: center;
              max-width: 320px;
            }
            .error-content svg {
              color: var(--error);
              margin-bottom: 1rem;
            }
            .error-content h2 {
              font-size: 1.125rem;
              font-weight: 600;
              margin: 0 0 0.5rem;
              color: var(--text-primary);
            }
            .error-content p {
              font-size: 0.875rem;
              color: var(--text-secondary);
              margin: 0 0 1.25rem;
            }
            .error-content button {
              padding: 0.5rem 1rem;
              background: var(--primary);
              color: white;
              border: none;
              border-radius: var(--radius);
              font-size: 0.875rem;
              font-weight: 500;
              cursor: pointer;
              transition: opacity 0.15s;
            }
            .error-content button:hover {
              opacity: 0.9;
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}
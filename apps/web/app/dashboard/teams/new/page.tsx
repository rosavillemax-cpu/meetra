'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Users, Check } from 'lucide-react'

export default function NewTeamPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === generateSlug(name)) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to create team')
        return
      }

      router.push(`/dashboard/teams/${data.id}`)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-team-page">
      <header className="page-header">
        <Link href="/dashboard/teams" className="back-btn">
          <ArrowLeft size={16} />
          Back to teams
        </Link>
      </header>

      <div className="form-container">
        <div className="form-header">
          <div className="form-icon">
            <Users size={24} />
          </div>
          <h1>Create a new team</h1>
          <p>Teams allow multiple people to host meetings with the same booking link</p>
        </div>

        <form onSubmit={handleSubmit} className="team-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Team name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Sales Team"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL slug</label>
            <div className="slug-input">
              <span className="slug-prefix">{typeof window !== 'undefined' ? window.location.origin : ''}/</span>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="sales-team"
                required
                pattern="[a-z0-9-]+"
              />
            </div>
            <span className="form-hint">Only lowercase letters, numbers, and hyphens</span>
          </div>

          <div className="form-actions">
            <Link href="/dashboard/teams" className="cancel-btn">
              Cancel
            </Link>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating...' : 'Create team'}
            </button>
          </div>
        </form>

        <div className="info-box">
          <div className="info-icon">
            <Check size={16} />
          </div>
          <div>
            <h4>Round Robin Routing</h4>
            <p>New team event types will automatically distribute bookings to the team member with the least bookings that day.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .new-team-page {
          padding: 2rem;
          max-width: 600px;
        }
        .page-header {
          margin-bottom: 2rem;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.15s;
        }
        .back-btn:hover { color: var(--text-primary); }
        .form-container {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 2rem;
        }
        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .form-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto 1rem;
          background: var(--primary-bg);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
        .form-header h1 {
          font-size: 1.25rem;
          margin: 0 0 0.5rem;
        }
        .form-header p {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .team-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .error-message {
          padding: 0.75rem 1rem;
          background: var(--error-bg);
          border: 1px solid var(--error);
          border-radius: var(--radius);
          color: var(--error);
          font-size: 0.875rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .form-group input {
          padding: 0.75rem 1rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.9375rem;
          color: var(--text-primary);
          transition: border-color 0.15s;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--primary);
        }
        .slug-input {
          display: flex;
          align-items: center;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .slug-input:focus-within {
          border-color: var(--primary);
        }
        .slug-prefix {
          padding: 0.75rem 0.75rem 0.75rem 1rem;
          color: var(--text-tertiary);
          font-size: 0.875rem;
          background: var(--surface2);
          border-right: 1px solid var(--border);
          white-space: nowrap;
        }
        .slug-input input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 1rem;
          font-size: 0.9375rem;
          color: var(--text-primary);
        }
        .slug-input input:focus {
          outline: none;
        }
        .form-hint {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .cancel-btn {
          padding: 0.75rem 1.25rem;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .cancel-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .submit-btn {
          flex: 1;
          padding: 0.75rem 1.25rem;
          background: var(--primary);
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .submit-btn:hover:not(:disabled) { opacity: 0.9; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .info-box {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--surface2);
          border-radius: var(--radius);
        }
        .info-icon {
          width: 28px;
          height: 28px;
          background: var(--success-bg);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--success);
          flex-shrink: 0;
        }
        .info-box h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }
        .info-box p {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          margin: 0;
        }
      `}</style>
    </div>
  )
}
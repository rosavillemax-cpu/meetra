'use client'

import { useState, useEffect } from 'react'
import { User, Globe, Hash } from 'lucide-react'

const TIMEZONES = [
  'Europe/Istanbul',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Dubai',
]

export default function SettingsPage() {
  const [handle, setHandle] = useState('')
  const [name, setName] = useState('')
  const [timezone, setTimezone] = useState('Europe/Istanbul')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [originalHandle, setOriginalHandle] = useState('')

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          fetchUser(data.handle)
        }
      })
  }, [])

  const fetchUser = async (handleOrId: string) => {
    try {
      const res = await fetch(`/api/users/${handleOrId}`)
      if (res.ok) {
        const user = await res.json()
        setHandle(user.handle || '')
        setOriginalHandle(user.handle || '')
        setName(user.name || '')
        setTimezone(user.timezone || 'Europe/Istanbul')
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const res = await fetch(`/api/users/${originalHandle}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, timezone, handle: handle !== originalHandle ? handle : undefined })
    })

    if (res.ok) {
      setSaved(true)
      if (handle !== originalHandle) {
        setOriginalHandle(handle)
      }
      setTimeout(() => setSaved(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error || 'An error occurred')
    }

    setSaving(false)
  }

  if (loading) {
    return <div className="settings-page"><div className="loading">Loading...</div></div>
  }

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences</p>
      </header>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-section">
          <h2>
            <User size={18} />
            Profile information
          </h2>

          <div className="form-group">
            <label>Full name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Adınız Soyadınız"
            />
          </div>

          <div className="form-group">
            <label>
              <Hash size={14} />
              Username (handle)
            </label>
            <div className="handle-input">
              <span className="handle-prefix">callroom.com/</span>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="kullanici-adi"
                required
              />
            </div>
            <span className="form-hint">Only letters, numbers and hyphens allowed</span>
          </div>
        </div>

        <div className="form-section">
          <h2>
            <Globe size={18} />
            Region and language
          </h2>

          <div className="form-group">
            <label>Timezone</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)}>
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {saved && <div className="success-message">Changes saved!</div>}

        <div className="form-actions">
          <button type="submit" disabled={saving} className="save-btn">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>

      <style jsx>{`
        .settings-page {
          padding: 2rem;
          max-width: 600px;
        }
        .page-header {
          margin-bottom: 2rem;
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .form-section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .form-section h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border);
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group:last-child {
          margin-bottom: 0;
        }
        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.375rem;
        }
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--background);
          color: var(--text-primary);
          font-size: 0.9375rem;
          transition: border-color 0.15s;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
          border-color: var(--primary);
        }
        .handle-input {
          display: flex;
          align-items: center;
        }
        .handle-prefix {
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--border);
          border-right: none;
          border-radius: var(--radius) 0 0 var(--radius);
          background: var(--surface-hover);
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }
        .handle-input input {
          border-radius: 0 var(--radius) var(--radius) 0;
        }
        .form-hint {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin-top: 0.25rem;
        }
        .error-message {
          padding: 0.75rem 1rem;
          background: var(--error-bg);
          color: var(--error);
          border-radius: var(--radius);
          font-size: 0.875rem;
        }
        .success-message {
          padding: 0.75rem 1rem;
          background: var(--success-bg);
          color: var(--success);
          border-radius: var(--radius);
          font-size: 0.875rem;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
        }
        .save-btn {
          padding: 0.625rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .save-btn:hover:not(:disabled) {
          opacity: 0.9;
        }
        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  )
}
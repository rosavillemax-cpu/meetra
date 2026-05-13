'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { WeekSchedule } from '@/components/availability/WeekSchedule'
import { useToast } from '@/components/ui/Toast'
import type { AvailabilityRule } from '@prisma/client'

const DEFAULT_RULES = [
  { weekday: 1, startTime: '09:00', endTime: '17:00' },
  { weekday: 2, startTime: '09:00', endTime: '17:00' },
  { weekday: 3, startTime: '09:00', endTime: '17:00' },
  { weekday: 4, startTime: '09:00', endTime: '17:00' },
  { weekday: 5, startTime: '09:00', endTime: '17:00' },
]

export default function AvailabilityPage() {
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) setUserId(data.id)
      })
  }, [])

  useEffect(() => {
    if (!userId) return
    fetch(`/api/availability?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setRules(data)
        } else {
          setRules([])
        }
        setLoading(false)
      })
  }, [userId])

  const handleAddRule = async (weekday: number, startTime: string, endTime: string) => {
    if (!userId) return
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, weekday, startTime, endTime })
    })
    if (res.ok) {
      const newRule = await res.json()
      setRules(prev => [...prev, newRule])
      setHasChanges(true)
    }
  }

  const handleDeleteRule = async (rule: AvailabilityRule) => {
    const res = await fetch(`/api/availability/${rule.id}`, { method: 'DELETE' })
    if (res.ok) {
      setRules(prev => prev.filter(r => r.id !== rule.id))
      setHasChanges(true)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      addToast('success', 'Availability saved')
      setHasChanges(false)
    } catch {
      addToast('error', 'Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="availability-page">
      <header className="page-header">
        <div>
          <h1>Availability</h1>
          <p className="page-subtitle">Set your weekly working hours</p>
        </div>
        <button
          className="save-btn"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? <Loader2 size={14} className="spin" /> : null}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {loading ? (
        <div className="loading">
          <Loader2 size={20} className="spin" />
          <span>Loading availability...</span>
        </div>
      ) : (
        <>
          <div className="info-card">
            <p>Your booking slots will be based on these hours. Changes take effect immediately after saving.</p>
          </div>

          <WeekSchedule
            rules={rules}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
            addToast={addToast}
          />
        </>
      )}

      <style jsx>{`
        .availability-page {
          padding: 2rem;
          max-width: 1100px;
        }
        .page-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .page-header h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 0.25rem;
          color: var(--text-primary);
        }
        .page-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.875rem;
        }
        .save-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s, background 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .save-btn:hover:not(:disabled) {
          background: var(--primary-hover);
        }
        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .info-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .info-card p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 3rem;
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .availability-page {
            padding: 1.25rem;
          }
          .page-header {
            flex-direction: column;
            align-items: stretch;
          }
          .save-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}
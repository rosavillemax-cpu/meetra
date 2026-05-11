'use client'

import { useState, useEffect } from 'react'
import { WeekSchedule } from '@/components/availability/WeekSchedule'
import type { AvailabilityRule } from '@prisma/client'

export default function AvailabilityPage() {
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

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
        setRules(data)
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
    }
  }

  const handleDeleteRule = async (rule: AvailabilityRule) => {
    const res = await fetch(`/api/availability/${rule.id}`, { method: 'DELETE' })
    if (res.ok) setRules(prev => prev.filter(r => r.id !== rule.id))
  }

  return (
    <div className="availability-page">
      <header className="page-header">
        <div>
          <h1>Availability</h1>
          <p className="page-subtitle">What days and times can guests book?</p>
        </div>
      </header>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="info-card">
            <p>Set your working hours for each day. Your bookings will be scheduled accordingly.</p>
          </div>

          <WeekSchedule
            rules={rules}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
          />
        </>
      )}

      <style jsx>{`
        .availability-page {
          padding: 2rem;
          max-width: 1100px;
        }
        .page-header {
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
          text-align: center;
          padding: 3rem;
          color: var(--text-tertiary);
          font-size: 0.875rem;
        }

        @media (max-width: 640px) {
          .availability-page {
            padding: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}

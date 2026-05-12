'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Slot {
  start: string
  end: string
}

interface EventType {
  id: string
  slug: string
  title: string
  description: string | null
  durationMin: number
  color: string
  bufferBefore: number
  bufferAfter: number
}

interface User {
  id: string
  handle: string
  timezone: string
}

export default function BookingPage({
  params
}: {
  params: Promise<{ handle: string; slug: string }>
}) {
  const router = useRouter()
  const [resolved, setResolved] = useState<{ handle: string; slug: string } | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    params.then((p) => {
      const RESERVED = ['api', 'auth', 'dashboard', 'confirmation', '_next']
      if (RESERVED.includes(p.handle)) {
setError('User or event not found')
        setLoading(false)
        return
      }
      setResolved(p)
    })
  }, [params])

  const fetchData = useCallback(async (handle: string, slug: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${handle}`)
      if (!res.ok) throw new Error('User not found')
      const userData = await res.json()
      setUser(userData)

      const eventTypeData = userData.eventTypes?.find((et: EventType) => et.slug === slug)
      if (!eventTypeData) throw new Error('Event type not found')
      setEventType(eventTypeData)

      const today = new Date()
      const dateStr = today.toISOString().split('T')[0] ?? ''
      setSelectedDate(dateStr)
    } catch (err) {
      setError('User or event not found')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSlots = useCallback(async (eventTypeId: string, date: string) => {
    try {
      const res = await fetch(`/api/event-types/${eventTypeId}/availability?date=${date}`)
      const data = await res.json()
      setSlots(data.slots || [])
    } catch {
      setSlots([])
    }
  }, [])

  useEffect(() => {
    if (resolved) {
      fetchData(resolved.handle, resolved.slug)
    }
  }, [resolved, fetchData])

  useEffect(() => {
    if (eventType && selectedDate) {
      fetchSlots(eventType.id, selectedDate)
    }
  }, [eventType, selectedDate, fetchSlots])

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !guestName || !guestEmail) return

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventTypeId: eventType!.id,
          guestEmail,
          guestName,
          startAt: selectedSlot.start,
          endAt: selectedSlot.end
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create booking')
      }

      const booking = await res.json()
      router.push(`/confirmation/${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const future = new Date()
    future.setDate(future.getDate() + 30)
    return future.toISOString().split('T')[0]
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    )
  }

  if (error || !user || !eventType) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--red-text)' }}>{error || 'Not found'}</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', maxWidth: '640px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: eventType.color || '#000'
          }} />
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {user.handle}
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{eventType.title}</h1>
        {eventType.description && (
          <p style={{ color: 'var(--text-secondary)' }}>{eventType.description}</p>
        )}
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {eventType.durationMin} minutes
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Date</span>
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            min={getMinDate()}
            max={getMaxDate()}
            required
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />
        </div>

        {selectedDate && (
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <span>Time</span>
            </label>
            {slots.length === 0 ? (
              <p style={{ color: 'var(--text-tertiary)', padding: '1rem 0' }}>
                No available hours on this date.
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem'
              }}>
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    style={{
                      padding: '0.75rem',
                      background: selectedSlot?.start === slot.start
                        ? 'var(--accent)'
                        : 'var(--surface)',
                      color: selectedSlot?.start === slot.start
                        ? 'var(--bg)'
                        : 'var(--text-primary)',
                      border: '1px solid',
                      borderColor: selectedSlot?.start === slot.start
                        ? 'var(--accent)'
                        : 'var(--border)',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.875rem',
                      fontFamily: 'DM Mono, monospace',
                      transition: 'all 0.15s'
                    }}
                  >
                    {formatTime(slot.start)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <h3 style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                Personal information
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  E-posta
                </label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  placeholder="ornek@email.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'var(--text-primary)',
                color: 'var(--bg)',
                borderRadius: 'var(--radius)',
                fontSize: '1rem',
                fontWeight: 500,
                opacity: submitting ? 0.6 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Submitting...' : 'Book'}
            </button>

            {error && (
              <p style={{ color: 'var(--red-text)', marginTop: '1rem', textAlign: 'center' }}>
                {error}
              </p>
            )}
          </>
        )}
      </form>
    </div>
  )
}
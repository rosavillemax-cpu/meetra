'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'

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
}

interface User {
  id: string
  handle: string
  timezone: string
}

export default function EmbedBookingPage({
  params
}: {
  params: Promise<{ handle: string; slug: string }>
}) {
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
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    params.then((p) => {
      const RESERVED = ['api', 'auth', 'dashboard', 'confirmation', '_next']
      if (RESERVED.includes(p.handle)) {
        setError('User not found')
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
      setError(err instanceof Error ? err.message : 'An error occurred')
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
      window.location.href = `/confirmation/${booking.id}`
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
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading...</div>
      </div>
    )
  }

  if (error || !user || !eventType) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>{error || 'Not found'}</div>
      </div>
    )
  }

  if (success) {
    return (
      <div style={containerStyle}>
        <div style={successStyle}>
          <h2 style={{ margin: '0 0 16px 0' }}>Booking Confirmed!</h2>
          <p style={{ color: '#666', margin: 0 }}>Check your email for confirmation.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      `}</style>

      <div style={cardStyle}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: eventType.color || '#000'
            }} />
            <span style={{ color: '#666', fontSize: '14px' }}>
              {user.handle}
            </span>
          </div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>{eventType.title}</h1>
          {eventType.description && (
            <p style={{ color: '#666', fontSize: '14px' }}>{eventType.description}</p>
          )}
          <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
            {eventType.durationMin} minutes
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              required
              style={inputStyle}
            />
          </div>

          {selectedDate && (
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Time</label>
              {slots.length === 0 ? (
                <p style={{ color: '#999', padding: '12px 0' }}>No available times on this date.</p>
              ) : (
                <div style={slotGridStyle}>
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        ...slotButtonStyle,
                        ...(selectedSlot?.start === slot.start ? slotButtonSelectedStyle : {})
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
              <div style={formCardStyle}>
                <h3 style={{ fontSize: '14px', marginBottom: '16px', color: '#666' }}>
                  Personal information
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    placeholder="Your name"
                    style={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    style={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...submitButtonStyle,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>

              {error && (
                <p style={{ color: '#dc2626', marginTop: '12px', textAlign: 'center' }}>
                  {error}
                </p>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f9fafb',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const loadingStyle: React.CSSProperties = {
  color: '#666',
  fontSize: '16px'
}

const errorStyle: React.CSSProperties = {
  color: '#dc2626',
  fontSize: '16px',
  textAlign: 'center'
}

const successStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '40px'
}

const cardStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '12px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151'
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '16px',
  color: '#1f2937',
  background: '#fff'
}

const slotGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px'
}

const slotButtonStyle: React.CSSProperties = {
  padding: '10px 8px',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  cursor: 'pointer',
  fontFamily: 'monospace'
}

const slotButtonSelectedStyle: React.CSSProperties = {
  background: '#6332E5',
  color: 'white',
  borderColor: '#6332E5'
}

const formCardStyle: React.CSSProperties = {
  background: '#f9fafb',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '20px'
}

const submitButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#1f2937',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 500
}
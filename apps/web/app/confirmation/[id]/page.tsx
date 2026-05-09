'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Booking {
  id: string
  guestEmail: string
  guestName: string
  startAt: string
  endAt: string
  status: string
  cancelToken: string
  eventType: {
    title: string
    durationMin: number
    color: string
    user: {
      handle: string
      email: string
      timezone: string
    }
  }
  host: {
    email: string
  }
}

export default function ConfirmationPage() {
  const params = useParams()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const id = (params as { id: string }).id
    if (!id) return

    fetch(`/api/bookings/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Rezervasyon bulunamadı')
        return res.json()
      })
      .then(setBooking)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [params])

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Yükleniyor...</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--red-text)' }}>{error || 'Bulunamadı'}</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', maxWidth: '540px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--green-dim)',
          border: '2px solid var(--green-text)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-text)" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Randevu Oluşturuldu</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {booking.guestName}, randevunuz başarıyla oluşturuldu.
        </p>
      </div>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: booking.eventType.color || '#000'
            }} />
            <span style={{ fontWeight: 500 }}>{booking.eventType.title}</span>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{formatDate(booking.startAt)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{formatTime(booking.startAt)} - {formatTime(booking.endAt)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>{booking.guestName}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{booking.guestEmail}</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Onay e-postası <strong style={{ color: 'var(--text-primary)' }}>{booking.guestEmail}</strong> adresine gönderildi.
        </p>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
          {booking.eventType.user.handle} kullanıcısı ile {booking.eventType.durationMin} dakikalık randevu.
        </p>
      </div>

      <div style={{
        background: 'var(--amber-dim)',
        border: '1px solid rgba(180,83,9,0.2)',
        borderRadius: 'var(--radius)',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--amber-text)' }}>
          Randevunuzu iptal etmek için bir sonraki sayfayı kullanabilirsiniz.
        </p>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.875rem 2rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem'
          }}
        >
          Ana Sayfaya Dön
        </a>
      </div>
    </div>
  )
}
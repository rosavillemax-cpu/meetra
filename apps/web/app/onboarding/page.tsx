import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const TIMEZONES = [
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'Vancouver (PST/PDT)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/Mexico_City', label: 'Mexico City (CST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET/CEST)' },
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)' },
  { value: 'Africa/Lagos', label: 'Lagos (WAT)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
]

export default async function OnboardingPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { handle: true, timezone: true }
  })

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
        Welcome to Callroom!
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        Let&apos;s get you set up. Your booking link will be{' '}
        <strong>callroom.com/{user?.handle}</strong>
      </p>

      <div style={{
        background: '#f9fafb',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '450px',
        width: '100%',
        marginBottom: '32px',
        textAlign: 'left'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>What you can do next:</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            'Create event types for booking',
            'Connect your calendar',
            'Set your availability',
            'Share your booking link',
          ].map((item) => (
            <li key={item} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#22c55e' }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Your timezone</h3>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
          Currently set to: <strong>{user?.timezone || 'Not set'}</strong>
        </p>
        <p style={{ color: '#999', fontSize: '13px', marginBottom: '16px' }}>
          You can change this later in Settings.
        </p>
        <Link href="/dashboard/event-types" style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: '#6332E5',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '14px'
        }}>
          Go to Settings to update timezone
        </Link>
      </div>

      <Link href="/dashboard/event-types" style={{
        padding: '14px 28px',
        background: '#6332E5',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: '16px'
      }}>
        Create your first event type →
      </Link>

      <p style={{ marginTop: '24px', color: '#999', fontSize: '14px' }}>
        or{' '}
        <Link href="/dashboard" style={{ color: '#6332E5' }}>
          go to your dashboard
        </Link>
      </p>
    </div>
  )
}

import Link from 'next/link'
import { LoginButton } from '@/components/LoginButton'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '1.5rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--text-primary)'
            }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.875rem' }}>
              CallRoom
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Link href="/dashboard" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Dashboard
            </Link>
            <LoginButton />
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem'
          }}>
            Randevularınızı<br />
            <span style={{ color: 'var(--text-secondary)' }}>kolayca planlayın</span>
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2rem'
          }}>
            CallRoom ile toplantı planlaması artık çok basit. Kendi randevu sayfanızı oluşturun, müsaitlik saatlerinizi ayarlayın ve gerisini CallRoom'ya bırakın.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a
              href="/dashboard"
              style={{
                padding: '0.875rem 1.75rem',
                background: 'var(--text-primary)',
                color: 'var(--bg)',
                borderRadius: 'var(--radius)',
                fontWeight: 500,
                fontSize: '0.9375rem'
              }}
            >
              Başla
            </a>
            <a
              href="#"
              style={{
                padding: '0.875rem 1.75rem',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontWeight: 500,
                fontSize: '0.9375rem'
              }}
            >
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
          CallRoom — Kolay randevu planlama
        </p>
      </footer>
    </div>
  )
}
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '1.5rem 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--text-primary)'
            }} />
            <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.875rem' }}>
              CallRoom
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Ana Sayfa
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, padding: '3rem 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Hoş geldiniz! Yakında burada randevularınızı yönetebileceksiniz.
          </p>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--text-secondary)' }}>
              Dashboard yakında eklenecek. Şimdilik landing sayfasına dönün.
            </p>
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
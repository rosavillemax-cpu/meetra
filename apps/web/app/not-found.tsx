import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#6332E5', margin: 0 }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', fontWeight: 600, margin: '16px 0 8px' }}>
        Page not found
      </h2>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" style={{
        padding: '12px 24px',
        background: '#6332E5',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 500
      }}>
        Go to homepage
      </Link>
    </div>
  )
}

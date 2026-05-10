import Link from 'next/link'
import { LoginButton } from '@/components/LoginButton'
import { BookingMockup } from '@/components/BookingMockup'

export default function Home() {
  return (
    <>
      <style>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .hero-nav-desktop {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .hero-nav-mobile {
          display: none;
        }
        .hero-cta-group {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .hero-booking-wrap {
          max-width: 380px;
          margin-left: auto;
        }
        .hero-cta-secondary {
          color: var(--obs-text-2);
          font-size: 0.9rem;
          text-decoration: none;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .hero-cta-secondary:hover {
          color: var(--obs-text-1);
        }
        .obs-nav-link {
          color: var(--obs-text-2);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s;
        }
        .obs-nav-link:hover {
          color: var(--obs-text-1);
        }
        .obs-get-started {
          padding: 0.5rem 1.125rem;
          background: var(--obs-violet);
          color: #09090b;
          border-radius: var(--obs-radius-card);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .obs-get-started:hover {
          opacity: 0.9;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
          .hero-nav-desktop {
            display: none;
          }
          .hero-nav-mobile {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }
          .hero-cta-group {
            justify-content: center;
            flex-wrap: wrap;
          }
          .hero-booking-wrap {
            max-width: 100%;
            margin-left: 0;
          }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--obs-bg)',
        color: 'var(--obs-text-1)',
        fontFamily: 'var(--font-geist-sans), DM Sans, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Blob background */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-20%', left: '30%',
            width: 600, height: 600,
            background: 'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '10%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
          }} />
        </div>

        {/* Header */}
        <header style={{
          position: 'relative', zIndex: 10,
          borderBottom: '1px solid var(--obs-border)',
          padding: '1rem 0',
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--obs-violet)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 700,
                fontSize: '1rem', letterSpacing: '-0.01em',
                color: 'var(--obs-text-1)',
              }}>
                Callroom
              </span>
            </div>

            {/* Desktop nav */}
            <nav className="hero-nav-desktop">
              <a href="#" className="obs-nav-link">Product</a>
              <a href="#" className="obs-nav-link">Pricing</a>
              <LoginButton />
              <Link href="/dashboard" className="obs-get-started">
                Get Started
              </Link>
            </nav>

            {/* Mobile nav */}
            <div className="hero-nav-mobile">
              <LoginButton />
            </div>
          </div>
        </header>

        {/* Hero */}
        <main style={{
          flex: 1, position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center',
        }}>
          <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', width: '100%' }}>
            <div className="hero-grid">
              {/* Left col */}
              <div>
                {/* Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.25rem 0.75rem',
                  border: '1px solid var(--obs-border)',
                  background: 'var(--obs-violet-dim)',
                  borderRadius: 999,
                  fontSize: '0.75rem',
                  color: 'var(--obs-violet)',
                  marginBottom: '1.5rem',
                  letterSpacing: '0.01em',
                }}>
                  ✦ Scheduling, reimagined
                </div>

                <h1 style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: 'var(--obs-text-1)',
                  marginBottom: '1.25rem',
                }}>
                  Book meetings<br />
                  without the<br />
                  back-and-forth.
                </h1>

                <p style={{
                  color: 'var(--obs-text-2)',
                  fontSize: '1.0625rem',
                  lineHeight: 1.7,
                  maxWidth: 420,
                  marginBottom: '2rem',
                }}>
                  Share your Callroom link. Guests pick a time. It shows up
                  in your calendar — no emails, no confusion, no missed connections.
                </p>

                <div className="hero-cta-group">
                  <LoginButton />
                  <a href="#" className="hero-cta-secondary">
                    See how it works →
                  </a>
                </div>
              </div>

              {/* Right col: booking mockup */}
              <div className="hero-booking-wrap">
                <BookingMockup />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          position: 'relative', zIndex: 1,
          borderTop: '1px solid var(--obs-border)',
          padding: '1.5rem 0',
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <p style={{ color: 'var(--obs-text-2)', fontSize: '0.8125rem' }}>
              © 2024 Callroom. Schedule smarter.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" style={{ color: 'var(--obs-text-2)', fontSize: '0.8125rem', textDecoration: 'none' }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

import Link from 'next/link'
import { BookingMockup } from '@/components/BookingMockup'

export default function Home() {
  return (
    <>
      <style>{`
        .landing-root {
          min-height: 100vh;
          background: #ffffff;
          color: #111827;
          font-family: 'DM Sans', sans-serif;
        }
        .landing-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid #f3f4f6;
          padding: 1rem 0;
        }
        .landing-logo {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 800;
          font-size: 1.375rem;
          letter-spacing: -0.02em;
          color: #111827;
          text-decoration: none;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          font-size: 0.875rem;
          color: #6b7280;
          text-decoration: none;
          cursor: pointer;
        }
        .nav-link:hover { color: #111827; }
        .nav-login {
          padding: 0.4375rem 1rem;
          background: transparent;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.15s;
        }
        .nav-login:hover { border-color: #9ca3af; }
        .nav-get-started {
          padding: 0.4375rem 1.125rem;
          background: #111827;
          color: #fff;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s;
        }
        .nav-get-started:hover { background: #1f2937; }
        .nav-mobile {
          display: none;
        }

        /* Hero */
        .hero-section {
          padding: 4.5rem 0 3rem;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 52% 1fr;
          gap: 3rem;
          align-items: center;
        }
        .hero-heading {
          font-family: 'Playfair Display', Georgia, serif;
          font-weight: 900;
          font-size: clamp(2.75rem, 5.5vw, 5rem);
          line-height: 1.0;
          letter-spacing: -0.035em;
          color: #111827;
          margin-bottom: 1.375rem;
        }
        .hero-sub {
          font-size: 1.0625rem;
          color: #6b7280;
          line-height: 1.75;
          max-width: 460px;
          margin-bottom: 2rem;
        }
        .google-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 55%, #2563eb 100%);
          color: #fff;
          border-radius: 999px;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          box-shadow: 0 4px 24px rgba(124,58,237,0.35);
        }
        .google-cta:hover { opacity: 0.92; transform: translateY(-1px); }
        .google-icon {
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Footer */
        .landing-footer {
          border-top: 1px solid #f3f4f6;
          padding: 1.5rem 0;
        }
        .footer-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
            text-align: center;
          }
          .hero-sub { margin-left: auto; margin-right: auto; }
          .hero-cta-wrap { display: flex; justify-content: center; }
          .nav-links-desktop { display: none; }
          .nav-mobile { display: flex; align-items: center; gap: 0.75rem; }
          .hero-section { padding: 2.5rem 0 2rem; }
        }
      `}</style>

      <div className="landing-root">
        {/* Header */}
        <header className="landing-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" className="landing-logo">Callroom</Link>

            {/* Desktop nav */}
            <nav className="nav-links-desktop">
              <span className="nav-link">Product ▾</span>
              <span className="nav-link">Resources ▾</span>
              <a href="#" className="nav-link">Pricing</a>
              <Link href="/auth/signin" className="nav-login">Log In</Link>
              <Link href="/auth/signin" className="nav-get-started">Get Started for Free</Link>
            </nav>

            {/* Mobile */}
            <div className="nav-mobile">
              <Link href="/auth/signin" className="nav-login">Log In</Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main>
          <section className="hero-section">
            <div className="container">
              <div className="hero-grid">
                {/* Left: text */}
                <div>
                  <h1 className="hero-heading">
                    Stop negotiating time. Start meeting.
                  </h1>
                  <p className="hero-sub">
                    Callroom syncs your calendar and gives everyone a simple way to book time with you — no emails, no confusion, no missed connections.
                  </p>
                  <div className="hero-cta-wrap">
                    <Link href="/auth/signin" className="google-cta">
                      <span className="google-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </span>
                      Sign up with Google
                    </Link>
                  </div>
                </div>

                {/* Right: booking mockup with blobs */}
                <BookingMockup />
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="container footer-inner">
            <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>© 2024 Callroom</span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy', 'Terms', 'Contact'].map(l => (
                <a key={l} href="#" style={{ fontSize: '0.8125rem', color: '#9ca3af', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

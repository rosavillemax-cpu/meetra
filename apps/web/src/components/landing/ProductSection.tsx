'use client'

import { useState } from 'react'

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    title: 'Smart Scheduling',
    description: 'Share your availability link. Guests pick a time that works for both of you. No back-and-forth emails.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Calendar Sync',
    description: 'Connects with Google Calendar and Outlook. Automatically checks for conflicts before confirming.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Team Scheduling',
    description: 'Create team event types with round-robin routing. Book the right person automatically.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
    title: 'Instant Notifications',
    description: 'Email confirmations and reminders sent automatically. Guests and hosts always stay informed.'
  }
]

const STEPS = [
  {
    number: '01',
    title: 'Create your link',
    description: 'Set up your event type in minutes. Define duration, availability, and preferences.'
  },
  {
    number: '02',
    title: 'Share your link',
    description: 'Send your booking link via email, chat, or social media. Or embed it on your website.'
  },
  {
    number: '03',
    title: 'Get booked',
    description: 'Guests pick a time that works for them. Both parties get instant confirmation.'
  }
]

const USE_CASES = [
  { title: 'Sales Teams', description: 'Qualify leads faster with instant demo calls', icon: '💼' },
  { title: 'Recruiters', description: 'Schedule interviews without the back-and-forth', icon: '👥' },
  { title: 'Consultants', description: 'Turn inquiries into paying engagements', icon: '💡' },
  { title: 'Enterprise', description: 'Coordinate meetings across entire organizations', icon: '🏢' }
]

const FAQS = [
  { q: 'How does calendar sync work?', a: 'Callroom connects to your Google Calendar or Microsoft Outlook account. When someone books a time, it automatically checks for conflicts and adds the event to your calendar.' },
  { q: 'Can I customize my booking page?', a: 'Yes. You can customize your name, profile, event types, colors, and availability. Each event type can have different durations and settings.' },
  { q: 'Is there a mobile app?', a: 'Callroom works beautifully on mobile through any web browser. You can view and manage all your bookings from your phone or tablet.' },
  { q: 'How does team scheduling work?', a: 'Create a team and add members. When someone books a team event, Callroom automatically assigns the meeting to the person with the most availability using round-robin routing.' }
]

const STATS = [
  { value: '50K+', label: 'Meetings Scheduled' },
  { value: '2.5M', label: 'Hours Saved' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' }
]

export function ProductSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      <style>{`
        .ps-section {
          padding: 5rem 0;
          background: #fafafa;
        }
        .ps-section-alt {
          background: #ffffff;
        }
        .ps-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .ps-section-header {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 3.5rem;
        }
        .ps-section-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.875rem;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(37, 99, 235, 0.08));
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #7c3aed;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .ps-section-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.875rem, 4vw, 2.75rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #111827;
          margin-bottom: 1rem;
        }
        .ps-section-sub {
          font-size: 1.0625rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* Features */
        .ps-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .ps-feature-card {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 16px;
          padding: 1.75rem;
          transition: all 0.2s ease;
        }
        .ps-feature-card:hover {
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow: 0 8px 30px rgba(124, 58, 237, 0.08);
          transform: translateY(-2px);
        }
        .ps-feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          margin-bottom: 1.25rem;
        }
        .ps-feature-title {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        .ps-feature-desc {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Steps */
        .ps-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          position: relative;
        }
        .ps-steps-grid::before {
          content: '';
          position: absolute;
          top: 28px;
          left: calc(16.67% + 28px);
          right: calc(16.67% + 28px);
          height: 2px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb);
          opacity: 0.2;
        }
        .ps-step {
          text-align: center;
        }
        .ps-step-num {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: #ffffff;
          font-size: 1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
        }
        .ps-step-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }
        .ps-step-desc {
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Use Cases */
        .ps-usecases-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }
        .ps-usecase-card {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: all 0.2s ease;
        }
        .ps-usecase-card:hover {
          border-color: rgba(124, 58, 237, 0.2);
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.06);
        }
        .ps-usecase-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .ps-usecase-title {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }
        .ps-usecase-desc {
          font-size: 0.875rem;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Stats */
        .ps-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }
        .ps-stat {
          text-align: center;
        }
        .ps-stat-value {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.25rem;
        }
        .ps-stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        /* FAQ */
        .ps-faq-list {
          max-width: 720px;
          margin: 0 auto;
        }
        .ps-faq-item {
          border-bottom: 1px solid #f3f4f6;
        }
        .ps-faq-question {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          gap: 1rem;
        }
        .ps-faq-question:hover {
          color: #7c3aed;
        }
        .ps-faq-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          color: #9ca3af;
        }
        .ps-faq-icon.open {
          transform: rotate(180deg);
          color: #7c3aed;
        }
        .ps-faq-answer {
          padding: 0 0 1.25rem;
          font-size: 0.9375rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* CTA */
        .ps-cta {
          text-align: center;
          padding: 5rem 0;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%);
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }
        .ps-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .ps-cta-content {
          position: relative;
          z-index: 1;
        }
        .ps-cta-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.75rem;
        }
        .ps-cta-sub {
          font-size: 1.0625rem;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2rem;
          max-width: 480px;
          margin-left: auto;
          margin-right: auto;
        }
        .ps-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          background: #ffffff;
          color: #7c3aed;
          border-radius: 999px;
          font-size: 0.9375rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        .ps-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ps-section { padding: 3rem 0; }
          .ps-steps-grid { grid-template-columns: 1fr; gap: 2.5rem; }
          .ps-steps-grid::before { display: none; }
          .ps-stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
          .ps-cta { border-radius: 16px; padding: 3rem 1.5rem; }
        }
      `}</style>

      {/* Features */}
      <section className="ps-section ps-section-alt">
        <div className="ps-container">
          <div className="ps-section-header">
            <div className="ps-section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Features
            </div>
            <h2 className="ps-section-title">Everything you need to schedule smarter</h2>
            <p className="ps-section-sub">Powerful features that save time, reduce friction, and help you close more deals.</p>
          </div>

          <div className="ps-features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="ps-feature-card">
                <div className="ps-feature-icon">{f.icon}</div>
                <h3 className="ps-feature-title">{f.title}</h3>
                <p className="ps-feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="ps-section">
        <div className="ps-container">
          <div className="ps-section-header">
            <div className="ps-section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              How It Works
            </div>
            <h2 className="ps-section-title">Up and running in minutes</h2>
            <p className="ps-section-sub">Three simple steps to start scheduling meetings without the hassle.</p>
          </div>

          <div className="ps-steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="ps-step">
                <div className="ps-step-num">{s.number}</div>
                <h3 className="ps-step-title">{s.title}</h3>
                <p className="ps-step-desc">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="ps-section ps-section-alt">
        <div className="ps-container">
          <div className="ps-section-header">
            <div className="ps-section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Use Cases
            </div>
            <h2 className="ps-section-title">Built for every workflow</h2>
            <p className="ps-section-sub">From solo consultants to large enterprises, Callroom adapts to how you work.</p>
          </div>

          <div className="ps-usecases-grid">
            {USE_CASES.map((uc, i) => (
              <div key={i} className="ps-usecase-card">
                <span className="ps-usecase-icon">{uc.icon}</span>
                <div>
                  <h4 className="ps-usecase-title">{uc.title}</h4>
                  <p className="ps-usecase-desc">{uc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="ps-section ps-section-alt" style={{ paddingTop: 0 }}>
        <div className="ps-container">
          <div className="ps-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="ps-stat">
                <div className="ps-stat-value">{s.value}</div>
                <div className="ps-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ps-section">
        <div className="ps-container">
          <div className="ps-section-header">
            <div className="ps-section-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              FAQ
            </div>
            <h2 className="ps-section-title">Common questions</h2>
          </div>

          <div className="ps-faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className="ps-faq-item">
                <button
                  className="ps-faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <span className={`ps-faq-icon ${openFaq === i ? 'open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </span>
                </button>
                {openFaq === i && (
                  <p className="ps-faq-answer">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ps-section ps-section-alt">
        <div className="ps-container">
          <div className="ps-cta">
            <div className="ps-cta-content">
              <h2 className="ps-cta-title">Ready to streamline your scheduling?</h2>
              <p className="ps-cta-sub">Join thousands of professionals who save hours every week with Callroom.</p>
              <a href="/auth/signin" className="ps-cta-btn">
                Get Started Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
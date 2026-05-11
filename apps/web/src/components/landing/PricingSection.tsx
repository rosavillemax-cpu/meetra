'use client'

import { useState } from 'react'

const PLAN_FEATURES = [
  'Smart Scheduling',
  'Calendar Sync (Google & Outlook)',
  'Team Scheduling (Round-Robin)',
  'Instant Notifications',
  'Unlimited Bookings',
  'Custom Booking Page',
  'Video Meeting Links',
  'Reminders & Follow-ups',
  'Team Management',
  'API Access',
  'Priority Support'
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const monthlyPrice = 6
  const annualPrice = 58
  const monthlyEquivalent = (annualPrice / 12).toFixed(2)
  const savings = 14 // 72 - 58

  return (
    <>
      <style>{`
        .ps-pricing-section {
          padding: 5rem 0;
          background: #ffffff;
        }
        .ps-pricing-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }
        .ps-pricing-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .ps-pricing-label {
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
        .ps-pricing-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.875rem, 4vw, 2.75rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: #111827;
          margin-bottom: 1rem;
        }
        .ps-pricing-sub {
          font-size: 1.0625rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* Toggle */
        .ps-pricing-toggle-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .ps-pricing-toggle-label {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #6b7280;
          transition: color 0.2s;
        }
        .ps-pricing-toggle-label.active {
          color: #111827;
        }
        .ps-pricing-toggle {
          position: relative;
          width: 52px;
          height: 28px;
          background: #e5e7eb;
          border-radius: 999px;
          cursor: pointer;
          transition: background 0.2s ease;
          border: none;
          padding: 0;
        }
        .ps-pricing-toggle.annual {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
        }
        .ps-pricing-toggle::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }
        .ps-pricing-toggle.annual::after {
          transform: translateX(24px);
        }
        .ps-pricing-save-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.625rem;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(37, 99, 235, 0.08));
          border: 1px solid rgba(124, 58, 237, 0.15);
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #7c3aed;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        /* Pricing Card */
        .ps-pricing-card {
          background: #ffffff;
          border: 1px solid #f3f4f6;
          border-radius: 24px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
        }
        .ps-pricing-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(135deg, #7c3aed, #4f46e5, #2563eb);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .ps-pricing-card-popular {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #7c3aed, #4f46e5, #2563eb);
        }
        .ps-pricing-card-inner {
          position: relative;
          z-index: 1;
        }
        .ps-pricing-plan-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #7c3aed;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }
        .ps-pricing-price-row {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .ps-pricing-currency {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }
        .ps-pricing-amount {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 4rem;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #7c3aed, #2563eb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ps-pricing-period {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }
        .ps-pricing-billing-note {
          font-size: 0.875rem;
          color: #9ca3af;
          margin-bottom: 2rem;
        }
        .ps-pricing-divider {
          height: 1px;
          background: #f3f4f6;
          margin: 2rem 0;
        }
        .ps-pricing-features-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .ps-pricing-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .ps-pricing-feature {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.9375rem;
          color: #374151;
        }
        .ps-pricing-feature-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(37, 99, 235, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ps-pricing-feature-icon svg {
          color: #7c3aed;
        }
        .ps-pricing-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9375rem 2rem;
          margin-top: 2rem;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%);
          color: #ffffff;
          border: none;
          border-radius: 999px;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
        }
        .ps-pricing-cta:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .ps-pricing-section { padding: 3rem 0; }
          .ps-pricing-card { padding: 2rem 1.5rem; }
          .ps-pricing-features { grid-template-columns: 1fr; }
          .ps-pricing-amount { font-size: 3rem; }
        }
      `}</style>

      <section className="ps-pricing-section">
        <div className="ps-pricing-container">
          <div className="ps-pricing-header">
            <div className="ps-pricing-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Pricing
            </div>
            <h2 className="ps-pricing-title">Simple, transparent pricing</h2>
            <p className="ps-pricing-sub">One plan with everything you need. No hidden fees, no surprises.</p>
          </div>

          <div className="ps-pricing-toggle-wrap">
            <span className={`ps-pricing-toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
            <button
              className={`ps-pricing-toggle ${isAnnual ? 'annual' : ''}`}
              onClick={() => setIsAnnual(!isAnnual)}
              aria-label="Toggle billing period"
            />
            <span className={`ps-pricing-toggle-label ${isAnnual ? 'active' : ''}`}>Annual</span>
            {isAnnual && <span className="ps-pricing-save-badge">Save ${savings}</span>}
          </div>

          <div className="ps-pricing-card">
            <div className="ps-pricing-card-popular" />
            <div className="ps-pricing-card-inner">
              <div className="ps-pricing-plan-name">Pro Plan</div>

              <div className="ps-pricing-price-row">
                <span className="ps-pricing-currency">$</span>
                <span className="ps-pricing-amount">{isAnnual ? Math.round(parseFloat(monthlyEquivalent)) : monthlyPrice}</span>
                <span className="ps-pricing-period">/{isAnnual ? 'mo' : 'month'}</span>
              </div>

              <div className="ps-pricing-billing-note">
                {isAnnual
                  ? `Billed as $${annualPrice}/year — save $${savings} per year`
                  : `Billed monthly — switch to annual and save $${savings}/year`}
              </div>

              <div className="ps-pricing-divider" />

              <div className="ps-pricing-features-title">Everything included</div>
              <ul className="ps-pricing-features">
                {PLAN_FEATURES.map((f, i) => (
                  <li key={i} className="ps-pricing-feature">
                    <span className="ps-pricing-feature-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="/auth/signin" className="ps-pricing-cta">
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
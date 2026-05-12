'use client'

interface StepProps {
  number: string
  title: string
  description: string
  mockup: React.ReactNode
}

export function HowItWorksStep({ number, title, description, mockup }: StepProps) {
  return (
    <div className="hiw-step">
      <div className="hiw-mockup">{mockup}</div>
      <div className="hiw-step-num">{number}</div>
      <h3 className="hiw-step-title">{title}</h3>
      <p className="hiw-step-desc">{description}</p>
    </div>
  )
}

function CalendarConnectMockup() {
  return (
    <div className="hiw-card">
      <div className="hiw-card-header">
        <span className="hiw-card-title">Calendar</span>
        <span className="hiw-badge-connected">Connected</span>
      </div>
      <div className="hiw-card-body">
        <div className="hiw-cal-row">
          <div className="hiw-cal-icon google">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </div>
          <span className="hiw-cal-label">Google Calendar</span>
          <div className="hiw-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <div className="hiw-cal-row">
          <div className="hiw-cal-icon outlook">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.24.576l-6.8 6.344V23.6L24 7.387zM0 7.793l10.24 8.84v9.964H7.2v-7.784L0 7.793zM12.96 8.44L24 17.24v-8.8l-11.04-8.32V8.44z"/>
            </svg>
          </div>
          <span className="hiw-cal-label">Outlook Calendar</span>
          <div className="hiw-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <div className="hiw-connect-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Connect calendar
        </div>
      </div>
    </div>
  )
}

function AvailabilityMockup() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  return (
    <div className="hiw-card">
      <div className="hiw-card-header">
        <span className="hiw-card-title">Availability</span>
      </div>
      <div className="hiw-card-body hiw-avail-body">
        <div className="hiw-avail-days">
          {days.map((d, i) => (
            <div key={d} className={`hiw-day ${i < 3 ? 'hiw-day-active' : ''}`}>{d}</div>
          ))}
        </div>
        <div className="hiw-avail-grid">
          {['9:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'].map((t, i) => (
            <div key={t} className={`hiw-slot ${i !== 2 && i !== 5 ? 'hiw-slot-active' : ''}`}>{t}</div>
          ))}
        </div>
        <div className="hiw-tz">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>Europe/London (GMT+1)</span>
        </div>
      </div>
    </div>
  )
}

function CreateEventMockup() {
  return (
    <div className="hiw-card">
      <div className="hiw-card-header">
        <span className="hiw-card-title">New Event Type</span>
      </div>
      <div className="hiw-card-body hiw-form-body">
        <div className="hiw-field">
          <label>Title</label>
          <div className="hiw-field-val">30 min intro call</div>
        </div>
        <div className="hiw-field-row">
          <div className="hiw-field">
            <label>Duration</label>
            <div className="hiw-field-val">30 min</div>
          </div>
          <div className="hiw-field">
            <label>Slug</label>
            <div className="hiw-field-val">/intro</div>
          </div>
        </div>
        <div className="hiw-create-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Create
        </div>
      </div>
    </div>
  )
}

function ShareLinkMockup() {
  return (
    <div className="hiw-card">
      <div className="hiw-card-header">
        <span className="hiw-card-title">Share your link</span>
      </div>
      <div className="hiw-card-body hiw-share-body">
        <div className="hiw-url-box">
          <span className="hiw-url-text">callroom.app/john/intro</span>
          <button className="hiw-copy-btn">Copy</button>
        </div>
        <div className="hiw-share-row">
          <div className="hiw-share-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <div className="hiw-share-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div className="hiw-share-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookedMockup() {
  return (
    <div className="hiw-card hiw-card-booked">
      <div className="hiw-card-header">
        <span className="hiw-card-title">Tuesday, May 14</span>
      </div>
      <div className="hiw-card-body hiw-booked-body">
        <div className="hiw-booked-slot">
          <div className="hiw-booked-time">10:00 AM</div>
          <div className="hiw-booked-info">
            <span className="hiw-booked-name">Sarah Miller</span>
            <span className="hiw-booked-type">30 min intro call</span>
          </div>
          <div className="hiw-booked-confirm">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <div className="hiw-email-snippet">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>Confirmation sent to sarah@example.com</span>
        </div>
      </div>
    </div>
  )
}

export const HOW_IT_WORKS_MOCKUPS = [
  <CalendarConnectMockup key="cal" />,
  <AvailabilityMockup key="avail" />,
  <CreateEventMockup key="create" />,
  <ShareLinkMockup key="share" />,
  <BookedMockup key="booked" />,
]

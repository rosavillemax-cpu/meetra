'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, Clock } from 'lucide-react'

export interface BookingWithRelations {
  id: string
  startAt: Date
  status: string
  guestName: string
  guestEmail: string
  eventType: {
    id: string
    slug: string
    title: string
    color: string
    durationMin: number
  } | null
  host: {
    id: string
    handle: string
    name: string | null
    image: string | null
  }
}

const DAYS_TR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface WeekStripProps {
  bookings: BookingWithRelations[]
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function WeekStrip({ bookings }: WeekStripProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const next7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const selectedDayBookings = selectedDay
    ? bookings.filter(b => isSameDay(new Date(b.startAt), selectedDay))
    : []

  return (
    <>
      <div className="week-card">
        <div className="week-head">
          <span className="week-label">This week</span>
          <Link href="/dashboard/bookings" className="see-all">
            View all <ArrowRight size={11} />
          </Link>
        </div>
        <div className="week-row">
          {next7.map((day, i) => {
            const count = bookings.filter(b => isSameDay(new Date(b.startAt), day)).length
            const isToday = i === 0
            const isSelected = selectedDay && isSameDay(day, selectedDay)
            return (
              <button
                key={i}
                className={`day ${isToday ? 'today' : ''} ${count > 0 ? 'busy' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDay(isSameDay(day, today) ? null : isSelected ? null : day)}
              >
                <span className="d-name">{DAYS_TR[day.getDay()]}</span>
                <span className="d-num">{day.getDate()}</span>
                <div className="d-dots">
                  {Array.from({ length: Math.min(count, 3) }, (_, j) => (
                    <span key={j} className="dot" />
                  ))}
                  {count === 0 && <span className="dot-empty" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="day-detail">
          <div className="panel-head">
            <div className="panel-title">
              <Calendar size={14} className="ph-icon" />
              <span>
                {DAYS_TR[selectedDay.getDay()]} {selectedDay.getDate()} — {selectedDayBookings.length} bookings
              </span>
            </div>
            <button className="clear-btn" onClick={() => setSelectedDay(null)}>
              Clear
            </button>
          </div>

          {selectedDayBookings.length > 0 ? (
            <div className="booking-rows">
              {selectedDayBookings.map(b => (
                <div key={b.id} className="booking-row">
                  <div className="booking-time">
                    {new Date(b.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    <span className="booking-dur">{b.eventType?.durationMin}min</span>
                  </div>
                  <div className="booking-info">
                    <span className="booking-title">{b.eventType?.title}</span>
                    <span className="booking-guest">{b.guestName}</span>
                  </div>
                  <div className="booking-color" style={{ background: b.eventType?.color || 'var(--primary)' }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="day-empty">
              <p>No bookings for this day</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .week-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem 1.25rem;
          margin-bottom: 1rem;
        }
        .week-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.875rem;
        }
        .week-label {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .see-all {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          text-decoration: none;
          transition: color 0.15s;
        }
        .see-all:hover { color: var(--primary); }
        .week-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.375rem;
        }
        .day {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.5rem 0.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          transition: all 0.15s;
          background: transparent;
          cursor: pointer;
          font-family: inherit;
        }
        .day:hover {
          background: var(--surface-hover);
        }
        .day.today {
          background: var(--primary-bg);
          border-color: rgba(167,139,250,0.3);
          animation: today-glow 3s ease-in-out infinite;
        }
        @keyframes today-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,50,229,0.0); }
          50% { box-shadow: 0 0 0 4px rgba(99,50,229,0.08); }
        }
        .day.selected {
          background: var(--primary-bg);
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99,50,229,0.15);
          transform: scale(1.03);
        }
        .day.busy:not(.today):not(.selected) {
          background: rgba(255,255,255,0.04);
        }
        .day:hover {
          background: var(--surface-hover);
        }
        .day.today {
          background: var(--primary-bg);
          border-color: rgba(167,139,250,0.3);
          animation: today-glow 3s ease-in-out infinite;
        }
        .day.busy:not(.today):not(.selected) {
          background: rgba(255,255,255,0.03);
        }
        .d-name {
          font-size: 0.6rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .day.today .d-name,
        .day.selected .d-name { color: var(--primary); }
        .d-num {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }
        .day.today .d-num,
        .day.selected .d-num { color: var(--primary); }
        .d-dots {
          display: flex;
          gap: 2px;
          height: 7px;
          align-items: center;
          justify-content: center;
        }
        .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--primary);
          flex-shrink: 0;
        }
        .dot-empty {
          width: 4px;
          height: 4px;
          display: block;
        }

        .day-detail {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          margin-bottom: 1.25rem;
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.125rem;
          border-bottom: 1px solid var(--border);
        }
        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .ph-icon { color: var(--text-tertiary); }
        .clear-btn {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius);
          transition: all 0.15s;
        }
        .clear-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .booking-rows { display: flex; flex-direction: column; }
        .booking-row {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 1.125rem;
          border-bottom: 1px solid var(--border);
        }
        .booking-row:last-child { border-bottom: none; }
        .booking-time {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
          min-width: 80px;
        }
        .booking-dur {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          font-weight: 400;
        }
        .booking-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          flex: 1;
        }
        .booking-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .booking-guest {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .booking-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .day-empty {
          padding: 2rem;
          text-align: center;
        }
        .day-empty p {
          font-size: 0.875rem;
          color: var(--text-tertiary);
          margin: 0;
        }

        @media (max-width: 640px) {
          .week-row { gap: 0.25rem; }
          .d-name { font-size: 0.55rem; }
          .d-num { font-size: 0.8125rem; }
        }
      `}</style>
    </>
  )
}

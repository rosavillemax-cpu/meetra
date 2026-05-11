'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus } from 'lucide-react'
import Link from 'next/link'
import type { BookingWithRelations } from './BookingCard'

const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

interface CalendarViewProps {
  bookings: BookingWithRelations[]
  onSelectBooking?: (booking: BookingWithRelations) => void
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

function getMonthLabel(year: number, month: number) {
  return `${MONTHS_EN[month]} ${year}`
}

export function CalendarView({ bookings, onSelectBooking }: CalendarViewProps) {
  const router = useRouter()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<Date>(today)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDay(now)
  }

  const selectedDayBookings = selectedDay
    ? bookings.filter(b => isSameDay(new Date(b.startAt), selectedDay))
    : []

  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const selectedDayLabel = selectedDay
    ? `${DAYS_EN[selectedDay.getDay()]}, ${MONTHS_EN[selectedDay.getMonth()]} ${selectedDay.getDate()}`
    : null

  const getDayAriaLabel = (day: number, cellDate: Date, bookingCount: number) => {
    const dateStr = `${MONTHS_EN[month]} ${day}, ${year}`
    if (bookingCount === 0) return `${dateStr}, no meetings`
    if (bookingCount === 1) return `${dateStr}, 1 meeting`
    return `${dateStr}, ${bookingCount} meetings`
  }

  return (
    <div className="cal-wrapper">
      <div className="cal-layout">
        <div className="cal-sidebar">
          <div className="cal-header">
            <button
              className="nav-btn"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="month-label">{getMonthLabel(year, month)}</span>
            <button
              className="nav-btn"
              onClick={nextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
            <button
              className="today-btn"
              onClick={goToToday}
              aria-label="Go to today"
            >
              Today
            </button>
          </div>

          <div className="cal-grid">
            {DAYS_EN.map(d => (
              <div key={d} className="day-header">{d}</div>
            ))}
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="day-cell empty" />

              const cellDate = new Date(year, month, day)
              const isToday = isSameDay(cellDate, today)
              const isSelected = selectedDay && isSameDay(cellDate, selectedDay)
              const dayBookings = bookings.filter(b => isSameDay(new Date(b.startAt), cellDate))
              const isPast = cellDate < today && !isToday

              return (
                <button
                  key={day}
                  className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayBookings.length > 0 ? 'has-bookings' : ''} ${isPast ? 'past' : ''}`}
                  onClick={() => setSelectedDay(cellDate)}
                  aria-selected={isSelected}
                  aria-label={getDayAriaLabel(day, cellDate, dayBookings.length)}
                >
                  <span className="day-num">{day}</span>
                  {dayBookings.length > 0 && (
                    <div className="booking-dots">
                      {dayBookings.slice(0, 3).map((b, i) => (
                        <span
                          key={i}
                          className="booking-dot"
                          style={{ background: b.eventType.color }}
                        />
                      ))}
                      {dayBookings.length > 3 && (
                        <span className="dot-more">+{dayBookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="cal-detail">
          {selectedDay && (
            <>
              <div className="detail-header">
                <div className="detail-title-row">
                  <h3 className="detail-date">{selectedDayLabel}</h3>
                  <span className="detail-count">
                    {selectedDayBookings.length} meeting{selectedDayBookings.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <Link href="/dashboard/event-types" className="create-btn">
                  <Plus size={14} />
                  Create Meeting
                </Link>
              </div>

              <div className="detail-content">
                {selectedDayBookings.length > 0 ? (
                  <div className="meeting-list">
                    {selectedDayBookings
                      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                      .map(b => (
                        <div key={b.id} className="meeting-card">
                          <div className="mc-color" style={{ background: b.eventType.color }} />
                          <div className="mc-body">
                            <div className="mc-header">
                              <div className="mc-time">
                                <Clock size={13} />
                                <span>{formatTime(b.startAt)} - {formatTime(b.endAt)}</span>
                              </div>
                              <span className={`mc-status status-${b.status}`}>{b.status}</span>
                            </div>
                            <h4 className="mc-title">{b.eventType.title}</h4>
                            <div className="mc-guest">
                              <User size={13} />
                              <span className="mc-guest-name">{b.guestName}</span>
                              <span className="mc-guest-email">{b.guestEmail}</span>
                            </div>
                          </div>
                          <button
                            className="mc-action"
                            onClick={() => router.push(`/confirmation/${b.id}`)}
                            aria-label="View meeting details"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="no-meetings">
                    <div className="no-meetings-icon">
                      <Calendar size={28} />
                    </div>
                    <p className="no-meetings-title">No meetings scheduled</p>
                    <p className="no-meetings-sub">No bookings for {selectedDayLabel}</p>
                    <Link href="/dashboard/event-types" className="no-meetings-cta">
                      <Plus size={14} />
                      Create a meeting
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .cal-wrapper {
          width: 100%;
          max-width: 1100px;
        }
        .cal-layout {
          display: grid;
          grid-template-columns: 42% 58%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .cal-sidebar {
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border-right: 1px solid var(--border);
        }
        .cal-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .nav-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
          border-color: var(--border-hover);
        }
        .nav-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .month-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          flex: 1;
          text-align: center;
        }
        .today-btn {
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: var(--surface);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .today-btn:hover {
          background: var(--primary-bg);
          border-color: var(--primary);
          color: var(--primary);
        }
        .today-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 1rem 0.875rem;
          gap: 3px;
          flex: 1;
        }
        .day-header {
          text-align: center;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.5rem 0;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border-radius: var(--radius-sm);
          border: 2px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
          min-height: 44px;
        }
        .day-cell.empty { cursor: default; }
        .day-cell:not(.empty):hover { background: var(--surface-hover); }
        .day-cell:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 1px;
        }
        .day-cell.today {
          background: var(--surface2);
        }
        .day-cell.today .day-num {
          color: var(--text-primary);
          font-weight: 700;
        }
        .day-cell.past:not(.selected) .day-num {
          color: var(--text-tertiary);
        }
        .day-cell.selected {
          background: var(--primary-bg);
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-bg), 0 0 0 4px var(--primary);
        }
        .day-cell.selected .day-num { color: var(--primary); font-weight: 600; }
        .day-num {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          line-height: 1;
        }
        .booking-dots {
          display: flex;
          gap: 2px;
          align-items: center;
          justify-content: center;
        }
        .booking-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-more {
          font-size: 0.5625rem;
          color: var(--text-tertiary);
          font-weight: 600;
        }

        .cal-detail {
          display: flex;
          flex-direction: column;
          background: var(--surface2);
          min-width: 0;
        }
        .detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          flex-shrink: 0;
        }
        .detail-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .detail-date {
          font-family: 'Syne', sans-serif;
          font-size: 1.0625rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.02em;
        }
        .detail-count {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-tertiary);
          background: var(--surface2);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .create-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: var(--radius-sm);
          background: var(--primary);
          color: white;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s;
        }
        .create-btn:hover {
          background: var(--primary-hover);
        }
        .create-btn:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
        .detail-content {
          flex: 1;
          padding: 1rem 1.5rem;
          overflow-y: auto;
        }
        .meeting-list {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .meeting-card {
          display: flex;
          align-items: stretch;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          transition: all 0.2s;
        }
        .meeting-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }
        .mc-color {
          width: 4px;
          flex-shrink: 0;
        }
        .mc-body {
          flex: 1;
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          min-width: 0;
        }
        .mc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .mc-time {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
        }
        .mc-status {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          background: var(--surface2);
          color: var(--text-secondary);
        }
        .mc-status.status-confirmed {
          background: var(--surface2);
          color: var(--text-primary);
        }
        .mc-status.status-pending {
          background: var(--warning-bg);
          color: var(--warning);
        }
        .mc-status.status-cancelled {
          background: var(--error-bg);
          color: var(--error);
        }
        .mc-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          line-height: 1.3;
        }
        .mc-guest {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .mc-guest-name {
          font-weight: 500;
          color: var(--text-secondary);
        }
        .mc-guest-email {
          color: var(--text-tertiary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 200px;
        }
        .mc-action {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          flex-shrink: 0;
          background: transparent;
          border: none;
          border-left: 1px solid var(--border);
          color: var(--text-tertiary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .mc-action:hover {
          background: var(--surface-hover);
          color: var(--primary);
        }
        .mc-action:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: -2px;
        }
        .no-meetings {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2.5rem 1.5rem;
          min-height: 300px;
        }
        .no-meetings-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          margin-bottom: 1rem;
        }
        .no-meetings-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.25rem;
        }
        .no-meetings-sub {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          margin: 0 0 1.25rem;
        }
        .no-meetings-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          background: var(--primary);
          color: white;
          font-size: 0.8125rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s;
        }
        .no-meetings-cta:hover {
          background: var(--primary-hover);
        }
        .no-meetings-cta:focus-visible {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        @media (max-width: 900px) {
          .cal-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }
          .cal-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .cal-grid {
            gap: 2px;
          }
        }
        @media (max-width: 640px) {
          .cal-wrapper { padding: 0; }
          .cal-layout { border-radius: var(--radius); }
          .cal-header { padding: 1rem 0.75rem; }
          .month-label { font-size: 0.875rem; }
          .cal-grid { padding: 0.75rem 0.5rem; }
          .day-cell { min-height: 40px; }
          .day-num { font-size: 0.75rem; }
          .day-header { font-size: 0.625rem; }
          .detail-header { padding: 1rem; }
          .detail-content { padding: 0.75rem 1rem; }
          .create-btn { display: none; }
          .mc-guest-email { display: none; }
        }
      `}</style>
    </div>
  )
}
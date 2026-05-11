'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

export function CalendarView({ bookings, onSelectBooking }: CalendarViewProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const goToToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDay(null)
  }

  const selectedDayBookings = selectedDay
    ? bookings.filter(b => isSameDay(new Date(b.startAt), selectedDay))
    : []

  const days: (number | null)[] = []
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="cal-nav">
          <button className="nav-btn" onClick={prevMonth}>
            <ChevronLeft size={16} />
          </button>
          <button className="today-btn" onClick={goToToday}>Today</button>
          <button className="nav-btn" onClick={nextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
        <span className="month-label">{MONTHS_EN[month]} {year}</span>
      </div>

      <div className="calendar-grid">
        {DAYS_EN.map(d => (
          <div key={d} className="day-header">{d}</div>
        ))}
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="day-cell empty" />

          const cellDate = new Date(year, month, day)
          const isToday = isSameDay(cellDate, today)
          const isSelected = selectedDay && isSameDay(cellDate, selectedDay)
          const dayBookings = bookings.filter(b => isSameDay(new Date(b.startAt), cellDate))

          return (
            <button
              key={day}
              className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayBookings.length > 0 ? 'has-bookings' : ''}`}
              onClick={() => setSelectedDay(isSameDay(cellDate, today) ? null : isSelected ? null : cellDate)}
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

      {selectedDay && (
        <div className="day-panel">
          <div className="panel-head">
            <span className="panel-date">
              {DAYS_EN[selectedDay.getDay()]} {selectedDay.getDate()} {MONTHS_EN[selectedDay.getMonth()]} — {selectedDayBookings.length} booking{selectedDayBookings.length !== 1 ? 's' : ''}
            </span>
            <button className="clear-btn" onClick={() => setSelectedDay(null)}>Clear</button>
          </div>
          {selectedDayBookings.length > 0 ? (
            <div className="panel-bookings">
              {selectedDayBookings.map(b => (
                <div
                  key={b.id}
                  className="panel-booking"
                  onClick={() => onSelectBooking?.(b)}
                >
                  <div className="pb-time">
                    {new Date(b.startAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="pb-info">
                    <span className="pb-title">{b.eventType.title}</span>
                    <span className="pb-guest">{b.guestName}</span>
                  </div>
                  <div className="pb-color" style={{ background: b.eventType.color }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="panel-empty">No bookings for this day</div>
          )}
        </div>
      )}

      <style jsx>{`
        .calendar-view {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .cal-nav {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .nav-btn:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .today-btn {
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          background: transparent;
          font-size: 0.75rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .today-btn:hover {
          background: var(--primary-bg);
          border-color: var(--primary);
          color: var(--primary);
        }
        .month-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 0.75rem;
          gap: 0.25rem;
        }
        .day-header {
          text-align: center;
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.375rem 0;
          margin-bottom: 0.25rem;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 0.125rem;
          padding: 0.375rem 0.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          min-height: 44px;
        }
        .day-cell.empty {
          cursor: default;
        }
        .day-cell:not(.empty):hover {
          background: var(--surface-hover);
        }
        .day-cell.today {
          background: var(--primary-bg);
          border-color: rgba(99,50,229,0.2);
        }
        .day-cell.today .day-num {
          color: var(--primary);
          font-weight: 700;
        }
        .day-cell.selected {
          background: var(--primary-bg);
          border-color: var(--primary);
        }
        .day-cell.selected .day-num {
          color: var(--primary);
        }
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
          flex-wrap: wrap;
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
          font-weight: 500;
        }
        .day-panel {
          border-top: 1px solid var(--border);
          animation: slideDown 0.2s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.875rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .panel-date {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
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
        .panel-bookings {
          display: flex;
          flex-direction: column;
          max-height: 240px;
          overflow-y: auto;
        }
        .panel-booking {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.15s;
        }
        .panel-booking:last-child { border-bottom: none; }
        .panel-booking:hover { background: var(--surface-hover); }
        .pb-time {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
          min-width: 56px;
        }
        .pb-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          flex: 1;
        }
        .pb-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .pb-guest {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .pb-color {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .panel-empty {
          padding: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-tertiary);
        }

        @media (max-width: 640px) {
          .calendar-grid { gap: 0.125rem; padding: 0.5rem; }
          .day-cell { min-height: 38px; padding: 0.25rem 0.125rem; }
          .day-num { font-size: 0.75rem; }
          .booking-dot { width: 4px; height: 4px; }
        }
      `}</style>
    </div>
  )
}
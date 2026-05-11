'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react'
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
    if (!selectedDay || !isSameDay(selectedDay, now)) {
      setSelectedDay(now)
    }
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

  return (
    <div className="cal-layout">
      <div className="cal-sidebar">
        <div className="cal-header">
          <div className="cal-nav">
            <button className="nav-btn" onClick={prevMonth}>
              <ChevronLeft size={16} />
            </button>
            <button className="nav-btn" onClick={nextMonth}>
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="month-label">{MONTHS_EN[month]} {year}</span>
          <button className="today-btn" onClick={goToToday}>Today</button>
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

            return (
              <button
                key={day}
                className={`day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayBookings.length > 0 ? 'has-bookings' : ''}`}
                onClick={() => setSelectedDay(isSameDay(cellDate, today) ? (isSelected ? null : cellDate) : (isSelected ? null : cellDate))}
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
        {selectedDay ? (
          <>
            <div className="detail-header">
              <h3 className="detail-date">{selectedDayLabel}</h3>
              <span className="detail-count">
                {selectedDayBookings.length} meeting{selectedDayBookings.length !== 1 ? 's' : ''}
              </span>
            </div>

            {selectedDayBookings.length > 0 ? (
              <div className="detail-bookings">
                {selectedDayBookings
                  .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
                  .map(b => (
                    <div
                      key={b.id}
                      className="detail-booking-card"
                      onClick={() => onSelectBooking?.(b)}
                    >
                      <div className="dbc-color" style={{ background: b.eventType.color }} />
                      <div className="dbc-content">
                        <div className="dbc-top">
                          <h4 className="dbc-title">{b.eventType.title}</h4>
                          <span className="dbc-time">
                            <Clock size={12} />
                            {formatTime(b.startAt)} - {formatTime(b.endAt)}
                          </span>
                        </div>
                        <div className="dbc-guest">
                          <User size={12} />
                          <span>{b.guestName}</span>
                          <span className="dbc-email">{b.guestEmail}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="detail-empty">
                <div className="empty-icon">
                  <Calendar size={32} />
                </div>
                <p className="empty-title">No meetings</p>
                <p className="empty-sub">No bookings scheduled for this day</p>
              </div>
            )}
          </>
        ) : (
          <div className="detail-welcome">
            <div className="welcome-icon">
              <Calendar size={40} />
            </div>
            <h3 className="welcome-title">Select a day</h3>
            <p className="welcome-sub">Click on any day to view its meetings</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .cal-layout {
          display: grid;
          grid-template-columns: 340px 1fr;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          min-height: 480px;
        }
        .cal-sidebar {
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.125rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .cal-nav {
          display: flex;
          gap: 0.25rem;
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
        .month-label {
          font-size: 0.9375rem;
          font-weight: 600;
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
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 0.875rem;
          gap: 0.125rem;
          flex: 1;
        }
        .day-header {
          text-align: center;
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 0.375rem 0;
          margin-bottom: 0.125rem;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border-radius: var(--radius-sm);
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.15s;
          position: relative;
        }
        .day-cell.empty { cursor: default; }
        .day-cell:not(.empty):hover { background: var(--surface-hover); }
        .day-cell.today { background: var(--primary-bg); }
        .day-cell.today .day-num { color: var(--primary); font-weight: 700; }
        .day-cell.selected {
          background: var(--primary-bg);
          border-color: var(--primary);
        }
        .day-cell.selected .day-num { color: var(--primary); }
        .day-num {
          font-size: 0.75rem;
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
          width: 4px;
          height: 4px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .dot-more {
          font-size: 0.5rem;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        .cal-detail {
          display: flex;
          flex-direction: column;
          background: var(--surface2);
        }
        .detail-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }
        .detail-date {
          font-size: 1.0625rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .detail-count {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          background: var(--surface-hover);
          padding: 0.25rem 0.625rem;
          border-radius: var(--radius);
        }
        .detail-bookings {
          flex: 1;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
        }
        .detail-booking-card {
          display: flex;
          gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .detail-booking-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transform: translateY(-1px);
        }
        .dbc-color {
          width: 4px;
          flex-shrink: 0;
        }
        .dbc-content {
          flex: 1;
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .dbc-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .dbc-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .dbc-time {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
        .dbc-guest {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }
        .dbc-email {
          color: var(--text-tertiary);
        }
        .detail-empty, .detail-welcome {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
        }
        .empty-icon, .welcome-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--surface-hover);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          margin-bottom: 1rem;
        }
        .empty-title, .welcome-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.25rem;
        }
        .empty-sub, .welcome-sub {
          font-size: 0.875rem;
          color: var(--text-tertiary);
          margin: 0;
        }

        @media (max-width: 768px) {
          .cal-layout {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
          }
          .cal-sidebar {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .cal-grid {
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  )
}
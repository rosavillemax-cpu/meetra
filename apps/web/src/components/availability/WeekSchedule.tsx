'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { AvailabilityRule } from '@prisma/client'
import type { ToastType } from '@/components/ui/Toast'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface WeekScheduleProps {
  rules: AvailabilityRule[]
  onAddRule?: (weekday: number, startTime: string, endTime: string) => void
  onDeleteRule?: (rule: AvailabilityRule) => void
  onUpdateRule?: (rule: AvailabilityRule) => void
  addToast?: (type: ToastType, message: string) => void
}

export function WeekSchedule({ rules, onAddRule, onDeleteRule, onUpdateRule, addToast }: WeekScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [closedDays, setClosedDays] = useState<Set<number>>(new Set())
  const [validationError, setValidationError] = useState<string | null>(null)

  const getRulesForDay = (weekday: number) => {
    return rules.filter(r => r.weekday === weekday && !r.isOverride)
  }

  const toggleClosed = (weekday: number) => {
    setClosedDays(prev => {
      const next = new Set(prev)
      if (next.has(weekday)) next.delete(weekday)
      else next.add(weekday)
      return next
    })
  }

  const handleAddSlot = () => {
    if (selectedDay === null) return
    setValidationError(null)
    if (!startTime) {
      setValidationError('Start time is required')
      return
    }
    if (!endTime) {
      setValidationError('End time is required')
      return
    }
    if (endTime <= startTime) {
      setValidationError('End time must be after start time')
      return
    }
    onAddRule?.(selectedDay, startTime, endTime)
    addToast?.('success', 'Time slot added')
    setStartTime('09:00')
    setEndTime('17:00')
    setSelectedDay(null)
  }

  return (
    <div className="week-table">
      <div className="table-header">
        <span className="col-name">Day</span>
        <span className="col-slots">Time slots</span>
        <span className="col-toggle">Status</span>
      </div>

      {WEEKDAYS.map((day, index) => {
        const dayRules = getRulesForDay(index)
        const isSelected = selectedDay === index
        const isClosed = closedDays.has(index)
        const hasSlots = dayRules.length > 0

        return (
          <div key={day} className={`day-row ${isClosed ? 'closed' : ''} ${hasSlots ? 'has-slots' : ''}`}>
            {/* Main row */}
            <div
              className="row-main"
              onClick={() => !isClosed && setSelectedDay(isSelected ? null : index)}
            >
              {/* Day name */}
              <div className="col-name">
                <span className="day-name">{day}</span>
                <span className="day-short">{WEEKDAYS_SHORT[index]}</span>
              </div>

              {/* Slots */}
              <div className="col-slots">
                {hasSlots ? (
                  <div className="slots-list">
                    {dayRules.map(rule => (
                      <div key={rule.id} className="slot-chip">
                        <span className="slot-time">
                          {rule.startTime} — {rule.endTime}
                        </span>
                        {onDeleteRule && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDeleteRule(rule); }}
                            className="slot-delete"
                            aria-label="Delete"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>No hours defined</span>
                )}
              </div>

              {/* Right side: add button + badge + toggle */}
              <div className="col-right">
                {!isClosed && (
                  <button
                    className="add-btn"
                    onClick={(e) => { e.stopPropagation(); setSelectedDay(isSelected ? null : index); }}
                    title="Add time slot"
                  >
                    <Plus size={13} />
                    <span>Add</span>
                  </button>
                )}

                {/* Status badge */}
                <span className={`status-badge ${isClosed ? 'status-unavailable' : 'status-available'}`}>
                  <span className="status-dot" />
                  {isClosed ? 'Unavailable' : 'Available'}
                </span>

                {/* Toggle switch */}
                <button
                  className={`toggle ${isClosed ? 'is-closed' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleClosed(index); }}
                  aria-label={isClosed ? 'Open day' : 'Close day'}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>

            {/* Inline add form */}
            {isSelected && !isClosed && (
              <div className="row-form" onClick={e => e.stopPropagation()}>
                <span className="form-label">Add new time slot</span>
                <div className="form-row">
                  <div className="time-field">
                    <label className="time-label">Start time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => { setStartTime(e.target.value); setValidationError(null); }}
                      className="time-input"
                    />
                  </div>
                  <span className="time-sep">—</span>
                  <div className="time-field">
                    <label className="time-label">End time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => { setEndTime(e.target.value); setValidationError(null); }}
                      className="time-input"
                    />
                  </div>
                  <button onClick={handleAddSlot} className="submit-btn">
                    <Plus size={13} />
                    Add
                  </button>
                  <button onClick={() => { setSelectedDay(null); setValidationError(null); }} className="cancel-btn">
                    Cancel
                  </button>
                </div>
                {validationError && (
                  <span className="validation-error">{validationError}</span>
                )}
              </div>
            )}
          </div>
        )
      })}

      <style jsx>{`
        .week-table {
          display: flex;
          flex-direction: column;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        /* ── Table header ── */
        .table-header {
          display: grid;
          grid-template-columns: 140px 1fr 100px;
          gap: 0;
          padding: 0.625rem 1.25rem;
          background: var(--surface2);
          border-bottom: 1px solid var(--border);
        }
        .table-header span {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .col-toggle {
          text-align: right;
        }

        /* ── Day row ── */
        .day-row {
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .day-row:last-child {
          border-bottom: none;
        }
        .day-row:hover:not(.closed) {
          background: rgba(0,0,0,0.015);
        }
        .day-row.closed {
          opacity: 0.45;
        }
        .day-row.has-slots .row-main {
          background: rgba(99,50,229,0.02);
        }

        /* ── Row main ── */
        .row-main {
          display: grid;
          grid-template-columns: 140px 1fr 100px;
          gap: 0;
          padding: 0.875rem 1.25rem;
          align-items: center;
          cursor: pointer;
        }

        /* ── Day name ── */
        .col-name {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .day-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .day-short {
          display: none;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        /* ── Slots ── */
        .col-slots {
          display: flex;
          align-items: center;
        }
        .slots-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }
        .slot-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          background: var(--surface-hover);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          font-size: 0.75rem;
          transition: all 0.15s;
        }
        .slot-chip:hover {
          border-color: var(--text-tertiary);
        }
        .slot-time {
          color: var(--text-primary);
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          white-space: nowrap;
        }
        .slot-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          font-size: 0.875rem;
          line-height: 1;
          transition: all 0.15s;
        }
        .slot-delete:hover {
          background: var(--error-bg);
          color: var(--error);
        }
        .no-slots {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
        }

        /* ── Status badge ── */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
          font-size: 0.6875rem;
          font-weight: 500;
          white-space: nowrap;
        }
        .status-available {
          background: rgba(45, 106, 79, 0.1);
          color: var(--success);
        }
        .status-unavailable {
          background: var(--error-bg);
          color: var(--error);
        }
        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        /* ── Right side ── */
        .col-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius);
          border: 1.5px dashed var(--border);
          background: transparent;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .add-btn span {
          white-space: nowrap;
        }
        .add-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-bg);
        }

        /* ── Toggle switch ── */
        .toggle {
          width: 36px;
          height: 20px;
          border-radius: 999px;
          border: none;
          background: var(--surface-hover);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          padding: 0;
          flex-shrink: 0;
        }
        .toggle.is-closed {
          background: var(--error);
        }
        .toggle:not(.is-closed) {
          background: var(--primary);
        }
        .toggle-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle.is-closed .toggle-thumb {
          transform: translateX(16px);
        }

        /* ── Row form ── */
        .row-form {
          padding: 0.875rem 1.25rem;
          padding-left: calc(140px + 1.25rem);
          background: var(--primary-bg);
          border-top: 1px solid rgba(99,50,229,0.15);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          animation: slideDown 0.18s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-label {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 500;
        }
        .form-row {
          display: flex;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .time-field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .time-label {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .time-input {
          width: 90px;
          padding: 0.4rem 0.625rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface);
          color: var(--text-primary);
          font-size: 0.8125rem;
          font-family: 'DM Mono', monospace;
        }
        .time-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        .time-sep {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          padding-bottom: 0.4rem;
        }
        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.875rem;
          border-radius: var(--radius);
          border: none;
          background: var(--primary);
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .submit-btn:hover {
          opacity: 0.88;
        }
        .cancel-btn {
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cancel-btn:hover {
          background: var(--surface-hover);
        }
        .validation-error {
          font-size: 0.75rem;
          color: var(--error);
          font-weight: 500;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .table-header {
            display: none;
          }
          .row-main {
            grid-template-columns: 1fr auto;
            grid-template-rows: auto auto;
            gap: 0.5rem;
            padding: 0.875rem 1rem;
          }
          .col-name {
            grid-column: 1;
            grid-row: 1;
          }
          .col-right {
            grid-column: 2;
            grid-row: 1;
          }
          .col-slots {
            grid-column: 1 / -1;
            grid-row: 2;
          }
          .col-toggle {
            display: none;
          }
          .day-name {
            display: none;
          }
          .day-short {
            display: block;
          }
          .row-form {
            padding-left: 1rem;
          }
          .form-row {
            flex-wrap: wrap;
            align-items: flex-start;
          }
        }
        @media (max-width: 480px) {
          .add-btn span {
            display: none;
          }
          .add-btn {
            padding: 0.3rem 0.5rem;
          }
          .status-badge span:last-child {
            display: none;
          }
          .time-input {
            width: 80px;
          }
        }
      `}</style>
    </div>
  )
}

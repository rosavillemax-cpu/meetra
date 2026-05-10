'use client'

import { useState } from 'react'
import { Plus, EyeOff, Eye } from 'lucide-react'
import type { AvailabilityRule } from '@prisma/client'

const WEEKDAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']

interface WeekScheduleProps {
  rules: AvailabilityRule[]
  onAddRule?: (weekday: number, startTime: string, endTime: string) => void
  onDeleteRule?: (rule: AvailabilityRule) => void
  onUpdateRule?: (rule: AvailabilityRule) => void
}

export function WeekSchedule({ rules, onAddRule, onDeleteRule, onUpdateRule }: WeekScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [closedDays, setClosedDays] = useState<Set<number>>(new Set())

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
    onAddRule?.(selectedDay, startTime, endTime)
    setSelectedDay(null)
  }

  return (
    <div className="week-schedule">
      <div className="week-grid">
        {WEEKDAYS.map((day, index) => {
          const dayRules = getRulesForDay(index)
          const isSelected = selectedDay === index
          const isClosed = closedDays.has(index)
          const hasSlots = dayRules.length > 0

          return (
            <div
              key={day}
              className={`day-column ${isSelected ? 'selected' : ''} ${isClosed ? 'closed' : ''} ${hasSlots && !isClosed ? 'has-slots' : ''}`}
            >
              {/* Header */}
              <div className="day-header">
                <span className="day-name">{day}</span>
                <div className="day-header-right">
                  <div className={`toggle-wrap ${isClosed ? 'toggle-closed' : ''}`} title={isClosed ? 'Günü aç' : 'Günü kapat'}>
                    <button
                      className={`toggle ${isClosed ? 'is-closed' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleClosed(index); }}
                      aria-label={isClosed ? 'Günü aç' : 'Günü kapat'}
                    >
                      <span className="toggle-thumb" />
                    </button>
                  </div>
                  <span
                    className="day-count"
                    title={hasSlots ? `${dayRules.length} saat aralığı tanımlı` : 'Henüz saat aralığı yok'}
                  >
                    {dayRules.length}
                  </span>
                </div>
              </div>

              {/* Slots */}
              <div className="day-slots">
                {dayRules.map(rule => (
                  <div key={rule.id} className="time-slot">
                    <span className="slot-time">
                      {rule.startTime} — {rule.endTime}
                    </span>
                    {onDeleteRule && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteRule(rule); }}
                        className="slot-delete"
                        aria-label="Sil"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Empty state — dashed line when no slots and not closed */}
              {!hasSlots && !isClosed && !isSelected && (
                <div className="day-empty-hint">
                  <span className="empty-dash" />
                  <span className="empty-text">Kapalı</span>
                  <span className="empty-dash" />
                </div>
              )}

              {/* Add form when selected */}
              {isSelected && !isClosed && (
                <div className="day-add-form" onClick={e => e.stopPropagation()}>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="time-input"
                  />
                  <span className="time-sep">—</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="time-input"
                  />
                  <button onClick={handleAddSlot} className="add-btn" aria-label="Ekle">
                    <Plus size={12} />
                  </button>
                </div>
              )}

              {/* Add button when not selected, not closed, no slots yet */}
              {!isSelected && !isClosed && !hasSlots && (
                <button
                  className="add-slot-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedDay(index); }}
                >
                  <Plus size={12} />
                  <span>Saat ekle</span>
                </button>
              )}

              {/* Add button when has slots but not selected */}
              {!isSelected && !isClosed && hasSlots && (
                <button
                  className="add-slot-btn add-slot-btn--compact"
                  onClick={(e) => { e.stopPropagation(); setSelectedDay(index); }}
                >
                  <Plus size={11} />
                  <span>Ekle</span>
                </button>
              )}

              {/* Closed overlay */}
              {isClosed && (
                <div className="closed-overlay">
                  <span>Gün kapalı</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .week-schedule {
          overflow-x: auto;
        }
        .week-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.75rem;
          min-width: 700px;
        }

        /* ── Card ── */
        .day-column {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: all 0.15s;
        }
        .day-column:hover:not(.closed):not(.selected) {
          border-color: var(--text-tertiary);
        }
        .day-column.selected {
          border-color: var(--primary);
          background: var(--primary-bg);
        }
        .day-column.closed {
          opacity: 0.5;
        }
        .day-column.has-slots {
          border-color: rgba(99,50,229,0.2);
        }

        /* ── Header ── */
        .day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .day-header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .day-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        /* ── Toggle switch ── */
        .toggle-wrap {
          position: relative;
        }
        .toggle {
          width: 32px;
          height: 18px;
          border-radius: 999px;
          border: none;
          background: var(--surface-hover);
          cursor: pointer;
          position: relative;
          transition: background 0.2s;
          padding: 0;
        }
        .toggle.is-closed {
          background: var(--error);
        }
        .toggle:not(.is-closed) {
          background: var(--primary);
        }
        .toggle-thumb {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #fff;
          transition: transform 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .toggle.is-closed .toggle-thumb {
          transform: translateX(14px);
        }

        /* ── Counter badge ── */
        .day-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          padding: 0 0.3rem;
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-tertiary);
          background: var(--surface-hover);
          border-radius: var(--radius-sm);
          cursor: default;
        }

        /* ── Slots ── */
        .day-slots {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .time-slot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.3rem 0.5rem;
          background: var(--surface-hover);
          border-radius: var(--radius);
          font-size: 0.75rem;
        }
        .slot-time {
          color: var(--text-primary);
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
        }
        .slot-delete {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          line-height: 1;
          flex-shrink: 0;
        }
        .slot-delete:hover {
          background: var(--error-bg);
          color: var(--error);
        }

        /* ── Empty hint ── */
        .day-empty-hint {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0;
        }
        .empty-dash {
          flex: 1;
          height: 1px;
          background: var(--border);
          border-radius: 1px;
        }
        .empty-text {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          white-space: nowrap;
        }

        /* ── Add slot button ── */
        .add-slot-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius);
          border: 1.5px dashed var(--border);
          background: transparent;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          margin-top: auto;
        }
        .add-slot-btn span {
          white-space: nowrap;
        }
        .add-slot-btn:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-bg);
        }
        .add-slot-btn--compact {
          padding: 0.3rem 0.6rem;
          font-size: 0.7rem;
          gap: 0.25rem;
        }
        .add-slot-btn--compact span {
          white-space: nowrap;
        }

        /* ── Add form ── */
        .day-add-form {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--border);
          margin-top: auto;
        }
        .time-input {
          width: 64px;
          padding: 0.25rem 0.3rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface);
          color: var(--text-primary);
          font-size: 0.7rem;
          font-family: 'DM Mono', monospace;
        }
        .time-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        .time-sep {
          font-size: 0.7rem;
          color: var(--text-tertiary);
          flex-shrink: 0;
        }
        .add-btn {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: none;
          background: var(--primary);
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.15s;
        }
        .add-btn:hover {
          opacity: 0.88;
        }

        /* ── Closed overlay ── */
        .closed-overlay {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          min-height: 60px;
          color: var(--text-tertiary);
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  )
}

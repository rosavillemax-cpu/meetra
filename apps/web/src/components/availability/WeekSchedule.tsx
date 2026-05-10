'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, EyeOff, Eye } from 'lucide-react'
import type { AvailabilityRule } from '@prisma/client'

const WEEKDAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']
const WEEKDAYS_SHORT = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct']

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

          return (
            <div
              key={day}
              className={`day-column ${isSelected ? 'selected' : ''} ${isClosed ? 'closed' : ''}`}
              onClick={() => !isClosed && setSelectedDay(isSelected ? null : index)}
            >
              <div className="day-header">
                <span className="day-name">{day}</span>
                <div className="day-header-right">
                  <button
                    className={`day-toggle ${isClosed ? 'is-closed' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleClosed(index); }}
                    title={isClosed ? 'Günü aç' : 'Günü kapat'}
                  >
                    {isClosed ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                  <span className="day-count">{dayRules.length}</span>
                </div>
              </div>

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
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isSelected && !isClosed && (
                <div className="day-add-form" onClick={e => e.stopPropagation()}>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="time-input"
                  />
                  <span className="time-separator">—</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="time-input"
                  />
                  <button onClick={handleAddSlot} className="add-slot-btn">
                    <Plus size={14} />
                  </button>
                </div>
              )}

              {!isSelected && !isClosed && dayRules.length === 0 && (
                <button
                  className="add-slot-empty"
                  onClick={(e) => { e.stopPropagation(); setSelectedDay(index); }}
                >
                  <Plus size={12} />
                  Saat ekle
                </button>
              )}

              {isClosed && (
                <div className="closed-overlay">
                  <EyeOff size={14} />
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
        .day-column {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .day-column:hover:not(.closed) {
          border-color: var(--text-tertiary);
        }
        .day-column.selected {
          border-color: var(--primary);
          background: var(--primary-bg);
        }
        .day-column.closed {
          opacity: 0.55;
          cursor: default;
        }
        .day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
        }
        .day-header-right {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .day-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .day-count {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          background: var(--surface-hover);
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
        }
        .day-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 5px;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          transition: all 0.15s;
        }
        .day-toggle:hover {
          background: var(--surface-hover);
          color: var(--text-primary);
        }
        .day-toggle.is-closed {
          color: var(--error);
          background: var(--error-bg);
        }
        .day-slots {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          flex: 1;
        }
        .time-slot {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.375rem 0.5rem;
          background: var(--surface-hover);
          border-radius: var(--radius);
          font-size: 0.75rem;
        }
        .slot-time {
          color: var(--text-primary);
          font-family: 'DM Mono', monospace;
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
        }
        .slot-delete:hover {
          background: var(--error-bg);
          color: var(--error);
        }
        .day-add-form {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .time-input {
          width: 70px;
          padding: 0.25rem 0.375rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--surface);
          color: var(--text-primary);
          font-size: 0.75rem;
          font-family: 'DM Mono', monospace;
        }
        .time-separator {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
        .add-slot-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: var(--primary);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .add-slot-btn:hover {
          opacity: 0.9;
        }
        .add-slot-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          width: 100%;
          padding: 0.5rem;
          border-radius: var(--radius);
          border: 1.5px dashed var(--border);
          background: transparent;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.15s;
          margin-top: auto;
        }
        .add-slot-empty:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: var(--primary-bg);
        }
        .closed-overlay {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          flex: 1;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}
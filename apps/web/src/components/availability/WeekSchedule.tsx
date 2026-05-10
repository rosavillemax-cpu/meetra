'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
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

  const getRulesForDay = (weekday: number) => {
    return rules.filter(r => r.weekday === weekday && !r.isOverride)
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

          return (
            <div
              key={day}
              className={`day-column ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDay(isSelected ? null : index)}
            >
              <div className="day-header">
                <span className="day-name">{day}</span>
                <span className="day-count">{dayRules.length}</span>
              </div>

              <div className="day-slots">
                {dayRules.map(rule => (
                  <div key={rule.id} className="time-slot">
                    <span className="slot-time">
                      {rule.startTime} - {rule.endTime}
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

              {isSelected && (
                <div className="day-add-form" onClick={e => e.stopPropagation()}>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="time-input"
                  />
                  <span className="time-separator">-</span>
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
        }
        .day-column:hover {
          border-color: var(--text-tertiary);
        }
        .day-column.selected {
          border-color: var(--primary);
          background: var(--primary-bg);
        }
        .day-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
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
        .day-slots {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
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
          font-family: monospace;
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
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .time-input {
          width: 70px;
          padding: 0.25rem 0.375rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--background);
          color: var(--text-primary);
          font-size: 0.75rem;
          font-family: monospace;
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
      `}</style>
    </div>
  )
}
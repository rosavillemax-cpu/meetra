'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { EventType } from '@prisma/client'

interface CreateEventTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    slug: string
    description?: string
    durationMin: number
    color: string
  }) => void
}

const COLORS = [
  '#000000', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6',
  '#ec4899', '#6b7280'
]

const DURATIONS = [15, 30, 45, 60, 90, 120]

export function CreateEventTypeModal({ isOpen, onClose, onSubmit }: CreateEventTypeModalProps) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [durationMin, setDurationMin] = useState(30)
  const [color, setColor] = useState('#000000')

  if (!isOpen) return null

  const generateSlug = (t: string) => {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      slug,
      description,
      durationMin,
      color
    })
    setTitle('')
    setSlug('')
    setDescription('')
    setDurationMin(30)
    setColor('#000000')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Yeni Randevu Tipi</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Başlık *</label>
            <input
              type="text"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="15 dakikalık tanışma görüşmesi"
              required
            />
          </div>

          <div className="form-group">
            <label>URL Slug *</label>
            <div className="slug-input">
              <span className="slug-prefix">/cal/</span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="tanisma-gorusmesi"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Açıklama</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Bu randevu tipi hakkında kısa bir açıklama..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Süre *</label>
              <select
                value={durationMin}
                onChange={e => setDurationMin(Number(e.target.value))}
              >
                {DURATIONS.map(d => (
                  <option key={d} value={d}>{d} dakika</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Renk</label>
              <div className="color-picker">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-btn ${color === c ? 'selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              İptal
            </button>
            <button type="submit" className="btn-primary">
              Oluştur
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }
        .modal-content {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h2 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
        }
        .close-btn {
          padding: 0.25rem;
          border: none;
          background: transparent;
          color: var(--text-tertiary);
          cursor: pointer;
          border-radius: var(--radius);
        }
        .modal-form {
          padding: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 0.375rem;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          background: var(--background);
          color: var(--text-primary);
          font-size: 0.9375rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--accent-dim);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        .slug-input {
          display: flex;
          align-items: center;
        }
        .slug-prefix {
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--border);
          border-right: none;
          border-radius: var(--radius) 0 0 var(--radius);
          background: var(--surface-hover);
          color: var(--text-tertiary);
          font-size: 0.875rem;
          font-family: monospace;
        }
        .slug-input input {
          border-radius: 0 var(--radius) var(--radius) 0;
          font-family: monospace;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .color-picker {
          display: flex;
          gap: 0.375rem;
          flex-wrap: wrap;
        }
        .color-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s;
        }
        .color-btn.selected {
          border-color: var(--text-primary);
          transform: scale(1.1);
        }
        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          margin-top: 0.5rem;
        }
        .btn-primary,
        .btn-secondary {
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-primary {
          background: var(--primary);
          color: white;
          border: none;
        }
        .btn-primary:hover {
          opacity: 0.9;
        }
        .btn-secondary {
          background: transparent;
          color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .btn-secondary:hover {
          background: var(--surface-hover);
        }
      `}</style>
    </div>
  )
}
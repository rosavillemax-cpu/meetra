const CALENDAR_DAYS = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, null, null],
]

const AVAILABLE_DAYS = new Set([9, 10, 11, 14, 15, 16, 17])
const SELECTED_DAY = 15

export function BookingMockup() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--obs-border)',
      borderRadius: 16,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      maxWidth: 380,
      marginLeft: 'auto',
    }}>
      {/* Guest info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--obs-border)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--obs-violet), #7c3aed)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.875rem', fontWeight: 600, color: '#fff',
          fontFamily: 'var(--font-geist-sans)',
        }}>
          A
        </div>
        <div>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--obs-text-1)', fontFamily: 'var(--font-geist-sans)' }}>
            Alex Johnson
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.125rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--obs-text-2)' }}>30-min Strategy Call</span>
            <span style={{
              fontSize: '0.6875rem', fontWeight: 600,
              color: 'var(--obs-emerald)',
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.2)',
              borderRadius: 4,
              padding: '0.125rem 0.375rem',
            }}>
              30 min
            </span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div>
        {/* Month header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--obs-text-1)', fontFamily: 'var(--font-geist-sans)' }}>
            July 2024
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['‹', '›'].map((ch, i) => (
              <button key={i} style={{
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--obs-surface-2)',
                border: '1px solid var(--obs-border)',
                borderRadius: 6,
                color: 'var(--obs-text-2)',
                fontSize: '1rem',
                cursor: 'default',
              }}>
                {ch}
              </button>
            ))}
          </div>
        </div>

        {/* Day labels */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.375rem' }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: '0.6875rem',
              color: 'var(--obs-text-2)', fontFamily: 'var(--font-geist-sans)',
              padding: '0 0 0.25rem',
            }}>
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        {CALENDAR_DAYS.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {week.map((day, di) => {
              const isSelected = day === SELECTED_DAY
              const isAvailable = day !== null && AVAILABLE_DAYS.has(day)
              const isEmpty = day === null

              return (
                <div key={di} style={{
                  width: 34, height: 34,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8125rem',
                  fontFamily: 'var(--font-geist-sans)',
                  borderRadius: isSelected ? '50%' : 6,
                  background: isSelected
                    ? 'var(--obs-violet)'
                    : isAvailable
                      ? 'var(--obs-violet-dim)'
                      : 'transparent',
                  color: isSelected
                    ? '#09090b'
                    : isEmpty
                      ? 'transparent'
                      : isAvailable
                        ? 'var(--obs-violet)'
                        : 'var(--obs-text-2)',
                  fontWeight: isSelected ? 700 : isAvailable ? 500 : 400,
                  opacity: isEmpty ? 0 : 1,
                  cursor: 'default',
                }}>
                  {day}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Time slots */}
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--obs-text-2)', marginBottom: '0.625rem', fontFamily: 'var(--font-geist-sans)' }}>
          Available times — Mon, Jul 15
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[{ t: '9:00 am', selected: false }, { t: '11:00 am', selected: true }].map(({ t, selected }) => (
            <button key={t} style={{
              flex: 1,
              padding: '0.5rem',
              border: selected ? '1px solid var(--obs-violet)' : '1px solid var(--obs-border)',
              background: selected ? 'var(--obs-violet-dim)' : 'var(--obs-surface-2)',
              color: selected ? 'var(--obs-violet)' : 'var(--obs-text-1)',
              borderRadius: 'var(--obs-radius-card)',
              fontSize: '0.8125rem',
              fontWeight: selected ? 600 : 400,
              cursor: 'default',
              fontFamily: 'var(--font-geist-sans)',
            }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm button */}
      <button style={{
        width: '100%',
        padding: '0.75rem',
        background: 'var(--obs-violet)',
        color: '#09090b',
        border: 'none',
        borderRadius: 'var(--obs-radius-card)',
        fontSize: '0.9375rem',
        fontWeight: 600,
        cursor: 'default',
        fontFamily: 'var(--font-geist-sans)',
      }}>
        Confirm Meeting
      </button>
    </div>
  )
}

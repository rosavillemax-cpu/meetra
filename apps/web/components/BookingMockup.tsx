const CALENDAR_DAYS = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 31, null, null, null],
]

const HIGHLIGHTED = new Set([1, 2, 3, 4, 5, 8, 9, 10, 11, 15, 16, 17])
const SELECTED = 8

export function BookingMockup() {
  return (
    <>
      <style>{`
        .bm-scene {
          position: relative;
          width: 100%;
          min-height: 520px;
          overflow: hidden;
          border-radius: 24px;
        }
        .bm-blob {
          position: absolute;
          border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
          pointer-events: none;
        }
        .bm-cards {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: 54% 1fr;
          gap: 0;
          align-items: flex-start;
          padding: 24px 20px;
          z-index: 10;
        }
        .bm-cal {
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          padding: 1.125rem;
          z-index: 2;
          position: relative;
        }
        .bm-book {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 14px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.16);
          padding: 1.125rem;
          margin-top: 110px;
          margin-left: -16px;
          z-index: 3;
          position: relative;
        }
        .bm-day {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8125rem;
          border-radius: 50%;
          cursor: default;
        }
        .bm-slot {
          flex: 1;
          padding: 0.4375rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: default;
          text-align: center;
          border: none;
        }
        .bm-slot-normal {
          background: #f9fafb;
          color: #374151;
          border: 1px solid #e5e7eb;
        }
        .bm-slot-selected {
          background: #4f46e5;
          color: #fff;
          border: 1px solid #4f46e5;
        }
        .bm-confirm {
          width: 100%;
          padding: 0.625rem;
          background: #4f46e5;
          color: #fff;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: default;
          border: none;
          font-family: 'DM Sans', sans-serif;
        }
        @media (max-width: 768px) {
          .bm-scene {
            min-height: unset;
            border-radius: 0;
            overflow: visible;
          }
          .bm-blob { display: none; }
          .bm-cards {
            position: static;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 0;
          }
          .bm-book {
            margin-top: 0;
            margin-left: 0;
          }
        }
      `}</style>

      <div className="bm-scene">
        {/* Vivid blob shapes */}
        <div className="bm-blob" style={{ width: 360, height: 360, background: '#7c3aed', top: '12%', left: '3%' }} />
        <div className="bm-blob" style={{ width: 280, height: 280, background: '#3b82f6', borderRadius: '54% 46% 38% 62% / 65% 44% 56% 35%', bottom: '3%', right: '4%' }} />
        <div className="bm-blob" style={{ width: 210, height: 210, background: '#8b5cf6', borderRadius: '45% 55% 67% 33% / 56% 34% 66% 44%', top: '4%', right: '18%' }} />

        <div className="bm-cards">
          {/* Calendar card */}
          <div className="bm-cal">
            {/* Company header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ width: 26, height: 26, background: '#1a1a1a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                </svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>Callroom Inc.</span>
            </div>

            {/* Month nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>July 2024</span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {['‹', '›'].map((ch, i) => (
                  <button key={i} style={{ width: 24, height: 24, border: '1px solid #e5e7eb', borderRadius: 5, background: '#fff', fontSize: '0.875rem', color: '#6b7280', cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ch}</button>
                ))}
              </div>
            </div>

            {/* Day labels */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.25rem' }}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.625rem', color: '#9ca3af', padding: '0 0 0.25rem', fontFamily: 'DM Sans, sans-serif' }}>{d}</div>
              ))}
            </div>

            {/* Date grid */}
            {CALENDAR_DAYS.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {week.map((day, di) => {
                  const isSel = day === SELECTED
                  const isHigh = day !== null && HIGHLIGHTED.has(day)
                  return (
                    <div key={di} className="bm-day" style={{
                      background: isSel ? '#4f46e5' : isHigh ? '#ede9fe' : 'transparent',
                      color: isSel ? '#fff' : day === null ? 'transparent' : isHigh ? '#4f46e5' : '#374151',
                      fontWeight: isSel ? 700 : isHigh ? 500 : 400,
                      margin: '1px auto',
                    }}>
                      {day}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Booking card */}
          <div className="bm-book">
            {/* Guest */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>S</div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>Sarah Jenkins</span>
            </div>

            {/* Event info */}
            <div style={{ marginBottom: '0.875rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827', fontFamily: 'DM Sans, sans-serif' }}>Client Check-in</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: 2 }}>
                    <span style={{ padding: '0.125rem 0.375rem', background: '#f3f4f6', borderRadius: 4, marginRight: '0.25rem' }}>30 min</span>
                    Mon, Jul 8
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </div>
            </div>

            {/* Time slots */}
            <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.625rem' }}>
              <button className="bm-slot bm-slot-normal">9:00am</button>
              <button className="bm-slot bm-slot-selected">11:00am</button>
            </div>

            {/* Confirm */}
            <button className="bm-confirm">Confirm</button>
          </div>
        </div>
      </div>
    </>
  )
}

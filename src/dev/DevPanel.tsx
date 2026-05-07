import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEV_SCREENS } from './devScreens'

export default function DevPanel() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  function go(path: string) {
    navigate(path)
    setOpen(false)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Dev Navigation"
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          zIndex: 9999,
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: '50%',
          background: '#0f172a',
          border: '1px solid #22d3ee',
          color: '#22d3ee',
          fontSize: '1rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 0 1px #22d3ee33',
          fontFamily: 'monospace',
        }}
      >
        ⚙
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(0,0,0,0.35)',
          }}
        />
      )}

      {/* Slide-in panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          width: '17rem',
          background: 'rgba(10, 15, 28, 0.96)',
          backdropFilter: 'blur(8px)',
          borderLeft: '1px solid #22d3ee44',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.22s ease',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'ui-monospace, "Cascadia Code", Menlo, monospace',
          fontSize: '0.72rem',
          color: '#cbd5e1',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #22d3ee33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'rgba(10,15,28,0.98)',
          }}
        >
          <span style={{ color: '#22d3ee', fontWeight: 700, letterSpacing: '0.08em' }}>
            [DEV] Hamlet
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '1rem',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Screen groups */}
        <div style={{ padding: '0.5rem 0 1rem' }}>
          {DEV_SCREENS.map(group => (
            <div key={group.group}>
              {group.group && (
                <div
                  style={{
                    padding: '0.5rem 1rem 0.25rem',
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                  }}
                >
                  {group.group}
                </div>
              )}
              {group.screens.map(screen => (
                <button
                  key={screen.path}
                  onClick={() => go(screen.path)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    padding: '0.35rem 1rem',
                    cursor: 'pointer',
                    color: '#e2e8f0',
                    borderLeft: '2px solid transparent',
                    transition: 'background 0.1s, border-color 0.1s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.background = 'rgba(34,211,238,0.07)'
                    el.style.borderLeftColor = '#22d3ee'
                    el.style.color = '#22d3ee'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.background = 'none'
                    el.style.borderLeftColor = 'transparent'
                    el.style.color = '#e2e8f0'
                  }}
                >
                  <span style={{ display: 'block' }}>{screen.label}</span>
                  {screen.description && (
                    <span style={{ color: '#475569', fontSize: '0.62rem' }}>
                      {screen.description}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

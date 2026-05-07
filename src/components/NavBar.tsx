import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface NavBarProps {
  variant?: 'landing' | 'app'
}

export default function NavBar({ variant = 'landing' }: NavBarProps) {
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = () => {
    setOpen(false)
    clearAuth()
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-10">
      <Link to="/" className="font-serif text-xl font-semibold text-ink-900 tracking-tight">
        🎭 Hamlet
      </Link>

      <div className="flex items-center gap-3">
        {variant === 'landing' && !user && (
          <>
            <Link to="/auth" className="btn-ghost">
              Iniciar sesión
            </Link>
            <Link to="/auth" className="btn-primary">
              Empezar
            </Link>
          </>
        )}

        {variant === 'app' && user && (
          <>
            <Link to="/app/dashboard" className="btn-ghost hidden sm:inline-flex">
              Panel
            </Link>

            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setOpen(o => !o)}
                aria-label="Mi cuenta"
                className="btn-ghost p-2"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </button>

              {open && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    minWidth: 160,
                    background: 'white',
                    border: '1px solid #e8e0d0',
                    borderRadius: 12,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    zIndex: 50,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={handleSignOut}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.65rem 1rem',
                      fontSize: '0.875rem',
                      color: '#1a1a2e',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#faf7f2')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

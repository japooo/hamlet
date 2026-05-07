import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { useAuditionStore } from '../store/auditionStore'

type SessionState = 'idle' | 'listening' | 'complete'

function VoiceOrb() {
  const [phase, setPhase] = useState<'listening' | 'reciting'>('listening')

  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => p === 'listening' ? 'reciting' : 'listening')
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const label = phase === 'listening' ? 'Escuchando...' : 'Recitando...'

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-10">
      <div style={{ position: 'relative', width: 180, height: 180 }}>
        {/* Outer ripple rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px solid',
              borderColor: `rgba(180,140,60,${0.18 - i * 0.05})`,
              animation: `orb-ring 2.4s ease-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
        {/* Core orb */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 36%, #f5e9c8 0%, #c9a84c 55%, #7c5c1e 100%)',
            boxShadow: '0 0 40px 8px rgba(201,168,76,0.28), 0 0 80px 20px rgba(201,168,76,0.10)',
            animation: 'orb-pulse 1.8s ease-in-out infinite',
          }}
        />
        {/* Inner shimmer */}
        <div
          style={{
            position: 'absolute',
            inset: 36,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, rgba(255,255,240,0.55) 0%, transparent 65%)',
            animation: 'orb-shimmer 2.6s ease-in-out infinite',
          }}
        />
        {/* Orbiting dots */}
        {[
          { r: 80, size: 12, duration: 3.2, delay: 0,    opacity: 0.85 },
          { r: 88, size: 7,  duration: 4.8, delay: -1.6,  opacity: 0.5 },
          { r: 74, size: 9,  duration: 5.6, delay: -3.8,  opacity: 0.65 },
        ].map((dot, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              animation: `orbit-spin ${dot.duration}s linear infinite`,
              animationDelay: `${dot.delay}s`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: dot.size,
                height: dot.size,
                marginTop: -dot.size / 2,
                marginLeft: dot.r - dot.size / 2,
                borderRadius: '50%',
                background: `rgba(201,168,76,${dot.opacity})`,
                boxShadow: `0 0 6px 2px rgba(201,168,76,${dot.opacity * 0.5})`,
              }}
            />
          </div>
        ))}
      </div>

      <p className="text-sm text-ink-400 tracking-wide animate-pulse">{label}</p>

      <style>{`
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.07); opacity: 0.92; }
        }
        @keyframes orb-shimmer {
          0%, 100% { opacity: 0.7; transform: rotate(0deg); }
          50% { opacity: 1; transform: rotate(8deg); }
        }
        @keyframes orb-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function PracticePage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { preparations } = useAuditionStore()
  const prep = preparations.find((p) => p.id === id)
  const userCharacter = prep?.selectedCharacter ?? 'Hamlet'

  const [sessionState, setSessionState] = useState<SessionState>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleStart() {
    setSessionState('listening')
    timerRef.current = setTimeout(() => setSessionState('complete'), 6000)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div className="page-container flex flex-col min-h-screen">
      <NavBar variant="app" />

      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pb-12 md:px-6 pt-2">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost p-2 shrink-0 text-2xl leading-none"
            aria-label="Volver"
          >
            ←
          </button>
          <div className="min-w-0">
            <h1 className="font-serif text-xl font-semibold text-ink-900 truncate">
              {prep?.title ?? 'Práctica'}
            </h1>
            <p className="text-xs text-ink-400 mt-0.5">Interpretando a {userCharacter}</p>
          </div>
        </div>

        {/* States */}
        {sessionState === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <button onClick={handleStart} className="btn-primary px-10 py-4 text-base">
              ▶ Empezar sesión de práctica
            </button>
          </div>
        )}

        {sessionState === 'listening' && <VoiceOrb />}

        {sessionState === 'complete' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="card text-center py-10 px-8 w-full max-w-sm">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">¡Escena completada!</h3>
              <p className="text-sm text-ink-400 mb-6">
                Precisión de sesión: <strong>79%</strong>
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleStart} className="btn-primary">
                  Repetir
                </button>
                <Link to={`/app/auditions/${id}/state`} className="btn-secondary">
                  Ver estado de audición
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

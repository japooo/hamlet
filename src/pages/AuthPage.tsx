import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAuth(
      { id: crypto.randomUUID(), email: email || 'dev@hamlet.app', name: name || email.split('@')[0] || 'Dev' },
      'mock-token',
    )
    navigate('/app/dashboard')
  }

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-screen px-4">
      <Link to="/" className="font-serif text-2xl font-semibold text-ink-900 mb-10 tracking-tight">
        🎭 Hamlet
      </Link>

      <div className="w-full max-w-sm">
        <div className="flex rounded-xl border border-parchment-200 bg-parchment-100 p-1 mb-6">
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                mode === m
                  ? 'bg-white shadow-soft text-ink-900'
                  : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink-700">Nombre</label>
              <input
                className="input"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink-700">Email</label>
            <input
              className="input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-2">
            {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-400 mt-6">
          Al continuar, aceptas nuestros{' '}
          <span className="text-ink-600 cursor-pointer hover:underline">Términos</span> y{' '}
          <span className="text-ink-600 cursor-pointer hover:underline">Política de privacidad</span>.
        </p>
      </div>
    </div>
  )
}

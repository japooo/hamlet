import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Toast from '../components/Toast'

type Mode = 'login' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const { setAuth, setLoading, isLoading } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with real Codex auth calls
      await new Promise((r) => setTimeout(r, 900))
      const mockUser = {
        id: crypto.randomUUID(),
        email,
        name: mode === 'signup' ? name : email.split('@')[0],
      }
      setAuth(mockUser, `mock-token-${Date.now()}`)
      if (mode === 'signup') setToast('Account created! Welcome.')
      navigate('/app/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-screen px-4">
      <Link to="/" className="font-serif text-2xl font-semibold text-ink-900 mb-10 tracking-tight">
        🎭 Audition Prep
      </Link>

      <div className="w-full max-w-sm">
        {/* Mode Toggle */}
        <div className="flex rounded-xl border border-parchment-200 bg-parchment-100 p-1 mb-6">
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError('') }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 capitalize ${
                mode === m
                  ? 'bg-white shadow-soft text-ink-900'
                  : 'text-ink-400 hover:text-ink-600'
              }`}
            >
              {m === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <div className="card shadow-card">
          <h1 className="font-serif text-2xl font-semibold text-ink-900 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-ink-400 mb-6">
            {mode === 'login'
              ? 'Log in to continue your prep.'
              : 'Start preparing your next audition.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="label" htmlFor="name">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="input"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === 'login' ? 'Logging in…' : 'Creating account…'}
                </span>
              ) : mode === 'login' ? (
                'Log in'
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-400 mt-6">
          By continuing you agree to our{' '}
          <span className="text-ink-600 cursor-pointer hover:underline">Terms</span> &amp;{' '}
          <span className="text-ink-600 cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>

      {toast && <Toast message={toast} type="success" onDismiss={() => setToast('')} />}
    </div>
  )
}

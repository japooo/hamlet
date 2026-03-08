import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface NavBarProps {
  variant?: 'landing' | 'app'
}

export default function NavBar({ variant = 'landing' }: NavBarProps) {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  function handleSignOut() {
    clearAuth()
    navigate('/')
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-10">
      <Link to="/" className="font-serif text-xl font-semibold text-ink-900 tracking-tight">
        🎭 Audition Prep
      </Link>

      <div className="flex items-center gap-3">
        {variant === 'landing' && !user && (
          <>
            <Link to="/auth" className="btn-ghost">
              Log in
            </Link>
            <Link to="/auth" className="btn-primary">
              Get started
            </Link>
          </>
        )}

        {variant === 'app' && user && (
          <>
            <Link to="/app/dashboard" className="btn-ghost hidden sm:inline-flex">
              Dashboard
            </Link>
            <button onClick={handleSignOut} className="btn-ghost text-ink-400">
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

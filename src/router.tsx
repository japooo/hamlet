import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import NewAuditionPage from './pages/NewAuditionPage'
import PracticePage from './pages/PracticePage'
import AuditionStatePage from './pages/AuditionStatePage'

function RequireAuth() {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/auth" replace />
  return <Outlet />
}

function RedirectIfAuthed() {
  const { user } = useAuthStore()
  if (user) return <Navigate to="/app/dashboard" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    element: <RedirectIfAuthed />,
    children: [
      {
        path: '/auth',
        element: <AuthPage />,
      },
    ],
  },
  {
    path: '/app',
    element: <RequireAuth />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'auditions/new',
        element: <NewAuditionPage />,
      },
      {
        path: 'auditions/:id/practice',
        element: <PracticePage />,
      },
      {
        path: 'auditions/:id/state',
        element: <AuditionStatePage />,
      },
    ],
  },
])

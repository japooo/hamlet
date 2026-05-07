import { createHashRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import NewAuditionPage from './pages/NewAuditionPage'
import PracticePage from './pages/PracticePage'
import AuditionStatePage from './pages/AuditionStatePage'
import DevPanel from './dev/DevPanel'

const isDev = import.meta.env.DEV

function RootLayout() {
  return (
    <>
      <Outlet />
      {isDev && <DevPanel />}
    </>
  )
}

function RequireAuth() {
  const user = useAuthStore((s) => s.user)
  if (isDev) return <Outlet />
  if (!user) return <Navigate to="/auth" replace />
  return <Outlet />
}

function RedirectIfAuthed() {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/app/dashboard" replace />
  return <Outlet />
}

export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
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
    ],
  },
])

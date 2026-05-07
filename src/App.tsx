import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import SyncUser from './components/SyncUser'

export default function App() {
  return (
    <>
      <SyncUser />
      <RouterProvider router={router} />
    </>
  )
}

import { Route, Routes, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import LearningPage from './pages/LearningPage'
import EditorPage from './pages/EditorPage'
import api from './services/api'
import { tokenStore } from './utils/token'

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStore.get()) {
        setLoading(false)
        return
      }
      try {
        const { data } = await api.get('/auth/me')
        setUser(data)
      } catch {
        tokenStore.clear()
      } finally {
        setLoading(false)
      }
    }
    bootstrap()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/signup" element={<SignupPage setUser={setUser} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage user={user} setUser={setUser} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learn"
        element={
          <ProtectedRoute user={user}>
            <LearningPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor"
        element={
          <ProtectedRoute user={user}>
            <EditorPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

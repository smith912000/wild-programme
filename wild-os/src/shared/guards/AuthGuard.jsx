import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { Spinner } from '@shared/ui/Spinner'

export function AuthGuard({ children }) {
  // initAuth is called once by AppInitialiser at the root — don't re-call here.
  // Re-calling on every protected-route mount caused (a) racing the Supabase
  // navigator-lock for sb-...-auth-token, and (b) wiping mock test sessions
  // back to null on navigation.
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <Spinner size="lg" className="text-accent-gold" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

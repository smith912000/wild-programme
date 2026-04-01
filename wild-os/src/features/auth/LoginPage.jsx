import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useAccessStore } from '@store/accessStore'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { isSupabaseConfigured } from '@lib/supabase'
import toast from 'react-hot-toast'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signInWithGoogle, loading, error, user } = useAuthStore()
  const { tier, initAccess, setTier } = useAccessStore()

  const MASTER_EMAIL = 'smith@negotiorum.com'
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const afterLogin = (loggedInUser) => {
    const email = loggedInUser?.email || user?.email
    if (email === MASTER_EMAIL) {
      setTier('T3')
      navigate(from, { replace: true })
      return
    }
    initAccess()
    if (!tier) {
      navigate('/unlock', { replace: true })
    } else {
      navigate(from, { replace: true })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return toast.error('Please fill in all fields')
    const result = await signIn(email, password)
    if (!result.error) {
      afterLogin(result.user)
    } else {
      toast.error(result.error?.message || 'Sign in failed')
    }
  }

  const handleGoogle = async () => {
    const result = await signInWithGoogle()
    if (result?.error) {
      // Google provider not yet configured — guide the user
      if (result.error.message?.includes('provider is not enabled') ||
          result.error.message?.includes('not configured')) {
        toast.error('Google sign-in requires setup in Supabase dashboard')
      } else {
        toast.error(result.error.message || 'Google sign-in failed')
      }
    }
    // On success the page redirects automatically via OAuth redirect
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4 animate-glow-gold">
            <span className="text-2xl font-display font-bold text-accent-gold">W</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-text-primary">WILD OS</h1>
          <p className="text-text-faint text-sm mt-1">Cognitive Performance System</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-amber-900/20 border border-accent-amber/30 rounded-xl p-3 mb-6 text-center">
            <p className="text-accent-amber text-xs">Running in offline mode — no Supabase configured</p>
          </div>
        )}

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border bg-bg-card hover:bg-bg-elevated transition-colors text-text-primary text-sm font-medium mb-4 disabled:opacity-50"
        >
          {/* Google 'G' icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.612 14.013 17.64 11.81 17.64 9.2z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border"/>
          <span className="text-text-faint text-xs">or</span>
          <div className="flex-1 h-px bg-border"/>
        </div>

        {/* Email / password */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {error && <p className="text-accent-red text-sm text-center">{error}</p>}
          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Sign In
          </Button>
        </form>

        <p className="text-text-faint text-sm text-center mt-6">
          New here?{' '}
          <Link to="/register" className="text-accent-blue hover:text-blue-400 transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

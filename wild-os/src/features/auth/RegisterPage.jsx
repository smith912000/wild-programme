import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import toast from 'react-hot-toast'

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const { signUp, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password || !confirm) return toast.error('Please fill in all fields')
    if (password !== confirm) return toast.error('Passwords do not match')
    if (password.length < 8) return toast.error('Password must be at least 8 characters')

    const result = await signUp(email, password)
    if (!result.error) {
      toast.success('Account created!')
      navigate('/unlock', { replace: true })
    } else {
      toast.error(result.error?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4 animate-glow-gold">
            <span className="text-2xl font-display font-bold text-accent-gold">W</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Create Account</h1>
          <p className="text-text-faint text-sm mt-1">Join WILD OS</p>
        </div>

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
            placeholder="8+ characters"
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat password"
            autoComplete="new-password"
          />
          <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
            Create Account
          </Button>
        </form>

        <p className="text-text-faint text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-blue hover:text-blue-400 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

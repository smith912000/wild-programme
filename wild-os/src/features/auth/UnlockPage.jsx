import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccessStore } from '@store/accessStore'
import { TIERS } from '@config/tiers'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import toast from 'react-hot-toast'

export function UnlockPage() {
  const [code, setCode] = useState('')
  const [success, setSuccess] = useState(false)
  const [unlockedTier, setUnlockedTier] = useState(null)
  const [countdown, setCountdown] = useState(3)
  const { unlockWithCode, loading, error, clearError } = useAccessStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (success && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
    if (success && countdown === 0) {
      navigate('/', { replace: true })
    }
  }, [success, countdown, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    if (!code.trim()) return toast.error('Enter your access code')
    const result = await unlockWithCode(code)
    if (result.success) {
      setUnlockedTier(result.tier)
      setSuccess(true)
      toast.success(`${TIERS[result.tier]?.label} access unlocked!`)
    } else {
      toast.error(result.error || 'Invalid code')
    }
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-bg-card border border-border flex items-center justify-center mb-4 animate-glow-gold">
            <span className="text-3xl font-display font-bold text-accent-gold">W</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-text-primary">WILD OS</h1>
          <p className="text-text-faint text-sm mt-1">Cognitive Performance System</p>
        </div>

        {!success ? (
          <>
            <div className="text-center mb-8">
              <h2 className="font-display font-semibold text-xl text-text-primary mb-2">Enter Your Access Code</h2>
              <p className="text-text-muted text-sm">Your code was included with your purchase. Enter it exactly as provided.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="FOUND-XXXXXXXX"
                autoCapitalize="characters"
                spellCheck={false}
                className="w-full bg-bg-surface border border-border rounded-xl px-4 py-4 text-text-primary text-center font-mono text-lg tracking-widest placeholder-text-faint focus:outline-none focus:border-accent-gold/60 transition-colors"
              />
              {error && <p className="text-accent-red text-sm text-center">{error}</p>}
              <Button type="submit" variant="gold" loading={loading} fullWidth size="lg">
                Unlock Access
              </Button>
            </form>

            <p className="text-text-faint text-xs text-center mt-6">
              Don't have a code?{' '}
              <a
                href={import.meta.env.VITE_WHOP_UPGRADE_URL || 'https://whop.com/wild-programme/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-gold hover:text-yellow-400 transition-colors"
              >
                Get WILD OS
              </a>
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-900/30 border border-accent-green/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10 text-accent-green">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-text-primary font-display font-semibold text-xl mb-2">Access Unlocked</p>
              <Badge variant="tier" tier={unlockedTier} size="md">
                {TIERS[unlockedTier]?.label}
              </Badge>
            </div>
            <p className="text-text-muted text-sm">
              Redirecting in {countdown}s...
            </p>
            <Button variant="gold" onClick={() => navigate('/', { replace: true })}>
              Enter WILD OS
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

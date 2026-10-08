import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useMemberStore } from '@store/memberStore'
import { hasOnboarded } from '@store/onboardingStore'
import { Spinner } from '@shared/ui/Spinner'
import { GuestScreen } from './GuestScreen'
import { LapsedScreen } from './LapsedScreen'
import { FirstRun } from '../onboarding/FirstRun'

export function MemberGate() {
  const status = useMemberStore((s) => s.status)
  const refresh = useMemberStore((s) => s.refresh)
  const [onboarded, setOnboarded] = React.useState(hasOnboarded)

  // Runs once per launch. A fresh sign-in (callback) arrives already verified.
  useEffect(() => {
    if (useMemberStore.getState().status === 'unknown') refresh()
  }, [refresh])

  if (status === 'unknown') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <Spinner size="lg" />
      </div>
    )
  }
  if (status === 'guest') return <GuestScreen />
  if (status === 'expired' || status === 'stale') return <LapsedScreen stale={status === 'stale'} />
  if (!onboarded) return <FirstRun onDone={() => setOnboarded(true)} />
  return <Outlet />
}

import { BootScreen } from '@shared/ui/BootScreen'
import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useMemberStore } from '@store/memberStore'
import { hasOnboarded } from '@store/onboardingStore'
import { syncAccount } from '@lib/accountSync'
import { GuestScreen } from './GuestScreen'
import { LapsedScreen } from './LapsedScreen'
import { FirstRun } from '../onboarding/FirstRun'

// The open (no sign-in) build never asks for a membership and never waits on the sign-in server.
const OPEN = import.meta.env.VITE_OPEN === '1'

export function MemberGate() {
  if (OPEN) return <OpenGate />
  return <MemberGateInner />
}

function OpenGate() {
  const [done, setDone] = React.useState(false)
  if (!done && !hasOnboarded()) return <FirstRun onDone={() => setDone(true)} />
  return <Outlet />
}

function MemberGateInner() {
  const status = useMemberStore((s) => s.status)
  const refresh = useMemberStore((s) => s.refresh)
  const token = useMemberStore((s) => s.token)
  const dataReady = useMemberStore((s) => s.dataReady)
  const [done, setDone] = React.useState(false)

  // Runs once per launch. A fresh sign-in (callback) arrives already verified.
  useEffect(() => {
    if (useMemberStore.getState().status === 'unknown') refresh()
  }, [refresh])

  // Keep the account copy current: when the app is hidden or shown, and every five minutes.
  useEffect(() => {
    if (status !== 'member' || !token) return
    const sync = () => syncAccount(token).catch(() => {})
    const id = setInterval(sync, 5 * 60 * 1000)
    document.addEventListener('visibilitychange', sync)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', sync) }
  }, [status, token])

  if (status === 'unknown' || (status === 'member' && !dataReady)) {
    return (
      <BootScreen />
    )
  }
  if (status === 'guest') return <GuestScreen />
  if (status === 'expired' || status === 'stale') return <LapsedScreen stale={status === 'stale'} />
  if (!done && !hasOnboarded()) return <FirstRun onDone={() => setDone(true)} />
  return <Outlet />
}

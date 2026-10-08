import React from 'react'
import { useMemberStore } from '@store/memberStore'
import { WHOP_MONTHLY_URL, WHOP_ANNUAL_URL } from '@config/whop'
import { Button } from '@shared/ui/Button'
import { GateLayout } from './GateLayout'

export function GuestScreen() {
  const signIn = useMemberStore((s) => s.signIn)
  const error = useMemberStore((s) => s.error)

  return (
    <GateLayout>
      <div>
        <h1 className="font-display font-bold text-3xl text-text-primary">WILD OS</h1>
        <p className="text-text-muted text-sm mt-3 leading-relaxed">
          The practice companion for WILD members. Breathwork, meditation, a dream journal, a seven night tracker,
          a sleep calculator and the full protocol library, all in one place on your phone.
        </p>
        <p className="text-text-faint text-xs mt-3">Included with membership.</p>
      </div>
      <div className="w-full flex flex-col gap-3">
        <Button variant="gold" size="lg" fullWidth onClick={signIn}>Sign in with Whop</Button>
        <a href={WHOP_MONTHLY_URL} className="block">
          <Button variant="secondary" size="lg" fullWidth>Join WILD</Button>
        </a>
        {error && <p role="alert" className="text-accent-red text-sm">{error}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <a href={WHOP_ANNUAL_URL} className="text-text-muted text-xs underline">Prefer the annual plan</a>
        <p className="text-text-faint text-xs">Sign in with the same email you used on Whop.</p>
        <p className="text-text-faint text-[10px] mt-2">Build {__BUILD_ID__}</p>
      </div>
    </GateLayout>
  )
}

import React from 'react'
import { useMemberStore } from '@store/memberStore'
import { WHOP_MONTHLY_URL, WHOP_ANNUAL_URL } from '@config/whop'
import { Button } from '@shared/ui/Button'
import { Mark } from '@shared/ui/Mark'

const HUB_URL = 'https://smith912000.github.io/wild-programme/'

// What a member does with the app, in the order of a night.
const MOMENTS = [
  { when: 'Before sleep', what: 'Breathe, settle, and set the tone for the threshold.' },
  { when: 'In the night', what: 'Timed wake windows and a tracker for the seven nights.' },
  { when: 'In the morning', what: 'Write what came back. The pattern builds over weeks.' },
]

// The guest screen is the app's own front door: what WILD OS is, and the one way in.
export function GuestScreen() {
  const signIn = useMemberStore((s) => s.signIn)
  const error = useMemberStore((s) => s.error)

  return (
    <div className="min-h-screen flex flex-col px-5 pt-14 pb-8">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col items-center text-center animate-fade-in">
        <Mark size={72} />
        <h1 className="mt-5 leading-none">
          <span className="wild-wordmark block text-4xl">WILD</span>
          <span className="section-label block mt-2">The practice app</span>
        </h1>
        <p className="font-display italic text-accent-gold text-xl mt-5" style={{ fontWeight: 500 }}>
          Be there when the threshold comes.
        </p>
        <p className="text-text-muted text-sm mt-3 leading-relaxed max-w-xs">
          Breathwork, tones and timing for the edge of sleep, a journal for what comes back, and the seven night
          tracker. What you write is kept with your account.
        </p>

        <ul className="w-full mt-7 flex flex-col gap-2 text-left">
          {MOMENTS.map(({ when, what }) => (
            <li key={when} className="flex gap-3 items-baseline rounded-2xl border border-border bg-bg-card/70 px-4 py-3 card-depth">
              <span className="section-label shrink-0 w-24">{when}</span>
              <span className="text-text-primary text-sm leading-snug">{what}</span>
            </li>
          ))}
        </ul>

        <div className="w-full flex flex-col gap-3 mt-8">
          <Button variant="gold" size="lg" fullWidth onClick={signIn}>Sign in with Whop</Button>
          <a href={WHOP_MONTHLY_URL} className="block">
            <Button variant="secondary" size="lg" fullWidth as="span">Join WILD · £13 a month</Button>
          </a>
          {error && <p role="alert" className="text-accent-red text-sm">{error}</p>}
        </div>

        <p className="text-text-muted text-xs mt-4">
          Included with membership. Sign in with the email you used on Whop. Memberships renew automatically each month or year until you cancel; cancel any time in Whop. 18+ only.
        </p>
        <p className="text-text-muted text-xs mt-1">
          <a href={WHOP_ANNUAL_URL} className="underline underline-offset-2">Or £100 a year</a>
          <span aria-hidden="true"> · </span>
          <a href={HUB_URL} className="underline underline-offset-2">What WILD is</a>
        </p>
      </div>
      <p className="text-text-faint text-[11px] text-center mt-8">
        Not therapy or medical advice. Build {__BUILD_ID__}
      </p>
    </div>
  )
}

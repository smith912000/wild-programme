import React from 'react'
import { useMemberStore } from '@store/memberStore'
import { WHOP_MONTHLY_URL } from '@config/whop'
import { Button } from '@shared/ui/Button'
import { GateLayout } from './GateLayout'

export function LapsedScreen({ stale = false }) {
  const email = useMemberStore((s) => s.email)
  const refresh = useMemberStore((s) => s.refresh)
  const signOut = useMemberStore((s) => s.signOut)

  return (
    <GateLayout>
      {stale ? (
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Connect to continue</h1>
          <p className="text-text-muted text-sm mt-3 leading-relaxed">
            WILD OS needs to confirm your membership. Go online and try again.
          </p>
        </div>
      ) : (
        <div>
          <h1 className="font-display font-bold text-2xl text-text-primary">Your membership has lapsed</h1>
          <p className="text-text-muted text-sm mt-3 leading-relaxed">
            {email ? `We could not find an active WILD membership for ${email}.` : 'We could not find an active WILD membership.'}{' '}
            Your journal and logs stay on this device and will be here when you return.
          </p>
        </div>
      )}
      <div className="w-full flex flex-col gap-3">
        {stale ? (
          <Button variant="gold" size="lg" fullWidth onClick={refresh}>Try again</Button>
        ) : (
          <a href={WHOP_MONTHLY_URL} className="block">
            <Button variant="gold" size="lg" fullWidth>Renew membership</Button>
          </a>
        )}
        <Button variant="ghost" fullWidth onClick={signOut}>Use a different account</Button>
      </div>
      {!stale && <p className="text-text-faint text-xs">Renewed already? Reopen the app and it will update.</p>}
    </GateLayout>
  )
}

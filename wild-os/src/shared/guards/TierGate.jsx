import React from 'react'
import { Lock, Clock } from 'lucide-react'
import { useAccessStore } from '@store/accessStore'
import { tierCanAccess, TIERS, FEATURE_TIERS } from '@config/tiers'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'

export function TierGate({ feature, children }) {
  const { tier } = useAccessStore()

  if (tierCanAccess(tier, feature)) {
    return children
  }

  const requiredTier = FEATURE_TIERS[feature]
  const tierInfo = TIERS[requiredTier]

  return (
    <Card className="p-6 flex flex-col items-center text-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-bg-surface border border-border flex items-center justify-center">
        <Lock className="w-6 h-6 text-text-faint" />
      </div>
      <div>
        <Badge variant="tier" tier={requiredTier} className="mb-2">
          {tierInfo?.label || requiredTier} Required
        </Badge>
        <p className="text-text-muted text-sm mt-2">
          This feature is available on the{' '}
          <span style={{ color: tierInfo?.color || '#fff' }} className="font-semibold">
            {tierInfo?.label || requiredTier}
          </span>{' '}
          tier and above.
        </p>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-surface border border-border text-text-faint text-sm">
        <Clock className="w-4 h-4" />
        Coming Soon
      </div>
    </Card>
  )
}

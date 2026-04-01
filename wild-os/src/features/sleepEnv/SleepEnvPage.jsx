import React, { useState } from 'react'
import { CheckCircle2, Circle } from 'lucide-react'
import { InfoTooltip } from '@shared/ui/InfoTooltip'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { ProgressRing } from '@shared/ui/ProgressRing'

const ENV_FACTORS = [
  { id: 'temp', label: 'Temperature 18–20°C', desc: 'Cool room optimises deep sleep and REM quality', icon: '🌡️' },
  { id: 'blackout', label: 'Blackout curtains', desc: 'Complete darkness boosts melatonin production', icon: '🌑' },
  { id: 'noise', label: 'White noise / silence', desc: 'Consistent sound prevents REM interruption', icon: '〰️' },
  { id: 'phone', label: 'Phone away from bed', desc: 'EM fields and notifications disrupt sleep architecture', icon: '📵' },
  { id: 'air', label: 'Fresh air / ventilation', desc: 'Optimal CO₂ levels support dream recall', icon: '💨' },
  { id: 'scent', label: 'Lavender / sandalwood', desc: 'Aromatherapy primes the limbic system for dreams', icon: '🕯️' },
  { id: 'emf', label: 'Minimal EMF exposure', desc: 'Router, phone on aeroplane mode during sleep', icon: '📡' },
  { id: 'mattress', label: 'Comfortable sleeping position', desc: 'Physical comfort is foundational to REM quality', icon: '🛏️' },
  { id: 'schedule', label: 'Consistent bedtime', desc: 'Circadian entrainment maximises WILD success', icon: '⏰' },
  { id: 'alcohol', label: 'No alcohol today', desc: 'Alcohol suppresses REM sleep for the entire night', icon: '🚫' },
  { id: 'caffeine', label: 'No caffeine after 2pm', desc: 'Caffeine\'s half-life is 5-7 hours', icon: '☕' },
  { id: 'meal', label: 'Light dinner only', desc: 'Heavy meals redirect blood flow away from the brain', icon: '🥗' },
]

export function SleepEnvContent() {
  const [checked, setChecked] = useState(new Set())

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const score = checked.size
  const total = ENV_FACTORS.length
  const pct = score / total
  const unchecked = ENV_FACTORS.filter(f => !checked.has(f.id))

  const getScoreColor = () => {
    if (pct >= 0.8) return '#22c55e'
    if (pct >= 0.5) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <PageWrapper>
        <TierGate feature="sleep_env">
          <div className="flex items-center justify-center mb-6">
            <ProgressRing size={100} progress={pct} color={getScoreColor()} strokeWidth={6}>
              <div className="text-center">
                <p className="font-display font-bold text-xl" style={{ color: getScoreColor() }}>{score}/{total}</p>
                <p className="text-text-faint text-xs">Score</p>
              </div>
            </ProgressRing>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            {ENV_FACTORS.map(factor => (
              <button
                key={factor.id}
                onClick={() => toggle(factor.id)}
                className="flex items-center gap-3 p-3 bg-bg-card border border-border rounded-xl hover:border-border-subtle transition-colors text-left"
              >
                <div className="shrink-0">
                  {checked.has(factor.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-accent-green" />
                  ) : (
                    <Circle className="w-5 h-5 text-text-faint" />
                  )}
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-lg">{factor.icon}</span>
                  <div>
                    <p className={`text-sm font-medium transition-colors flex items-center ${checked.has(factor.id) ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                      {factor.label}
                      <InfoTooltip text={factor.desc} />
                    </p>
                    <p className="text-text-faint text-xs">{factor.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {unchecked.length > 0 && unchecked.length < 7 && (
            <div className="bg-bg-surface border border-border rounded-xl p-4">
              <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">Recommendations</p>
              <div className="flex flex-col gap-1">
                {unchecked.slice(0, 3).map(f => (
                  <p key={f.id} className="text-text-faint text-xs">· {f.desc}</p>
                ))}
              </div>
            </div>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function SleepEnvPage() {
  return <AppShell title="Sleep Environment"><SleepEnvContent /></AppShell>
}

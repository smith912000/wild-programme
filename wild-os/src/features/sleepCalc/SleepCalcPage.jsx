import React, { useState } from 'react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { InfoTooltip } from '@shared/ui/InfoTooltip'
import { calculateWbtbWindows } from '@utils/sleepCalc'

const CYCLE_OPTIONS = [
  { value: 80, label: '80 min (short cycle)' },
  { value: 90, label: '90 min (typical)' },
  { value: 100, label: '100 min (longer)' },
  { value: 110, label: '110 min (very long)' },
]

const ALERT_COLORS = {
  optimal: { bg: 'bg-green-900/30', text: 'text-accent-green', border: 'border-accent-green/30', label: 'Optimal' },
  good: { bg: 'bg-blue-900/30', text: 'text-accent-blue', border: 'border-accent-blue/30', label: 'Good' },
  early: { bg: 'bg-amber-900/30', text: 'text-accent-amber', border: 'border-accent-amber/30', label: 'Early' },
}

function formatHoursFromBed(minutesFromBed) {
  const h = Math.floor(minutesFromBed / 60)
  const m = minutesFromBed % 60
  if (m === 0) return `${h} hr`
  return `${h} hr ${m} min`
}

function getWbtbExplanation(cycle, alertLevel) {
  if (alertLevel === 'optimal') {
    return `Wake at ${cycle === 4 ? '4th' : '5th'} cycle → high REM pressure, low sleep debt — optimal WILD window.`
  }
  if (alertLevel === 'good') {
    return cycle === 3
      ? 'Wake at 3rd cycle → moderate REM. Good for beginners or if you wake naturally here.'
      : 'Wake at 6th cycle → very high REM but tiredness may interfere with awareness.'
  }
  return 'Wake at 7th cycle → late in sleep architecture. Use only if you wake naturally.'
}

export function SleepCalcContent() {
  const [bedtime, setBedtime] = useState('23:00')
  const [cycleDuration, setCycleDuration] = useState(90)

  const windows = calculateWbtbWindows(bedtime, cycleDuration)

  return (
    <PageWrapper>
        <TierGate feature="sleep_calc">
          <p className="text-text-muted text-sm mb-6">
            Calculate your optimal WBTB (Wake-Back-To-Bed) windows based on sleep cycle timing.
          </p>

          <div className="flex flex-col gap-5 mb-8">
            <div>
              <label className="text-text-muted text-sm font-medium mb-2 flex items-center">
                Bedtime
                <InfoTooltip
                  title="Bedtime"
                  text="The time you actually get into bed and close your eyes. The calculator counts sleep cycles from this point to find your ideal WBTB alarm times."
                />
              </label>
              <input
                type="time"
                value={bedtime}
                onChange={e => setBedtime(e.target.value)}
                className="w-full bg-bg-surface border border-border rounded-xl px-4 py-3 text-text-primary font-mono focus:outline-none focus:border-accent-blue/60 text-lg transition-colors"
              />
            </div>

            <div>
              <label className="text-text-muted text-sm font-medium mb-2 flex items-center">
                Sleep Cycle Length
                <InfoTooltip
                  title="Sleep Cycle Duration"
                  text="A sleep cycle is the time from falling asleep through light sleep, deep sleep and REM, then back to light sleep. Most adults average 90 minutes but individuals vary. If you tend to wake naturally after exactly X hours, your cycle is likely X ÷ 5 or ÷ 6 minutes long."
                />
              </label>
              <div className="flex flex-col gap-2">
                {CYCLE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setCycleDuration(opt.value)}
                    className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors border text-left ${
                      cycleDuration === opt.value
                        ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue'
                        : 'bg-bg-surface border-border text-text-muted hover:border-border-subtle'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">WBTB Windows</h2>
          <div className="flex flex-col gap-3">
            {windows.map(w => {
              const colors = ALERT_COLORS[w.alertLevel] || ALERT_COLORS.good
              return (
                <Card key={w.cycle} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-text-primary font-mono text-xl font-bold">{w.wakeTime}</p>
                      <p className="text-text-faint text-xs mt-0.5">
                        Cycle {w.cycle} · {formatHoursFromBed(w.minutesFromBed)} after bed
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {colors.label}
                    </div>
                  </div>
                  <p className="text-text-faint text-xs leading-relaxed border-t border-border pt-2 mt-1">
                    {getWbtbExplanation(w.cycle, w.alertLevel)}
                  </p>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-bg-surface border border-border rounded-xl">
            <p className="text-text-faint text-xs leading-relaxed">
              <span className="text-accent-green font-medium">Optimal</span> — Cycles 4–5 have highest REM density, ideal for WILD entry.{' '}
              <span className="text-accent-blue font-medium">Good</span> — Cycles 3 & 6 work well.{' '}
              <span className="text-accent-amber font-medium">Early</span> — Cycle 7 may be too late in sleep architecture.
            </p>
          </div>
        </TierGate>
      </PageWrapper>
  )
}

export function SleepCalcPage() {
  return <AppShell title="Sleep Calculator"><SleepCalcContent /></AppShell>
}

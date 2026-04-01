import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAttemptLog } from '@hooks/useAttemptLog'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Toggle } from '@shared/ui/Toggle'
import toast from 'react-hot-toast'

const METHODS = ['WILD', 'WBTB', 'SSILD', 'DEILD', 'MILD', 'Other']
const OUTCOMES = ['Fail', 'Sleep', 'Partial', 'Full']

export function AttemptEntryPage() {
  const navigate = useNavigate()
  const { createAttempt } = useAttemptLog()
  const [method, setMethod] = useState('WILD')
  const [outcome, setOutcome] = useState('Fail')
  const [atonia, setAtonia] = useState(false)
  const [hypnagogicImagery, setHypnagogicImagery] = useState(false)
  const [lucidityDepth, setLucidityDepth] = useState(0)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await createAttempt({
      attemptDate: new Date().toISOString(),
      method,
      outcome,
      atonia,
      hypnagogicImagery,
      lucidityDepth,
      notes,
    })
    toast.success('Attempt logged')
    navigate('/attempts')
  }

  return (
    <AppShell title="Log Attempt" backTo="/attempts">
      <PageWrapper>
        <div className="flex flex-col gap-5">
          {/* Method */}
          <div>
            <label className="text-text-muted text-sm font-medium mb-2 block">Method</label>
            <div className="flex flex-wrap gap-2">
              {METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                    method === m
                      ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue'
                      : 'bg-bg-surface border-border text-text-muted'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label className="text-text-muted text-sm font-medium mb-2 block">Outcome</label>
            <div className="grid grid-cols-4 gap-2">
              {OUTCOMES.map(o => {
                const colors = {
                  Full: 'border-accent-green/50 text-accent-green bg-green-900/20',
                  Partial: 'border-accent-amber/50 text-accent-amber bg-amber-900/20',
                  Sleep: 'border-accent-blue/50 text-accent-blue bg-blue-900/20',
                  Fail: 'border-accent-red/50 text-accent-red bg-red-900/20',
                }
                return (
                  <button
                    key={o}
                    onClick={() => setOutcome(o)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                      outcome === o ? colors[o] : 'bg-bg-surface border-border text-text-muted'
                    }`}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-col gap-3 bg-bg-surface border border-border rounded-xl p-4">
            <Toggle checked={atonia} onChange={setAtonia} label="Sleep paralysis / atonia" />
            <Toggle checked={hypnagogicImagery} onChange={setHypnagogicImagery} label="Hypnagogic imagery" />
          </div>

          {/* Lucidity depth */}
          {(outcome === 'Full' || outcome === 'Partial') && (
            <div>
              <label className="text-text-muted text-sm font-medium mb-2 block">Lucidity Depth (1-5)</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(d => (
                  <button
                    key={d}
                    onClick={() => setLucidityDepth(d)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
                      lucidityDepth === d
                        ? 'bg-accent-gold/20 border-accent-gold/50 text-accent-gold'
                        : 'bg-bg-surface border-border text-text-muted'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Input
            label="Notes"
            textarea
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What happened? Any notable sensations or observations..."
          />

          <Button variant="gold" size="lg" fullWidth onClick={handleSave} loading={saving}>
            Save Attempt
          </Button>
        </div>
      </PageWrapper>
    </AppShell>
  )
}

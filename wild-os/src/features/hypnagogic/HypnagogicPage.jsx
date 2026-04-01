import React, { useState, useEffect } from 'react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { InfoTooltip } from '@shared/ui/InfoTooltip'
import { useAudio } from '@hooks/useAudio'

const SESSIONS = [
  {
    id: 'threshold',
    label: 'Threshold Entry',
    duration: 25,
    freq: 'Theta (6 Hz)',
    band: 'theta',
    desc: 'Light theta induction for beginners',
    color: '#3b82f6',
    tooltip: 'Gentle 6 Hz theta induction to guide you to the hypnagogic threshold. Ideal for new practitioners.',
  },
  {
    id: 'deep',
    label: 'Deep Hypnagogia',
    duration: 40,
    freq: 'Theta (4 Hz)',
    band: 'theta',
    desc: 'Progressive depth with tonal shifts',
    color: '#a855f7',
    tooltip: 'Deeper 4 Hz theta for experienced practitioners — slower oscillations support longer hypnagogic imagery sequences.',
  },
  {
    id: 'gateway',
    label: 'WILD Gateway',
    duration: 90,
    freq: 'Delta (2 Hz)',
    band: 'delta',
    desc: 'Optimal pre-entry state preparation',
    color: '#c9a84c',
    tooltip: 'Full 90-minute session at 2 Hz delta — matches the depth of stage 3 NREM. Use for serious WILD attempts following WBTB.',
  },
  {
    id: 'advanced',
    label: 'Advanced Entry',
    duration: 30,
    freq: 'Gamma (40 Hz)',
    band: 'gamma',
    desc: 'Gamma cortical spike for lucid entry',
    color: '#0ea5e9',
    tooltip: 'Gamma entrainment is used to spike cortical awareness before sleep onset — accelerating the transition to a conscious dream state. Best used 20–30 minutes after WBTB.',
    note: 'Gamma entrainment is used to spike cortical awareness before sleep onset — accelerating the transition to a conscious dream state. Best used 20–30 minutes after WBTB.',
  },
]

const PHASE_LABELS = ['Settling in...', 'Relaxing the body...', 'Deepening awareness...', 'Approaching threshold...', 'Hold the stillness...']

export function HypnagogicContent() {
  const [selected, setSelected] = useState(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const audio = useAudio()

  const session = selected ? SESSIONS.find(s => s.id === selected) : null
  const totalSeconds = session ? session.duration * 60 : 0
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0
  const remaining = Math.max(0, totalSeconds - elapsed)
  const mins = Math.floor(remaining / 60)
  const secs = Math.floor(remaining % 60)

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= totalSeconds) {
          setRunning(false)
          audio.playBell(3)
        }
        const newPhaseIdx = Math.min(4, Math.floor((next / totalSeconds) * 5))
        setPhaseIdx(newPhaseIdx)
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [running, totalSeconds, audio])

  const handleStart = async () => {
    if (!audio.ready) await audio.init()
    setElapsed(0)
    setPhaseIdx(0)
    setRunning(true)
    const band = session?.band || 'theta'
    await audio.startBinaural(band, 0.3)
  }

  const handleStop = () => {
    setRunning(false)
    audio.stopBinaural()
  }

  if (running && session) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-between py-16 px-6">
        <div />
        <div className="flex flex-col items-center gap-8">
          {/* Ripple animation */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {[0,1,2].map(i => (
              <div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${(i+1) * 70}px`,
                  height: `${(i+1) * 70}px`,
                  borderColor: (session.color) + '40',
                  animation: `ripple-out ${2 + i}s ease-out ${i * 0.7}s infinite`,
                }}
              />
            ))}
            <ProgressRing size={160} progress={progress} color={session.color} strokeWidth={2}>
              <div className="text-center">
                <p className="font-mono text-2xl text-text-primary">
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </p>
              </div>
            </ProgressRing>
          </div>
          <p className="text-text-muted text-center text-sm animate-pulse-slow">
            {PHASE_LABELS[phaseIdx]}
          </p>
        </div>
        <Button variant="ghost" onClick={handleStop}>End Session</Button>
      </div>
    )
  }

  return (
    <PageWrapper>
        <TierGate feature="hypnagogic">
          <p className="text-text-muted text-sm mb-6">
            Guided sessions to navigate the hypnagogic threshold — the gateway between waking and dreaming.
          </p>

          <div className="flex flex-col gap-3 mb-6">
            {SESSIONS.map(s => (
              <Card
                key={s.id}
                as="button"
                onClick={() => setSelected(s.id)}
                className={`p-4 text-left ${selected === s.id ? 'border-border-subtle' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selected === s.id ? s.color : '#525770' }} />
                    <div>
                      <p className="text-text-primary font-medium text-sm flex items-center">
                        {s.label}
                        <InfoTooltip text={s.tooltip} title={s.label} />
                      </p>
                      <p className="text-text-faint text-xs">{s.duration}m · {s.freq} · {s.desc}</p>
                    </div>
                  </div>
                  {selected === s.id && <div className="w-2 h-2 rounded-full bg-accent-gold" />}
                </div>
                {selected === s.id && s.note && (
                  <p className="text-text-faint text-xs mt-3 pt-2 border-t border-border leading-relaxed">
                    {s.note}
                  </p>
                )}
              </Card>
            ))}
          </div>

          <Button
            variant="gold"
            size="lg"
            fullWidth
            onClick={handleStart}
            disabled={!selected}
            loading={audio.loading}
          >
            Begin Session
          </Button>

          <div className="mt-4 p-4 bg-bg-surface border border-border rounded-xl">
            <p className="text-text-faint text-xs leading-relaxed">
              Lie down comfortably. Use headphones for binaural tones. Keep perfectly still as imagery emerges — do not react, just observe.
            </p>
          </div>
        </TierGate>
      </PageWrapper>
  )
}

export function HypnagogicPage() {
  return <AppShell title="Hypnagogic"><HypnagogicContent /></AppShell>
}

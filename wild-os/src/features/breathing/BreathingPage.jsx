import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { TierGate } from '@shared/guards/TierGate'
import { PatternCard } from './components/PatternCard'
import { InfoTooltip } from '@shared/ui/InfoTooltip'
import { useAccessStore } from '@store/accessStore'
import { BREATHING_PATTERNS } from '@config/breathing'
import { tierCanAccess } from '@config/tiers'

const PATTERN_TOOLTIPS = {
  '4-7-8': 'Dr. Weil\'s technique — inhale 4s, hold 7s, exhale 8s. Activates the parasympathetic nervous system, ideal before sleep.',
  'box': 'Equal 4-4-4-4 sides. Used by Navy SEALs for stress regulation. Builds rhythmic focus for pre-sleep.',
  'diaphragmatic': 'Extended exhale (4s inhale, 6s exhale) activates the vagus nerve. Foundation technique for all WILD practitioners.',
  'relaxation': 'Gentle 5-5 count for beginners. Eases into a calm, receptive state for WILD entry.',
  'wim-hof': 'Hyperventilation cycles followed by breath retention. Alkalises the blood, may induce altered states.',
  'ssild': 'Short rapid cycles prime the brain for hypnagogic imagery. Used in the SSILD lucid dream induction technique.',
  'pranayama': 'Nadi Shodhana alternates nostrils to balance brain hemispheres and deepen meditative absorption.',
  'coherent': '5.5 breaths per minute — the cardiac resonance frequency. Maximises heart rate variability and parasympathetic tone.',
}

export function BreathingContent() {
  const { tier } = useAccessStore()
  const navigate = useNavigate()
  const [showCustom, setShowCustom] = useState(false)
  const [customInhale, setCustomInhale] = useState('')
  const [customHold, setCustomHold] = useState('')
  const [customExhale, setCustomExhale] = useState('')
  const [customHoldOut, setCustomHoldOut] = useState('')
  const [customCycles, setCustomCycles] = useState('')

  const handleStartCustom = () => {
    const inhale  = parseFloat(customInhale)
    const exhale  = parseFloat(customExhale)
    if (!inhale || inhale < 1 || !exhale || exhale < 1) return
    const hold    = parseFloat(customHold)    || 0
    const holdOut = parseFloat(customHoldOut) || 0
    const cycles  = parseInt(customCycles)    || 20
    navigate('/breathe/session/custom', {
      state: { customTiming: { inhale, hold, exhale, holdOut, cycles } },
    })
  }

  const customReady = parseFloat(customInhale) >= 1 && parseFloat(customExhale) >= 1

  const t1Patterns = BREATHING_PATTERNS.filter(p => p.tier === 'T1')
  const t2Patterns = BREATHING_PATTERNS.filter(p => p.tier === 'T2')

  return (
    <PageWrapper>

        {/* ── CUSTOM TIMING — always visible at top ─────────────── */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 mb-6">
          <p className="text-text-primary text-sm font-medium mb-1">Custom Timing</p>
          <p className="text-text-faint text-xs mb-4">
            Set your own durations. Leave blank to use a preset's defaults.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-text-faint text-xs mb-1 block">Inhale (s)</label>
              <input
                type="number" min={1} max={60}
                value={customInhale}
                onChange={e => setCustomInhale(e.target.value)}
                placeholder="—"
                className="w-full bg-bg-surface border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-gold/60 text-center tabular-nums"
              />
            </div>
            <div>
              <label className="text-text-faint text-xs mb-1 block">Hold after inhale (s)</label>
              <input
                type="number" min={0} max={60}
                value={customHold}
                onChange={e => setCustomHold(e.target.value)}
                placeholder="—"
                className="w-full bg-bg-surface border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-gold/60 text-center tabular-nums"
              />
            </div>
            <div>
              <label className="text-text-faint text-xs mb-1 block">Exhale (s)</label>
              <input
                type="number" min={1} max={60}
                value={customExhale}
                onChange={e => setCustomExhale(e.target.value)}
                placeholder="—"
                className="w-full bg-bg-surface border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-gold/60 text-center tabular-nums"
              />
            </div>
            <div>
              <label className="text-text-faint text-xs mb-1 block">Hold after exhale (s)</label>
              <input
                type="number" min={0} max={60}
                value={customHoldOut}
                onChange={e => setCustomHoldOut(e.target.value)}
                placeholder="—"
                className="w-full bg-bg-surface border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-gold/60 text-center tabular-nums"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-text-faint text-xs mb-1 block">Cycles</label>
            <input
              type="number" min={1} max={200}
              value={customCycles}
              onChange={e => setCustomCycles(e.target.value)}
              placeholder="20"
              className="w-full bg-bg-surface border border-border rounded-xl px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:border-accent-gold/60 text-center tabular-nums"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            {(customInhale || customHold || customExhale || customHoldOut || customCycles) ? (
              <button
                onClick={() => { setCustomInhale(''); setCustomHold(''); setCustomExhale(''); setCustomHoldOut(''); setCustomCycles('') }}
                className="text-text-faint text-xs hover:text-accent-gold transition-colors"
              >
                Clear
              </button>
            ) : <span />}
            <button
              onClick={handleStartCustom}
              disabled={!customReady}
              className="px-5 py-2 rounded-xl bg-accent-gold text-bg-deep text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Start ▶
            </button>
          </div>
        </div>

        {/* ── PRESETS ────────────────────────────────────────────── */}
        <p className="section-label mb-3">Foundations</p>
        <div className="grid grid-cols-1 gap-3 mb-8">
          {t1Patterns.map(pattern => (
            <div key={pattern.id} className="relative">
              <div className="absolute top-3 right-3 z-10">
                <InfoTooltip text={PATTERN_TOOLTIPS[pattern.id] || pattern.description} title={pattern.name} />
              </div>
              <PatternCard pattern={pattern} locked={false} />
            </div>
          ))}
        </div>

        <p className="section-label mb-3">Advanced</p>
        <TierGate feature="breathing_advanced">
          <div className="grid grid-cols-1 gap-3">
            {t2Patterns.map(pattern => (
              <div key={pattern.id} className="relative">
                <div className="absolute top-3 right-3 z-10">
                  <InfoTooltip text={PATTERN_TOOLTIPS[pattern.id] || pattern.description} title={pattern.name} />
                </div>
                <PatternCard pattern={pattern} locked={false} />
              </div>
            ))}
          </div>
        </TierGate>

      </PageWrapper>
  )
}

export function BreathingPage() {
  return <AppShell title="Breathing"><BreathingContent /></AppShell>
}

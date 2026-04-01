import React, { useState, useEffect, useRef } from 'react'
import { Plus, Play, Trash2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Modal } from '@shared/ui/Modal'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { getAllRitualBlocks, saveRitualBlock, deleteRitualBlock } from '@lib/db'
import { useAudio } from '@hooks/useAudio'
import toast from 'react-hot-toast'

const RITUAL_SLOTS = ['Pre-Sleep', 'WBTB', 'Morning Integration']

const STEP_PRESETS_BY_CATEGORY = {
  'Core Practice': [
    { label: 'Box Breathing (5 min)', duration: 5, notes: 'Box breathing pattern' },
    { label: 'Body Scan (10 min)', duration: 10, notes: 'Progressive relaxation from feet to crown' },
    { label: 'Intention Setting (3 min)', duration: 3, notes: 'State your WILD intention clearly and with feeling' },
    { label: 'Theta Binaural (15 min)', duration: 15, notes: 'Headphones — 6Hz theta beat' },
    { label: 'Stillness Hold (5 min)', duration: 5, notes: 'Complete stillness — watch the hypnagogic field' },
    { label: 'Gratitude Anchor (2 min)', duration: 2, notes: 'Feel genuine gratitude — primes limbic access' },
    { label: 'Journal (5 min)', duration: 5, notes: 'Record what you want to dream or just experienced' },
  ],
  'Body & Mind': [
    { label: '5-Minute Morning Breath', duration: 5, notes: 'Box breathing (4-4-4-4), 5 rounds on waking. Activates prefrontal cortex and clears sleep inertia.' },
    { label: 'Spinal Decompression Stretch', duration: 5, notes: 'Child\'s pose → cat-cow → supine twist × 2. Releases tension stored during sleep.' },
    { label: 'Cold Finish Shower', duration: 1, notes: 'End any shower with 30–60 seconds cold water. Activates norepinephrine, improves alertness and mood.' },
    { label: 'Evening Body Scan', duration: 10, notes: 'Progressive relaxation from feet to head, lying down. Primes parasympathetic state for sleep onset.' },
    { label: 'Nadi Shodhana (Alternate Nostril)', duration: 7, notes: 'Alternate nostril breathing, 5–10 min. Balances hemispheric activity; calms the nervous system before sleep.' },
    { label: 'Yoga Nidra Preparation', duration: 20, notes: 'Guided relaxation before sleep. Deepens body awareness, reduces sleep latency.' },
    { label: 'Wim Hof Round', duration: 10, notes: '30 power breaths + retention breath-hold + recovery breath, 3 rounds. Elevates oxygen, improves energy and focus. Do NOT near water.' },
    { label: 'Walking Meditation', duration: 15, notes: '10–20 min slow walking, full attention on each step and breath. Grounds awareness in body; excellent post-WILD integration.' },
    { label: 'Eye Palming', duration: 4, notes: 'Cup warm palms over closed eyes for 3–5 min. Reduces eye strain and calms the visual cortex before sleep.' },
    { label: 'Gratitude + Intention Statement', duration: 5, notes: 'Write 3 gratitudes + 1 lucid dream intention before sleep. Primes the subconscious and sets motivational context for dreaming.' },
  ],
}

// Flatten for backward compatibility
const STEP_PRESETS = Object.values(STEP_PRESETS_BY_CATEGORY).flat()

function genId() {
  return 'rb-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export function RitualsContent() {
  const [blocks, setBlocks] = useState([])
  const [activeSlot, setActiveSlot] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addingTo, setAddingTo] = useState(null)
  const [runningBlock, setRunningBlock] = useState(null)
  const [runStepIdx, setRunStepIdx] = useState(0)
  const [runElapsed, setRunElapsed] = useState(0)
  const [runRunning, setRunRunning] = useState(false)
  const runIntervalRef = useRef(null)
  const audio = useAudio()

  const load = async () => {
    const all = await getAllRitualBlocks()
    setBlocks(all)
  }

  useEffect(() => { load() }, [])

  const getBlocksForSlot = (slot) => blocks.filter(b => b.slot === slot)

  const addPreset = async (preset, slot) => {
    const block = {
      id: genId(),
      slot,
      label: preset.label,
      duration: preset.duration,
      notes: preset.notes,
      createdAt: new Date().toISOString(),
    }
    await saveRitualBlock(block)
    toast.success('Step added')
    load()
  }

  const removeBlock = async (id) => {
    await deleteRitualBlock(id)
    load()
  }

  // Run ritual
  const startRitual = async (slot) => {
    const slotBlocks = getBlocksForSlot(slot)
    if (!slotBlocks.length) return toast.error('Add steps first')
    if (!audio.ready) await audio.init()
    setRunningBlock({ slot, steps: slotBlocks })
    setRunStepIdx(0)
    setRunElapsed(0)
    setRunRunning(true)
  }

  const currentRunStep = runningBlock?.steps?.[runStepIdx]
  const runStepDuration = (currentRunStep ? Number(currentRunStep.duration) : 5) * 60
  const runProgress = runStepDuration > 0 ? runElapsed / runStepDuration : 0
  const runRemaining = Math.max(0, runStepDuration - runElapsed)

  useEffect(() => {
    if (!runRunning || !runningBlock) {
      clearInterval(runIntervalRef.current)
      return
    }
    runIntervalRef.current = setInterval(() => {
      setRunElapsed(e => {
        const next = e + 1
        if (next >= runStepDuration) {
          clearInterval(runIntervalRef.current)
          if (audio.ready) audio.playBell(1)
          const nextIdx = runStepIdx + 1
          if (nextIdx < runningBlock.steps.length) {
            setRunStepIdx(nextIdx)
            setRunElapsed(0)
            setTimeout(() => setRunRunning(true), 200)
          } else {
            setRunRunning(false)
            setRunningBlock(prev => ({ ...prev, complete: true }))
            if (audio.ready) audio.playBell(3)
          }
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(runIntervalRef.current)
  }, [runRunning, runStepDuration, runStepIdx, runningBlock, audio])

  if (runningBlock) {
    const mins = Math.floor(runRemaining / 60)
    const secs = Math.floor(runRemaining % 60)

    if (runningBlock.complete) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 py-12 animate-fade-in" style={{ background: 'var(--color-bg)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--color-tier1)' }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Ritual Complete</h2>
          <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>{runningBlock.slot} ritual finished</p>
          <Button variant="primary" onClick={() => setRunningBlock(null)}>Back to Rituals</Button>
        </div>
      )
    }

    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6" style={{ background: 'var(--color-bg)' }}>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            {runningBlock.slot} Ritual
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Step {runStepIdx + 1} / {runningBlock.steps.length}
          </p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <ProgressRing size={220} progress={runProgress} color="var(--color-accent)" strokeWidth={3}>
            <div className="text-center">
              <p className="font-mono text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </p>
            </div>
          </ProgressRing>
          <div className="text-center">
            <p className="text-xl font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
              {currentRunStep?.label}
            </p>
            {currentRunStep?.notes && (
              <p className="text-sm max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
                {currentRunStep.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => setRunRunning(v => !v)}>
            {runRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="ghost" onClick={() => {
            clearInterval(runIntervalRef.current)
            setRunRunning(false)
            setRunningBlock(null)
          }}>
            Exit
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper>
        <TierGate feature="rituals">
          <p className="text-text-muted text-sm mb-6">
            Build and run timed ritual sequences for each stage of your WILD practice.
          </p>

          {RITUAL_SLOTS.map(slot => {
            const slotBlocks = getBlocksForSlot(slot)
            const isExpanded = activeSlot === slot
            const totalDuration = slotBlocks.reduce((s, b) => s + (Number(b.duration) || 0), 0)

            return (
              <Card key={slot} className="mb-4 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setActiveSlot(isExpanded ? null : slot)}
                >
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{slot}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {slotBlocks.length} steps · {totalDuration} min
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {slotBlocks.length > 0 && (
                      <button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        style={{ background: 'rgba(108, 99, 255, 0.1)', color: 'var(--color-accent)' }}
                        onClick={e => { e.stopPropagation(); startRitual(slot) }}
                      >
                        <Play className="w-3 h-3" /> Run
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    ) : (
                      <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex flex-col gap-2 mt-3">
                      {slotBlocks.length === 0 ? (
                        <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                          No steps yet. Add presets below.
                        </p>
                      ) : (
                        slotBlocks.map((block, i) => (
                          <div
                            key={block.id}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl border"
                            style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}
                          >
                            <span className="text-xs w-4 text-center" style={{ color: 'var(--color-text-muted)' }}>{i + 1}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{block.label}</p>
                              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{block.duration} min</p>
                            </div>
                            <button onClick={() => removeBlock(block.id)} style={{ color: 'var(--color-text-muted)' }}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setAddingTo(slot); setShowAdd(true) }}
                        className="mt-1"
                      >
                        <Plus className="w-4 h-4" /> Add Step
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}

          <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title={`Add Step to ${addingTo}`}>
            <div className="flex flex-col gap-4">
              {Object.entries(STEP_PRESETS_BY_CATEGORY).map(([category, presets]) => (
                <div key={category}>
                  <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>{category}</p>
                  <div className="flex flex-col gap-2">
                    {presets.map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => { addPreset(preset, addingTo); setShowAdd(false) }}
                        className="flex items-center justify-between p-3 rounded-xl border text-left transition-colors"
                        style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{preset.label}</p>
                          <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--color-text-muted)' }}>{preset.notes}</p>
                        </div>
                        <span className="text-xs ml-3 shrink-0" style={{ color: 'var(--color-text-muted)' }}>{preset.duration}m</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        </TierGate>
      </PageWrapper>
  )
}

export function RitualsPage() {
  return (
    <AppShell title="Ritual Planner">
      <RitualsContent />
    </AppShell>
  )
}

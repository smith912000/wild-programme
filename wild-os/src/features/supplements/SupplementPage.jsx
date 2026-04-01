import React, { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { InfoTooltip } from '@shared/ui/InfoTooltip'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Modal } from '@shared/ui/Modal'
import { Input } from '@shared/ui/Input'
import { SupplementLog } from './components/SupplementLog'
import { getAllSupplementLogs, saveSupplementLog, deleteSupplementLog } from '@lib/db'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const PRESET_SUPPLEMENTS = [
  { name: 'Galantamine', defaultDose: '4-8mg', timing: '-60 min WBTB', info: 'Acetylcholinesterase inhibitor — increases acetylcholine in REM sleep, dramatically enhancing lucid dream frequency. T2 protocol only.' },
  { name: 'Alpha-GPC', defaultDose: '300mg', timing: '-30 min WBTB', info: 'Choline donor — pairs with Galantamine to prevent choline depletion and support memory consolidation during REM.' },
  { name: 'DMAE', defaultDose: '200mg', timing: '-60 min WBTB', info: 'Dimethylaminoethanol — boosts acetylcholine synthesis, improves cognitive function and dream recall.' },
  { name: 'Mugwort', defaultDose: '1g', timing: '-60 min bed', info: 'Traditional oneirogenic herb — Artemisia vulgaris. Reported to intensify dream recall and vividness. Use as tea or capsule.' },
  { name: 'Valerian Root', defaultDose: '300-600mg', timing: '-30 min bed', info: 'Increases GABA activity; shortens sleep onset, increases deep sleep.' },
  { name: 'Passion Flower', defaultDose: '250-500mg', timing: '-30 min bed', info: 'Mild anxiolytic; quiets mental chatter before sleep.' },
  { name: 'Lemon Balm', defaultDose: '300-600mg', timing: '-30 min bed', info: 'Reduces stress and anxiety; synergises with valerian.' },
  { name: 'Ashwagandha (KSM-66)', defaultDose: '300-600mg', timing: '-60 min bed', info: 'Adaptogen; lowers cortisol, improves sleep quality and REM.' },
  { name: "Lion's Mane", defaultDose: '500-1000mg', timing: '-60 min bed', info: 'NGF stimulation; supports neural clarity and dream vividness.' },
  { name: 'Reishi Mushroom', defaultDose: '1-2g', timing: '-60 min bed', info: 'Calms the nervous system; prolongs deep sleep stages.' },
  { name: 'Calea Zacatechichi', defaultDose: '1-3g tea', timing: '-60 min bed', info: 'Mexican dream herb — enhances hypnagogic imagery and dream clarity.' },
  { name: 'Blue Lotus', defaultDose: '1-5g tea', timing: '-60 min bed', info: 'Mild sedative and lucid dreaming aid from ancient Egypt.' },
  { name: 'Melatonin (low dose)', defaultDose: '0.3-0.5mg', timing: '-30 min bed', info: 'Circadian signal; use only if needed. Low dose (0.3mg) is more effective than high.' },
  { name: '5-HTP', defaultDose: '50-100mg', timing: '-60 min bed', info: 'Serotonin precursor; improves REM sleep. Do not combine with SSRIs.' },
  { name: 'Magnesium Glycinate', defaultDose: '200-400mg', timing: '-30 min bed', info: 'Muscle relaxation, reduces sleep latency, improves sleep quality.' },
]

const TIMING_OPTIONS = ['-60 min WBTB', '-30 min WBTB', 'At WBTB', '+30 min WBTB', '-30 min bed', '-60 min bed']

function genId() {
  return 'sl-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export function SupplementContent() {
  const [entries, setEntries] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showAllPresets, setShowAllPresets] = useState(false)
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [timing, setTiming] = useState('-30 min WBTB')
  const today = format(new Date(), 'yyyy-MM-dd')

  const load = async () => {
    const all = await getAllSupplementLogs()
    setEntries(all.filter(e => e.date === today))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!name) return toast.error('Enter supplement name')
    const entry = {
      id: genId(),
      date: today,
      name,
      dose,
      timing,
      taken: false,
      takenAt: null,
    }
    await saveSupplementLog(entry)
    setShowAdd(false)
    setName(''); setDose('')
    toast.success('Added')
    load()
  }

  const handlePreset = async (preset) => {
    const entry = {
      id: genId(),
      date: today,
      name: preset.name,
      dose: preset.defaultDose,
      timing: preset.timing,
      taken: false,
      takenAt: null,
    }
    await saveSupplementLog(entry)
    toast.success(`${preset.name} added`)
    load()
  }

  const handleToggle = async (id) => {
    const entry = entries.find(e => e.id === id)
    if (!entry) return
    await saveSupplementLog({ ...entry, taken: !entry.taken, takenAt: !entry.taken ? new Date().toISOString() : null })
    load()
  }

  const handleDelete = async (id) => {
    await deleteSupplementLog(id)
    load()
  }

  return (
    <PageWrapper>
      <TierGate feature="supplements">
          <div className="flex items-center justify-between mb-5">
            <p className="text-text-muted text-sm">
              Track your supplement protocol for tonight's WILD attempt.
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          {entries.length === 0 && (
            <>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold">Quick Add Presets</h2>
                <button
                  onClick={() => setShowAllPresets(v => !v)}
                  className="flex items-center gap-1 text-text-faint text-xs"
                >
                  {showAllPresets ? 'Show less' : 'Show all'}
                  {showAllPresets ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 mb-6">
                {(showAllPresets ? PRESET_SUPPLEMENTS : PRESET_SUPPLEMENTS.slice(0, 5)).map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => handlePreset(preset)}
                    className="flex items-center justify-between p-3 bg-bg-surface border border-border rounded-xl hover:border-border-subtle transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm font-medium flex items-center">
                        {preset.name}
                        {preset.info && <InfoTooltip text={preset.info} title={preset.name} />}
                      </p>
                      <p className="text-text-faint text-xs">{preset.defaultDose} · {preset.timing}</p>
                    </div>
                    <Plus className="w-4 h-4 text-text-faint shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </>
          )}

          {entries.length > 0 && (
            <>
              <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">
                Tonight's Protocol — {entries.filter(e => e.taken).length}/{entries.length} taken
              </h2>
              <SupplementLog entries={entries} onToggle={handleToggle} onDelete={handleDelete} />
            </>
          )}

          <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Supplement">
            <div className="flex flex-col gap-4">
              <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Galantamine" />
              <Input label="Dose" value={dose} onChange={e => setDose(e.target.value)} placeholder="e.g., 4mg" />
              <div>
                <label className="text-text-muted text-sm font-medium mb-2 block">Timing</label>
                <div className="flex flex-col gap-2">
                  {TIMING_OPTIONS.map(t => (
                    <button
                      key={t}
                      onClick={() => setTiming(t)}
                      className={`py-2 px-3 rounded-xl text-sm text-left transition-colors border ${
                        timing === t
                          ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue'
                          : 'bg-bg-surface border-border text-text-muted'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="gold" fullWidth onClick={handleAdd}>Add to Tonight</Button>
            </div>
          </Modal>
        </TierGate>
      </PageWrapper>
  )
}

export function SupplementPage() {
  return <AppShell title="Supplements"><SupplementContent /></AppShell>
}

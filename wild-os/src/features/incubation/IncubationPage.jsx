import React, { useState, useEffect, useCallback } from 'react'
import { Plus, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { Modal } from '@shared/ui/Modal'
import { INCUBATION_THEMES } from '@config/prompts'
import { getAllIncubationEntries, saveIncubationEntry } from '@lib/db'
import { format, differenceInDays } from 'date-fns'
import toast from 'react-hot-toast'

function genId() {
  return 'inc-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

const RITUAL_STEPS = {
  clarity: ['Complete your pre-sleep breathing', 'Write your clarity intention on paper', 'Visualise clear perception before sleep', 'Place your intention note near your bed'],
  healing: ['Take a warm bath or shower before bed', 'Set a healing intention in your body', 'Breathe healing light into affected areas', 'Trust the body\'s dream-state repair mechanisms'],
  creativity: ['Review your creative project before bed', 'Write one creative question you want answered', 'Do 5 minutes of free-form drawing or writing', 'Ask your unconscious for a novel solution'],
  fear: ['Name the fear explicitly — write it down', 'Breathe into where you feel it in your body', 'Set intention to face it with curiosity', 'Commit to staying present if it arises'],
  default: ['Set your clear intention statement', 'Do 10 minutes of breathing practice', 'Visualise your intended dream scenario', 'Repeat your intention as you fall asleep'],
}

export function IncubationContent() {
  const [entries, setEntries] = useState([])
  const [showNew, setShowNew] = useState(false)
  const [intention, setIntention] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [showMorningLog, setShowMorningLog] = useState(null)
  const [morningManifested, setMorningManifested] = useState(null)
  const [morningNotes, setMorningNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const all = await getAllIncubationEntries()
    setEntries(all)
  }, [])

  useEffect(() => { load() }, [load])

  const active = entries.find(e => e.status === 'active')

  const handleCreate = async () => {
    if (!intention.trim()) return toast.error('Set your intention')
    if (!selectedTheme) return toast.error('Choose a theme')
    setSaving(true)
    // Close any previous active
    const updated = entries.map(e =>
      e.status === 'active' ? { ...e, status: 'archived' } : e
    )
    for (const e of updated) {
      if (e.status === 'archived') await saveIncubationEntry(e)
    }
    const theme = INCUBATION_THEMES.find(t => t.id === selectedTheme)
    const entry = {
      id: genId(),
      intention: intention.trim(),
      themeId: selectedTheme,
      themeLabel: theme?.label || selectedTheme,
      status: 'active',
      morningLogs: [],
      createdAt: new Date().toISOString(),
    }
    await saveIncubationEntry(entry)
    toast.success('Incubation set')
    setShowNew(false)
    setIntention('')
    setSelectedTheme(null)
    setSaving(false)
    load()
  }

  const handleMorningLog = async () => {
    if (!showMorningLog) return
    const updated = {
      ...showMorningLog,
      morningLogs: [
        ...(showMorningLog.morningLogs || []),
        {
          date: new Date().toISOString(),
          manifested: morningManifested,
          notes: morningNotes,
        }
      ]
    }
    await saveIncubationEntry(updated)
    toast.success('Morning log saved')
    setShowMorningLog(null)
    setMorningManifested(null)
    setMorningNotes('')
    load()
  }

  const ritualSteps = active
    ? (RITUAL_STEPS[active.themeId] || RITUAL_STEPS.default)
    : []

  const manifestationRate = (entry) => {
    const logs = entry.morningLogs || []
    if (!logs.length) return null
    const manifested = logs.filter(l => l.manifested === true).length
    return Math.round((manifested / logs.length) * 100)
  }

  return (
    <PageWrapper>
        <TierGate feature="dream_incubation">
          <p className="text-text-muted text-sm mb-6">
            Set a focused dream intention and track whether it manifests. Consistency compounds over days.
          </p>

          {/* Active incubation */}
          {active ? (
            <Card className="p-5 mb-6" glow>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--color-accent)' }}>
                    Active Intention
                  </p>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{active.intention}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {active.themeLabel} · Day {differenceInDays(new Date(), new Date(active.createdAt)) + 1} ·{' '}
                    {active.morningLogs?.length || 0} logs
                    {manifestationRate(active) !== null && ` · ${manifestationRate(active)}% manifested`}
                  </p>
                </div>
              </div>

              {/* Tonight's ritual */}
              <div className="border-t pt-3 mb-3" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Tonight's Ritual
                </p>
                <div className="flex flex-col gap-1.5">
                  {ritualSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-xs w-4 shrink-0 mt-0.5" style={{ color: 'var(--color-accent)' }}>{i + 1}.</span>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setShowMorningLog(active)
                    setMorningManifested(null)
                    setMorningNotes('')
                  }}
                >
                  Morning Log
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNew(true)}
                >
                  Change
                </Button>
              </div>
            </Card>
          ) : (
            <Button variant="primary" size="lg" fullWidth className="mb-6" onClick={() => setShowNew(true)}>
              <Plus className="w-5 h-5" /> Set Intention
            </Button>
          )}

          {/* History */}
          {entries.filter(e => e.status !== 'active').length > 0 && (
            <>
              <h2 className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--color-text-muted)' }}>
                Past Incubations
              </h2>
              <div className="flex flex-col gap-3">
                {entries.filter(e => e.status !== 'active').map(entry => (
                  <Card key={entry.id} className="overflow-hidden">
                    <button
                      className="w-full text-left p-4"
                      onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{entry.intention}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                            {entry.themeLabel} · {format(new Date(entry.createdAt), 'MMM d')} ·{' '}
                            {manifestationRate(entry) !== null
                              ? `${manifestationRate(entry)}% manifested`
                              : 'No logs'}
                          </p>
                        </div>
                        {expandedId === entry.id
                          ? <ChevronUp className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                          : <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                        }
                      </div>
                    </button>
                    {expandedId === entry.id && entry.morningLogs?.length > 0 && (
                      <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <div className="flex flex-col gap-2 mt-3">
                          {entry.morningLogs.map((log, i) => (
                            <div key={i} className="flex items-start gap-2">
                              {log.manifested
                                ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-tier1)' }} />
                                : <XCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--color-danger)' }} />
                              }
                              <div>
                                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                                  {format(new Date(log.date), 'MMM d')}
                                </p>
                                {log.notes && (
                                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text)' }}>{log.notes}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* New intention modal */}
          <Modal isOpen={showNew} onClose={() => setShowNew(false)} title="Set Dream Intention">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Your intention
                </label>
                <textarea
                  value={intention}
                  onChange={e => setIntention(e.target.value)}
                  rows={3}
                  placeholder="What do you want to dream about or explore tonight?"
                  className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
                  style={{
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-text)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2" style={{ color: 'var(--color-text-muted)' }}>Theme</label>
                <div className="flex flex-wrap gap-2">
                  {INCUBATION_THEMES.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border"
                      style={selectedTheme === theme.id ? {
                        background: 'rgba(108, 99, 255, 0.15)',
                        borderColor: 'rgba(108, 99, 255, 0.4)',
                        color: 'var(--color-accent)',
                      } : {
                        background: 'var(--color-surface-2)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>
              {selectedTheme && (
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {INCUBATION_THEMES.find(t => t.id === selectedTheme)?.description}
                </p>
              )}
              <Button variant="primary" fullWidth onClick={handleCreate} loading={saving}>
                Set Intention
              </Button>
            </div>
          </Modal>

          {/* Morning log modal */}
          <Modal isOpen={!!showMorningLog} onClose={() => setShowMorningLog(null)} title="Morning Log">
            <div className="flex flex-col gap-4">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Did your intention manifest in last night's dream?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setMorningManifested(true)}
                  className="flex-1 py-3 rounded-xl border font-medium text-sm transition-colors"
                  style={morningManifested === true ? {
                    background: 'rgba(74, 222, 128, 0.1)',
                    borderColor: 'rgba(74, 222, 128, 0.4)',
                    color: 'var(--color-tier1)',
                  } : {
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Yes ✓
                </button>
                <button
                  onClick={() => setMorningManifested(false)}
                  className="flex-1 py-3 rounded-xl border font-medium text-sm transition-colors"
                  style={morningManifested === false ? {
                    background: 'rgba(248, 113, 113, 0.1)',
                    borderColor: 'rgba(248, 113, 113, 0.4)',
                    color: 'var(--color-danger)',
                  } : {
                    background: 'var(--color-surface-2)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  Not yet
                </button>
              </div>
              <textarea
                value={morningNotes}
                onChange={e => setMorningNotes(e.target.value)}
                rows={3}
                placeholder="Notes on what you dreamed (optional)"
                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
                style={{
                  background: 'var(--color-surface-2)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              />
              <Button
                variant="primary"
                fullWidth
                onClick={handleMorningLog}
                disabled={morningManifested === null}
              >
                Save Log
              </Button>
            </div>
          </Modal>
        </TierGate>
      </PageWrapper>
  )
}

export function IncubationPage() {
  return (
    <AppShell title="Dream Incubation">
      <IncubationContent />
    </AppShell>
  )
}

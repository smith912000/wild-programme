import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Layers, Play, Trash2 } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { EmptyState } from '@shared/ui/EmptyState'
import { getAllProtocols, saveProtocol, deleteProtocol } from '@lib/db'
import { formatMinutes } from '@utils/formatters'
import toast from 'react-hot-toast'

const EXAMPLE_PROTOCOLS = [
  {
    id: 'example-classic-wbtb',
    name: 'Classic WBTB',
    isExample: true,
    steps: [
      { id: 's1', type: 'note', label: 'Sleep 5.5 hours', duration: 0, notes: 'Set your alarm for exactly 5.5 hours after falling asleep.' },
      { id: 's2', type: 'note', label: 'Wake', duration: 0, notes: 'Get up immediately when the alarm sounds. Sit up, turn on a dim light.' },
      { id: 's3', type: 'custom', label: 'Dream Journaling', duration: 10, notes: 'Record any dreams or fragments immediately. Write in detail.' },
      { id: 's4', type: 'custom', label: 'Light Reading', duration: 20, notes: 'Read something light and engaging — not your phone. Keep the mind gently active.' },
      { id: 's5', type: 'breathing', label: '4-7-8 Breathing (3 cycles)', duration: 2, notes: '4-7-8 breathing pattern — 3 complete cycles only.' },
      { id: 's6', type: 'custom', label: 'WILD Attempt with Intention Setting', duration: 30, notes: 'Return to bed. Lie completely still. State your intention: "I will become lucid." Focus on the hypnagogic field.' },
      { id: 's7', type: 'journal', label: 'Journal on Wake', duration: 10, notes: 'Record every detail of any experience, lucid or not.' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'example-theta-induction',
    name: 'Theta Induction',
    isExample: true,
    steps: [
      { id: 's1', type: 'breathing', label: 'Box Breathing (10 min evening)', duration: 10, notes: 'Box breathing — 4-4-4-4 pattern. 10 complete rounds.' },
      { id: 's2', type: 'meditation', label: 'Deep Meditation (20 min)', duration: 20, notes: '20 minutes silent meditation. Focus on the breath or open awareness.' },
      { id: 's3', type: 'journal', label: 'Journal Intention', duration: 5, notes: 'Write your specific intention for tonight: what you want to do when you become lucid.' },
      { id: 's4', type: 'note', label: 'Sleep', duration: 0, notes: 'Sleep normally until your WBTB alarm at 5.5 hours.' },
      { id: 's5', type: 'note', label: 'WBTB at 5.5 hours', duration: 0, notes: 'Wake. Get up briefly. Remain mentally active for 10–20 minutes.' },
      { id: 's6', type: 'binaural', label: 'Theta Binaural (15 min, 6 Hz)', duration: 15, notes: 'Headphones — 6 Hz theta binaural. Lie in bed, eyes closed. Do not sleep yet.' },
      { id: 's7', type: 'custom', label: 'WILD Attempt', duration: 45, notes: 'Let the binaural continue or fade. Maintain awareness as sleep overtakes you.' },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'example-gamma-spike',
    name: 'Advanced Gamma Spike',
    isExample: true,
    steps: [
      { id: 's1', type: 'note', label: 'Sleep 6 hours', duration: 0, notes: 'Full 6 hours of sleep before WBTB.' },
      { id: 's2', type: 'note', label: 'WBTB', duration: 0, notes: 'Wake fully. Get up. Splash cold water on face.' },
      { id: 's3', type: 'note', label: 'Galantamine 4mg + Alpha-GPC 200mg', duration: 0, notes: 'T2 supplements only. Take with water. Wait 15 minutes before returning to bed.' },
      { id: 's4', type: 'breathing', label: 'Box Breathing (10 min)', duration: 10, notes: 'Box breathing — steady 4-4-4-4 cycles. Calms the nervous system before re-entry.' },
      { id: 's5', type: 'binaural', label: 'Advanced Entry — Gamma 40 Hz (20 min)', duration: 20, notes: 'Gamma 40 Hz binaural with headphones. Lie down. Eyes closed. The goal is cortical spike before sleep onset.' },
      { id: 's6', type: 'custom', label: 'WILD Attempt', duration: 60, notes: 'Maintain waking awareness as the Galantamine enhances acetylcholine and REM. Hold the hypnagogic field without reacting.' },
      { id: 's7', type: 'journal', label: 'Full Integration Journal on Wake', duration: 15, notes: 'Write everything in full detail. Include emotions, environments, insights. This is your primary training record.' },
    ],
    createdAt: new Date().toISOString(),
  },
]

const SEEDED_KEY = 'wos_protocols_seeded'

export function ProtocolsContent() {
  const navigate = useNavigate()
  const [protocols, setProtocols] = useState([])

  const load = async () => {
    // Seed example protocols once
    if (!localStorage.getItem(SEEDED_KEY)) {
      for (const p of EXAMPLE_PROTOCOLS) {
        await saveProtocol(p)
      }
      localStorage.setItem(SEEDED_KEY, '1')
    }
    const all = await getAllProtocols()
    setProtocols(all)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    await deleteProtocol(id)
    toast.success('Protocol deleted')
    load()
  }

  return (
    <PageWrapper>
      <div className="flex justify-end mb-4">
        <Button variant="primary" size="sm" onClick={() => navigate('/protocols/new')}>
          <Plus className="w-4 h-4" /> New Protocol
        </Button>
      </div>
        <TierGate feature="protocols">
          <p className="text-text-muted text-sm mb-6">
            Build custom multi-step dream induction protocols combining breathing, meditation, rest, and custom steps.
          </p>

          {protocols.length === 0 ? (
            <EmptyState
              icon={Layers}
              message="No protocols yet"
              subMessage="Create your first custom protocol"
              action={<Button variant="primary" size="sm" onClick={() => navigate('/protocols/new')}>Create Protocol</Button>}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {protocols.map(protocol => {
                const totalDuration = protocol.steps?.reduce((s, step) => s + (step.duration || 0), 0) || 0
                return (
                  <Card key={protocol.id} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-text-primary font-medium">{protocol.name}</p>
                          {protocol.isExample && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-accent-blue/15 text-accent-blue border border-accent-blue/25">
                              Example
                            </span>
                          )}
                        </div>
                        <p className="text-text-faint text-xs mt-0.5">
                          {protocol.steps?.length || 0} steps · {formatMinutes(totalDuration)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" className="flex-1" onClick={() => navigate(`/protocols/${protocol.id}/run`)}>
                        <Play className="w-3.5 h-3.5" /> Run
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => navigate(`/protocols/${protocol.id}/edit`)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={(e) => handleDelete(protocol.id, e)}>
                        <Trash2 className="w-4 h-4 text-accent-red" />
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function ProtocolsPage() {
  return (
    <AppShell title="Protocols">
      <ProtocolsContent />
    </AppShell>
  )
}

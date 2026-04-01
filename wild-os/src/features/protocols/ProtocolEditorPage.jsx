import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { Card } from '@shared/ui/Card'
import { getProtocol, saveProtocol } from '@lib/db'
import toast from 'react-hot-toast'

const STEP_TYPES = [
  { value: 'breathing', label: 'Breathing' },
  { value: 'meditation', label: 'Meditation' },
  { value: 'binaural', label: 'Binaural' },
  { value: 'rest', label: 'Rest / Hold Still' },
  { value: 'journal', label: 'Journal Prompt' },
  { value: 'intention', label: 'Intention Setting' },
  { value: 'custom', label: 'Custom' },
]

function genId() {
  return 'proto-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}
function genStepId() {
  return 'step-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

function createDefaultStep() {
  return { id: genStepId(), type: 'breathing', duration: 5, notes: '' }
}

export function ProtocolEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const [name, setName] = useState('')
  const [steps, setSteps] = useState([createDefaultStep()])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isEditing) return
    getProtocol(id).then(proto => {
      if (proto) {
        setName(proto.name)
        setSteps(proto.steps || [])
      }
      setLoading(false)
    })
  }, [id, isEditing])

  const addStep = () => {
    setSteps(prev => [...prev, createDefaultStep()])
  }

  const removeStep = (stepId) => {
    setSteps(prev => prev.filter(s => s.id !== stepId))
  }

  const updateStep = (stepId, field, value) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, [field]: value } : s))
  }

  const moveStep = (index, direction) => {
    const newSteps = [...steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newSteps.length) return
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    setSteps(newSteps)
  }

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Give your protocol a name')
    if (steps.length === 0) return toast.error('Add at least one step')
    setSaving(true)
    const proto = {
      id: id || genId(),
      name: name.trim(),
      steps,
      createdAt: isEditing ? undefined : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await saveProtocol(proto)
    toast.success(isEditing ? 'Protocol updated' : 'Protocol created')
    navigate('/protocols')
  }

  const totalDuration = steps.reduce((s, step) => s + (Number(step.duration) || 0), 0)

  if (loading) {
    return (
      <AppShell title={isEditing ? 'Edit Protocol' : 'New Protocol'} backTo="/protocols">
        <PageWrapper>
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
          </div>
        </PageWrapper>
      </AppShell>
    )
  }

  return (
    <AppShell title={isEditing ? 'Edit Protocol' : 'New Protocol'} backTo="/protocols">
      <PageWrapper>
        <TierGate feature="protocols">
          <div className="flex flex-col gap-5">
            <Input
              label="Protocol Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., My WBTB Sequence"
            />

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-text-muted text-sm font-medium">
                  Steps <span className="text-text-faint">({totalDuration}m total)</span>
                </p>
                <Button variant="ghost" size="sm" onClick={addStep}>
                  <Plus className="w-4 h-4" /> Add Step
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {steps.map((step, index) => (
                  <Card key={step.id} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveStep(index, 'up')}
                          disabled={index === 0}
                          className="text-text-faint hover:text-text-muted disabled:opacity-30 transition-colors"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path d="M8 4l-5 5h10L8 4z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveStep(index, 'down')}
                          disabled={index === steps.length - 1}
                          className="text-text-faint hover:text-text-muted disabled:opacity-30 transition-colors"
                        >
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                            <path d="M8 12l-5-5h10l-5 5z" />
                          </svg>
                        </button>
                      </div>
                      <span className="text-text-faint text-xs w-5 text-center">{index + 1}</span>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <select
                          value={step.type}
                          onChange={e => updateStep(step.id, 'type', e.target.value)}
                          className="bg-bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue/60 transition-colors"
                          style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                        >
                          {STEP_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            max={120}
                            value={step.duration}
                            onChange={e => updateStep(step.id, 'duration', Number(e.target.value))}
                            className="flex-1 bg-bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue/60 transition-colors text-center"
                            style={{ background: 'var(--color-surface)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                          />
                          <span className="text-text-faint text-xs">min</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeStep(step.id)}
                        className="text-text-faint hover:text-danger transition-colors p-1"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={step.notes}
                      onChange={e => updateStep(step.id, 'notes', e.target.value)}
                      placeholder="Notes (optional)"
                      className="w-full bg-bg-surface border border-border rounded-xl px-3 py-2 text-text-primary text-xs focus:outline-none focus:border-accent-blue/60 transition-colors placeholder-text-faint"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', borderColor: 'var(--color-border)' }}
                    />
                  </Card>
                ))}
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Create Protocol'}
            </Button>
          </div>
        </TierGate>
      </PageWrapper>
    </AppShell>
  )
}

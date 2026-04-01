import React, { useState, useEffect, useCallback } from 'react'
import { RefreshCw, ChevronDown, ChevronUp, Save } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { SHADOW_PROMPTS, SHADOW_PROMPTS_PSYCHOLOGICAL, SHADOW_PROMPTS_SPIRITUAL } from '@config/prompts'
import { getAllShadowResponses, saveShadowResponse } from '@lib/db'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const ALL_SHADOW_PROMPTS = [...SHADOW_PROMPTS, ...SHADOW_PROMPTS_PSYCHOLOGICAL, ...SHADOW_PROMPTS_SPIRITUAL]

function genId() {
  return 'sw-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

function getRandomPrompt(exclude) {
  const available = ALL_SHADOW_PROMPTS.filter(p => p !== exclude)
  return available[Math.floor(Math.random() * available.length)]
}

export function ShadowWorkContent() {
  const [currentPrompt, setCurrentPrompt] = useState(() => getRandomPrompt(null))
  const [response, setResponse] = useState('')
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState([])
  const [expandedId, setExpandedId] = useState(null)

  const loadHistory = useCallback(async () => {
    const all = await getAllShadowResponses()
    setHistory(all)
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  const refreshPrompt = () => {
    setCurrentPrompt(getRandomPrompt(currentPrompt))
    setResponse('')
  }

  const handleSave = async () => {
    if (!response.trim()) return toast.error('Write a response before saving')
    setSaving(true)
    const entry = {
      id: genId(),
      prompt: currentPrompt,
      response: response.trim(),
      createdAt: new Date().toISOString(),
    }
    await saveShadowResponse(entry)
    toast.success('Response saved to shadow journal')
    setResponse('')
    setCurrentPrompt(getRandomPrompt(currentPrompt))
    await loadHistory()
    setSaving(false)
  }

  return (
    <PageWrapper>
      <TierGate feature="shadow_work">
        <p className="text-text-muted text-sm mb-6">
          Explore the unconscious material surfacing in your dreams. Write without editing yourself.
        </p>

        <Card className="p-5 mb-5" glow>
          <div className="flex items-start justify-between gap-3 mb-4">
            <p className="text-base leading-relaxed font-medium" style={{ color: 'var(--color-text)' }}>
              {currentPrompt}
            </p>
            <button
              onClick={refreshPrompt}
              className="shrink-0 p-2 rounded-lg transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              title="New prompt"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            rows={6}
            placeholder="Write freely — no editing, no judgment. Let whatever comes, come..."
            className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            }}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {response.length > 0 ? `${response.split(' ').filter(Boolean).length} words` : 'Start writing...'}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              loading={saving}
              disabled={!response.trim()}
            >
              <Save className="w-3.5 h-3.5" /> Save Response
            </Button>
          </div>
        </Card>

        {history.length > 0 && (
          <>
            <h2 className="text-xs uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Previous Responses ({history.length})
            </h2>
            <div className="flex flex-col gap-3">
              {history.map(entry => (
                <Card key={entry.id} className="overflow-hidden">
                  <button
                    className="w-full text-left p-4"
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium line-clamp-2 flex-1" style={{ color: 'var(--color-text)' }}>
                        {entry.prompt}
                      </p>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                          {format(new Date(entry.createdAt), 'MMM d')}
                        </span>
                        {expandedId === entry.id
                          ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                          : <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                        }
                      </div>
                    </div>
                  </button>
                  {expandedId === entry.id && (
                    <div className="px-4 pb-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <p className="text-sm leading-relaxed mt-3 whitespace-pre-wrap" style={{ color: 'var(--color-text-muted)' }}>
                        {entry.response}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </TierGate>
    </PageWrapper>
  )
}

export function ShadowWorkPage() {
  return (
    <AppShell title="Shadow Work">
      <ShadowWorkContent />
    </AppShell>
  )
}

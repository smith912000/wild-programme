import React, { useState, useEffect } from 'react'
import { Save, BarChart2 } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'wos_integrations'

const CATEGORIES = [
  { id: 'dream', label: 'Dream Content', color: '#3b82f6' },
  { id: 'emotional', label: 'Emotional Processing', color: '#a855f7' },
  { id: 'insight', label: 'Insight', color: '#c9a84c' },
  { id: 'symbol', label: 'Symbol / Archetype', color: '#0ea5e9' },
  { id: 'somatic', label: 'Somatic (Body)', color: '#22c55e' },
  { id: 'spiritual', label: 'Spiritual', color: '#f59e0b' },
  { id: 'action', label: 'Practical Action', color: '#ef4444' },
]

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function genId() {
  return 'int-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

function getLast30DaysCounts(entries) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recent = entries.filter(e => new Date(e.createdAt).getTime() > cutoff)
  const counts = {}
  CATEGORIES.forEach(c => { counts[c.id] = 0 })
  recent.forEach(e => {
    (e.tags || []).forEach(tag => {
      if (counts[tag] !== undefined) counts[tag]++
    })
  })
  return counts
}

export function IntegrationContent() {
  const [entries, setEntries] = useState(loadEntries)
  const [text, setText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [saving, setSaving] = useState(false)

  const counts = getLast30DaysCounts(entries)
  const maxCount = Math.max(...Object.values(counts), 1)

  const toggleTag = (id) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!text.trim()) return toast.error('Write something before saving')
    setSaving(true)
    const entry = {
      id: genId(),
      text: text.trim(),
      tags: selectedTags,
      createdAt: new Date().toISOString(),
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    saveEntries(updated)
    setText('')
    setSelectedTags([])
    setSaving(false)
    toast.success('Integration saved')
  }

  return (
    <PageWrapper>
        <TierGate feature="integration">
          <p className="text-text-muted text-sm mb-6">
            Reflect on your practice. What did you experience? What insight are you carrying forward?
          </p>

          {/* Today's Integration */}
          <div className="mb-6">
            <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">Today's Integration</h2>
            <Card className="p-4">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={6}
                placeholder="What happened in your practice today? What did you notice, feel, see or understand? What will you carry forward?"
                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors bg-bg-surface border border-border text-text-primary mb-4"
              />
              <p className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-2">Tag this entry</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => toggleTag(cat.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border"
                    style={{
                      background: selectedTags.includes(cat.id) ? cat.color + '25' : 'var(--color-surface-2)',
                      borderColor: selectedTags.includes(cat.id) ? cat.color + '80' : 'var(--color-border)',
                      color: selectedTags.includes(cat.id) ? cat.color : 'var(--color-text-muted)',
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <Button
                variant="gold"
                fullWidth
                onClick={handleSave}
                loading={saving}
                disabled={!text.trim()}
              >
                <Save className="w-4 h-4" /> Save Entry
              </Button>
            </Card>
          </div>

          {/* Recurring themes last 30 days */}
          {entries.length > 0 && (
            <div className="mb-6">
              <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5" />
                Recurring Themes (last 30 days)
              </h2>
              <Card className="p-4">
                <div className="flex flex-col gap-3">
                  {CATEGORIES.map(cat => {
                    const count = counts[cat.id]
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-text-muted text-xs">{cat.label}</span>
                          <span className="text-text-faint text-xs font-mono">{count}</span>
                        </div>
                        <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, background: cat.color }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* Past entries */}
          {entries.length > 0 && (
            <>
              <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">Past Integrations</h2>
              <div className="flex flex-col gap-3 pb-20">
                {entries.map(entry => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-text-faint text-xs font-mono">
                        {format(new Date(entry.createdAt), 'MMM d, yyyy')}
                      </span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {(entry.tags || []).map(tagId => {
                          const cat = CATEGORIES.find(c => c.id === tagId)
                          if (!cat) return null
                          return (
                            <span
                              key={tagId}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ background: cat.color + '20', color: cat.color }}
                            >
                              {cat.label}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                      {entry.text}
                    </p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function IntegrationPage() {
  return (
    <AppShell title="Integration">
      <IntegrationContent />
    </AppShell>
  )
}

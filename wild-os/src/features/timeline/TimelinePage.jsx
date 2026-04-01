import React, { useState } from 'react'
import { Clock, Moon, Flame } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { useJournal } from '@hooks/useJournal'
import { useAttemptLog } from '@hooks/useAttemptLog'
import { format, parseISO } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const TYPE_CONFIG = {
  dream:   { icon: Moon,  color: '#c9a84c', label: 'Dream'   },
  attempt: { icon: Flame, color: '#a855f7', label: 'Attempt' },
}

function LucidityDot({ score }) {
  const hue = Math.round((score / 10) * 120)
  return <span className='inline-block w-2.5 h-2.5 rounded-full ml-2' style={{ background: score > 0 ? 'hsl(' + hue + ',80%,55%)' : '#525770' }} />
}

export function TimelineContent() {
  const navigate = useNavigate()
  const { entries } = useJournal()
  const { attempts } = useAttemptLog()
  const [filter, setFilter] = useState('all')

  const allItems = [
    ...entries.map(e => ({ id: e.id, type: 'dream', date: e.created_at || e.createdAt, title: e.title || 'Dream entry', sub: (e.content || '').slice(0, 90), lucidity: e.lucidity || 0, onClick: () => navigate('/journal/' + e.id) })),
    ...attempts.map(a => ({ id: a.id, type: 'attempt', date: a.date || a.created_at, title: (a.method || 'WILD') + ' attempt', sub: 'Outcome: ' + (a.outcome || 'logged'), lucidity: a.lucidity || 0, onClick: () => navigate('/attempts') })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date))

  const filtered = filter === 'all' ? allItems : allItems.filter(i => i.type === filter)
  const topLucidity = allItems.length ? Math.max(...allItems.map(i => i.lucidity)) : 0
  const avgLucidity = allItems.length ? (allItems.reduce((s, i) => s + i.lucidity, 0) / allItems.length).toFixed(1) : '---'

  return (
    <PageWrapper>
        <div className='grid grid-cols-3 gap-3 mb-6'>
          <Card className='p-3 text-center'><p className='text-xl font-bold text-accent-gold'>{allItems.length}</p><p className='text-xs text-text-muted'>Total entries</p></Card>
          <Card className='p-3 text-center'><p className='text-xl font-bold text-accent-purple'>{topLucidity}/10</p><p className='text-xs text-text-muted'>Peak lucidity</p></Card>
          <Card className='p-3 text-center'><p className='text-xl font-bold text-accent-teal'>{avgLucidity}</p><p className='text-xs text-text-muted'>Avg lucidity</p></Card>
        </div>
        <div className='flex gap-2 mb-5'>
          {['all', 'dream', 'attempt'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={'px-3 py-1 rounded-full text-xs font-medium transition-colors ' + (filter === f ? 'bg-accent-gold text-bg-deep' : 'bg-bg-surface text-text-muted border border-border')}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <Card className='p-8 text-center'><Clock className='w-10 h-10 text-text-faint mx-auto mb-3' /><p className='text-text-muted'>No entries yet.</p></Card>
        ) : (
          <div className='relative'>
            <div className='absolute left-[19px] top-0 bottom-0 w-px bg-border' />
            <div className='space-y-3'>
              {filtered.map(item => {
                const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.dream
                const Icon = cfg.icon
                return (
                  <div key={item.type + '-' + item.id} className='flex gap-3 cursor-pointer' onClick={item.onClick}>
                    <div className='w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10' style={{ background: cfg.color + '22', border: '1px solid ' + cfg.color + '44' }}>
                      <Icon className='w-4 h-4' style={{ color: cfg.color }} />
                    </div>
                    <Card className='flex-1 p-3 hover:border-border-subtle transition-colors'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='text-sm font-medium text-text-primary flex items-center'>{item.title}<LucidityDot score={item.lucidity} /></span>
                        <span className='text-xs text-text-faint'>{item.date ? format(parseISO(item.date), 'MMM d') : '---'}</span>
                      </div>
                      {item.sub && <p className='text-xs text-text-muted line-clamp-2'>{item.sub}</p>}
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </PageWrapper>
  )
}

export function TimelinePage() {
  return (
    <AppShell title='Consciousness Timeline'>
      <TimelineContent />
    </AppShell>
  )
}
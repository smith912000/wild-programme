import React, { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Card } from '@shared/ui/Card'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { useNavigate } from 'react-router-dom'

const RETREAT_TYPES = [
  { id: '3day', label: '3-Day Intensive', days: 3, description: 'Focused sprint — ideal for beginners wanting a breakthrough weekend.' },
  { id: '7day', label: '7-Day Deep Dive', days: 7, description: 'Full week immersion — complete protocol transformation.' },
  {
    id: '14day',
    label: '2-Week Intensive',
    days: 14,
    theme: 'Establishing the Foundation',
    description: 'Structured 14-day programme building from sleep tracking to full WILD attempts.',
    phases: [
      { label: 'Phase 1 — Days 1–3', desc: 'Sleep tracking only. Record bedtime, waking times, dream recall quality. No pressure to attempt WILD.' },
      { label: 'Phase 2 — Days 4–7', desc: 'Add morning meditation (10 min) and evening journal. Note patterns in dream recall.' },
      { label: 'Phase 3 — Days 8–14', desc: 'Full WILD attempts nightly. Morning breath, evening protocol, WBTB at cycle 4–5.' },
    ],
  },
  {
    id: '33day',
    label: '33-Day Accelerator',
    days: 33,
    theme: 'The Initiation',
    description: 'Three distinct phases of deepening practice from foundation to full WILD integration.',
    phases: [
      { label: 'Phase 1 — Days 1–11 (Foundation)', desc: 'Circadian alignment: consistent bedtime within 30 min. Daily dream journal. 10 min box breathing. No stimulants after 2pm.' },
      { label: 'Phase 2 — Days 12–22 (Activation)', desc: 'WBTB protocol every other night. Add theta binaural (15 min pre-sleep). Introduce supplements cautiously. Log every attempt.' },
      { label: 'Phase 3 — Days 23–33 (Integration)', desc: 'WILD attempts every night. Full journaling. Symbol mapping — track recurring symbols. Integration practice each morning.' },
    ],
  },
  {
    id: '90day',
    label: '90-Day Master Programme',
    days: 90,
    theme: 'The Transformation',
    description: 'Four-phase deep transformation programme. The complete WILD OS curriculum lived daily.',
    phases: [
      { label: 'Phase 1 — Days 1–21 (Foundations)', desc: 'Establish all baseline practices: circadian rhythm, dream journaling, morning meditation, sleep environment optimisation, weekly tracker review.' },
      { label: 'Phase 2 — Days 22–45 (Deepening)', desc: 'Introduce WBTB protocol, binaural beats, supplement stack, hypnagogic sessions. Log every attempt with full detail. Weekly shadow work prompt.' },
      { label: 'Phase 3 — Days 46–75 (Mastery)', desc: 'Daily WILD attempts. Advanced techniques (DEILD, SSILD, Galantamine protocol). Reality checking 10×/day. Full protocol builder use.' },
      { label: 'Phase 4 — Days 76–90 (Integration & Teaching)', desc: 'Document your process. Write your own protocol. Conduct a personal review retreat on day 90. Record what worked, what failed, your next cycle.' },
    ],
  },
]

const DAY_SCHEDULES = {
  morning: [
    { time: '06:00', activity: 'Wake & gratitude', duration: '5 min', feature: '/journal/new' },
    { time: '06:05', activity: 'Box breathing or 4-7-8', duration: '10 min', feature: '/breathe' },
    { time: '06:15', activity: 'Body scan meditation', duration: '15 min', feature: '/meditate' },
    { time: '06:30', activity: 'Dream journal entry', duration: '15 min', feature: '/journal/new' },
  ],
  afternoon: [
    { time: '14:00', activity: 'Reality check practice', duration: '5 min', feature: '/reality-check' },
    { time: '14:05', activity: 'Theta binaural session', duration: '20 min', feature: '/binaural' },
    { time: '14:25', activity: 'Sleep environment check', duration: '10 min', feature: '/sleep-env' },
  ],
  evening: [
    { time: '21:00', activity: 'Supplement protocol review', duration: '5 min', feature: '/supplements' },
    { time: '21:05', activity: 'Pre-sleep ritual', duration: '20 min', feature: '/rituals' },
    { time: '21:25', activity: 'WBTB alarm set', duration: '5 min', feature: '/sleep-calc' },
    { time: '21:30', activity: 'Evening journal + intention', duration: '10 min', feature: '/journal/new' },
  ],
}

const STORAGE_KEY = 'wos_retreat_state'

export function RetreatContent() {
  const navigate = useNavigate()
  const [retreatType, setRetreatType] = useState(null)
  const [status, setStatus] = useState('idle') // idle | active | complete
  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState([])
  const [todaySlots, setTodaySlots] = useState({})
  const [startDate, setStartDate] = useState(null)
  const [expandedPhases, setExpandedPhases] = useState({})

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (saved) {
        setRetreatType(saved.retreatType)
        setStatus(saved.status)
        setCurrentDay(saved.currentDay)
        setCompletedDays(saved.completedDays || [])
        setTodaySlots(saved.todaySlots || {})
        setStartDate(saved.startDate)
      }
    } catch {}
  }, [])

  const save = (patch) => {
    const state = {
      retreatType,
      status,
      currentDay,
      completedDays,
      todaySlots,
      startDate,
      ...patch,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }

  const startRetreat = (type) => {
    const patch = {
      retreatType: type,
      status: 'active',
      currentDay: 1,
      completedDays: [],
      todaySlots: {},
      startDate: new Date().toISOString(),
    }
    setRetreatType(type)
    setStatus('active')
    setCurrentDay(1)
    setCompletedDays([])
    setTodaySlots({})
    setStartDate(patch.startDate)
    save(patch)
  }

  const toggleSlot = (key) => {
    const newSlots = { ...todaySlots, [key]: !todaySlots[key] }
    setTodaySlots(newSlots)
    save({ todaySlots: newSlots })
  }

  const completeDay = () => {
    const newCompleted = [...completedDays, currentDay]
    const totalDays = RETREAT_TYPES.find(r => r.id === retreatType)?.days || 3
    const newDay = currentDay + 1
    if (newCompleted.length >= totalDays) {
      setStatus('complete')
      setCompletedDays(newCompleted)
      save({ completedDays: newCompleted, status: 'complete' })
    } else {
      setCompletedDays(newCompleted)
      setCurrentDay(newDay)
      setTodaySlots({})
      save({ completedDays: newCompleted, currentDay: newDay, todaySlots: {} })
    }
  }

  const resetRetreat = () => {
    localStorage.removeItem(STORAGE_KEY)
    setRetreatType(null)
    setStatus('idle')
    setCurrentDay(1)
    setCompletedDays([])
    setTodaySlots({})
    setStartDate(null)
  }

  const totalDays = RETREAT_TYPES.find(r => r.id === retreatType)?.days || 3
  const allSlotKeys = [
    ...DAY_SCHEDULES.morning.map((_, i) => `morning-${i}`),
    ...DAY_SCHEDULES.afternoon.map((_, i) => `afternoon-${i}`),
    ...DAY_SCHEDULES.evening.map((_, i) => `evening-${i}`),
  ]
  const completedSlots = allSlotKeys.filter(k => todaySlots[k]).length

  const togglePhase = (key) => {
    setExpandedPhases(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <PageWrapper>
        <TierGate feature="retreat_mode">
          {status === 'idle' && (
            <div className="flex flex-col gap-5">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Immersive multi-day structured practice. Each day has a full schedule of morning, afternoon, and evening sessions.
              </p>
              {RETREAT_TYPES.map(type => (
                <Card
                  key={type.id}
                  className="p-5 text-left overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{type.label}</p>
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: 'var(--color-accent)' + '20', color: 'var(--color-accent)' }}>
                          {type.days} days
                        </span>
                      </div>
                      {type.theme && (
                        <p className="text-xs italic mb-1" style={{ color: 'var(--color-accent)' }}>{type.theme}</p>
                      )}
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{type.description}</p>
                    </div>
                  </div>

                  {type.phases && (
                    <div className="mt-3">
                      <button
                        className="flex items-center gap-1 text-xs mb-2"
                        style={{ color: 'var(--color-text-muted)' }}
                        onClick={() => togglePhase(type.id)}
                      >
                        {expandedPhases[type.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expandedPhases[type.id] ? 'Hide' : 'Show'} phase breakdown
                      </button>
                      {expandedPhases[type.id] && (
                        <div className="flex flex-col gap-2 mb-3">
                          {type.phases.map((phase, i) => (
                            <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                              <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-text)' }}>{phase.label}</p>
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{phase.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className="mt-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                    style={{ background: 'var(--color-accent)', color: '#000' }}
                    onClick={() => startRetreat(type.id)}
                  >
                    Start {type.label}
                  </button>
                </Card>
              ))}
            </div>
          )}

          {status === 'complete' && (
            <div className="flex flex-col items-center text-center gap-5 py-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <span className="text-4xl">🌙</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Retreat Complete!</h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  You completed the {RETREAT_TYPES.find(r => r.id === retreatType)?.label}.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={() => navigate('/integration')}>
                  Integration Journal
                </Button>
                <Button variant="ghost" onClick={resetRetreat}>
                  Start Again
                </Button>
              </div>
            </div>
          )}

          {status === 'active' && (
            <div className="flex flex-col gap-5">
              {/* Progress header */}
              <div className="flex items-center gap-4">
                <ProgressRing size={64} progress={completedDays.length / totalDays} color="var(--color-tier3)" strokeWidth={4}>
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--color-tier3)' }}>
                    {completedDays.length}/{totalDays}
                  </span>
                </ProgressRing>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    Day {currentDay} of {totalDays}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {RETREAT_TYPES.find(r => r.id === retreatType)?.label}
                  </p>
                </div>
                <button
                  className="ml-auto text-xs"
                  style={{ color: 'var(--color-text-muted)' }}
                  onClick={resetRetreat}
                >
                  Reset
                </button>
              </div>

              {/* Day progress */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalDays, 33) }, (_, i) => i + 1).map(d => (
                  <div
                    key={d}
                    className="flex-1 h-1.5 rounded-full"
                    style={{
                      background: completedDays.includes(d)
                        ? 'var(--color-tier3)'
                        : d === currentDay
                          ? 'var(--color-accent)'
                          : 'var(--color-border)',
                    }}
                  />
                ))}
                {totalDays > 33 && (
                  <span className="text-text-faint text-xs ml-1">+{totalDays - 33}</span>
                )}
              </div>

              {/* Phase info for longer retreats */}
              {(() => {
                const rt = RETREAT_TYPES.find(r => r.id === retreatType)
                if (!rt?.phases) return null
                let activePhase = null
                for (const phase of rt.phases) {
                  const match = phase.label.match(/Days? (\d+)[–-](\d+)/)
                  if (match) {
                    const from = parseInt(match[1])
                    const to = parseInt(match[2])
                    if (currentDay >= from && currentDay <= to) {
                      activePhase = phase
                      break
                    }
                  }
                }
                if (!activePhase) return null
                return (
                  <div className="p-3 rounded-xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--color-accent)' }}>{activePhase.label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{activePhase.desc}</p>
                  </div>
                )
              })()}

              {/* Today's schedule */}
              {[
                { slot: 'morning', label: 'Morning Practice', items: DAY_SCHEDULES.morning },
                { slot: 'afternoon', label: 'Afternoon Integration', items: DAY_SCHEDULES.afternoon },
                { slot: 'evening', label: 'Evening Prep', items: DAY_SCHEDULES.evening },
              ].map(({ slot, label, items }) => (
                <Card key={slot} className="overflow-hidden">
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{label}</p>
                  </div>
                  <div className="flex flex-col divide-y" style={{ borderColor: 'var(--color-border)' }}>
                    {items.map((item, i) => {
                      const key = `${slot}-${i}`
                      const done = !!todaySlots[key]
                      return (
                        <div key={key} className="flex items-center gap-3 px-4 py-3">
                          <button onClick={() => toggleSlot(key)}>
                            {done
                              ? <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--color-tier1)' }} />
                              : <Circle className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                            }
                          </button>
                          <div className="flex-1">
                            <p className={`text-sm ${done ? 'line-through' : ''}`} style={{ color: done ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
                              {item.activity}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                              {item.time} · {item.duration}
                            </p>
                          </div>
                          <button
                            onClick={() => navigate(item.feature)}
                            className="text-xs px-2 py-1 rounded-lg"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-accent)' }}
                          >
                            Open
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))}

              {/* Complete day */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={completeDay}
                disabled={completedSlots < 6}
              >
                {completedSlots < 6
                  ? `Complete ${6 - completedSlots} more sessions`
                  : `Complete Day ${currentDay}`
                }
              </Button>
            </div>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function RetreatPage() {
  return (
    <AppShell title="Retreat Mode">
      <RetreatContent />
    </AppShell>
  )
}

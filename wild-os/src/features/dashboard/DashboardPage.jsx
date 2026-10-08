import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Activity, Moon, MoreHorizontal, BookOpen } from 'lucide-react'
import { useMemberStore } from '@store/memberStore'
import { useTracker } from '@hooks/useTracker'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { getGreeting } from '@utils/sleepCalc'
import { format } from 'date-fns'

const CATEGORIES = [
  {
    label: 'Practice',
    sub: 'Breathe · Meditate · Binaural · Hypnagogic',
    icon: Activity,
    path: '/practice',
    color: '#3b82f6',
  },
  {
    label: 'Sleep',
    sub: '7-Night · Sleep Calc · Supplements · Environment',
    icon: Moon,
    path: '/sleep',
    color: '#a855f7',
  },
  {
    label: 'Log',
    sub: 'Journal · Attempts · Analytics',
    icon: BookOpen,
    path: '/log',
    color: '#c9a84c',
  },
  {
    label: 'Explore',
    sub: 'Symbols · Protocols · Rituals · Shadow Work',
    icon: MoreHorizontal,
    path: '/explore',
    color: '#22c55e',
  },
]

export function DashboardPage() {
  const memberName = useMemberStore((s) => s.name)
  const memberEmail = useMemberStore((s) => s.email)
  const { completedNights, streak } = useTracker()
  const navigate = useNavigate()

  const greeting = getGreeting()
  const name = memberName?.split(' ')[0] || memberEmail?.split('@')[0] || 'Dreamer'
  const today = format(new Date(), 'EEEE, MMM d')

  return (
    <AppShell>
      <PageWrapper>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-text-faint text-sm">{today}</p>
              <h1 className="font-display font-bold text-2xl text-text-primary mt-0.5">
                {greeting}, {name}
              </h1>
            </div>
          </div>
        </div>

        {/* Streak / Progress Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="text-3xl font-display font-bold text-accent-gold leading-none">{streak}</p>
            <p className="text-text-faint text-[11px] mt-1.5 font-display uppercase tracking-widest">Streak</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-3xl font-display font-bold text-accent-blue leading-none">{completedNights}</p>
            <p className="text-text-faint text-[11px] mt-1.5 font-display uppercase tracking-widest">Nights</p>
          </Card>
          <Card className="p-4 flex items-center justify-center">
            <ProgressRing size={56} progress={completedNights / 7} color="#c9a84c" strokeWidth={4}>
              <span className="text-xs font-mono text-accent-gold">{completedNights}/7</span>
            </ProgressRing>
          </Card>
        </div>

        {/* Category Grid */}
        <p className="section-label mb-3">Categories</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ label, sub, icon: Icon, path, color }) => (
            <Card
              key={path}
              as="button"
              onClick={() => navigate(path)}
              className="p-5 text-left relative overflow-hidden transition-all"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                style={{ backgroundColor: color }} />
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: color + '22' }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="font-display font-semibold text-text-primary text-sm leading-tight mb-1">{label}</p>
              <p className="text-text-faint text-[11px] leading-snug">{sub}</p>
            </Card>
          ))}
        </div>

      </PageWrapper>
    </AppShell>
  )
}

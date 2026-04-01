import React from 'react'
import { useTracker } from '@hooks/useTracker'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { NightCard } from './components/NightCard'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { Spinner } from '@shared/ui/Spinner'

export function TrackerContent() {
  const { nights, loading, updateNight, toggleChecklistItem, completedNights, streak } = useTracker()

  return (
    <PageWrapper>
        {/* Header stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-display font-bold text-accent-gold">{streak}</p>
            <p className="text-text-faint text-xs mt-0.5">Streak</p>
          </div>
          <div className="bg-bg-card border border-border rounded-2xl p-3 text-center">
            <p className="text-2xl font-display font-bold text-accent-green">{completedNights}</p>
            <p className="text-text-faint text-xs mt-0.5">Complete</p>
          </div>
          <div className="bg-bg-card border border-border rounded-2xl p-3 flex items-center justify-center">
            <ProgressRing size={52} progress={completedNights / 7} color="#22c55e" strokeWidth={4}>
              <span className="text-xs font-mono text-accent-green">{completedNights}/7</span>
            </ProgressRing>
          </div>
        </div>

        <p className="text-text-muted text-sm mb-4">
          Complete all items each night to build your protocol streak. Set your bedtime to auto-calculate the WBTB alarm.
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="text-accent-gold" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {nights.map(night => (
              <NightCard
                key={night.id}
                night={night}
                onUpdate={updateNight}
                onToggleItem={toggleChecklistItem}
              />
            ))}
          </div>
        )}
      </PageWrapper>
  )
}

export function TrackerPage() {
  return <AppShell title="7-Night Protocol"><TrackerContent /></AppShell>
}

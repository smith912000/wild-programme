import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Target } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { AttemptCard } from './components/AttemptCard'
import { EmptyState } from '@shared/ui/EmptyState'
import { Button } from '@shared/ui/Button'
import { useAttemptLog } from '@hooks/useAttemptLog'
import { Spinner } from '@shared/ui/Spinner'

export function AttemptLogContent() {
  const navigate = useNavigate()
  const { attempts, loading, removeAttempt, successRate } = useAttemptLog()

  return (
    <PageWrapper>
        <TierGate feature="attempt_log">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-accent-blue">{attempts.length}</p>
              <p className="text-text-faint text-xs mt-0.5">Attempts</p>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-accent-green">{successRate}%</p>
              <p className="text-text-faint text-xs mt-0.5">Success</p>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-2xl font-display font-bold text-accent-gold">
                {attempts.filter(a => a.outcome === 'Full').length}
              </p>
              <p className="text-text-faint text-xs mt-0.5">Full WILD</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="text-accent-gold" />
            </div>
          ) : attempts.length === 0 ? (
            <EmptyState
              icon={Target}
              message="No attempts logged"
              subMessage="Log your first WILD attempt"
              action={<Button variant="primary" size="sm" onClick={() => navigate('/attempts/new')}>Log Attempt</Button>}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {attempts.map(attempt => (
                <AttemptCard key={attempt.id} attempt={attempt} onDelete={removeAttempt} />
              ))}
            </div>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function AttemptLogPage() {
  const navigate = useNavigate()
  return (
    <AppShell title="Attempt Log" rightAction={
      <Button variant="primary" size="sm" onClick={() => navigate('/attempts/new')}>
        <Plus className="w-4 h-4" /> Log
      </Button>
    }>
      <AttemptLogContent />
    </AppShell>
  )
}

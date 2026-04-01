import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMeditationTimer } from '@hooks/useMeditationTimer'
import { useAudio } from '@hooks/useAudio'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { MandalaAnimation } from './components/MandalaAnimation'
import { TimerDisplay } from './components/TimerDisplay'
import { IntervalPicker } from './components/IntervalPicker'
import { Modal } from '@shared/ui/Modal'
import { formatDuration } from '@utils/formatters'

const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60]

export function MeditationContent() {
  const navigate = useNavigate()
  const audio = useAudio()
  const [durationMinutes, setDurationMinutes] = useState(15)
  const [intervalMinutes, setIntervalMinutes] = useState(5)
  const [phase, setPhase] = useState('SETUP') // SETUP | ACTIVE
  const [showComplete, setShowComplete] = useState(false)
  const [sessionSeconds, setSessionSeconds] = useState(0)

  const timer = useMeditationTimer({
    durationMinutes,
    intervalMinutes,
    onComplete: () => {
      setShowComplete(true)
      setPhase('SETUP')
    },
  })

  const handleStart = async () => {
    if (!audio.ready) await audio.init()
    timer.start()
    setPhase('ACTIVE')
  }

  const handleEnd = () => {
    setSessionSeconds(Math.round(timer.elapsed))
    timer.stop()
    setPhase('SETUP')
  }

  if (phase === 'ACTIVE') {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-between py-12 px-6">
        <TimerDisplay remaining={timer.remaining} total={durationMinutes * 60} />
        <div className="flex flex-col items-center gap-6">
          <ProgressRing size={280} progress={timer.progress} color="#c9a84c" strokeWidth={2}>
            <div className="flex flex-col items-center">
              <MandalaAnimation size={200} />
            </div>
          </ProgressRing>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={timer.isPaused ? timer.resume : timer.pause}
          >
            {timer.isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button variant="ghost" onClick={handleEnd}>
            End
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper>
        <p className="text-text-muted text-sm mb-6">Set your session parameters and begin.</p>

        {/* Duration */}
        <div className="mb-6">
          <p className="text-text-muted text-sm mb-3">Duration</p>
          <div className="flex flex-wrap gap-2">
            {DURATION_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDurationMinutes(d)}
                className={`px-4 py-2 rounded-xl text-sm font-display font-medium transition-all duration-150 border active:scale-95 ${
                  durationMinutes === d
                    ? 'bg-accent-gold/15 border-accent-gold/50 text-accent-gold'
                    : 'bg-bg-surface border-border text-text-muted hover:border-border-subtle hover:text-text-primary'
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <IntervalPicker value={intervalMinutes} onChange={setIntervalMinutes} />
        </div>

        {/* Preview ring */}
        <div className="flex justify-center mb-8">
          <ProgressRing size={160} progress={0} color="#c9a84c" strokeWidth={3}>
            <div className="text-center">
              <p className="font-mono text-2xl text-accent-gold">{durationMinutes}m</p>
              {intervalMinutes > 0 && (
                <p className="text-text-faint text-xs mt-1">Bell /{intervalMinutes}m</p>
              )}
            </div>
          </ProgressRing>
        </div>

        <Button variant="gold" size="lg" fullWidth onClick={handleStart} loading={audio.loading}>
          Begin Session
        </Button>

        {/* Complete Modal */}
        <Modal isOpen={showComplete} onClose={() => setShowComplete(false)} title="Session Complete">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-900/30 border border-accent-green/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-accent-green">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-text-primary font-display font-semibold">You completed {durationMinutes} minutes</p>
            <p className="text-text-muted text-sm">Total sitting time: {formatDuration(sessionSeconds)}</p>
            <Button variant="gold" fullWidth onClick={() => setShowComplete(false)}>Done</Button>
          </div>
        </Modal>
      </PageWrapper>
  )
}

export function MeditationPage() {
  return <AppShell title="Meditate"><MeditationContent /></AppShell>
}

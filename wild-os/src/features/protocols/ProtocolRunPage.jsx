import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, SkipForward } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { ProgressRing } from '@shared/ui/ProgressRing'
import { getProtocol } from '@lib/db'
import { useAudio } from '@hooks/useAudio'

const STEP_TYPE_COLORS = {
  breathing: '#3b82f6',
  meditation: '#a855f7',
  binaural: '#0ea5e9',
  rest: '#525770',
  journal: '#c9a84c',
  intention: '#22c55e',
  custom: '#f59e0b',
}

export function ProtocolRunPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const audio = useAudio()

  const [protocol, setProtocol] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    getProtocol(id).then(proto => {
      if (proto) setProtocol(proto)
      else navigate('/protocols')
    })
  }, [id, navigate])

  const step = protocol?.steps?.[currentStep]
  const stepDuration = (step ? Number(step.duration) : 5) * 60
  const progress = stepDuration > 0 ? elapsed / stepDuration : 0
  const remaining = Math.max(0, stepDuration - elapsed)
  const mins = Math.floor(remaining / 60)
  const secs = Math.floor(remaining % 60)

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= stepDuration) {
          clearInterval(intervalRef.current)
          if (audio.ready) audio.playBell(1)
          const nextStepIdx = currentStep + 1
          if (nextStepIdx < (protocol?.steps?.length || 0)) {
            setCurrentStep(nextStepIdx)
            setElapsed(0)
          } else {
            setIsRunning(false)
            setIsComplete(true)
            if (audio.ready) audio.playBell(3)
          }
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [isRunning, stepDuration, currentStep, protocol, audio])

  const handleStart = async () => {
    if (!audio.ready) await audio.init()
    setIsRunning(true)
  }

  const handleSkip = () => {
    clearInterval(intervalRef.current)
    const nextStepIdx = currentStep + 1
    if (nextStepIdx < (protocol?.steps?.length || 0)) {
      setCurrentStep(nextStepIdx)
      setElapsed(0)
      if (isRunning) {
        // restart timer for new step
        setIsRunning(false)
        setTimeout(() => setIsRunning(true), 50)
      }
    } else {
      setIsRunning(false)
      setIsComplete(true)
    }
  }

  const handleStop = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    navigate('/protocols')
  }

  if (!protocol) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 animate-fade-in" style={{ background: 'var(--color-bg)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
          <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--color-tier1)' }} />
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Protocol Complete</h2>
        <p className="mb-2" style={{ color: 'var(--color-text-muted)' }}>{protocol.name}</p>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          {protocol.steps?.length} steps completed
        </p>
        <div className="flex gap-3 w-full max-w-xs">
          <Button variant="ghost" className="flex-1" onClick={() => navigate('/journal/new')}>
            Journal Now
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => navigate('/protocols')}>
            Done
          </Button>
        </div>
      </div>
    )
  }

  const stepColor = STEP_TYPE_COLORS[step?.type] || 'var(--color-accent)'
  const totalSteps = protocol.steps?.length || 1

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{protocol.name}</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>
        <button
          onClick={handleStop}
          className="text-sm"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Exit
        </button>
      </div>

      {/* Step progress bar */}
      <div className="h-1" style={{ background: 'var(--color-border)' }}>
        <div
          className="h-1 transition-all duration-300"
          style={{ width: `${((currentStep) / totalSteps) * 100}%`, background: 'var(--color-accent)' }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-between py-12 px-6">
        <div />

        <div className="flex flex-col items-center gap-8">
          <ProgressRing size={220} progress={progress} color={stepColor} strokeWidth={3}>
            <div className="text-center">
              <p className="font-mono text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </p>
            </div>
          </ProgressRing>

          <div className="text-center">
            <p className="text-xs uppercase tracking-wider mb-1 font-medium" style={{ color: stepColor }}>
              {step?.type}
            </p>
            <p className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
              Step {currentStep + 1}: {step?.type?.charAt(0).toUpperCase() + step?.type?.slice(1)}
            </p>
            {step?.notes && (
              <p className="text-sm mt-2 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
                {step.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {!isRunning ? (
            <Button variant="primary" size="lg" fullWidth onClick={handleStart}>
              {elapsed > 0 ? 'Resume' : 'Start Step'}
            </Button>
          ) : (
            <div className="flex gap-3 w-full">
              <Button variant="ghost" className="flex-1" onClick={() => setIsRunning(false)}>
                Pause
              </Button>
              <Button variant="ghost" size="md" onClick={handleSkip}>
                <SkipForward className="w-4 h-4" />
                Skip
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

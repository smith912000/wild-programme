import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getPatternById } from '@config/breathing'
import { useBreathingSession } from '@hooks/useBreathingSession'
import { useAudio } from '@hooks/useAudio'
import { saveBreathingSession } from '@lib/db'
import { BreathingGeometric } from './components/BreathingGeometric'
import { PhaseLabel } from './components/PhaseLabel'
import { CycleCounter } from './components/CycleCounter'
import { Button } from '@shared/ui/Button'
import { formatDuration } from '@utils/formatters'

function buildCustomPattern({ inhale, hold, exhale, holdOut, cycles }) {
  const phases = [
    { name: 'INHALE',    duration: inhale,   color: '#3b82f6' },
    ...(hold    > 0 ? [{ name: 'HOLD',     duration: hold,    color: '#c9a84c' }] : []),
    { name: 'EXHALE',    duration: exhale,   color: '#a855f7' },
    ...(holdOut > 0 ? [{ name: 'HOLD_OUT', duration: holdOut, color: '#6366f1' }] : []),
  ]
  const total = phases.reduce((s, p) => s + p.duration, 0)
  return {
    id: 'custom', name: 'Custom', tier: 'T1',
    phases, totalCycleDuration: total, defaultCycles: cycles || 20,
    cues: {
      inhale:  'inhale',
      hold:    hold    > 0 ? 'hold'    : null,
      exhale:  'exhale',
      holdOut: holdOut > 0 ? 'holdOut' : null,
    },
    isWimHof: false,
  }
}

const TRANSITION_MS = 3500  // intro / outro animation duration

export function BreathingSessionPage() {
  const { patternId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const customTiming = location.state?.customTiming
  const pattern = customTiming ? buildCustomPattern(customTiming) : getPatternById(patternId)
  const audio = useAudio()
  const [sessionStarted, setSessionStarted] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [sessionData, setSessionData] = useState(null)
  // 'idle' | 'intro' | 'active' | 'outro'
  const [animState, setAnimState] = useState('idle')
  const [countdown, setCountdown] = useState(null)   // 3 | 2 | 1 | null
  const outroFiredRef = useRef(false)

  const session = useBreathingSession(pattern)

  // Session completes naturally → trigger outro
  useEffect(() => {
    if (session.isComplete && !showSummary && !outroFiredRef.current) {
      outroFiredRef.current = true
      const data = {
        id: 'bs-' + Date.now(),
        patternId,
        patternName: pattern?.name || patternId,
        startedAt: new Date(Date.now() - session.elapsed * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        cyclesCompleted: session.cycleCount,
        durationSeconds: Math.round(session.elapsed),
      }
      saveBreathingSession(data)
      setSessionData(data)
      setAnimState('outro')
      setTimeout(() => setShowSummary(true), TRANSITION_MS)
    }
  }, [session.isComplete, showSummary, patternId, pattern, session.elapsed, session.cycleCount])

  const handleStart = async () => {
    if (!audio.ready) await audio.init()
    setAnimState('intro')
    // 3-2-1 countdown fires in the final 3s of the intro window
    const offset = Math.max(0, TRANSITION_MS - 3000)
    setTimeout(() => setCountdown(3), offset)
    setTimeout(() => setCountdown(2), offset + 1000)
    setTimeout(() => setCountdown(1), offset + 2000)
    setTimeout(() => {
      setCountdown(null)
      session.start()
      setSessionStarted(true)
      setAnimState('active')
    }, TRANSITION_MS)
  }

  const handleEnd = () => {
    if (outroFiredRef.current) return
    outroFiredRef.current = true
    session.stop()
    if (session.elapsed > 10) {
      const data = {
        id: 'bs-' + Date.now(),
        patternId,
        patternName: pattern?.name || patternId,
        startedAt: new Date(Date.now() - session.elapsed * 1000).toISOString(),
        endedAt: new Date().toISOString(),
        cyclesCompleted: session.cycleCount,
        durationSeconds: Math.round(session.elapsed),
      }
      saveBreathingSession(data)
      setSessionData(data)
    }
    setAnimState('outro')
    setTimeout(() => setShowSummary(true), TRANSITION_MS)
  }

  if (!pattern) {
    return (
      <div className="min-h-screen bg-bg-deep flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted mb-4">Pattern not found</p>
          <Button onClick={() => navigate('/breathe')}>Back to Breathing</Button>
        </div>
      </div>
    )
  }

  if (showSummary) {
    return (
      <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 py-12 animate-fade-in">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-green-900/30 border border-accent-green/30 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10 text-accent-green">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-2xl text-text-primary mb-2">Session Complete</h2>
          <p className="text-text-muted mb-8">{pattern.name}</p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-bg-card border border-border rounded-2xl p-4">
              <p className="text-2xl font-display font-bold text-accent-blue">{sessionData?.cyclesCompleted || session.cycleCount}</p>
              <p className="text-text-faint text-xs mt-1">Cycles</p>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-4">
              <p className="text-2xl font-display font-bold text-accent-gold">{formatDuration(sessionData?.durationSeconds || Math.round(session.elapsed))}</p>
              <p className="text-text-faint text-xs mt-1">Duration</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/breathe')} className="flex-1">
              Back
            </Button>
            <Button variant="primary" onClick={() => { setShowSummary(false); setSessionStarted(false); setAnimState('idle'); setCountdown(null); outroFiredRef.current = false; }} className="flex-1">
              Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // intro → show star stage; active → follow session; outro → star stage; idle → rest
  const geoPhase =
    animState === 'intro'  ? 'inhale-stomach' :
    animState === 'outro'  ? 'exhale-chest'   :
    animState === 'active' ? session.figurePhase : 'rest'

  return (
    <div className="relative min-h-screen bg-bg-deep overflow-hidden">

      {/* ── Foreground UI ─────────────────────────────────────── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-between py-12 px-6">

        {/* Top: pattern name + cycle counter */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-text-faint text-sm">{pattern.name}</p>
          {sessionStarted && (
            <CycleCounter
              current={session.cycleCount}
              total={session.totalCycles}
              breathCount={session.wimHofBreathCount}
              breathsPerCycle={pattern.isWimHof ? pattern.breathsPerCycle : undefined}
            />
          )}
        </div>

        {/* Center: geometric animation + phase label */}
        <div className="flex flex-col items-center gap-4">
          {session.isRetention ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-accent-teal font-display font-bold text-5xl">
                {Math.round(session.retentionElapsed)}s
              </p>
              <p className="text-text-muted text-xs tracking-widest uppercase">Retention</p>
            </div>
          ) : session.isRecovery ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-accent-green font-display font-bold text-2xl tracking-widest uppercase">Recovery</p>
              <p className="text-text-faint text-xs">Deep breath in — hold 15s</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {/* Geometric animation */}
              <div style={{ width: 'min(72vw, 320px)', height: 'min(72vw, 320px)' }}>
                <BreathingGeometric phase={geoPhase} phaseDuration={session.phaseDuration} />
              </div>
              {/* Phase label + countdown */}
              <div className="flex flex-col items-center gap-1">
                <PhaseLabel phase={session.phase} />
                <p className="font-mono text-text-muted text-2xl">
                  {Math.ceil(session.phaseTimeRemaining)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom: controls */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          {animState === 'idle' ? (
            <Button variant="gold" size="lg" fullWidth onClick={handleStart} loading={audio.loading}>
              {audio.loading ? 'Loading Audio…' : 'Start Session'}
            </Button>
          ) : animState === 'active' ? (
            <Button variant="ghost" size="md" onClick={handleEnd}>
              End Session
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {animState === 'intro' && countdown !== null ? (
                <p
                  key={countdown}
                  className="font-display font-bold text-accent-gold animate-fade-in"
                  style={{ fontSize: '4rem', lineHeight: 1, opacity: 1 }}
                >
                  {countdown}
                </p>
              ) : (
                <p className="text-text-faint text-sm animate-pulse">
                  {animState === 'intro' ? 'Preparing…' : 'Finishing…'}
                </p>
              )}
            </div>
          )}
          <button
            onClick={() => navigate('/breathe')}
            className="text-text-faint text-sm hover:text-text-muted transition-colors"
          >
            ← Back to patterns
          </button>
        </div>

      </div>
    </div>
  )
}

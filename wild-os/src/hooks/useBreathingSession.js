import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudio } from './useAudio'

export function useBreathingSession(pattern) {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [phaseElapsed, setPhaseElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Wim Hof specific
  const [wimHofBreathCount, setWimHofBreathCount] = useState(0)
  const [isRetention, setIsRetention] = useState(false)
  const [retentionElapsed, setRetentionElapsed] = useState(0)
  const [isRecovery, setIsRecovery] = useState(false)

  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const phaseStartRef = useRef(0)
  const audio = useAudio()

  const phases = pattern?.phases || []
  const currentPhase = phases[phaseIndex] || phases[0]

  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const delta = (timestamp - lastTimeRef.current) / 1000
    lastTimeRef.current = timestamp

    setElapsed(prev => prev + delta)
    setPhaseElapsed(prev => {
      const next = prev + delta

      if (!pattern) return next

      if (pattern.isWimHof) {
        // Wim Hof: count breaths, then retention, then recovery
        const phaseDur = currentPhase?.duration || 1.5
        if (next >= phaseDur) {
          setWimHofBreathCount(bc => {
            const newBc = bc + (phaseIndex === 1 ? 1 : 0)
            const breathsPerCycle = pattern.breathsPerCycle || 30
            if (phaseIndex === 1 && newBc >= breathsPerCycle) {
              // Start retention
              setIsRetention(true)
              setPhaseIndex(0)
              setWimHofBreathCount(0)
              return 0
            }
            return newBc
          })
          setPhaseIndex(pi => (pi + 1) % phases.length)
          return 0
        }
        return next
      }

      const phaseDur = currentPhase?.duration || 4
      if (next >= phaseDur) {
        const nextPhaseIndex = (phaseIndex + 1) % phases.length
        if (nextPhaseIndex === 0) {
          setCycleCount(cc => {
            const newCc = cc + 1
            if (newCc >= (pattern.defaultCycles || 8)) {
              setIsRunning(false)
              setIsComplete(true)
              return newCc
            }
            return newCc
          })
        }
        setPhaseIndex(nextPhaseIndex)
        if (audio.ready) {
          const nextPhase = phases[nextPhaseIndex]
          if (nextPhase) audio.playPhaseCue(nextPhase.name.toLowerCase().replace('_out', 'Out').replace('hold', 'hold'))
        }
        return 0
      }
      return next
    })

    rafRef.current = requestAnimationFrame(tick)
  }, [pattern, phaseIndex, currentPhase, phases, audio])

  // Retention timer for Wim Hof
  useEffect(() => {
    if (!isRetention) return
    let start = null
    const retDur = pattern?.retentionDuration || 90

    const frame = (ts) => {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      setRetentionElapsed(elapsed)
      if (elapsed >= retDur) {
        setIsRetention(false)
        setIsRecovery(true)
        setRetentionElapsed(0)
      } else {
        requestAnimationFrame(frame)
      }
    }
    const id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [isRetention, pattern])

  useEffect(() => {
    if (!isRecovery) return
    let start = null
    const recDur = pattern?.recoveryDuration || 15

    const frame = (ts) => {
      if (!start) start = ts
      const elapsed = (ts - start) / 1000
      if (elapsed >= recDur) {
        setIsRecovery(false)
        setCycleCount(cc => {
          const newCc = cc + 1
          if (newCc >= (pattern.defaultCycles || 3)) {
            setIsRunning(false)
            setIsComplete(true)
          } else {
            setIsRunning(true)
          }
          return newCc
        })
      } else {
        requestAnimationFrame(frame)
      }
    }
    const id = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(id)
  }, [isRecovery, pattern])

  const start = useCallback(() => {
    if (!pattern) return
    setIsRunning(true)
    setIsComplete(false)
    setPhaseIndex(0)
    setCycleCount(0)
    setElapsed(0)
    setPhaseElapsed(0)
    setWimHofBreathCount(0)
    setIsRetention(false)
    setIsRecovery(false)
    lastTimeRef.current = null
    if (audio.ready) audio.playPhaseCue('inhale')
  }, [pattern, audio])

  const stop = useCallback(() => {
    setIsRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(() => {
    if (isRunning && !isRetention && !isRecovery) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isRunning, isRetention, isRecovery, tick])

  const phaseDuration = currentPhase?.duration || 4
  const phaseProgress = Math.min(phaseElapsed / phaseDuration, 1)
  const phaseTimeRemaining = Math.max(0, phaseDuration - phaseElapsed)

  // Compute figurePhase for BreathingFigure
  let figurePhase = 'hold'
  if (currentPhase) {
    const phaseName = currentPhase.name?.toUpperCase()
    if (phaseName === 'INHALE') {
      figurePhase = 'inhale-chest'    // 3D active from first frame of inhale
    } else if (phaseName === 'EXHALE') {
      figurePhase = 'exhale-stomach'  // 3D active, rotation decelerates back to aligned
    } else if (phaseName === 'HOLD_OUT') {
      figurePhase = 'hold-out'        // 3D at flat projection, static, stars visible
    } else {
      figurePhase = 'hold'            // HOLD: 3D continues spinning
    }
  }

  return {
    phase: currentPhase,
    phaseIndex,
    cycleCount,
    elapsed,
    phaseProgress,
    phaseTimeRemaining,
    isRunning,
    isComplete,
    wimHofBreathCount,
    isRetention,
    retentionElapsed,
    isRecovery,
    start,
    stop,
    totalCycles: pattern?.defaultCycles || 8,
    figurePhase,
    phaseDuration,
  }
}

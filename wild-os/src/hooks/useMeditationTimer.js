import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudio } from './useAudio'

export function useMeditationTimer({ durationMinutes, intervalMinutes, onComplete }) {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const lastBellRef = useRef(0)
  const audio = useAudio()

  const totalSeconds = durationMinutes * 60
  const remaining = Math.max(0, totalSeconds - elapsed)

  const tick = useCallback((timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const delta = (timestamp - lastTimeRef.current) / 1000
    lastTimeRef.current = timestamp

    setElapsed(prev => {
      const next = prev + delta

      // Interval bells
      if (intervalMinutes && intervalMinutes > 0) {
        const intervalSecs = intervalMinutes * 60
        const bellsNow = Math.floor(next / intervalSecs)
        const bellsBefore = Math.floor(prev / intervalSecs)
        if (bellsNow > bellsBefore && prev > 1) {
          if (audio.ready) audio.playBell(1)
          lastBellRef.current = next
        }
      }

      if (next >= totalSeconds) {
        setIsRunning(false)
        setIsComplete(true)
        if (audio.ready) audio.playBell(3)
        if (onComplete) onComplete()
        return totalSeconds
      }
      return next
    })

    rafRef.current = requestAnimationFrame(tick)
  }, [totalSeconds, intervalMinutes, audio, onComplete])

  useEffect(() => {
    if (isRunning && !isPaused) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [isRunning, isPaused, tick])

  const start = useCallback(() => {
    setElapsed(0)
    setIsComplete(false)
    setIsRunning(true)
    setIsPaused(false)
    lastBellRef.current = 0
    lastTimeRef.current = null
    if (audio.ready) audio.playBell(1)
  }, [audio])

  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
    lastTimeRef.current = null
  }, [])

  const stop = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setElapsed(0)
    setIsComplete(false)
  }, [])

  const progress = elapsed / totalSeconds

  return {
    elapsed,
    remaining,
    isRunning,
    isPaused,
    isComplete,
    progress,
    start,
    pause,
    resume,
    stop,
  }
}

import { useState, useEffect, useCallback } from 'react'
import * as audioEngine from '@lib/audio/engine'


export function useAudio() {
  const [ready, setReady] = useState(audioEngine.isInitialised())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (audioEngine.isInitialised()) setReady(true)
  }, [])

  const init = useCallback(async () => {
    if (audioEngine.isInitialised()) {
      setReady(true)
      return
    }
    setLoading(true)
    await audioEngine.initAudio()
    setReady(audioEngine.isInitialised())
    setLoading(false)
  }, [])

  return {
    ready,
    loading,
    init,
    playBell: audioEngine.playBell,
    playPhaseCue: audioEngine.playPhaseCue,
    startBinaural: audioEngine.startBinaural,
    stopBinaural: audioEngine.stopBinaural,
    setBinauralVolume: audioEngine.setBinauralVolume,
    setBinauralCarrier: audioEngine.setBinauralCarrier,
    isBinauralRunning: audioEngine.isBinauralRunning,
    startZhaaric: audioEngine.startZhaaric,
    stopZhaaric: audioEngine.stopZhaaric,
    setZhaaricVolume: audioEngine.setZhaaricVolume,
    onZhaaricGammaBurst: audioEngine.onZhaaricGammaBurst,
    isZhaaricRunning: audioEngine.isZhaaricRunning,
  }
}

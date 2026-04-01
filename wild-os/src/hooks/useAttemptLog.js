import { useState, useEffect, useCallback } from 'react'
import { getAllAttemptLogs, saveAttemptLog, deleteAttemptLog } from '@lib/db'

function genId() {
  return 'al-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export function useAttemptLog() {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllAttemptLogs()
    setAttempts(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createAttempt = useCallback(async (data) => {
    const attempt = {
      id: genId(),
      attemptDate: data.attemptDate || new Date().toISOString(),
      method: data.method || 'WILD',
      atonia: data.atonia || false,
      hypnagogicImagery: data.hypnagogicImagery || false,
      outcome: data.outcome || 'Fail',
      lucidityDepth: data.lucidityDepth || 0,
      notes: data.notes || '',
      ...data,
    }
    await saveAttemptLog(attempt)
    await refresh()
    return attempt
  }, [refresh])

  const removeAttempt = useCallback(async (id) => {
    await deleteAttemptLog(id)
    await refresh()
  }, [refresh])

  const successRate = attempts.length > 0
    ? Math.round((attempts.filter(a => a.outcome === 'Full' || a.outcome === 'Partial').length / attempts.length) * 100)
    : 0

  return {
    attempts,
    loading,
    refresh,
    createAttempt,
    removeAttempt,
    successRate,
  }
}

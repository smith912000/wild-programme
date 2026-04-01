import { useState, useEffect, useCallback } from 'react'
import { getAllTrackerNights, saveTrackerNight } from '@lib/db'

const DEFAULT_CHECKLIST = [
  { id: 'no_caffeine', label: 'No caffeine after 2pm' },
  { id: 'dim_lights', label: 'Dimmed lights 1h before bed' },
  { id: 'intention', label: 'Set clear WILD intention' },
  { id: 'breathing', label: 'Completed breathing exercise' },
  { id: 'alarm', label: 'WBTB alarm set' },
  { id: 'journal', label: 'Dream journal ready' },
]

function createDefaultNight(nightNum) {
  return {
    id: `night-${nightNum}`,
    nightNumber: nightNum,
    date: null,
    bedtime: '',
    wbtbAlarm: '',
    checklist: DEFAULT_CHECKLIST.map(item => ({ ...item, checked: false })),
    notes: '',
    completedAt: null,
  }
}

export function useTracker() {
  const [nights, setNights] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const saved = await getAllTrackerNights()
    const nightMap = {}
    for (const n of saved) nightMap[n.id] = n

    const allNights = Array.from({ length: 7 }, (_, i) => {
      const num = i + 1
      return nightMap[`night-${num}`] || createDefaultNight(num)
    })
    setNights(allNights)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const updateNight = useCallback(async (nightId, data) => {
    const existing = nights.find(n => n.id === nightId) || createDefaultNight(parseInt(nightId.split('-')[1]))
    const updated = { ...existing, ...data }

    // Auto-calc WBTB alarm from bedtime
    if (data.bedtime) {
      const [h, m] = data.bedtime.split(':').map(Number)
      const date = new Date()
      date.setHours(h, m, 0, 0)
      date.setTime(date.getTime() + 5 * 60 * 60 * 1000)
      updated.wbtbAlarm = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }

    // Check completion
    const allChecked = updated.checklist.every(item => item.checked)
    if (allChecked && !updated.completedAt) {
      updated.completedAt = new Date().toISOString()
    } else if (!allChecked) {
      updated.completedAt = null
    }

    await saveTrackerNight(updated)
    await refresh()
    return updated
  }, [nights, refresh])

  const toggleChecklistItem = useCallback(async (nightId, itemId) => {
    const night = nights.find(n => n.id === nightId)
    if (!night) return
    const newChecklist = night.checklist.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    )
    await updateNight(nightId, { checklist: newChecklist })
  }, [nights, updateNight])

  const completedNights = nights.filter(n => n.completedAt).length

  // Calculate streak
  const streak = (() => {
    let s = 0
    for (let i = nights.length - 1; i >= 0; i--) {
      if (nights[i].completedAt) s++
      else break
    }
    return s
  })()

  return {
    nights,
    loading,
    refresh,
    updateNight,
    toggleChecklistItem,
    completedNights,
    streak,
  }
}

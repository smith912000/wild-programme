import { useState, useEffect, useCallback } from 'react'
import { getAllJournalEntries, getAllAttemptLogs } from '@lib/db'
import { format, subDays, eachDayOfInterval } from 'date-fns'

export function useAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const compute = useCallback(async () => {
    setLoading(true)
    const [entries, attempts] = await Promise.all([
      getAllJournalEntries(),
      getAllAttemptLogs(),
    ])

    // Lucidity chart (last 30 entries)
    const lucidityData = entries.slice(0, 30).reverse().map((e, i) => ({
      index: i + 1,
      date: format(new Date(e.createdAt), 'MMM d'),
      lucidity: e.lucidityScore || 0,
      clarity: e.clarity || 0,
    }))

    // Streak heatmap (last 90 days)
    const now = new Date()
    const start = subDays(now, 89)
    const allDays = eachDayOfInterval({ start, end: now })
    const entryDates = new Set(entries.map(e => format(new Date(e.createdAt), 'yyyy-MM-dd')))
    const heatmapData = allDays.map(d => ({
      date: format(d, 'yyyy-MM-dd'),
      label: format(d, 'MMM d'),
      hasEntry: entryDates.has(format(d, 'yyyy-MM-dd')),
    }))

    // Streak calculation
    let currentStreak = 0
    for (let i = allDays.length - 1; i >= 0; i--) {
      const dateStr = format(allDays[i], 'yyyy-MM-dd')
      if (entryDates.has(dateStr)) currentStreak++
      else break
    }
    let longestStreak = 0
    let tempStreak = 0
    for (const d of allDays) {
      if (entryDates.has(format(d, 'yyyy-MM-dd'))) {
        tempStreak++
        if (tempStreak > longestStreak) longestStreak = tempStreak
      } else {
        tempStreak = 0
      }
    }

    // Attempt outcomes chart
    const outcomeCounts = { Full: 0, Partial: 0, Sleep: 0, Fail: 0 }
    for (const a of attempts) {
      if (outcomeCounts[a.outcome] !== undefined) outcomeCounts[a.outcome]++
    }
    const attemptChart = Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }))

    const avgLucidity = entries.length > 0
      ? (entries.reduce((s, e) => s + (e.lucidityScore || 0), 0) / entries.length).toFixed(1)
      : 0

    setData({
      totalEntries: entries.length,
      avgLucidity,
      currentStreak,
      longestStreak,
      lucidityData,
      heatmapData,
      attemptChart,
      successRate: attempts.length > 0
        ? Math.round((attempts.filter(a => a.outcome === 'Full' || a.outcome === 'Partial').length / attempts.length) * 100)
        : 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    compute()
  }, [compute])

  return { data, loading, refresh: compute }
}

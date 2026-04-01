import { useState, useEffect, useCallback } from 'react'
import {
  getAllJournalEntries,
  getJournalEntry,
  saveJournalEntry,
  deleteJournalEntry,
} from '@lib/db'

function genId() {
  return 'je-' + Date.now() + '-' + Math.random().toString(36).slice(2)
}

export function useJournal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const all = await getAllJournalEntries()
    setEntries(all)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const createEntry = useCallback(async (data) => {
    const entry = {
      id: genId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: data.title || '',
      content: data.content || '',
      moodTags: data.moodTags || [],
      clarity: data.clarity || 3,
      isLucid: !!(data.lucidityScore && data.lucidityScore >= 5),
      lucidityScore: data.lucidityScore || 0,
      remQuality: data.remQuality || 3,
      emotionTags: data.emotionTags || [],
      recurringSymbols: data.recurringSymbols || [],
      ...data,
    }
    await saveJournalEntry(entry)
    await refresh()
    return entry
  }, [refresh])

  const updateEntry = useCallback(async (id, data) => {
    const existing = await getJournalEntry(id)
    if (!existing) return null
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
      isLucid: !!(data.lucidityScore !== undefined ? data.lucidityScore : existing.lucidityScore) && (data.lucidityScore || existing.lucidityScore) >= 5,
    }
    await saveJournalEntry(updated)
    await refresh()
    return updated
  }, [refresh])

  const removeEntry = useCallback(async (id) => {
    await deleteJournalEntry(id)
    await refresh()
  }, [refresh])

  const getEntry = useCallback((id) => {
    return getJournalEntry(id)
  }, [])

  return {
    entries,
    loading,
    refresh,
    createEntry,
    updateEntry,
    removeEntry,
    getEntry,
  }
}

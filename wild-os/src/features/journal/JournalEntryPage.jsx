import React, { useState, useEffect } from 'react'
import { Star, X } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useJournal } from '@hooks/useJournal'
import { useAccessStore } from '@store/accessStore'
import { tierCanAccess } from '@config/tiers'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { MoodTagPicker } from './components/MoodTagPicker'
import { LuciditySlider } from './components/LuciditySlider'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const EMOTION_TAGS = ['joy', 'fear', 'awe', 'confusion', 'peace', 'sadness', 'excitement', 'love', 'anger', 'wonder']

export function JournalEntryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createEntry, updateEntry, getEntry } = useJournal()
  const { tier } = useAccessStore()
  const hasT2 = tierCanAccess(tier, 'breathing_advanced')
  const isEdit = !!id

  const [title, setTitle] = useState(`Dream — ${format(new Date(), 'MMM d, yyyy')}`)
  const [content, setContent] = useState('')
  const [moodTags, setMoodTags] = useState([])
  const [clarity, setClarity] = useState(3)
  const [lucidityScore, setLucidityScore] = useState(0)
  const [remQuality, setRemQuality] = useState(3)
  const [emotionTags, setEmotionTags] = useState([])
  const [recurringSymbols, setRecurringSymbols] = useState([])
  const [symbolInput, setSymbolInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getEntry(id).then(entry => {
        if (entry) {
          setTitle(entry.title || '')
          setContent(entry.content || '')
          setMoodTags(entry.moodTags || [])
          setClarity(entry.clarity || 3)
          setLucidityScore(entry.lucidityScore || 0)
          setRemQuality(entry.remQuality || 3)
          setEmotionTags(entry.emotionTags || [])
          setRecurringSymbols(entry.recurringSymbols || [])
        }
        setLoaded(true)
      })
    } else {
      setLoaded(true)
    }
  }, [id, isEdit, getEntry])

  const toggleEmotion = (tag) => {
    setEmotionTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const addSymbol = (e) => {
    if (e.key === 'Enter' && symbolInput.trim()) {
      e.preventDefault()
      if (!recurringSymbols.includes(symbolInput.trim())) {
        setRecurringSymbols(prev => [...prev, symbolInput.trim()])
      }
      setSymbolInput('')
    }
  }

  const removeSymbol = (sym) => {
    setRecurringSymbols(prev => prev.filter(s => s !== sym))
  }

  const handleSave = async () => {
    if (!content.trim()) return toast.error('Write something first')
    setSaving(true)
    const data = { title, content, moodTags, clarity, lucidityScore, remQuality, emotionTags, recurringSymbols }
    if (isEdit) {
      await updateEntry(id, data)
      toast.success('Entry updated')
      navigate(`/journal/${id}`)
    } else {
      const entry = await createEntry(data)
      toast.success('Dream recorded')
      navigate(`/journal/${entry.id}`)
    }
    setSaving(false)
  }

  if (!loaded) return null

  return (
    <AppShell title={isEdit ? 'Edit Entry' : 'New Entry'} backTo="/journal">
      <PageWrapper>
        <div className="flex flex-col gap-5">
          <Input
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted text-sm font-medium">Dream Content</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              placeholder="Describe your dream in as much detail as you can remember..."
              className="w-full bg-bg-surface border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-faint focus:outline-none focus:border-accent-blue/60 transition-colors text-sm resize-none"
            />
          </div>

          <MoodTagPicker selected={moodTags} onChange={setMoodTags} />

          {/* Clarity (star rating) */}
          <div className="flex flex-col gap-2">
            <label className="text-text-muted text-sm font-display font-medium">Dream Clarity</label>
            <div className="flex gap-1.5">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setClarity(star)}
                  className="transition-all duration-100 active:scale-90"
                >
                  <Star
                    className="w-6 h-6 transition-colors"
                    fill={star <= clarity ? '#c9a84c' : 'transparent'}
                    stroke={star <= clarity ? '#c9a84c' : '#4e5368'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* T2+ Fields */}
          {hasT2 && (
            <>
              <LuciditySlider value={lucidityScore} onChange={setLucidityScore} />

              <div className="flex flex-col gap-2">
                <label className="text-text-muted text-sm font-display font-medium">REM Quality</label>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRemQuality(star)}
                      className="transition-all duration-100 active:scale-90"
                    >
                      <Star
                        className="w-6 h-6 transition-colors"
                        fill={star <= remQuality ? '#3b82f6' : 'transparent'}
                        stroke={star <= remQuality ? '#3b82f6' : '#4e5368'}
                        strokeWidth={1.5}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-text-muted text-sm font-medium">Emotions</label>
                <div className="flex flex-wrap gap-2">
                  {EMOTION_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEmotion(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors border ${
                        emotionTags.includes(tag)
                          ? 'bg-accent-teal/20 border-accent-teal/50 text-accent-teal'
                          : 'bg-bg-surface border-border text-text-muted hover:border-border-subtle'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-text-muted text-sm font-medium">Recurring Symbols</label>
                <input
                  type="text"
                  value={symbolInput}
                  onChange={e => setSymbolInput(e.target.value)}
                  onKeyDown={addSymbol}
                  placeholder="Type symbol name + Enter"
                  className="w-full bg-bg-surface border border-border rounded-xl px-4 py-2.5 text-text-primary placeholder-text-faint focus:outline-none focus:border-accent-blue/60 text-sm transition-colors"
                />
                {recurringSymbols.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {recurringSymbols.map(sym => (
                      <span
                        key={sym}
                        className="flex items-center gap-1 px-2.5 py-1 bg-bg-surface border border-border rounded-lg text-xs text-text-muted"
                      >
                        {sym}
                        <button onClick={() => removeSymbol(sym)} className="text-text-faint hover:text-accent-red ml-0.5 transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <Button variant="gold" size="lg" fullWidth onClick={handleSave} loading={saving} className="mt-2">
            {isEdit ? 'Save Changes' : 'Save Dream'}
          </Button>
        </div>
      </PageWrapper>
    </AppShell>
  )
}

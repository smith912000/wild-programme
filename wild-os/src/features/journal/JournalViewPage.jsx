import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Edit2, Trash2 } from 'lucide-react'
import { useJournal } from '@hooks/useJournal'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Badge } from '@shared/ui/Badge'
import { Modal } from '@shared/ui/Modal'
import { formatDate } from '@utils/formatters'
import toast from 'react-hot-toast'

export function JournalViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEntry, removeEntry } = useJournal()
  const [entry, setEntry] = useState(null)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    getEntry(id).then(setEntry)
  }, [id, getEntry])

  const handleDelete = async () => {
    await removeEntry(id)
    toast.success('Entry deleted')
    navigate('/journal', { replace: true })
  }

  if (!entry) return null

  return (
    <AppShell
      title=""
      backTo="/journal"
      rightAction={
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/journal/${id}/edit`)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowDelete(true)}>
            <Trash2 className="w-4 h-4 text-accent-red" />
          </Button>
        </div>
      }
    >
      <PageWrapper>
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-text-faint text-sm mb-1">{formatDate(entry.createdAt)}</p>
            <h1 className="font-display font-bold text-2xl text-text-primary">{entry.title || 'Untitled Dream'}</h1>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-2">
            {entry.lucidityScore > 0 && (
              <Badge variant="status" status={entry.lucidityScore >= 7 ? 'green' : 'amber'}>
                Lucidity {entry.lucidityScore}/10
              </Badge>
            )}
            {entry.clarity > 0 && (
              <Badge variant="plain">Clarity {'★'.repeat(entry.clarity)}</Badge>
            )}
            {entry.moodTags?.map(tag => (
              <Badge key={tag} variant="plain" size="sm">{tag}</Badge>
            ))}
          </div>

          <p className="text-text-primary leading-relaxed whitespace-pre-wrap text-sm">{entry.content}</p>

          {entry.emotionTags?.length > 0 && (
            <div>
              <p className="text-text-faint text-xs uppercase tracking-wider mb-2">Emotions</p>
              <div className="flex flex-wrap gap-2">
                {entry.emotionTags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-bg-surface border border-border rounded-lg text-xs text-text-muted capitalize">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {entry.recurringSymbols?.length > 0 && (
            <div>
              <p className="text-text-faint text-xs uppercase tracking-wider mb-2">Symbols</p>
              <div className="flex flex-wrap gap-2">
                {entry.recurringSymbols.map(sym => (
                  <button
                    key={sym}
                    onClick={() => navigate('/symbols')}
                    className="px-2.5 py-1 bg-bg-surface border border-border rounded-lg text-xs text-accent-gold hover:border-accent-gold/50 transition-colors"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageWrapper>

      <Modal isOpen={showDelete} onClose={() => setShowDelete(false)} title="Delete Entry">
        <p className="text-text-muted text-sm mb-6">Are you sure you want to delete this dream entry? This cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </AppShell>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, BookOpen } from 'lucide-react'
import { useJournal } from '@hooks/useJournal'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { SearchBar } from './components/SearchBar'
import { EntryCard } from './components/EntryCard'
import { EmptyState } from '@shared/ui/EmptyState'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'

export function JournalContent() {
  const navigate = useNavigate()
  const { entries, loading } = useJournal()
  const [search, setSearch] = useState('')

  const filtered = search
    ? entries.filter(e =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.content?.toLowerCase().includes(search.toLowerCase()) ||
        e.moodTags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : entries

  return (
    <PageWrapper>
        <div className="mb-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner className="text-accent-gold" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            message={search ? 'No matching entries' : 'No dream entries yet'}
            subMessage={search ? 'Try different keywords' : 'Tap New to record your first dream'}
            action={!search && (
              <Button variant="gold" size="sm" onClick={() => navigate('/journal/new')}>
                Record Dream
              </Button>
            )}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => navigate('/journal/new')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-accent-gold rounded-full flex items-center justify-center shadow-lg shadow-accent-gold/20 hover:bg-yellow-400 active:scale-95 transition-all z-30"
        >
          <Plus className="w-6 h-6 text-bg-deep" />
        </button>
      </PageWrapper>
  )
}

export function JournalPage() {
  const navigate = useNavigate()
  return (
    <AppShell title="Journal" rightAction={
      <Button variant="primary" size="sm" onClick={() => navigate('/journal/new')}>
        <Plus className="w-4 h-4" /> New
      </Button>
    }>
      <JournalContent />
    </AppShell>
  )
}

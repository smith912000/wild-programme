import React, { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { DREAM_SYMBOLS, SYMBOL_CATEGORIES, searchSymbols } from '@config/symbols'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { SearchBar } from '@features/journal/components/SearchBar'
import { SymbolCard } from './components/SymbolCard'
import { EmptyState } from '@shared/ui/EmptyState'

export function SymbolLibraryContent() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = (() => {
    let symbols = query ? searchSymbols(query) : DREAM_SYMBOLS
    if (category !== 'all') {
      symbols = symbols.filter(s => s.category === category)
    }
    return symbols
  })()

  return (
    <PageWrapper>
      <p className="text-text-muted text-sm mb-4">
        {DREAM_SYMBOLS.length}+ dream symbols with cognitive and spiritual interpretations.
      </p>

      <div className="mb-4">
        <SearchBar value={query} onChange={setQuery} placeholder="Search symbols..." />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {SYMBOL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
              category === cat.id
                ? 'bg-accent-gold/20 border-accent-gold/50 text-accent-gold'
                : 'bg-bg-surface border-border text-text-muted hover:border-border-subtle'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Sparkles} message="No symbols found" subMessage="Try a different search term" />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(symbol => (
            <SymbolCard key={symbol.id} symbol={symbol} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

export function SymbolLibraryPage() {
  return (
    <AppShell title="Symbol Library">
      <SymbolLibraryContent />
    </AppShell>
  )
}

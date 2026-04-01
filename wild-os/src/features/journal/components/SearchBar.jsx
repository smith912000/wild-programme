import React from 'react'
import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange, placeholder = 'Search dreams...' }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg-surface border border-border rounded-xl pl-9 pr-9 py-2.5 text-text-primary placeholder-text-faint focus:outline-none focus:border-accent-blue/60 text-sm transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

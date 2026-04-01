import React, { useState } from 'react'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'

export function SymbolCard({ symbol }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card
      as="button"
      onClick={() => setExpanded(v => !v)}
      className="p-4 text-left w-full transition-all hover:border-border-subtle"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-text-primary font-medium text-sm">{symbol.name}</p>
        <Badge variant="plain" size="sm">{symbol.category}</Badge>
      </div>

      {!expanded && (
        <p className="text-text-faint text-xs line-clamp-2">{symbol.bioInterpretation}</p>
      )}

      {expanded && (
        <div className="mt-3 space-y-3 animate-fade-in">
          <div>
            <p className="text-accent-blue text-xs font-semibold uppercase tracking-wider mb-1">Cognitive / Bio</p>
            <p className="text-text-muted text-xs leading-relaxed">{symbol.bioInterpretation}</p>
          </div>
          <div>
            <p className="text-accent-gold text-xs font-semibold uppercase tracking-wider mb-1">Spiritual</p>
            <p className="text-text-muted text-xs leading-relaxed">{symbol.spiritualInterpretation}</p>
          </div>
          {symbol.keywords?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {symbol.keywords.map(k => (
                <span key={k} className="text-xs bg-bg-surface border border-border-subtle rounded px-1.5 py-0.5 text-text-faint">
                  {k}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

import React from 'react'
import { CheckCircle2, Circle, Trash2 } from 'lucide-react'
import { formatTime } from '@utils/formatters'

export function SupplementLog({ entries, onToggle, onDelete }) {
  if (!entries.length) return null

  return (
    <div className="flex flex-col gap-2">
      {entries.map(entry => (
        <div key={entry.id} className="flex items-center justify-between gap-3 bg-bg-surface border border-border rounded-xl p-3">
          <button onClick={() => onToggle(entry.id)} className="shrink-0">
            {entry.taken ? (
              <CheckCircle2 className="w-5 h-5 text-accent-green" />
            ) : (
              <Circle className="w-5 h-5 text-text-faint" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${entry.taken ? 'text-text-muted line-through' : 'text-text-primary'}`}>
              {entry.name}
            </p>
            <p className="text-text-faint text-xs">{entry.dose} · {entry.timing}</p>
          </div>
          {entry.takenAt && (
            <span className="text-accent-green text-xs font-mono">{formatTime(entry.takenAt)}</span>
          )}
          <button onClick={() => onDelete(entry.id)} className="text-text-faint hover:text-accent-red p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

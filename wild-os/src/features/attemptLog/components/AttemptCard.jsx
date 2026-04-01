import React from 'react'
import { Trash2 } from 'lucide-react'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { formatDate, formatTime } from '@utils/formatters'

const OUTCOME_STATUS = {
  Full: 'green',
  Partial: 'amber',
  Sleep: 'blue',
  Fail: 'red',
}

export function AttemptCard({ attempt, onDelete }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="status" status={OUTCOME_STATUS[attempt.outcome] || 'blue'} size="sm">
              {attempt.outcome}
            </Badge>
            <span className="text-text-faint text-xs">{attempt.method}</span>
          </div>
          <p className="text-text-faint text-xs mb-2">
            {formatDate(attempt.attemptDate)} · {formatTime(attempt.attemptDate)}
          </p>
          <div className="flex gap-3 text-xs">
            <span className={`${attempt.atonia ? 'text-accent-green' : 'text-text-faint'}`}>
              {attempt.atonia ? '✓' : '×'} Atonia
            </span>
            <span className={`${attempt.hypnagogicImagery ? 'text-accent-green' : 'text-text-faint'}`}>
              {attempt.hypnagogicImagery ? '✓' : '×'} Imagery
            </span>
            {attempt.lucidityDepth > 0 && (
              <span className="text-accent-gold">Depth {attempt.lucidityDepth}/5</span>
            )}
          </div>
          {attempt.notes && (
            <p className="text-text-muted text-xs mt-2 line-clamp-2">{attempt.notes}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(attempt.id)}
          className="text-text-faint hover:text-accent-red transition-colors p-1 shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Card>
  )
}

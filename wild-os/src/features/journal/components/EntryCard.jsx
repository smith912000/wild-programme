import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { formatDate } from '@utils/formatters'

export function EntryCard({ entry }) {
  const navigate = useNavigate()
  const preview = entry.content?.slice(0, 100) || 'No content'

  return (
    <Card
      as="button"
      onClick={() => navigate(`/journal/${entry.id}`)}
      className="p-4 text-left w-full hover:border-border-subtle transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-text-primary font-medium text-sm leading-tight flex-1 truncate">
          {entry.title || 'Untitled Dream'}
        </p>
        {entry.lucidityScore > 0 && (
          <Badge
            variant="status"
            status={entry.lucidityScore >= 7 ? 'green' : entry.lucidityScore >= 4 ? 'amber' : 'blue'}
            size="sm"
          >
            {entry.lucidityScore}/10
          </Badge>
        )}
      </div>
      <p className="text-text-faint text-xs mb-2 line-clamp-2">{preview}</p>
      <div className="flex items-center justify-between">
        <p className="text-text-faint text-xs">{formatDate(entry.createdAt)}</p>
        {entry.moodTags?.length > 0 && (
          <div className="flex gap-1">
            {entry.moodTags.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-bg-surface border border-border rounded px-1.5 py-0.5 text-text-faint">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

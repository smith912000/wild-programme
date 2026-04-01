import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@shared/ui/Card'
import { Badge } from '@shared/ui/Badge'
import { formatMinutes } from '@utils/formatters'

export function PatternCard({ pattern, locked = false }) {
  const navigate = useNavigate()
  const totalMinutes = Math.ceil((pattern.totalCycleDuration * pattern.defaultCycles) / 60)

  const handleClick = () => {
    if (!locked) navigate(`/breathe/session/${pattern.id}`)
  }

  return (
    <Card
      as="button"
      onClick={handleClick}
      className={`p-4 text-left w-full ${locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-border-subtle active:scale-[0.98]'} transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant="tier" tier={pattern.tier} size="sm">{pattern.tier}</Badge>
        <span className="text-text-faint text-xs">{formatMinutes(totalMinutes)}</span>
      </div>
      <p className="text-text-primary font-medium text-sm mb-1">{pattern.name}</p>
      <p className="text-text-faint text-xs mb-3 line-clamp-2">{pattern.description}</p>
      {/* Phase dots */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {pattern.phases.map((phase, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: phase.color }}
            />
            <span className="text-text-faint text-xs">{phase.duration}s</span>
          </div>
        ))}
        <span className="text-text-faint text-xs ml-1">× {pattern.defaultCycles}</span>
      </div>
    </Card>
  )
}

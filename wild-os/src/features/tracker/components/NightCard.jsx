import React, { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, Circle } from 'lucide-react'
import { Card } from '@shared/ui/Card'

export function NightCard({ night, onUpdate, onToggleItem }) {
  const [expanded, setExpanded] = useState(night.nightNumber === 1)
  const checkedCount = night.checklist.filter(i => i.checked).length
  const isComplete = checkedCount === night.checklist.length

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold border ${
            isComplete
              ? 'bg-accent-green/20 border-accent-green/40 text-accent-green'
              : 'bg-bg-surface border-border text-text-muted'
          }`}>
            {isComplete ? '✓' : night.nightNumber}
          </div>
          <div className="text-left">
            <p className="text-text-primary text-sm font-medium">Night {night.nightNumber}</p>
            <p className="text-text-faint text-xs">{checkedCount}/{night.checklist.length} complete</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Progress bar */}
          <div className="w-16 h-1.5 bg-bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-gold rounded-full transition-all duration-300"
              style={{ width: `${(checkedCount / night.checklist.length) * 100}%` }}
            />
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-text-faint" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-faint" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border pt-4">
          {/* Bedtime + WBTB */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-text-faint text-xs mb-1 block">Bedtime</label>
              <input
                type="time"
                value={night.bedtime}
                onChange={e => onUpdate(night.id, { bedtime: e.target.value })}
                className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-blue/60"
              />
            </div>
            <div>
              <label className="text-text-faint text-xs mb-1 block">WBTB Alarm</label>
              <div className="w-full bg-bg-surface border border-border rounded-lg px-3 py-2 text-sm font-mono text-accent-gold">
                {night.wbtbAlarm || '—'}
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-2">
            {night.checklist.map(item => (
              <button
                key={item.id}
                onClick={() => onToggleItem(night.id, item.id)}
                className="flex items-center gap-3 text-left py-1"
              >
                {item.checked ? (
                  <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-text-faint shrink-0" />
                )}
                <span className={`text-sm transition-colors ${item.checked ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}

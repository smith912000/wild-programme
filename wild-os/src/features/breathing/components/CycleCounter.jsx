import React from 'react'

export function CycleCounter({ current, total, breathCount, breathsPerCycle }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className="text-text-faint text-sm">Cycle</span>
        <span className="font-mono text-text-primary font-bold">{current + 1}/{total}</span>
      </div>
      {breathsPerCycle && (
        <div className="flex items-center gap-2">
          <span className="text-text-faint text-xs">Breath</span>
          <span className="font-mono text-accent-teal text-sm font-medium">{breathCount}/{breathsPerCycle}</span>
        </div>
      )}
    </div>
  )
}

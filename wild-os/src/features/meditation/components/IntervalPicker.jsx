import React from 'react'

const OPTIONS = [
  { value: 0, label: 'Off' },
  { value: 5, label: '5m' },
  { value: 10, label: '10m' },
  { value: 15, label: '15m' },
]

export function IntervalPicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-text-muted text-sm">Bell interval</p>
      <div className="flex gap-2">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors border ${
              value === opt.value
                ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue'
                : 'bg-bg-surface border-border text-text-muted hover:border-border-subtle'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

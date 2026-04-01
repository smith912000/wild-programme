import React from 'react'

export function LuciditySlider({ value, onChange }) {
  const color = value >= 7 ? '#22c55e' : value >= 4 ? '#f59e0b' : '#3b82f6'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-text-muted text-sm font-medium">Lucidity Level</label>
        <span className="font-mono text-sm font-bold" style={{ color }}>{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: color }}
      />
      <div className="flex justify-between text-text-faint text-xs">
        <span>Not lucid</span>
        <span>Fully lucid</span>
      </div>
    </div>
  )
}

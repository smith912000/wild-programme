import React from 'react'

export function Slider({ label, value, min = 0, max = 10, step = 1, onChange, className = '', showValue = true }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-text-muted text-sm">{label}</span>
          {showValue && <span className="text-text-primary text-sm font-mono font-medium">{value}</span>}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1"
      />
      <div className="flex justify-between text-text-faint text-xs">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

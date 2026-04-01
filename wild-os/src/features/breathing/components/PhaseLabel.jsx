import React from 'react'

const PHASE_LABELS = {
  INHALE: 'Inhale',
  HOLD: 'Hold',
  EXHALE: 'Exhale',
  HOLD_OUT: 'Hold Out',
}

const PHASE_COLORS = {
  INHALE: '#3b82f6',
  HOLD: '#c9a84c',
  EXHALE: '#a855f7',
  HOLD_OUT: '#525770',
}

export function PhaseLabel({ phase }) {
  const name = phase?.name || 'INHALE'
  const label = PHASE_LABELS[name] || name
  const color = PHASE_COLORS[name] || '#e8eaf0'

  return (
    <p
      className="font-display font-bold text-2xl tracking-widest uppercase transition-all duration-300"
      style={{ color }}
    >
      {label}
    </p>
  )
}

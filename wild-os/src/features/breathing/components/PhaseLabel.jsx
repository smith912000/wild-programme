import React from 'react'

const PHASE_LABELS = {
  INHALE: 'Inhale',
  HOLD: 'Hold',
  EXHALE: 'Exhale',
  HOLD_OUT: 'Hold Out',
}

const PHASE_COLORS = {
  INHALE: '#8A6FE0',
  HOLD: '#C9A84C',
  EXHALE: '#B9A9F0',
  HOLD_OUT: '#6E6A80',
}

export function PhaseLabel({ phase }) {
  const name = phase?.name || 'INHALE'
  const label = PHASE_LABELS[name] || name
  const color = PHASE_COLORS[name] || '#F4F1ED'

  return (
    <p
      className="font-display text-2xl tracking-widest uppercase transition-all duration-300"
      style={{ color }}
    >
      {label}
    </p>
  )
}

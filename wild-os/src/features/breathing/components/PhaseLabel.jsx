import React from 'react'

const PHASE_LABELS = {
  INHALE: 'Inhale',
  HOLD: 'Hold',
  EXHALE: 'Exhale',
  HOLD_OUT: 'Hold Out',
}

const PHASE_COLORS = {
  INHALE: '#4DB8A2',
  HOLD: '#D2825A',
  EXHALE: '#9EDCCB',
  HOLD_OUT: '#6E6A80',
}

export function PhaseLabel({ phase }) {
  const name = phase?.name || 'INHALE'
  const label = PHASE_LABELS[name] || name
  const color = PHASE_COLORS[name] || '#EDEFE6'

  return (
    <p
      className="font-display text-2xl tracking-widest uppercase transition-all duration-300"
      style={{ color }}
    >
      {label}
    </p>
  )
}

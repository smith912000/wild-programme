import React, { useEffect, useRef } from 'react'

const PHASE_SCALES = {
  INHALE: 1.4,
  HOLD: 1.4,
  EXHALE: 1.0,
  HOLD_OUT: 1.0,
}

const PHASE_COLORS = {
  INHALE: '#3b82f6',
  HOLD: '#c9a84c',
  EXHALE: '#a855f7',
  HOLD_OUT: '#525770',
}

export function BreathingCircle({ phase, phaseProgress, size = 200 }) {
  const circleRef = useRef(null)
  const prevPhaseRef = useRef(null)

  const phaseName = phase?.name || 'INHALE'
  const color = PHASE_COLORS[phaseName] || PHASE_COLORS.INHALE
  const targetScale = PHASE_SCALES[phaseName] || 1

  // Calculate current scale based on phase and progress
  let currentScale
  if (phaseName === 'INHALE') {
    currentScale = 1 + (0.4 * phaseProgress)
  } else if (phaseName === 'HOLD') {
    currentScale = targetScale
  } else if (phaseName === 'EXHALE') {
    currentScale = 1.4 - (0.4 * phaseProgress)
  } else {
    currentScale = 1
  }

  const outerSize = size
  const innerSize = size * 0.75
  const ringSize = size * 1.15

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: ringSize, height: ringSize }}
    >
      {/* Outer ring (subtle pulse) */}
      <div
        className="absolute rounded-full border"
        style={{
          width: ringSize,
          height: ringSize,
          borderColor: color + '20',
          transform: `scale(${0.8 + currentScale * 0.1})`,
          transition: 'transform 0.1s linear, border-color 0.5s ease',
        }}
      />
      {/* Glow layer */}
      <div
        className="absolute rounded-full"
        style={{
          width: outerSize,
          height: outerSize,
          background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
          transform: `scale(${currentScale})`,
          transition: 'transform 0.1s linear, background 0.5s ease',
        }}
      />
      {/* Main circle */}
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: innerSize,
          height: innerSize,
          background: `radial-gradient(circle at 35% 35%, ${color}60, ${color}20)`,
          border: `2px solid ${color}60`,
          transform: `scale(${currentScale})`,
          transition: 'transform 0.1s linear, background 0.5s ease, border-color 0.5s ease',
          boxShadow: `0 0 ${30 * currentScale}px ${color}40`,
        }}
      />
    </div>
  )
}

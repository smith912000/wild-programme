import React from 'react'

// The WILD mark: a vertical vesica (two rings) with a gold aperture. Same geometry as the hub.
// size is the width in px; height follows the 100x120 viewBox.
export function Mark({ size = 64, halo = true, className = '', ...props }) {
  return (
    <svg
      className={`wild-mark ${className}`}
      viewBox="0 0 100 120"
      width={size}
      height={size * 1.2}
      role="img"
      aria-label="WILD"
      style={{ overflow: 'visible' }}
      {...props}
    >
      {halo && (
        <>
          <defs>
            <radialGradient id="wild-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(99,73,184,.45)" />
              <stop offset="100%" stopColor="rgba(99,73,184,0)" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="60" rx="46" ry="54" fill="url(#wild-halo)" />
        </>
      )}
      <g fill="none" stroke="var(--wild-indigo)" strokeWidth="2.4">
        <circle className="ring" cx="50" cy="44" r="34" />
        <circle className="ring2" cx="50" cy="76" r="34" />
      </g>
      <line className="aperture" x1="50" y1="51" x2="50" y2="69" stroke="var(--wild-gold-2)" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  )
}

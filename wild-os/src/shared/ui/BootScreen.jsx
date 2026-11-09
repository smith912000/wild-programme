import React from 'react'

/* The WILD loading screen, the same as index.html's and every WILD page's (wild-loader.js),
   so the launch reads as one screen, not a chain of different spinners. Styles: .boot in index.html. */
export function BootScreen() {
  return (
    <div className="boot" role="status" aria-label="Loading">
      <svg viewBox="0 0 100 120" aria-hidden="true">
        <g fill="none" stroke="#4DB8A2" strokeWidth="7"><circle cx="50" cy="44" r="34" /><circle cx="50" cy="76" r="34" /></g>
        <line x1="50" y1="51" x2="50" y2="69" stroke="#EBA37F" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <div>WILD</div>
    </div>
  )
}

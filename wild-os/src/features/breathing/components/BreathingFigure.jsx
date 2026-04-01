import React, { useMemo } from 'react'

/**
 * BreathingFigure — Soul Silhouette
 * ─────────────────────────────────────────────────────────────────
 * 38 keypoints traced directly from reference artwork.
 * Catmull-Rom closed spline → smooth single-path silhouette.
 *
 * Breathing sequence (phase-driven, CSS transition:d):
 *   inhale-stomach → belly expands,  chest static
 *   inhale-chest   → chest expands,  belly stays
 *   hold           → both held fully expanded
 *   exhale-stomach → belly deflates, chest stays
 *   exhale-chest   → chest deflates, belly gone
 *
 * Dynamic x-offsets only:
 *   CHEST  idx 12 ×0.50 | 13 ×1.00 | 14 ×0.75 | 15 ×0.08
 *   BELLY  idx 16 ×0.55 | 17 ×1.00 | 18 ×0.65 | 19 ×0.20
 */

function cr2b(pts) {
  const n = pts.length
  const cmds = [`M ${pts[0][0]},${pts[0][1]}`]
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const cp1x = (p1[0] + (p2[0] - p0[0]) / 6).toFixed(2)
    const cp1y = (p1[1] + (p2[1] - p0[1]) / 6).toFixed(2)
    const cp2x = (p2[0] - (p3[0] - p1[0]) / 6).toFixed(2)
    const cp2y = (p2[1] - (p3[1] - p1[1]) / 6).toFixed(2)
    cmds.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`)
  }
  cmds.push('Z')
  return cmds.join(' ')
}

// ── 38 keypoints traced from reference image ─────────────────────
// ViewBox 0 0 290 490  |  Back ≈ x 30–65  |  Face/chest ≈ x 124–260
const BASE = [
  // HEAD
  [170,  5],  //  0  Crown
  [207,  9],  //  1  Top-front skull
  [237, 32],  //  2  Forehead
  [253, 60],  //  3  Brow
  [260, 88],  //  4  Cheek widest
  [253,111],  //  5  Below cheek
  [257,128],  //  6  Nose (subtle)
  [252,141],  //  7  Upper lip
  [242,155],  //  8  Chin front
  // NECK
  [226,167],  //  9  Chin bottom
  [212,179],  // 10  Throat
  [194,193],  // 11  Collar front
  // CHEST  (dynamic — push right by cO)
  [174,208],  // 12  Shoulder / upper chest  ×0.50
  [199,245],  // 13  Breast peak             ×1.00  ← most forward
  [186,270],  // 14  Under breast            ×0.75
  // DIAPHRAGM
  [170,299],  // 15  Diaphragm notch         ×0.08  (barely moves)
  // BELLY  (dynamic — push right by bO)
  [158,327],  // 16  Belly start             ×0.55
  [147,359],  // 17  Belly peak              ×1.00
  [132,395],  // 18  Lower belly             ×0.65
  [124,432],  // 19  Waist front             ×0.20
  // BOTTOM CLOSURE
  [116,485],  // 20  Bottom front
  [ 84,485],  // 21  Bottom back
  // BACK CONTOUR (going up)
  [ 73,427],  // 22  Hip back
  [ 60,370],  // 23  Lower back lower
  [ 62,337],  // 24  Lower back upper
  [ 65,323],  // 25  Lumbar arch
  [ 57,277],  // 26  Mid-spine hollow
  [ 53,232],  // 27  Upper-mid spine
  [ 51,197],  // 28  Upper back
  [ 30,165],  // 29  Shoulder ← WIDEST back point
  [ 37,142],  // 30  Back of shoulder
  [ 45,117],  // 31  Back neck base
  [ 55, 91],  // 32  Back neck mid
  [ 65, 68],  // 33  Back neck top
  [ 95, 47],  // 34  Occiput / skull base
  [120, 26],  // 35  Back of skull
  [144,  9],  // 36  Crown back
  [160,  6],  // 37  Crown back-top
]

const CHEST_W = { 12: 0.50, 13: 1.00, 14: 0.75, 15: 0.08 }
const BELLY_W = { 16: 0.55, 17: 1.00, 18: 0.65, 19: 0.20 }

function buildPath(bO, cO) {
  return cr2b(BASE.map(([x, y], i) => {
    let nx = x
    if (CHEST_W[i] !== undefined) nx += cO * CHEST_W[i]
    if (BELLY_W[i] !== undefined) nx += bO * BELLY_W[i]
    return [nx, y]
  }))
}

export function BreathingFigure({ phase = 'rest', phaseDuration = 4 }) {
  // Belly: full during inhale-stomach, inhale-chest, hold
  const bellyOn = phase === 'inhale-stomach' || phase === 'inhale-chest' || phase === 'hold'
  // Chest: full during inhale-chest, hold, exhale-stomach
  const chestOn = phase === 'inhale-chest'   || phase === 'hold'          || phase === 'exhale-stomach'

  const bO = bellyOn ? 30 : 0
  const cO = chestOn ? 22 : 0

  const bodyPath = useMemo(() => buildPath(bO, cO), [bO, cO])

  const dur  = Math.max(phaseDuration, 1.8)
  const ease = `${dur}s cubic-bezier(0.45,0,0.2,1)`
  const gold = 'var(--color-accent-gold, #c9a84c)'

  return (
    <svg
      viewBox="0 0 290 490"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="bf-fill" cx="62%" cy="40%" r="55%">
          <stop offset="0%"   stopColor={gold} stopOpacity="0.14" />
          <stop offset="100%" stopColor={gold} stopOpacity="0.02" />
        </radialGradient>
        <filter id="bf-glow" x="-50%" y="-20%" width="200%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bf-aura-blur">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>

      {/* Soft aura behind figure */}
      <ellipse
        cx="148" cy="265" rx="145" ry="220"
        fill={gold}
        fillOpacity={0.04 + (bellyOn ? 0.03 : 0) + (chestOn ? 0.03 : 0)}
        filter="url(#bf-aura-blur)"
        style={{ transition: `fill-opacity ${Math.max(dur, 2)}s ease-in-out` }}
      />

      {/* Body fill */}
      <path d={bodyPath} fill="url(#bf-fill)" style={{ transition: `d ${ease}` }} />

      {/* Silhouette outline */}
      <path
        d={bodyPath}
        fill="none"
        stroke={gold}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.78"
        filter="url(#bf-glow)"
        style={{ transition: `d ${ease}` }}
      />
    </svg>
  )
}

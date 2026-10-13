import React, { memo, useEffect, useRef } from 'react'

// ═══════════════════════════════════════════════════════════════
// 3-D math
// ═══════════════════════════════════════════════════════════════
// Rotation is rotY(ay) then rotX(ax), projection is a mild perspective
// (camera distance 4.5, depth factor 0.30). Both are linear up to the
// projection, so each frame the trig is done once to build the rotation
// matrix and every vertex is a handful of multiply-adds. No per-frame
// arrays or objects are allocated.
const CAM_D = 4.5
function rotMatrix(m, ay, ax) {
  const cy = Math.cos(ay), sy = Math.sin(ay)
  const cx = Math.cos(ax), sx = Math.sin(ax)
  // row-major 3x3: rotX(ax) · rotY(ay)
  m[0] = cy;       m[1] = 0;   m[2] = sy
  m[3] = sx * sy;  m[4] = cx;  m[5] = -sx * cy
  m[6] = -cx * sy; m[7] = sx;  m[8] = cx * cy
}
function ringPts(n, cx, cy, r, startDeg = 0) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((i * 360 / n) + startDeg) * Math.PI / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  })
}
function polyStr(n, cx, cy, r, startDeg = 0) {
  return ringPts(n, cx, cy, r, startDeg)
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
}

// ═══════════════════════════════════════════════════════════════
// Polyhedra
// ═══════════════════════════════════════════════════════════════

/**
 * Stella Octangula — compound of 2 tetrahedra.
 * Tetra A (blue) indices 0-3, Tetra B (red) indices 4-7.
 * At rotY = π/4 projects to the hexagram. ✓
 */
const STELLA_V = [
  [ 1, 1, 1], [ 1,-1,-1], [-1, 1,-1], [-1,-1, 1],  // tetra A  (0-3)
  [-1,-1,-1], [-1, 1, 1], [ 1,-1, 1], [ 1, 1,-1],  // tetra B  (4-7)
]
const STELLA_E = [
  [0,1],[0,2],[0,3],[1,2],[1,3],[2,3],   // tetra A — first 6 edges
  [4,5],[4,6],[4,7],[5,6],[5,7],[6,7],   // tetra B — last 6 edges
]

/**
 * Cube circumscribing the Stella — same 8 vertex positions, 12 square edges.
 * At rotY = π/4 projects to hexagon outline + 3 centre spokes (body-diagonal
 * view = the 2D alignment diagram). ✓
 */
const S2 = Math.SQRT1_2
const COMP_CUBE_E = [
  [0,5],[0,6],[0,7],
  [4,1],[4,2],[4,3],
  [1,6],[1,7],
  [2,5],[2,7],
  [3,5],[3,6],
]

/**
 * Inner octahedron — the intersection of the two tetrahedra.
 * Vertices at (±1,0,0),(0,±1,0),(0,0,±1); at rotY=π/4 projects to the
 * inner hexagon of the hexagram (purple). ✓
 */
const INNER_OCT_V = [
  [ 1, 0, 0],[-1, 0, 0],
  [ 0, 1, 0],[ 0,-1, 0],
  [ 0, 0, 1],[ 0, 0,-1],
]
const INNER_OCT_E = [
  [0,2],[0,3],[0,4],[0,5],
  [1,2],[1,3],[1,4],[1,5],
  [2,4],[2,5],[3,4],[3,5],
]

/**
 * 3-D Flower of Life — centre + 8 Stella vertices as sphere centres.
 */
const SQ3_2 = Math.sqrt(3) / 2
const FOL_CENTERS = [[0,0,0], ...STELLA_V]
const FOL_CENTERS_E = FOL_CENTERS.slice(1).map((_, i) => [0, i + 1])


// ═══════════════════════════════════════════════════════════════
// Fixed geometry (computed once at module load)
// ═══════════════════════════════════════════════════════════════
const CX = 200, CY = 200
const R1 = 120
const R2 = R1 / Math.sqrt(2)            // ≈ 84.9
const R3 = R2 / 2                        // ≈ 42.4

// 3-D scale — stella, cube, inner octahedron and FOL share one world-space
// scale, so the octahedron (vertices at distance 1) stays inside the stella
// (vertices at distance √3) at every rotation angle.
const WIRE_SCALE = R2 / Math.sqrt(3)    // ≈ 49

// Body-diagonal view: rotY(-π/4) + rotX(arctan(1/√2)) makes the stella/cube
// project exactly to the hexagram/hexagon at delta=0. tiltX grows slowly with
// delta so the 3D orbit feels volumetric without over-tilting.
const BASE_ANGLE_Y = -Math.PI / 4
const BASE_TILT_X  = Math.atan(1 / Math.sqrt(2))   // ≈ 0.6155 rad (35.26°)

// Rates, per second. Tuned at 60 fps as 0.018 and 0.007 per frame; now
// time-based so 120 Hz screens don't spin twice as fast.
const SPIN_RATE  = 0.018 * 60
const ORBIT_RATE = 0.007 * 60
const MIN_FRAME_MS = 15                  // cap drawing at ~60 fps

const RING_N = 24
const RING_COS = Float64Array.from({ length: RING_N }, (_, i) => Math.cos(i / RING_N * 2 * Math.PI))
const RING_SIN = Float64Array.from({ length: RING_N }, (_, i) => Math.sin(i / RING_N * 2 * Math.PI))
// Each sphere gets three great circles: in the xy, xz and yz planes,
// written as pairs of the unit axes that span them (0 = x, 1 = y, 2 = z).
const RING_PLANES = [[0, 1], [0, 2], [1, 2]]

// 2-D forms
const TRI_PTS       = polyStr(3, CX, CY, R2, -90)              // triangle A, pointing up
const HEX_PTS       = polyStr(6, CX, CY, R2, -90)              // hexagon at hexagram tip radius
const INNER_HEX_PTS = polyStr(6, CX, CY, R2 / Math.sqrt(3), 0) // octahedron projection
const TRI_A_TIPS    = ringPts(3, CX, CY, R2, -90)              // spokes

// The 2-D Flower of Life only shows at delta = 0, so its centres are the
// aligned projection of the 3-D sphere centres, computed once.
const FOL_2D = (() => {
  const m = new Float64Array(9)
  rotMatrix(m, BASE_ANGLE_Y, BASE_TILT_X)
  return FOL_CENTERS.map(([x, y, z]) => {
    const rx = m[0] * x + m[1] * y + m[2] * z
    const ry = m[3] * x + m[4] * y + m[5] * z
    const rz = m[6] * x + m[7] * y + m[8] * z
    const f = CAM_D / (CAM_D + rz * 0.30)
    return [CX + rx * WIRE_SCALE * f, CY - ry * WIRE_SCALE * f]
  })
})()

// Number formatting for path strings (1 decimal is sub-pixel at 320 px).
const n1 = v => Math.round(v * 10) / 10

// ═══════════════════════════════════════════════════════════════
// Per-frame renderer — writes straight into the SVG nodes
// ═══════════════════════════════════════════════════════════════
function createRenderer(nodes) {
  const m  = new Float64Array(9)
  const px = new Float64Array(9), py = new Float64Array(9), pz = new Float64Array(9) // FOL centres (rotated)
  const sx = new Float64Array(9), sy = new Float64Array(9)                            // FOL centres (projected)
  const ox = new Float64Array(6), oy = new Float64Array(6)                            // octahedron (projected)

  const project = (rx, ry, rz) => {
    const f = CAM_D / (CAM_D + rz * 0.30) * WIRE_SCALE
    return [CX + rx * f, CY - ry * f]
  }

  return function draw(delta, orbitT) {
    rotMatrix(m, BASE_ANGLE_Y + delta, BASE_TILT_X + delta * 0.15)

    // Sphere centres = centre + the 8 stella / cube vertices
    for (let i = 0; i < 9; i++) {
      const [x, y, z] = FOL_CENTERS[i]
      const rx = m[0] * x + m[1] * y + m[2] * z
      const ry = m[3] * x + m[4] * y + m[5] * z
      const rz = m[6] * x + m[7] * y + m[8] * z
      px[i] = rx; py[i] = ry; pz[i] = rz
      const f = CAM_D / (CAM_D + rz * 0.30) * WIRE_SCALE
      sx[i] = CX + rx * f; sy[i] = CY - ry * f
    }
    // Stella vertex k is FOL centre k+1
    const seg = (edges, off, from, to) => {
      let d = ''
      for (let e = from; e < to; e++) {
        const a = edges[e][0] + off, b = edges[e][1] + off
        d += `M${n1(sx[a])} ${n1(sy[a])}L${n1(sx[b])} ${n1(sy[b])}`
      }
      return d
    }
    nodes.stellaA.setAttribute('d', seg(STELLA_E, 1, 0, 6))
    nodes.stellaB.setAttribute('d', seg(STELLA_E, 1, 6, 12))
    nodes.cube.setAttribute('d', seg(COMP_CUBE_E, 1, 0, COMP_CUBE_E.length))
    nodes.folEdges.setAttribute('d', seg(FOL_CENTERS_E, 0, 0, FOL_CENTERS_E.length))

    // Inner octahedron: unit axis vertices, so rotated vertex = ±column of m
    for (let i = 0; i < 6; i++) {
      const axis = i >> 1, sgn = i & 1 ? -1 : 1
      const [x, y] = project(sgn * m[axis], sgn * m[3 + axis], sgn * m[6 + axis])
      ox[i] = x; oy[i] = y
    }
    let od = ''
    for (const [a, b] of INNER_OCT_E) od += `M${n1(ox[a])} ${n1(oy[a])}L${n1(ox[b])} ${n1(oy[b])}`
    nodes.oct.setAttribute('d', od)

    // Sphere rings: centre + r·(cos·u + sin·v), with u, v rotated unit axes
    let k = 0
    for (let s = 0; s < 9; s++) {
      for (const [ua, va] of RING_PLANES) {
        const ux = m[ua] * SQ3_2, uy = m[3 + ua] * SQ3_2, uz = m[6 + ua] * SQ3_2
        const vx = m[va] * SQ3_2, vy = m[3 + va] * SQ3_2, vz = m[6 + va] * SQ3_2
        let d = ''
        for (let i = 0; i < RING_N; i++) {
          const c = RING_COS[i], sn = RING_SIN[i]
          const rz = pz[s] + c * uz + sn * vz
          const f = CAM_D / (CAM_D + rz * 0.30) * WIRE_SCALE
          d += (i ? 'L' : 'M') + n1(CX + (px[s] + c * ux + sn * vx) * f) + ' ' + n1(CY - (py[s] + c * uy + sn * vy) * f)
        }
        nodes.rings[k++].setAttribute('d', d + 'Z')
      }
    }

    // Orbiting dots: centre + √3/2·(cos·x̂ + sin·(ŷ+ẑ)/√2)
    for (let i = 0; i < 9; i++) {
      const angle = orbitT * 1.8 + (i / 9) * Math.PI * 2
      const c = Math.cos(angle) * SQ3_2, sn = Math.sin(angle) * SQ3_2 * S2
      const rx = px[i] + c * m[0] + sn * (m[1] + m[2])
      const ry = py[i] + c * m[3] + sn * (m[4] + m[5])
      const rz = pz[i] + c * m[6] + sn * (m[7] + m[8])
      const [x, y] = project(rx, ry, rz)
      const dot = nodes.dots[i]
      dot.setAttribute('cx', n1(x))
      dot.setAttribute('cy', n1(y))
      dot.setAttribute('r', n1(Math.max(1.2, 3.0 - rz * 0.40)))
      dot.setAttribute('fill-opacity', Math.round(Math.max(0.06, 0.90 - rz * 0.30) * 100) / 100)
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════
const green  = '#86B894'   // circles / rings / FOL spheres
const blue   = '#8A6FE0'   // triangle A / tetra A
const red    = '#E07A85'   // triangle B / tetra B
const amber  = '#E9C766'   // hexagon + 3 spokes / cube
const purple = '#8A6FE0'   // inner hexagon / inner octahedron (violet)
const white  = '#FFFFFF'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const BreathingGeometric = memo(function BreathingGeometric({ phase = 'rest', phaseDuration = 4 }) {

  // ── Stages ───────────────────────────────────────────────────
  // 0 rest | 1 star (2-D forms) | 2 active-3D | 3 hold-out (aligned)
  const stage =
    (phase === 'inhale-stomach' || phase === 'exhale-chest')                       ? 1 :
    (phase === 'inhale-chest'   || phase === 'hold' || phase === 'exhale-stomach') ? 2 :
    phase === 'hold-out'                                                            ? 3 : 0

  const FADE    = '1.2s cubic-bezier(0.45, 0, 0.2, 1)'
  // 2D elements and 3D elements crossfade together in 0.4s when stage switches
  const FADE_XF  = stage >= 2 ? '0.4s ease' : FADE  // used by both 2D out and 3D in
  const isStar = stage >= 1

  // ── Stage-based colours (white → colour at stage 1) ─────────────
  const cCircle = isStar ? green  : white
  const cTriA   = isStar ? blue   : white
  const cTriB   = isStar ? red    : white
  const cAmber  = isStar ? amber  : white
  const cPurple = isStar ? purple : white

  // ── Opacities  [rest, star, active-3D, hold-out] ──────────────
  const ringOp     = [0.30, 0.70, 0.20, 0.35][stage]
  const triAOp     = [0.60, 1.00, 0.00, 0.00][stage]
  const triBOp     = [0.00, 1.00, 0.00, 0.00][stage]
  const hexOp      = [0.00, 0.90, 0.00, 0.00][stage]
  const spokesOp   = [0.00, 1.00, 0.00, 0.00][stage]
  const innerHexOp = [0.00, 0.80, 0.00, 0.00][stage]
  const folOp2D    = [0.00, 0.75, 0.00, 0.00][stage]
  const wireOp     = [0.00, 0.00, 0.88, 0.88][stage]
  const folOp3D    = [0.00, 0.00, 0.68, 0.68][stage]
  const auraScl    = [1.00, 1.45, 1.90, 1.65][stage]

  // Triangle B spins 180° into place
  const triBSpinDeg = isStar ? 180 : 0

  // ── 3-D rotation state ────────────────────────────────────────
  const rotMode =
    (phase === 'inhale-chest' || phase === 'hold') ? 'forward'   :
    phase === 'exhale-stomach'                      ? 'returning' : 'stopped'

  // Mutable animation state (never triggers a render). The loop writes to
  // the SVG nodes tagged data-geo, found once after mount.
  const svgRef  = useRef(null)
  const animRef = useRef({ delta: 0, orbitT: 0, mode: 'stopped', modeStart: 0, startDelta: 0, phaseDur: 4, draw: null })
  useEffect(() => { animRef.current.phaseDur = phaseDuration }, [phaseDuration])

  // Rotation mode changes
  useEffect(() => {
    const anim = animRef.current
    anim.mode = rotMode
    if (rotMode === 'stopped' || rotMode === 'forward') anim.delta = 0
    if (rotMode === 'returning') {
      anim.modeStart  = performance.now()
      anim.startDelta = Math.max(anim.delta, 0.001)
    }
    anim.draw?.(anim.delta, anim.orbitT)
  }, [rotMode])

  // Animation loop — runs only while the 3-D layer is visible (plus the
  // 0.4 s crossfade out), never while the 2-D forms are on their own.
  // requestAnimationFrame already stops when the tab is hidden; dt is
  // clamped so coming back doesn't jump.
  const show3D = stage >= 2
  useEffect(() => {
    const anim = animRef.current
    if (!anim.draw) {
      const q = sel => svgRef.current.querySelector(`[data-geo="${sel}"]`)
      anim.draw = createRenderer({
        stellaA: q('stella-a'), stellaB: q('stella-b'), cube: q('cube'), oct: q('oct'), folEdges: q('fol-edges'),
        rings: [...svgRef.current.querySelectorAll('[data-geo="ring"]')],
        dots:  [...svgRef.current.querySelectorAll('[data-geo="dot"]')],
      })
    }
    if (stage === 0) anim.orbitT = 0
    anim.draw(anim.delta, anim.orbitT)
    if (prefersReducedMotion()) return

    let raf = 0, last = 0, stopAt = show3D ? Infinity : performance.now() + 450
    if (!show3D && stage === 0) return
    const tick = (now) => {
      if (now > stopAt) return
      raf = requestAnimationFrame(tick)
      if (last && now - last < MIN_FRAME_MS) return
      const dt = last ? Math.min(now - last, 50) / 1000 : 0
      last = now
      anim.orbitT += ORBIT_RATE * dt
      if (anim.mode === 'forward') anim.delta += SPIN_RATE * dt
      else if (anim.mode === 'returning') {
        const totalMs = Math.max(anim.phaseDur, 2) * 1000
        const p = Math.max(0, (totalMs - (now - anim.modeStart)) / totalMs)
        anim.delta = anim.startDelta * p * p
        if (p === 0) anim.mode = 'stopped'
      }
      anim.draw(anim.delta, anim.orbitT)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [show3D, stage])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg ref={svgRef} viewBox="0 0 400 400" width="100%" height="100%" fill="none" style={{ overflow: 'visible' }}>

        <defs>
          <filter id="geo-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Wide radial falloff stands in for the old 24px blur on the aura:
              same soft edge, no filter pass while it scales. */}
          <radialGradient id="geo-aura-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={green} stopOpacity="0.12"/>
            <stop offset="55%"  stopColor={green} stopOpacity="0.07"/>
            <stop offset="100%" stopColor={green} stopOpacity="0"/>
          </radialGradient>
          <style>{`
            @keyframes amber-flicker {
              0%,100% { opacity:1.00; }
              20%     { opacity:0.80; }
              45%     { opacity:0.95; }
              70%     { opacity:0.75; }
            }
            @keyframes circle-breathe {
              0%,100% { opacity:0.85; }
              50%     { opacity:1.00; }
            }
            .flicker  { animation: amber-flicker  2.4s ease-in-out infinite; }
            .breathe  { animation: circle-breathe 3.0s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .flicker, .breathe { animation: none; }
            }
          `}</style>
        </defs>

        {/* Ambient aura */}
        <g style={{
          transformOrigin: `${CX}px ${CY}px`,
          transform: `scale(${auraScl})`,
          transition: `transform ${FADE}`,
        }}>
          <circle cx={CX} cy={CY} r={140} fill="url(#geo-aura-fill)" />
        </g>

        {/* ── Outer rings (green, always visible) ────────────────── */}
        {[R1, R2, R3].map((r, i) => (
          <circle key={i} cx={CX} cy={CY} r={r}
            stroke={cCircle}
            strokeWidth={i === 2 ? 1.4 : 0.8}
            strokeOpacity={ringOp * (i === 2 ? 1.0 : i === 1 ? 0.75 : 0.55)}
            className={isStar ? 'breathe' : undefined}
            style={{ transition: `stroke ${FADE}, stroke-opacity ${FADE}` }}
          />
        ))}

        {/* ══════════════════════════════════════════════════════════
            ① 2-D FLOWER OF LIFE  [GREEN CIRCLES]
        ══════════════════════════════════════════════════════════ */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: folOp2D }}>
          {FOL_2D.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={R3}
              stroke={cCircle}
              strokeWidth={i === 0 ? 1.3 : 0.8}
              strokeOpacity={i === 0 ? 0.90 : 0.55}
              style={{ transition: `stroke ${FADE}` }}
            />
          ))}
          {FOL_2D.slice(1).map(([x, y], i) => (
            <line key={i} x1={FOL_2D[0][0]} y1={FOL_2D[0][1]} x2={x} y2={y}
              stroke={cCircle} strokeWidth="0.4" strokeOpacity="0.18"
              style={{ transition: `stroke ${FADE}` }}
            />
          ))}
        </g>

        {/* ══════════════════════════════════════════════════════════
            ② INNER HEXAGON — octahedron intersection  [PURPLE]
        ══════════════════════════════════════════════════════════ */}
        <polygon points={INNER_HEX_PTS}
          stroke={cPurple} strokeWidth="1.1" strokeLinejoin="round"
          filter="url(#geo-glow)"
          style={{ transition: `opacity ${FADE_XF}, stroke ${FADE}`, opacity: innerHexOp }}
        />

        {/* ══════════════════════════════════════════════════════════
            ③ TRIANGLE A — upward  [BLUE]
        ══════════════════════════════════════════════════════════ */}
        <polygon points={TRI_PTS}
          stroke={cTriA} strokeWidth="1.3" strokeLinejoin="round"
          filter="url(#geo-glow)"
          style={{ transition: `opacity ${FADE_XF}, stroke ${FADE}`, opacity: triAOp }}
        />

        {/* ══════════════════════════════════════════════════════════
            ④ TRIANGLE B — spins 180° to form hexagram  [RED]
        ══════════════════════════════════════════════════════════ */}
        <g style={{
          transformOrigin: `${CX}px ${CY}px`,
          transform: `rotate(${triBSpinDeg}deg)`,
          transition: `opacity ${FADE_XF}, transform ${FADE}`, opacity: triBOp,
        }}>
          <polygon points={TRI_PTS}
            stroke={cTriB} strokeWidth="1.3" strokeLinejoin="round"
            strokeOpacity="0.88"
            style={{ transition: `stroke ${FADE}` }}
          />
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑤ OUTER HEXAGON + ⑥ 3 SPOKES  [AMBER]
            Removed from DOM entirely at stage 2+ — can't show through
        ══════════════════════════════════════════════════════════ */}
        {stage < 2 && (
          <polygon points={HEX_PTS}
            stroke={cAmber} strokeWidth="1.1" strokeLinejoin="round"
            filter="url(#geo-glow)"
            className={isStar ? 'flicker' : undefined}
            style={{ transition: `stroke ${FADE}`, opacity: hexOp }}
          />
        )}
        {stage < 2 && (
          <g className={isStar ? 'flicker' : undefined}
             filter="url(#geo-glow)"
             style={{ opacity: spokesOp, transition: `opacity ${FADE}` }}>
            {TRI_A_TIPS.map(([x, y], i) => (
              <line key={i} x1={x} y1={y} x2={CX} y2={CY}
                stroke={cAmber} strokeWidth="2.0" strokeLinecap="round"
                style={{ transition: `stroke ${FADE}` }} />
            ))}
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════
            ⑦ 3-D SPHERE CLUSTER — FOL  [GREEN]
            Paths are written by the animation loop, not by React.
        ══════════════════════════════════════════════════════════ */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: folOp3D }}>
          <path data-geo="fol-edges"
            stroke={green} strokeWidth="0.5" strokeOpacity="0.20" strokeLinecap="round" />
          {Array.from({ length: 27 }, (_, i) => (
            <path key={i} data-geo="ring"
              stroke={green} strokeWidth="0.8" strokeOpacity="0.65" strokeLinejoin="round" />
          ))}
        </g>

        {/* Orbiting dots — one glow pass for all nine */}
        <g filter="url(#geo-glow)" style={{ transition: `opacity ${FADE_XF}`, opacity: folOp3D }}>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} data-geo="dot" fill={green} />
          ))}
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑧ 3-D STELLA OCTANGULA (tetra A blue, tetra B red)
            ⑨ 3-D CUBE — outer frame  [AMBER]
            One glow pass for the whole group instead of one per edge.
        ══════════════════════════════════════════════════════════ */}
        <g filter="url(#geo-glow)" style={{ transition: `opacity ${FADE_XF}`, opacity: wireOp }}>
          <path data-geo="stella-a"
            stroke={blue} strokeWidth="1.2" strokeOpacity="0.88" strokeLinecap="round" />
          <path data-geo="stella-b"
            stroke={red} strokeWidth="1.2" strokeOpacity="0.88" strokeLinecap="round" />
          <path data-geo="cube"
            stroke={amber} strokeWidth="1.1" strokeOpacity="0.80" strokeLinecap="round" />
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑩ 3-D INNER OCTAHEDRON — intersection  [PURPLE]
        ══════════════════════════════════════════════════════════ */}
        <g filter="url(#geo-glow)" style={{ transition: `opacity ${FADE_XF}`, opacity: wireOp * 0.80 }}>
          <path data-geo="oct"
            stroke={purple} strokeWidth="1.0" strokeOpacity="0.75" strokeLinecap="round" />
        </g>

        {/* Centre dot — part of 2D forms, disappears with them at stage 2 */}
        <circle cx={CX} cy={CY} r="3.5"
          fill={isStar ? amber : white}
          fillOpacity="0.95"
          filter="url(#geo-glow)"
          style={{
            opacity: stage >= 2 ? 0 : 1,
            transition: `fill ${FADE}, opacity ${FADE_XF}`,
          }}
        />

      </svg>
    </div>
  )
})

import React, { useState, useEffect, useRef } from 'react'

// ═══════════════════════════════════════════════════════════════
// 3-D math
// ═══════════════════════════════════════════════════════════════
function rotY([x, y, z], a) {
  const c = Math.cos(a), s = Math.sin(a)
  return [x * c + z * s, y, -x * s + z * c]
}
function rotX([x, y, z], a) {
  const c = Math.cos(a), s = Math.sin(a)
  return [x, y * c - z * s, y * s + z * c]
}
function proj([x, y, z], cx, cy, scale, d = 4.5) {
  const f = d / (d + z * 0.30)
  return [cx + x * scale * f, cy - y * scale * f]
}
function buildWire(verts, edges, ay, ax, cx, cy, scale) {
  return edges.map(([a, b]) => {
    const va = rotX(rotY(verts[a], ay), ax)
    const vb = rotX(rotY(verts[b], ay), ax)
    const [x1, y1] = proj(va, cx, cy, scale)
    const [x2, y2] = proj(vb, cx, cy, scale)
    return { x1, y1, x2, y2 }
  })
}
function buildSphereRings(centers, sphRadius, ay, ax, cx, cy, scale, N = 24) {
  return centers.map(([scx, scy, scz]) => {
    const mkRing = (ptsFn) => Array.from({ length: N }, (_, i) => {
      const a = (i / N) * 2 * Math.PI
      const [ox, oy, oz] = ptsFn(a)
      return proj(rotX(rotY([scx + ox, scy + oy, scz + oz], ay), ax), cx, cy, scale)
    })
    return [
      mkRing(a => [sphRadius * Math.cos(a), sphRadius * Math.sin(a), 0]),
      mkRing(a => [sphRadius * Math.cos(a), 0, sphRadius * Math.sin(a)]),
      mkRing(a => [0, sphRadius * Math.cos(a), sphRadius * Math.sin(a)]),
    ]
  })
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
const COMP_CUBE_V = STELLA_V
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
// 2-D helpers
// ═══════════════════════════════════════════════════════════════
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
// Component
// ═══════════════════════════════════════════════════════════════
export function BreathingGeometric({ phase = 'rest', phaseDuration = 4 }) {

  // ── Colour palette ─────────────────────────────────────────────
  const green  = '#00E87A'   // circles / rings / FOL spheres
  const blue   = '#4499FF'   // triangle A / tetra A
  const red    = '#FF3355'   // triangle B / tetra B
  const amber  = '#FFB700'   // hexagon + 3 spokes / cube
  const purple = '#8B5CF6'   // inner hexagon / inner octahedron (violet)
  const white  = '#FFFFFF'

  // ── Stages ───────────────────────────────────────────────────
  // 0 rest | 1 star (2-D forms) | 2 active-3D | 3 hold-out (aligned)
  const stage =
    (phase === 'inhale-stomach' || phase === 'exhale-chest')                       ? 1 :
    (phase === 'inhale-chest'   || phase === 'hold' || phase === 'exhale-stomach') ? 2 :
    phase === 'hold-out'                                                            ? 3 : 0

  const FADE    = '1.2s cubic-bezier(0.45, 0, 0.2, 1)'
  // 2D elements and 3D elements crossfade together in 0.4s when stage switches
  const FADE_XF  = stage >= 2 ? '0.4s ease' : FADE  // used by both 2D out and 3D in
  const FADE_HEX = stage >= 2 ? '0s' : FADE          // hex + spokes: instant removal at stage 2
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

  // ── 3-D rotation state ────────────────────────────────────────
  const rotMode =
    (phase === 'inhale-chest' || phase === 'hold') ? 'forward'   :
    phase === 'exhale-stomach'                      ? 'returning' : 'stopped'

  const [delta, setDelta]     = useState(0)
  const deltaRef    = useRef(0)
  const rafRef      = useRef(null)
  const phaseDurRef = useRef(phaseDuration)
  phaseDurRef.current = phaseDuration

  const [orbitT, setOrbitT]   = useState(0)
  const orbitTRef   = useRef(0)
  const orbitRafRef = useRef(null)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    if (rotMode === 'stopped') { deltaRef.current = 0; setDelta(0); return }
    if (rotMode === 'forward') {
      deltaRef.current = 0; setDelta(0)
      let frame = 0
      const tick = () => {
        deltaRef.current += 0.018
        if (++frame % 2 === 0) setDelta(deltaRef.current)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafRef.current)
    }
    if (rotMode === 'returning') {
      const tStart     = performance.now()
      const startDelta = Math.max(deltaRef.current, 0.001)
      const totalMs    = Math.max(phaseDurRef.current, 2) * 1000
      let frame = 0
      const tick = (now) => {
        const elapsed = now - tStart
        if (elapsed >= totalMs) { deltaRef.current = 0; setDelta(0); return }
        const p = (totalMs - elapsed) / totalMs
        deltaRef.current = startDelta * p * p
        if (++frame % 2 === 0) setDelta(deltaRef.current)
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafRef.current)
    }
  }, [rotMode])

  const orbitActive = stage > 0
  useEffect(() => {
    cancelAnimationFrame(orbitRafRef.current)
    if (!orbitActive) { orbitTRef.current = 0; return }
    const tick = () => {
      orbitTRef.current += 0.007
      setOrbitT(orbitTRef.current)
      orbitRafRef.current = requestAnimationFrame(tick)
    }
    orbitRafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(orbitRafRef.current)
  }, [orbitActive])

  // ── Angles ────────────────────────────────────────────────────
  // Body-diagonal view: rotY(-π/4) + rotX(arctan(1/√2)) makes the stella/cube
  // project exactly to the hexagram/hexagon at delta=0. tiltX grows slowly so
  // the 3D orbit feels volumetric without over-tilting.
  const BASE_TILT_X = Math.atan(1 / Math.sqrt(2))   // ≈ 0.6155 rad (35.26°)
  const stellaAngle = -Math.PI / 4 + delta
  const tiltX       = BASE_TILT_X + delta * 0.15

  // ── Geometry ─────────────────────────────────────────────────
  const CX = 200, CY = 200
  const R1 = 120
  const R2 = R1 / Math.sqrt(2)            // ≈ 84.9
  const R3 = R2 / 2                        // ≈ 42.4

  // 3-D scales — all three share the same world-space scale so the inner
  // octahedron (vertices at distance 1) stays inside the stella (vertices
  // at distance √3) at every rotation angle.
  const WIRE_STELLA = R2 / Math.sqrt(3)   // Stella + cube  ≈ 49
  const WIRE_CUBE   = R2 / Math.sqrt(3)   // same — cube circumscribes Stella
  const WIRE_OCT    = WIRE_STELLA          // inner oct uses same scale → always inside

  // 2-D geometry
  // Triangle A: pointing up (-90° start)
  const triPts  = polyStr(3, CX, CY, R2, -90)
  // Hexagon: 6 vertices at same radius as hexagram tips, -90° start
  const hexPts  = polyStr(6, CX, CY, R2, -90)
  // Inner hexagon: intersection of the two triangles (octahedron projection)
  const innerHexPts = polyStr(6, CX, CY, R2 / Math.sqrt(3), 0)
  // Triangle A tip positions for the 3 radial spokes
  const triATips = ringPts(3, CX, CY, R2, -90)

  // Triangle B spins 180° into place
  const triBSpinDeg = isStar ? 180 : 0

  // 3-D wireframes
  const stellaLines  = buildWire(STELLA_V,    STELLA_E,    stellaAngle, tiltX, CX, CY, WIRE_STELLA)
  const cubeLines    = buildWire(COMP_CUBE_V,  COMP_CUBE_E, stellaAngle, tiltX, CX, CY, WIRE_CUBE)
  const octLines     = buildWire(INNER_OCT_V,  INNER_OCT_E, stellaAngle, tiltX, CX, CY, WIRE_OCT)

  // FOL 2-D projected centres (track stella rotation)
  const fCens = FOL_CENTERS.map(v =>
    proj(rotX(rotY(v, stellaAngle), tiltX), CX, CY, WIRE_STELLA)
  )
  const folEdgeLines = FOL_CENTERS_E.map(([a, b]) => ({
    x1: fCens[a][0], y1: fCens[a][1],
    x2: fCens[b][0], y2: fCens[b][1],
  }))
  const folSphereRings = buildSphereRings(FOL_CENTERS, SQ3_2, stellaAngle, tiltX, CX, CY, WIRE_STELLA)

  // Orbiting dots
  const dotPts = FOL_CENTERS.map(([scx, scy, scz], i) => {
    const phase = (i / FOL_CENTERS.length) * Math.PI * 2
    const angle = orbitT * 1.8 + phase
    const sa = Math.sin(angle)
    const rotated = rotX(rotY([
      scx + SQ3_2 * Math.cos(angle),
      scy + SQ3_2 * sa * S2,
      scz + SQ3_2 * sa * S2,
    ], stellaAngle), tiltX)
    const [sx, sy] = proj(rotated, CX, CY, WIRE_STELLA)
    const depth = rotated[2]
    return {
      x: sx, y: sy,
      opacity: Math.max(0.06, 0.90 - depth * 0.30),
      r:       Math.max(1.2,  3.0  - depth * 0.40),
    }
  })

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 400 400" width="100%" height="100%" fill="none" style={{ overflow: 'visible' }}>

        <defs>
          <filter id="geo-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="geo-glow-strong" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="geo-aura" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="24"/>
          </filter>
          <radialGradient id="geo-aura-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={green} stopOpacity="0.12"/>
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
          `}</style>
        </defs>

        {/* Ambient aura */}
        <g style={{
          transformOrigin: `${CX}px ${CY}px`,
          transform: `scale(${auraScl})`,
          transition: `transform ${FADE}`,
        }}>
          <circle cx={CX} cy={CY} r={110} fill="url(#geo-aura-fill)" filter="url(#geo-aura)" />
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
          {fCens.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={R3}
              stroke={cCircle}
              strokeWidth={i === 0 ? 1.3 : 0.8}
              strokeOpacity={i === 0 ? 0.90 : 0.55}
              style={{ transition: `stroke ${FADE}` }}
            />
          ))}
          {fCens.slice(1).map(([x, y], i) => (
            <line key={i} x1={fCens[0][0]} y1={fCens[0][1]} x2={x} y2={y}
              stroke={cCircle} strokeWidth="0.4" strokeOpacity="0.18"
              style={{ transition: `stroke ${FADE}` }}
            />
          ))}
        </g>

        {/* ══════════════════════════════════════════════════════════
            ② INNER HEXAGON — octahedron intersection  [PURPLE]
        ══════════════════════════════════════════════════════════ */}
        <polygon points={innerHexPts}
          stroke={cPurple} strokeWidth="1.1" strokeLinejoin="round"
          filter="url(#geo-glow)"
          style={{ transition: `opacity ${FADE_XF}, stroke ${FADE}`, opacity: innerHexOp }}
        />

        {/* ══════════════════════════════════════════════════════════
            ③ TRIANGLE A — upward  [BLUE]
        ══════════════════════════════════════════════════════════ */}
        <polygon points={triPts}
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
          <polygon points={triPts}
            stroke={cTriB} strokeWidth="1.3" strokeLinejoin="round"
            strokeOpacity="0.88"
            style={{ transition: `stroke ${FADE}` }}
          />
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑤ OUTER HEXAGON  [AMBER]  surrounds the hexagram
            Removed from DOM entirely at stage 2+ — can't show through
        ══════════════════════════════════════════════════════════ */}
        {stage < 2 && (
          <polygon points={hexPts}
            stroke={cAmber} strokeWidth="1.1" strokeLinejoin="round"
            filter="url(#geo-glow)"
            className={isStar ? 'flicker' : undefined}
            style={{ transition: `stroke ${FADE}`, opacity: hexOp }}
          />
        )}

        {/* ══════════════════════════════════════════════════════════
            ⑥ 3 SPOKES — Triangle A tips → centre  [AMBER]
            Removed from DOM entirely at stage 2+ — can't show through
        ══════════════════════════════════════════════════════════ */}
        {stage < 2 && (
          <g className={isStar ? 'flicker' : undefined}
             filter="url(#geo-glow)"
             style={{ opacity: spokesOp, transition: `opacity ${FADE}` }}>
            <line x1={triATips[0][0]} y1={triATips[0][1]} x2={CX} y2={CY}
              stroke={cAmber} strokeWidth="2.0" strokeLinecap="round"
              style={{ transition: `stroke ${FADE}` }} />
            <line x1={triATips[1][0]} y1={triATips[1][1]} x2={CX} y2={CY}
              stroke={cAmber} strokeWidth="2.0" strokeLinecap="round"
              style={{ transition: `stroke ${FADE}` }} />
            <line x1={triATips[2][0]} y1={triATips[2][1]} x2={CX} y2={CY}
              stroke={cAmber} strokeWidth="2.0" strokeLinecap="round"
              style={{ transition: `stroke ${FADE}` }} />
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════
            ⑦ 3-D SPHERE CLUSTER — FOL  [GREEN]
        ══════════════════════════════════════════════════════════ */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: folOp3D }}>
          {folEdgeLines.map(({ x1, y1, x2, y2 }, i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={green} strokeWidth="0.5" strokeOpacity="0.20"
              strokeLinecap="round"
            />
          ))}
          {folSphereRings.map((sphere, si) =>
            sphere.map((ring, ri) => (
              <polygon key={`fol-${si}-${ri}`}
                points={ring.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
                fill="none" stroke={green}
                strokeWidth="0.8"
                strokeOpacity="0.65"
                strokeLinejoin="round"
              />
            ))
          )}
        </g>

        {/* Orbiting dots */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: folOp3D }}>
          {dotPts.map(({ x, y, opacity, r }, i) => (
            <circle key={i} cx={x} cy={y} r={r}
              fill={green} fillOpacity={opacity}
              filter="url(#geo-glow)"
            />
          ))}
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑧ 3-D STELLA OCTANGULA — tetra A blue, tetra B red
        ══════════════════════════════════════════════════════════ */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: wireOp }}>
          {stellaLines.map(({ x1, y1, x2, y2 }, i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i < 6 ? blue : red}
              strokeWidth="1.2" strokeOpacity="0.88"
              strokeLinecap="round" filter="url(#geo-glow)"
            />
          ))}
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑨ 3-D CUBE — outer frame  [AMBER]
        ══════════════════════════════════════════════════════════ */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: wireOp }}>
          {cubeLines.map(({ x1, y1, x2, y2 }, i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={amber}
              strokeWidth="1.1" strokeOpacity="0.80"
              strokeLinecap="round" filter="url(#geo-glow)"
            />
          ))}
        </g>

        {/* ══════════════════════════════════════════════════════════
            ⑩ 3-D INNER OCTAHEDRON — intersection  [PURPLE]
        ══════════════════════════════════════════════════════════ */}
        <g style={{ transition: `opacity ${FADE_XF}`, opacity: wireOp * 0.80 }}>
          {octLines.map(({ x1, y1, x2, y2 }, i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={purple}
              strokeWidth="1.0" strokeOpacity="0.75"
              strokeLinecap="round" filter="url(#geo-glow)"
            />
          ))}
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
}

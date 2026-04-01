import React from 'react'

export function MandalaAnimation({ color = '#c9a84c', size = 240 }) {
  const r = size / 2
  const petals = 8
  const petalRadius = r * 0.35

  const paths = Array.from({ length: petals }, (_, i) => {
    const angle = (i * 2 * Math.PI) / petals
    const cx = r + Math.cos(angle) * (r * 0.5)
    const cy = r + Math.sin(angle) * (r * 0.5)
    return { cx, cy, angle }
  })

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-mandala"
        style={{ opacity: 0.7 }}
      >
        {/* Outer ring */}
        <circle cx={r} cy={r} r={r - 4} fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.3" />
        {/* Inner rings */}
        <circle cx={r} cy={r} r={r * 0.7} fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx={r} cy={r} r={r * 0.45} fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.25" />
        <circle cx={r} cy={r} r={r * 0.2} fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Petals */}
        {paths.map((p, i) => (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={petalRadius * 0.4}
            ry={petalRadius}
            fill="none"
            stroke={color}
            strokeWidth="0.75"
            strokeOpacity="0.5"
            transform={`rotate(${(p.angle * 180) / Math.PI + 90}, ${p.cx}, ${p.cy})`}
          />
        ))}

        {/* Spokes */}
        {paths.map((p, i) => (
          <line
            key={`spoke-${i}`}
            x1={r}
            y1={r}
            x2={p.cx}
            y2={p.cy}
            stroke={color}
            strokeWidth="0.5"
            strokeOpacity="0.2"
          />
        ))}

        {/* Center dot */}
        <circle cx={r} cy={r} r={3} fill={color} fillOpacity="0.6" />
      </svg>

      {/* Counter-rotating inner layer */}
      <div
        className="absolute inset-0 animate-mandala-counter"
        style={{ transform: 'scale(0.6) translate(33%, 33%)' }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * 2 * Math.PI) / 6
            const cx2 = r + Math.cos(a) * (r * 0.45)
            const cy2 = r + Math.sin(a) * (r * 0.45)
            return (
              <circle
                key={i}
                cx={cx2}
                cy={cy2}
                r={r * 0.08}
                fill="none"
                stroke={color}
                strokeWidth="0.75"
                strokeOpacity="0.5"
              />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

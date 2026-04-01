import React, { useRef, useEffect } from 'react'

export function WaveformCanvas({ isRunning, frequency = 200, beatFreq = 6, width = 320, height = 80 }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = (timestamp) => {
      timeRef.current = timestamp / 1000
      ctx.clearRect(0, 0, width, height)

      if (!isRunning) {
        // Static wave
        ctx.strokeStyle = '#252836'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.stroke()
        return
      }

      const t = timeRef.current

      // Left wave
      ctx.strokeStyle = '#3b82f680'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const phase = (x / width) * 4 * Math.PI + t * frequency * 0.02
        const y = height / 2 + Math.sin(phase) * (height * 0.3)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Right wave (slightly offset frequency for binaural effect)
      ctx.strokeStyle = '#a855f780'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let x = 0; x < width; x++) {
        const phase = (x / width) * 4 * Math.PI + t * (frequency + beatFreq) * 0.02
        const y = height / 2 + Math.sin(phase) * (height * 0.3)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isRunning, frequency, beatFreq, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-xl bg-bg-surface border border-border w-full"
      style={{ maxWidth: '100%' }}
    />
  )
}

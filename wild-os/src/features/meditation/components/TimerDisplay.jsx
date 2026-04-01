import React from 'react'
import { formatDuration } from '@utils/formatters'

export function TimerDisplay({ remaining, total }) {
  const mins = Math.floor(remaining / 60)
  const secs = Math.floor(remaining % 60)

  return (
    <div className="text-center">
      <p className="font-mono text-5xl font-light text-text-primary tracking-widest">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </p>
      <p className="text-text-faint text-xs mt-2">{formatDuration(total)} total</p>
    </div>
  )
}

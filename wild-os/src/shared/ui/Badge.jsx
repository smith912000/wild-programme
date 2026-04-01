import React from 'react'

const tierColors = {
  T1: { bg: 'bg-amber-900/30', text: 'text-accent-gold', border: 'border-accent-gold/30' },
  T2: { bg: 'bg-blue-900/30', text: 'text-accent-blue', border: 'border-accent-blue/30' },
  T3: { bg: 'bg-purple-900/30', text: 'text-accent-purple', border: 'border-accent-purple/30' },
}

const statusColors = {
  green: { bg: 'bg-green-900/30', text: 'text-accent-green', border: 'border-accent-green/30' },
  amber: { bg: 'bg-amber-900/30', text: 'text-accent-amber', border: 'border-accent-amber/30' },
  red: { bg: 'bg-red-900/30', text: 'text-accent-red', border: 'border-accent-red/30' },
  blue: { bg: 'bg-blue-900/30', text: 'text-accent-blue', border: 'border-accent-blue/30' },
  purple: { bg: 'bg-purple-900/30', text: 'text-accent-purple', border: 'border-accent-purple/30' },
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 rounded-md',
  md: 'text-xs px-2.5 py-1 rounded-lg',
}

export function Badge({ children, variant = 'plain', tier, status, size = 'md', className = '' }) {
  let colorCls = 'bg-bg-surface text-text-muted border-border'

  if (variant === 'tier' && tier && tierColors[tier]) {
    const c = tierColors[tier]
    colorCls = `${c.bg} ${c.text} border ${c.border}`
  } else if (variant === 'status' && status && statusColors[status]) {
    const c = statusColors[status]
    colorCls = `${c.bg} ${c.text} border ${c.border}`
  } else if (variant === 'plain') {
    colorCls = 'bg-bg-surface text-text-muted border border-border'
  }

  const sizeCls = sizeClasses[size] || sizeClasses.md

  return (
    <span className={`inline-flex items-center font-medium ${sizeCls} ${colorCls} ${className}`}>
      {children}
    </span>
  )
}

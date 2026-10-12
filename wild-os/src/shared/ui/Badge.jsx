import React from 'react'

const statusColors = {
  green:  { bg: 'bg-accent-green/10',  text: 'text-accent-green',  border: 'border-accent-green/30' },
  amber:  { bg: 'bg-accent-amber/10',  text: 'text-accent-amber',  border: 'border-accent-amber/30' },
  red:    { bg: 'bg-accent-red/10',    text: 'text-accent-red',    border: 'border-accent-red/30' },
  blue:   { bg: 'bg-accent-blue/10',   text: 'text-accent-blue',   border: 'border-accent-blue/30' },
  purple: { bg: 'bg-accent-purple/10', text: 'text-accent-purple', border: 'border-accent-purple/30' },
  gold:   { bg: 'bg-accent-gold/10',   text: 'text-accent-gold',   border: 'border-accent-gold/30' },
}

const sizeClasses = {
  sm: 'text-[10px] px-2 py-0.5 rounded-full tracking-wider uppercase',
  md: 'text-xs px-2.5 py-1 rounded-full',
}

export function Badge({ children, variant = 'plain', status, size = 'md', className = '' }) {
  let colorCls = 'bg-bg-surface text-text-muted border border-border'

  if (variant === 'status' && status && statusColors[status]) {
    const c = statusColors[status]
    colorCls = `${c.bg} ${c.text} border ${c.border}`
  }

  const sizeCls = sizeClasses[size] || sizeClasses.md

  return (
    <span className={`inline-flex items-center font-medium ${sizeCls} ${colorCls} ${className}`}>
      {children}
    </span>
  )
}

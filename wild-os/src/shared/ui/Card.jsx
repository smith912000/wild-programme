import React from 'react'

export function Card({
  children,
  glow = false,
  as: Tag = 'div',
  className = '',
  onClick,
  ...props
}) {
  const base = 'bg-bg-card border border-border rounded-2xl card-depth'
  const glowCls = glow ? 'animate-glow-gold' : ''
  const clickCls = onClick || Tag === 'button'
    ? 'cursor-pointer hover:border-border-subtle hover:bg-bg-surface/60 transition-all duration-150 active:scale-[0.98] active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue'
    : ''

  return (
    <Tag
      className={`${base} ${glowCls} ${clickCls} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Tag>
  )
}

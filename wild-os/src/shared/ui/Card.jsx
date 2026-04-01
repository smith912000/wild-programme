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
    ? 'cursor-pointer hover:border-border-subtle hover:bg-bg-surface/40 transition-all duration-150 active:scale-[0.97] active:brightness-95'
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

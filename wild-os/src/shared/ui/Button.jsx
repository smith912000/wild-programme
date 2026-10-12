import React from 'react'

// One gold button per screen. Everything else is secondary (indigo outline) or ghost.
const variantClasses = {
  primary:   'bg-accent-indigo text-white hover:bg-accent-blue active:brightness-90',
  secondary: 'bg-accent-indigo/10 border border-border-subtle text-text-primary hover:bg-accent-indigo/20 hover:border-accent-blue active:brightness-90',
  ghost:     'bg-transparent text-text-muted hover:text-text-primary hover:bg-bg-surface active:bg-border',
  danger:    'bg-accent-red/90 text-bg-deep hover:bg-accent-red active:brightness-90',
  gold:      'bg-accent-gold text-bg-deep font-semibold hover:brightness-110 active:brightness-90',
}

const sizeClasses = {
  sm: 'px-3.5 py-1.5 text-sm rounded-full gap-1.5 min-h-9',
  md: 'px-5 py-2.5 text-sm rounded-full gap-2 min-h-11',
  lg: 'px-6 py-3.5 text-base rounded-full gap-2 min-h-12',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  as,
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-body font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97]'
  const variantCls = variantClasses[variant] || variantClasses.primary
  const sizeCls = sizeClasses[size] || sizeClasses.md
  const widthCls = fullWidth ? 'w-full' : ''
  const cls = `${base} ${variantCls} ${sizeCls} ${widthCls} ${className}`

  // as="span" renders a button-shaped span, for use inside a link
  if (as === 'span') return <span className={cls} {...props}>{children}</span>

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cls}
      {...props}
    >
      {loading && (
        <svg className="animate-spin-fast w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  )
}

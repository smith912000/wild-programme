import React from 'react'

const variantClasses = {
  primary:   'bg-accent-blue/90 text-white hover:bg-accent-blue active:brightness-90',
  secondary: 'bg-bg-surface border border-border text-text-primary hover:border-border-subtle hover:bg-bg-surface/80 active:brightness-90',
  ghost:     'bg-transparent text-text-muted hover:text-text-primary hover:bg-bg-surface active:bg-border',
  danger:    'bg-accent-red/90 text-white hover:bg-accent-red active:brightness-90',
  gold:      'bg-accent-gold text-bg-deep font-semibold hover:brightness-110 active:brightness-90',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-2xl gap-2',
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
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-display font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97]'
  const variantCls = variantClasses[variant] || variantClasses.primary
  const sizeCls = sizeClasses[size] || sizeClasses.md
  const widthCls = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variantCls} ${sizeCls} ${widthCls} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin-fast w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  )
}

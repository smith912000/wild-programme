import React, { useState } from 'react'

export function Input({
  label,
  error,
  type = 'text',
  textarea = false,
  rows = 4,
  className = '',
  inputClassName = '',
  id,
  ...props
}) {
  const [showPw, setShowPw] = useState(false)
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const isPassword = type === 'password'
  const actualType = isPassword ? (showPw ? 'text' : 'password') : type

  const baseInput = `w-full bg-bg-surface border ${error ? 'border-accent-red' : 'border-border'} rounded-xl px-4 py-3 text-text-primary placeholder-text-faint focus:outline-none focus:border-accent-blue/60 transition-colors text-sm`

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-text-muted text-sm font-medium">
          {label}
        </label>
      )}
      <div className="relative">
        {textarea ? (
          <textarea
            id={inputId}
            rows={rows}
            className={`${baseInput} resize-none ${inputClassName}`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={actualType}
            className={`${baseInput} ${isPassword ? 'pr-10' : ''} ${inputClassName}`}
            {...props}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
            tabIndex={-1}
          >
            {showPw ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" />
                <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="text-accent-red text-xs">{error}</span>}
    </div>
  )
}

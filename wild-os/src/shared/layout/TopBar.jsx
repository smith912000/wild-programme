import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export function TopBar({ title, backTo, rightAction }) {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-border pt-safe"
      style={{ background: 'rgba(12,14,19,0.88)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-1 min-w-0">
          {backTo !== undefined && (
            <button
              onClick={() => backTo ? navigate(backTo) : navigate(-1)}
              className="p-1.5 rounded-lg text-text-faint hover:text-text-primary hover:bg-bg-surface transition-all duration-150 shrink-0 active:scale-95 group"
            >
              <ChevronLeft className="w-5 h-5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            </button>
          )}
          {title && (
            <h1 className="font-display font-semibold text-text-primary truncate ml-1">{title}</h1>
          )}
        </div>
        {rightAction && <div className="shrink-0 ml-2">{rightAction}</div>}
      </div>
    </header>
  )
}

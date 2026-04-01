import React, { useState, useRef, useEffect } from 'react'
import { Info } from 'lucide-react'

export function InfoTooltip({ text, title }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex items-center ml-1 align-middle">
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => { e.stopPropagation(); setOpen(v => !v) }}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); setOpen(v => !v) } }}
        className="text-text-faint hover:text-text-muted transition-colors focus:outline-none cursor-pointer"
        aria-label="More info"
      >
        <Info size={14} />
      </span>
      {open && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-xl border border-border bg-bg-surface shadow-lg p-3"
          style={{ maxWidth: 260 }}
        >
          {title && (
            <p className="text-text-primary text-xs font-semibold mb-1">{title}</p>
          )}
          <p className="text-text-muted text-xs leading-relaxed">{text}</p>
          {/* Arrow */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-bg-surface border-b border-r border-border" />
        </div>
      )}
    </span>
  )
}

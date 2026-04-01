import React from 'react'

/**
 * Horizontal scrollable pill-tab bar used inside hub pages.
 * tabs: [{ id, label, Icon? }]
 */
export function SubTabs({ tabs, active, onChange }) {
  return (
    <div
      className="flex overflow-x-auto gap-2 px-4 py-2.5 border-b border-white/5 scrollbar-hide shrink-0"
      style={{ background: 'rgba(13,15,20,0.6)', backdropFilter: 'blur(8px)' }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? 'bg-accent-gold/12 text-accent-gold border-accent-gold/30'
                : 'text-text-faint border-transparent hover:text-text-muted'
            }`}
          >
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

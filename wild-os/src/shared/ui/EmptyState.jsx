import React from 'react'

export function EmptyState({ icon: Icon, message, subMessage, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-text-faint" />
        </div>
      )}
      <p className="text-text-muted font-medium mb-1">{message}</p>
      {subMessage && <p className="text-text-faint text-sm mb-4">{subMessage}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

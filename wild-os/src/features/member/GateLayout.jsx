import React from 'react'

// Shared frame for the guest and lapsed screens.
export function GateLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
        <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="" width="72" height="72" className="rounded-2xl" />
        {children}
      </div>
    </div>
  )
}

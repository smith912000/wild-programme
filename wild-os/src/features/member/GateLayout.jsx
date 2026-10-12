import React from 'react'
import { Mark } from '@shared/ui/Mark'

// Shared frame for the guest, lapsed and callback screens: the mark on the night, content centred.
export function GateLayout({ children, mark = true }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6 animate-fade-in">
        {mark && <Mark size={64} />}
        {children}
      </div>
    </div>
  )
}

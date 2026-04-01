import React from 'react'

export function PageWrapper({ children, className = '', noPad = false }) {
  return (
    <main className={`flex-1 max-w-lg mx-auto w-full animate-fade-in ${noPad ? '' : 'px-4 py-4 pb-24'} ${className}`}>
      {children}
    </main>
  )
}

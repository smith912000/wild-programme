import React from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { TopBar } from './TopBar'

// Routes where we hide the BottomNav (full-screen experiences)
const HIDE_NAV_ROUTES = ['/breathe/session']

export function AppShell({ children, title, backTo, rightAction }) {
  const location = useLocation()
  const hideNav = HIDE_NAV_ROUTES.some(route => location.pathname.startsWith(route))

  return (
    <div className="min-h-screen flex flex-col">
      {title !== undefined && (
        <TopBar title={title} backTo={backTo} rightAction={rightAction} />
      )}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      {!hideNav && <BottomNav />}
    </div>
  )
}

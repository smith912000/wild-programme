import React from 'react'

/* Auth has been removed — every route is open. This guard is now a simple
   pass-through, kept so the route definitions in App.jsx don't need to change
   shape (and so it can be re-tightened later if accounts are reintroduced). */
export function AuthGuard({ children }) {
  return children
}

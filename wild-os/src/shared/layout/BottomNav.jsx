import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Activity, Moon, BookOpen, MoreHorizontal } from 'lucide-react'

// Which URL prefixes count as "active" for each nav item
const NAV_ITEMS = [
  {
    path: '/',
    label: 'Home',
    Icon: LayoutGrid,
    match: (p) => p === '/',
  },
  {
    path: '/practice',
    label: 'Practice',
    Icon: Activity,
    match: (p) => p.startsWith('/practice') || p.startsWith('/breathe') || p.startsWith('/meditate') || p.startsWith('/binaural') || p.startsWith('/hypnagogic'),
  },
  {
    path: '/sleep',
    label: 'Sleep',
    Icon: Moon,
    match: (p) => p.startsWith('/sleep') || p.startsWith('/sleep-calc') || p.startsWith('/sleep-env') || p.startsWith('/reality-check') || p.startsWith('/tracker') || p.startsWith('/supplements'),
  },
  {
    path: '/log',
    label: 'Log',
    Icon: BookOpen,
    match: (p) => p.startsWith('/log') || p.startsWith('/journal') || p.startsWith('/attempts') || p.startsWith('/analytics'),
  },
  {
    path: '/explore',
    label: 'Explore',
    Icon: MoreHorizontal,
    match: (p) => p.startsWith('/explore'),
  },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border pb-safe"
      style={{ background: 'rgba(13,15,20,0.92)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, label, Icon, match }) => {
          const active = match(location.pathname)
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 relative group"
            >
              <Icon
                className={`w-5 h-5 transition-all duration-200 ${
                  active ? 'text-accent-gold scale-110' : 'text-text-faint scale-100 group-hover:text-text-muted'
                }`}
                strokeWidth={active ? 2.5 : 1.75}
              />
              <span className={`text-[11px] font-display font-medium transition-colors duration-200 ${
                active ? 'text-accent-gold' : 'text-text-faint group-hover:text-text-muted'
              }`}>
                {label}
              </span>
              {active && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-5 rounded-full bg-accent-gold"
                  style={{ boxShadow: '0 0 8px rgba(201,168,76,0.8)' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

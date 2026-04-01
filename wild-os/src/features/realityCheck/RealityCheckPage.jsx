import React, { useState, useEffect, useRef } from 'react'
import { Eye, Bell } from 'lucide-react'
import { TierGate } from '@shared/guards/TierGate'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Card } from '@shared/ui/Card'
import { Button } from '@shared/ui/Button'
import { Toggle } from '@shared/ui/Toggle'
import { InfoTooltip } from '@shared/ui/InfoTooltip'

const TECHNIQUES = [
  { id: 'hand', label: 'Hand Check', desc: 'Count your fingers. In dreams, you often have more or fewer than 5.', instruction: 'Slowly count each finger. Count again. Do you have exactly 5 on each hand?' },
  { id: 'text', label: 'Text Re-read', desc: 'Read something, look away, read again. Dream text changes.', instruction: 'Find any text nearby. Read it clearly. Look away. Look back. Has the text changed?' },
  { id: 'nose', label: 'Nose Pinch', desc: 'Pinch your nose. In a dream you can still breathe.', instruction: 'Pinch your nose closed with your fingers. Try to breathe through it. Can you breathe?' },
  { id: 'mirror', label: 'Mirror Check', desc: 'Look at your reflection. Dream reflections are often distorted.', instruction: 'Look at your reflection. Is it completely normal? Or is something subtly wrong?' },
  { id: 'light', label: 'Light Switch', desc: 'Toggle a light switch. Dream lighting rarely responds normally.', instruction: 'Find a light switch. Turn it on. Turn it off. Does the light level change correctly?' },
]

const FREQUENCIES = [
  { value: 60, label: 'Every hour' },
  { value: 120, label: 'Every 2h' },
  { value: 180, label: 'Every 3h' },
  { value: 240, label: 'Every 4h' },
]

const STORAGE_KEY = 'wos_rc_scheduler_active'

export function RealityCheckContent() {
  const [selectedTech, setSelectedTech] = useState('hand')
  const [frequency, setFrequency] = useState(120)
  const [permission, setPermission] = useState(() => {
    if (typeof Notification === 'undefined') return 'unsupported'
    return Notification.permission
  })
  const [schedulerActive, setSchedulerActive] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || false } catch { return false }
  })
  const [activeCheck, setActiveCheck] = useState(false)
  const [checkCountdown, setCheckCountdown] = useState(10)
  const [log, setLog] = useState([])
  const intervalRef = useRef(null)

  const tech = TECHNIQUES.find(t => t.id === selectedTech)

  // Manage notification interval
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (schedulerActive && permission === 'granted') {
      intervalRef.current = setInterval(() => {
        try {
          new Notification('Reality Check', {
            body: `${tech?.label || 'Hand Check'} — Are you dreaming?`,
            icon: '/icons/icon-192.png',
            silent: false,
          })
        } catch (e) {
          console.warn('Notification error:', e)
        }
      }, frequency * 60 * 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [schedulerActive, permission, frequency, tech?.label])

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Notifications not supported in this browser')
      return
    }
    const perm = await Notification.requestPermission()
    setPermission(perm)
    if (perm === 'granted') {
      setSchedulerActive(true)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(true))
    }
  }

  const toggleScheduler = (v) => {
    if (v && permission !== 'granted') {
      handleRequestPermission()
      return
    }
    setSchedulerActive(v)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  }

  const handleDoCheck = () => {
    setActiveCheck(true)
    setCheckCountdown(10)
  }

  useEffect(() => {
    if (!activeCheck) return
    if (checkCountdown <= 0) {
      setActiveCheck(false)
      setLog(prev => [{ id: Date.now(), tech: selectedTech, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)])
      return
    }
    const t = setTimeout(() => setCheckCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [activeCheck, checkCountdown, selectedTech])

  const statusDot = permission === 'granted' && schedulerActive
    ? { color: 'text-accent-green', dot: 'bg-accent-green', label: 'Notifications active' }
    : permission === 'denied'
    ? { color: 'text-red-400', dot: 'bg-red-400', label: 'Permission denied' }
    : permission === 'unsupported'
    ? { color: 'text-text-faint', dot: 'bg-text-faint', label: 'Not supported' }
    : { color: 'text-text-faint', dot: 'bg-border', label: 'Not requested' }

  return (
    <PageWrapper>
        <TierGate feature="reality_check">
          <p className="text-text-muted text-sm mb-6">
            Train your waking awareness to recognise the dream state. Perform 10+ checks per day.
          </p>

          {/* Technique selector */}
          <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">Technique</h2>
          <div className="flex flex-col gap-2 mb-6">
            {TECHNIQUES.map(t => (
              <Card
                key={t.id}
                as="button"
                onClick={() => setSelectedTech(t.id)}
                className={`p-4 text-left ${selectedTech === t.id ? 'border-border-subtle' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-primary font-medium text-sm">{t.label}</p>
                    <p className="text-text-faint text-xs mt-0.5">{t.desc}</p>
                  </div>
                  {selectedTech === t.id && (
                    <div className="w-2 h-2 rounded-full bg-accent-gold shrink-0 ml-3" />
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Do check button */}
          {activeCheck ? (
            <div className="bg-bg-card border border-accent-blue/30 rounded-2xl p-6 text-center mb-6 animate-fade-in">
              <p className="text-accent-blue font-display font-bold text-5xl mb-4">{checkCountdown}</p>
              <p className="text-text-primary text-sm leading-relaxed">{tech?.instruction}</p>
            </div>
          ) : (
            <Button variant="gold" size="lg" fullWidth onClick={handleDoCheck} className="mb-6">
              <Eye className="w-5 h-5" /> Do Reality Check Now
            </Button>
          )}

          {/* Notifications scheduler */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-text-muted" />
                <p className="text-text-primary text-sm font-medium">
                  Scheduled Reminders
                  <InfoTooltip
                    title="Scheduled Reminders"
                    text="Sends a browser notification at the chosen interval to remind you to do a reality check. Notifications only fire while this page or app is open. For background alerts, add the app to your home screen."
                  />
                </p>
              </div>
              <Toggle
                checked={schedulerActive && permission === 'granted'}
                onChange={toggleScheduler}
              />
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${statusDot.dot}`} />
              <span className={`text-xs ${statusDot.color}`}>{statusDot.label}</span>
            </div>

            {permission !== 'granted' && permission !== 'denied' && (
              <Button variant="secondary" size="sm" onClick={handleRequestPermission} className="mb-3">
                Request Notification Permission
              </Button>
            )}

            {permission === 'denied' && (
              <p className="text-red-400 text-xs mb-2">
                Notifications are blocked. Enable them in your browser settings.
              </p>
            )}

            {permission === 'granted' && schedulerActive && (
              <div className="flex gap-2 flex-wrap mt-2">
                {FREQUENCIES.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFrequency(f.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      frequency === f.value
                        ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue'
                        : 'bg-bg-surface border-border text-text-muted'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            <p className="text-text-faint text-xs mt-3 leading-relaxed">
              Notifications only fire while this page/app is open. For background alerts, add the app to your home screen.
            </p>
          </div>

          {/* Log */}
          {log.length > 0 && (
            <>
              <h2 className="text-text-faint text-xs uppercase tracking-wider font-semibold mb-3">Today's Checks</h2>
              <div className="flex flex-col gap-2">
                {log.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-bg-surface border border-border rounded-xl px-4 py-2.5">
                    <p className="text-text-primary text-sm capitalize">{item.tech} check</p>
                    <span className="text-text-faint text-xs font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </TierGate>
      </PageWrapper>
  )
}

export function RealityCheckPage() {
  return <AppShell title="Reality Check"><RealityCheckContent /></AppShell>
}

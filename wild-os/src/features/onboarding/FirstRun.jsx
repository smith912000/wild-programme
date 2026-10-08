import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/ui/Button'
import { Input } from '@shared/ui/Input'
import { useMemberStore } from '@store/memberStore'
import { markOnboarded, saveSleepPrefs, getSleepPrefs } from '@store/onboardingStore'
import { useJournal } from '@hooks/useJournal'
import { format } from 'date-fns'

const STEPS = 3

export function FirstRun({ onDone }) {
  const navigate = useNavigate()
  const name = useMemberStore((s) => s.name)
  const prefs = getSleepPrefs()
  const [step, setStep] = useState(0)
  const [bedtime, setBedtime] = useState(prefs.bedtime || '23:00')
  const [wake, setWake] = useState(prefs.wake || '07:00')
  const [line, setLine] = useState('')
  const [saving, setSaving] = useState(false)
  const { createEntry } = useJournal()

  const finish = async (withLine) => {
    setSaving(true)
    saveSleepPrefs({ bedtime, wake })
    if (withLine && line.trim()) {
      await createEntry({
        title: `Dream — ${format(new Date(), 'MMM d, yyyy')}`,
        content: line.trim(),
      })
    }
    markOnboarded()
    onDone()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex gap-1.5" aria-label={`Step ${step + 1} of ${STEPS}`}>
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent-gold' : 'bg-border'}`} />
          ))}
        </div>

        {step === 0 && (
          <>
            <div>
              <h1 className="font-display font-bold text-2xl text-text-primary">
                {name ? `Welcome, ${name.split(' ')[0]}` : 'Welcome to WILD OS'}
              </h1>
              <p className="text-text-muted text-sm mt-3 leading-relaxed">
                This is where the practice happens. Breathe and meditate before sleep, log your nights, keep a dream
                journal and watch the pattern build. Everything you write stays on this device.
              </p>
            </div>
            <Button variant="gold" size="lg" fullWidth onClick={() => setStep(1)}>Continue</Button>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <h1 className="font-display font-bold text-2xl text-text-primary">Your usual sleep</h1>
              <p className="text-text-muted text-sm mt-3 leading-relaxed">
                The sleep calculator uses these to work out your best wake back to bed windows. You can change them later.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Input type="time" label="Usual bedtime" value={bedtime} onChange={(e) => setBedtime(e.target.value)} />
              <Input type="time" label="Usual wake time" value={wake} onChange={(e) => setWake(e.target.value)} />
            </div>
            <Button variant="gold" size="lg" fullWidth onClick={() => setStep(2)}>Continue</Button>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h1 className="font-display font-bold text-2xl text-text-primary">Write the first line</h1>
              <p className="text-text-muted text-sm mt-3 leading-relaxed">
                A fragment of last night's dream, or a sentence about why you are here. One line is enough.
              </p>
            </div>
            <textarea
              value={line}
              onChange={(e) => setLine(e.target.value)}
              rows={4}
              placeholder="I was walking through..."
              className="w-full rounded-xl bg-bg-surface border border-border text-text-primary text-sm p-3 focus:outline-none focus:border-accent-gold/60"
            />
            <div className="flex flex-col gap-2">
              <Button variant="gold" size="lg" fullWidth loading={saving} onClick={() => finish(true)}>
                {line.trim() ? 'Save and open the app' : 'Open the app'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

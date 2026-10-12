import React, { useEffect, useState } from 'react'
import { useMemberStore } from '@store/memberStore'
import { AppShell } from '@shared/layout/AppShell'
import { PageWrapper } from '@shared/layout/PageWrapper'
import { Button } from '@shared/ui/Button'
import { Spinner } from '@shared/ui/Spinner'
import { Mark } from '@shared/ui/Mark'
import { intake } from '@lib/intake'

// "Your path": a short guided intake. Answers go to The Wild Project (n8n, keyed by Whop user id),
// which answers with three opening directives. The same text is later sent as a Discord DM.
const QUESTIONS = [
  {
    key: 'aim', title: 'What calls you to the night?',
    options: [
      ['recall', 'To remember', 'My dreams slip away by morning'],
      ['lucid', 'To wake within', 'I want to know I am dreaming'],
      ['meaning', 'To understand', 'What my dreams are telling me'],
      ['rest', 'To rest', 'Deeper, steadier sleep'],
      ['spirit', 'To seek', 'The night as a spiritual practice'],
    ],
  },
  {
    key: 'track', title: 'Which way do you walk?',
    options: [
      ['science', 'Science', 'Sleep stages, the brain, method'],
      ['spirit', 'Spirit', 'Traditions, symbol, prayer'],
      ['both', 'Both', 'I want the whole picture'],
    ],
  },
  {
    key: 'recall', title: 'How often do you remember a dream?',
    options: [
      ['rarely', 'Rarely', 'Almost never'],
      ['monthly', 'Now and then', 'A few times a month'],
      ['weekly', 'Most weeks', 'Several times a week'],
      ['nightly', 'Most nights', 'They are vivid and close'],
    ],
  },
  {
    key: 'lucid', title: 'Have you known you were dreaming, while dreaming?',
    options: [
      ['never', 'Not yet', ''],
      ['once', 'Once or twice', ''],
      ['sometimes', 'Sometimes', ''],
      ['often', 'Often', ''],
    ],
  },
  {
    key: 'obstacle', title: 'What gets in the way?',
    options: [
      ['forgetting', 'Forgetting', 'It is gone before I can hold it'],
      ['tired', 'Tiredness', 'I wake too tired to practise'],
      ['irregular', 'Irregular sleep', 'Late nights, early starts, shifts'],
      ['doubt', 'Doubt', 'I am not sure it works for me'],
      ['fear', 'Fear', 'Sleep paralysis or nightmares'],
      ['time', 'Time', 'Life is full'],
    ],
  },
  {
    key: 'rhythm', title: 'When do you usually sleep?',
    options: [
      ['early', 'Before 10pm', ''],
      ['standard', '10pm to midnight', ''],
      ['late', 'After midnight', ''],
      ['shifts', 'It changes', 'Shifts or no fixed pattern'],
    ],
  },
  { key: 'remember', title: 'One thing you hope to remember', text: true, hint: 'A place, a person, a feeling. Optional.' },
  { key: 'strength', title: 'One thing you already know well', text: true, hint: 'A skill or practice you could share with others. Optional.' },
]

const LAST = QUESTIONS.length

export function PathPage() {
  const token = useMemberStore((s) => s.token)
  const [phase, setPhase] = useState('loading') // loading | ask | sending | reading | error
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [reading, setReading] = useState('')

  useEffect(() => {
    let live = true
    intake(token)
      .then((d) => {
        if (!live) return
        if (d.answers) setAnswers(d.answers)
        if (d.reading) { setReading(d.reading); setPhase('reading') } else setPhase('ask')
      })
      .catch(() => live && setPhase('ask'))
    return () => { live = false }
  }, [token])

  const choose = (key, value) => {
    setAnswers((a) => ({ ...a, [key]: value }))
    setTimeout(() => setStep((s) => s + 1), 180)
  }

  const send = async () => {
    setPhase('sending')
    try {
      const d = await intake(token, answers)
      setReading(d.reading)
      setPhase('reading')
    } catch {
      setPhase('error')
    }
  }

  const q = QUESTIONS[step]

  return (
    <AppShell title="Your path" backTo="/">
      <PageWrapper>
        {phase === 'loading' && <div className="flex justify-center py-16"><Spinner size="lg" /></div>}

        {phase === 'ask' && step < LAST && (
          <div className="flex flex-col gap-5" key={q.key}>
            <div className="flex gap-1.5" aria-label={`Question ${step + 1} of ${LAST}`}>
              {QUESTIONS.map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-accent-gold' : 'bg-border'}`} />
              ))}
            </div>
            {step === 0 && (
              <p className="text-text-muted text-sm leading-relaxed">
                Eight short questions. Your answers go to The Wild Project, who will answer with three directives shaped to you.
              </p>
            )}
            <h1 className="font-display text-3xl text-text-primary animate-fade-in">{q.title}</h1>

            {!q.text && (
              <div className="flex flex-col gap-2.5 animate-fade-in">
                {q.options.map(([value, label, sub]) => {
                  const on = answers[q.key] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => choose(q.key, value)}
                      className={`text-left rounded-2xl border px-4 py-3.5 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue ${on ? 'border-accent-gold bg-accent-gold/10' : 'border-border bg-bg-card hover:border-border-subtle'}`}
                    >
                      <span className="font-display text-xl text-text-primary">{label}</span>
                      {sub && <span className="block text-text-muted text-[13px] mt-0.5">{sub}</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {q.text && (
              <div className="flex flex-col gap-4 animate-fade-in">
                <p className="text-text-muted text-sm">{q.hint}</p>
                <textarea
                  rows={3}
                  maxLength={280}
                  value={answers[q.key] || ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q.key]: e.target.value }))}
                  className="w-full rounded-2xl bg-bg-card border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue"
                />
                <Button variant="gold" size="lg" fullWidth onClick={() => (step === LAST - 1 ? send() : setStep(step + 1))}>
                  {step === LAST - 1 ? 'Send to The Wild Project' : 'Continue'}
                </Button>
              </div>
            )}

            {step > 0 && (
              <button type="button" className="text-text-muted text-sm self-start" onClick={() => setStep(step - 1)}>Back</button>
            )}
          </div>
        )}

        {phase === 'sending' && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <Mark size={48} className="animate-pulse" />
            <p className="text-text-muted text-sm">The Wild Project is reading your answers.</p>
          </div>
        )}

        {phase === 'reading' && (
          <div className="flex flex-col gap-4">
            <Mark size={40} halo={false} />
            {reading.split('\n\n').map((p, i) => (
              <p
                key={i}
                className={`animate-fade-in leading-relaxed ${i === 0 ? 'font-display text-2xl text-text-primary' : p === 'The Wild Project' ? 'font-display text-accent-gold' : 'text-text-primary/90'}`}
                style={{ animationDelay: `${i * 350}ms`, animationFillMode: 'both' }}
              >
                {p}
              </p>
            ))}
            <Button variant="secondary" fullWidth onClick={() => { setStep(0); setPhase('ask') }}>
              Walk it again
            </Button>
            <p className="text-text-muted text-xs">Your answers are kept by The Wild Project against your Whop account, so the community can meet you where you are. Change them any time here.</p>
          </div>
        )}

        {phase === 'error' && (
          <div className="flex flex-col gap-4 py-10 text-center">
            <p className="text-text-primary">Your answers did not reach The Wild Project. Check your connection and try again.</p>
            <Button variant="gold" onClick={send}>Try again</Button>
          </div>
        )}
      </PageWrapper>
    </AppShell>
  )
}

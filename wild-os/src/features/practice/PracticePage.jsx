import React, { useState } from 'react'
import { Wind, Moon, Headphones, Sparkles } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { SubTabs } from '@shared/components/SubTabs'
import { BreathingContent } from '@features/breathing/BreathingPage'
import { MeditationContent } from '@features/meditation/MeditationPage'
import { BinauralContent } from '@features/binaural/BinauralPage'
import { HypnagogicContent } from '@features/hypnagogic/HypnagogicPage'

const TABS = [
  { id: 'breathe',   label: 'Breathe',    Icon: Wind },
  { id: 'meditate',  label: 'Meditate',   Icon: Moon },
  { id: 'binaural',  label: 'Binaural',   Icon: Headphones },
  { id: 'hypnagogic',label: 'Hypnagogic', Icon: Sparkles },
]

export function PracticePage() {
  const [active, setActive] = useState('breathe')

  return (
    <AppShell title="Practice">
      <SubTabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'breathe'    && <BreathingContent />}
      {active === 'meditate'   && <MeditationContent />}
      {active === 'binaural'   && <BinauralContent />}
      {active === 'hypnagogic' && <HypnagogicContent />}
    </AppShell>
  )
}

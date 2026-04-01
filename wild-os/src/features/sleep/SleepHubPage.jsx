import React, { useState } from 'react'
import { Calculator, Bed, Eye, CalendarCheck, FlaskConical } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { SubTabs } from '@shared/components/SubTabs'
import { SleepCalcContent } from '@features/sleepCalc/SleepCalcPage'
import { SleepEnvContent } from '@features/sleepEnv/SleepEnvPage'
import { RealityCheckContent } from '@features/realityCheck/RealityCheckPage'
import { TrackerContent } from '@features/tracker/TrackerPage'
import { SupplementContent } from '@features/supplements/SupplementPage'

const TABS = [
  { id: 'calc',    label: 'Sleep Calc',    Icon: Calculator },
  { id: 'env',     label: 'Environment',   Icon: Bed },
  { id: 'reality', label: 'Reality Check', Icon: Eye },
  { id: '7night',  label: '7-Night',       Icon: CalendarCheck },
  { id: 'supps',   label: 'Supplements',   Icon: FlaskConical },
]

export function SleepHubPage() {
  const [active, setActive] = useState('calc')

  return (
    <AppShell title="Sleep">
      <SubTabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'calc'    && <SleepCalcContent />}
      {active === 'env'     && <SleepEnvContent />}
      {active === 'reality' && <RealityCheckContent />}
      {active === '7night'  && <TrackerContent />}
      {active === 'supps'   && <SupplementContent />}
    </AppShell>
  )
}

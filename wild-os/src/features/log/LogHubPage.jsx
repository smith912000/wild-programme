import React, { useState } from 'react'
import { BookOpen, Target, BarChart2 } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { SubTabs } from '@shared/components/SubTabs'
import { JournalContent } from '@features/journal/JournalPage'
import { AttemptLogContent } from '@features/attemptLog/AttemptLogPage'
import { AnalyticsContent } from '@features/analytics/AnalyticsPage'

const TABS = [
  { id: 'journal',   label: 'Journal',   Icon: BookOpen },
  { id: 'attempts',  label: 'Attempts',  Icon: Target },
  { id: 'analytics', label: 'Analytics', Icon: BarChart2 },
]

export function LogHubPage() {
  const [active, setActive] = useState('journal')

  return (
    <AppShell title="Log">
      <SubTabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'journal'   && <JournalContent />}
      {active === 'attempts'  && <AttemptLogContent />}
      {active === 'analytics' && <AnalyticsContent />}
    </AppShell>
  )
}

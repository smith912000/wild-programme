import React, { useState } from 'react'
import { Sparkles, Layers, Calendar, Brain, Feather, Map, Clock, Moon } from 'lucide-react'
import { AppShell } from '@shared/layout/AppShell'
import { SubTabs } from '@shared/components/SubTabs'
import { SymbolLibraryContent } from '@features/symbolLibrary/SymbolLibraryPage'
import { ProtocolsContent } from '@features/protocols/ProtocolsPage'
import { RitualsContent } from '@features/rituals/RitualsPage'
import { ShadowWorkContent } from '@features/shadowWork/ShadowWorkPage'
import { IntegrationContent } from '@features/integration/IntegrationPage'
import { IncubationContent } from '@features/incubation/IncubationPage'
import { RetreatContent } from '@features/retreat/RetreatPage'
import { TimelineContent } from '@features/timeline/TimelinePage'

const TABS = [
  { id: 'symbols',    label: 'Symbols',    Icon: Sparkles },
  { id: 'protocols',  label: 'Protocols',  Icon: Layers   },
  { id: 'rituals',    label: 'Rituals',    Icon: Calendar },
  { id: 'shadow',     label: 'Shadow',     Icon: Brain    },
  { id: 'incubation', label: 'Incubation', Icon: Moon     },
  { id: 'integrate',  label: 'Integrate',  Icon: Feather  },
  { id: 'retreat',    label: 'Retreat',    Icon: Map      },
  { id: 'timeline',   label: 'Timeline',   Icon: Clock    },
]

export function ExplorePage() {
  const [active, setActive] = useState('symbols')

  return (
    <AppShell title="Explore">
      <SubTabs tabs={TABS} active={active} onChange={setActive} />
      {active === 'symbols'    && <SymbolLibraryContent />}
      {active === 'protocols'  && <ProtocolsContent />}
      {active === 'rituals'    && <RitualsContent />}
      {active === 'shadow'     && <ShadowWorkContent />}
      {active === 'incubation' && <IncubationContent />}
      {active === 'integrate'  && <IntegrationContent />}
      {active === 'retreat'    && <RetreatContent />}
      {active === 'timeline'   && <TimelineContent />}
    </AppShell>
  )
}

import { BootScreen } from '@shared/ui/BootScreen'
import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MemberGate } from '@features/member/MemberGate'
import { CallbackPage } from '@features/member/CallbackPage'

// Lazy-load all feature pages. Each loader is also kept so the pages can be fetched
// in the background once the first screen is up: a tap then opens an already-downloaded page.
const loaders = []
function lz(loader) { loaders.push(loader); return lazy(loader) }
const DashboardPage = lz(() => import('@features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const BreathingPage = lz(() => import('@features/breathing/BreathingPage').then(m => ({ default: m.BreathingPage })))
const BreathingSessionPage = lz(() => import('@features/breathing/BreathingSessionPage').then(m => ({ default: m.BreathingSessionPage })))
const MeditationPage = lz(() => import('@features/meditation/MeditationPage').then(m => ({ default: m.MeditationPage })))
const JournalPage = lz(() => import('@features/journal/JournalPage').then(m => ({ default: m.JournalPage })))
const JournalEntryPage = lz(() => import('@features/journal/JournalEntryPage').then(m => ({ default: m.JournalEntryPage })))
const JournalViewPage = lz(() => import('@features/journal/JournalViewPage').then(m => ({ default: m.JournalViewPage })))
const TrackerPage = lz(() => import('@features/tracker/TrackerPage').then(m => ({ default: m.TrackerPage })))
const SymbolLibraryPage = lz(() => import('@features/symbolLibrary/SymbolLibraryPage').then(m => ({ default: m.SymbolLibraryPage })))
const SleepCalcPage = lz(() => import('@features/sleepCalc/SleepCalcPage').then(m => ({ default: m.SleepCalcPage })))
const BinauralPage = lz(() => import('@features/binaural/BinauralPage').then(m => ({ default: m.BinauralPage })))
const AttemptLogPage = lz(() => import('@features/attemptLog/AttemptLogPage').then(m => ({ default: m.AttemptLogPage })))
const AttemptEntryPage = lz(() => import('@features/attemptLog/AttemptEntryPage').then(m => ({ default: m.AttemptEntryPage })))
const SupplementPage = lz(() => import('@features/supplements/SupplementPage').then(m => ({ default: m.SupplementPage })))
const RealityCheckPage = lz(() => import('@features/realityCheck/RealityCheckPage').then(m => ({ default: m.RealityCheckPage })))
const HypnagogicPage = lz(() => import('@features/hypnagogic/HypnagogicPage').then(m => ({ default: m.HypnagogicPage })))
const SleepEnvPage = lz(() => import('@features/sleepEnv/SleepEnvPage').then(m => ({ default: m.SleepEnvPage })))
const ProtocolsPage = lz(() => import('@features/protocols/ProtocolsPage').then(m => ({ default: m.ProtocolsPage })))
const ProtocolEditorPage = lz(() => import('@features/protocols/ProtocolEditorPage').then(m => ({ default: m.ProtocolEditorPage })))
const ProtocolRunPage = lz(() => import('@features/protocols/ProtocolRunPage').then(m => ({ default: m.ProtocolRunPage })))
const RitualsPage = lz(() => import('@features/rituals/RitualsPage').then(m => ({ default: m.RitualsPage })))
const ShadowWorkPage = lz(() => import('@features/shadowWork/ShadowWorkPage').then(m => ({ default: m.ShadowWorkPage })))
const AnalyticsPage = lz(() => import('@features/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const IncubationPage = lz(() => import('@features/incubation/IncubationPage').then(m => ({ default: m.IncubationPage })))
const IntegrationPage = lz(() => import('@features/integration/IntegrationPage').then(m => ({ default: m.IntegrationPage })))
const RetreatPage = lz(() => import('@features/retreat/RetreatPage').then(m => ({ default: m.RetreatPage })))
const TimelinePage = lz(() => import('@features/timeline/TimelinePage').then(m => ({ default: m.TimelinePage })))
const SettingsPage = lz(() => import('@features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))
const PracticePage = lz(() => import('@features/practice/PracticePage').then(m => ({ default: m.PracticePage })))
const SleepHubPage = lz(() => import('@features/sleep/SleepHubPage').then(m => ({ default: m.SleepHubPage })))
const LogHubPage   = lz(() => import('@features/log/LogHubPage').then(m => ({ default: m.LogHubPage })))
const PathPage     = lz(() => import('@features/path/PathPage').then(m => ({ default: m.PathPage })))
const ExplorePage  = lz(() => import('@features/explore/ExplorePage').then(m => ({ default: m.ExplorePage })))

function prefetchPages() {
  const c = navigator.connection
  if (c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ''))) return
  let i = 0
  const next = () => {
    if (i >= loaders.length) return
    loaders[i++]().catch(() => {})
    idle(next)
  }
  idle(next)
}
const idle = (fn) => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 4000 }) : setTimeout(fn, 300))

function PageFallback() {
  return (
    <BootScreen />
  )
}

export default function App() {
  React.useEffect(() => { const t = setTimeout(prefetchPages, 1500); return () => clearTimeout(t) }, [])
  return (
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Whop OAuth return. Sits outside the gate: the visitor is a guest until it finishes. */}
            <Route path="/auth/callback" element={<CallbackPage />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />

            {/* Everything else needs an active Whop membership */}
            <Route element={<MemberGate />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/sleep"    element={<SleepHubPage />} />
              <Route path="/log"      element={<LogHubPage />} />
              <Route path="/explore"  element={<ExplorePage />} />
              <Route path="/path"     element={<PathPage />} />
              <Route path="/breathe" element={<BreathingPage />} />
              <Route path="/breathe/session/:patternId" element={<BreathingSessionPage />} />
              <Route path="/meditate" element={<MeditationPage />} />
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/journal/new" element={<JournalEntryPage />} />
              <Route path="/journal/:id" element={<JournalViewPage />} />
              <Route path="/journal/:id/edit" element={<JournalEntryPage />} />
              <Route path="/tracker" element={<TrackerPage />} />
              <Route path="/symbols" element={<SymbolLibraryPage />} />
              <Route path="/sleep-calc" element={<SleepCalcPage />} />
              <Route path="/binaural" element={<BinauralPage />} />
              <Route path="/attempts" element={<AttemptLogPage />} />
              <Route path="/attempts/new" element={<AttemptEntryPage />} />
              <Route path="/supplements" element={<SupplementPage />} />
              <Route path="/reality-check" element={<RealityCheckPage />} />
              <Route path="/hypnagogic" element={<HypnagogicPage />} />
              <Route path="/sleep-env" element={<SleepEnvPage />} />
              <Route path="/protocols" element={<ProtocolsPage />} />
              <Route path="/protocols/new" element={<ProtocolEditorPage />} />
              <Route path="/protocols/:id/edit" element={<ProtocolEditorPage />} />
              <Route path="/protocols/:id/run" element={<ProtocolRunPage />} />
              <Route path="/rituals" element={<RitualsPage />} />
              <Route path="/shadow" element={<ShadowWorkPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/incubation" element={<IncubationPage />} />
              <Route path="/integration" element={<IntegrationPage />} />
              <Route path="/retreat" element={<RetreatPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
  )
}

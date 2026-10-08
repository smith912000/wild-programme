import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Spinner } from '@shared/ui/Spinner'
import { MemberGate } from '@features/member/MemberGate'
import { CallbackPage } from '@features/member/CallbackPage'

// Lazy-load all feature pages
const DashboardPage = lazy(() => import('@features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const BreathingPage = lazy(() => import('@features/breathing/BreathingPage').then(m => ({ default: m.BreathingPage })))
const BreathingSessionPage = lazy(() => import('@features/breathing/BreathingSessionPage').then(m => ({ default: m.BreathingSessionPage })))
const MeditationPage = lazy(() => import('@features/meditation/MeditationPage').then(m => ({ default: m.MeditationPage })))
const JournalPage = lazy(() => import('@features/journal/JournalPage').then(m => ({ default: m.JournalPage })))
const JournalEntryPage = lazy(() => import('@features/journal/JournalEntryPage').then(m => ({ default: m.JournalEntryPage })))
const JournalViewPage = lazy(() => import('@features/journal/JournalViewPage').then(m => ({ default: m.JournalViewPage })))
const TrackerPage = lazy(() => import('@features/tracker/TrackerPage').then(m => ({ default: m.TrackerPage })))
const SymbolLibraryPage = lazy(() => import('@features/symbolLibrary/SymbolLibraryPage').then(m => ({ default: m.SymbolLibraryPage })))
const SleepCalcPage = lazy(() => import('@features/sleepCalc/SleepCalcPage').then(m => ({ default: m.SleepCalcPage })))
const BinauralPage = lazy(() => import('@features/binaural/BinauralPage').then(m => ({ default: m.BinauralPage })))
const AttemptLogPage = lazy(() => import('@features/attemptLog/AttemptLogPage').then(m => ({ default: m.AttemptLogPage })))
const AttemptEntryPage = lazy(() => import('@features/attemptLog/AttemptEntryPage').then(m => ({ default: m.AttemptEntryPage })))
const SupplementPage = lazy(() => import('@features/supplements/SupplementPage').then(m => ({ default: m.SupplementPage })))
const RealityCheckPage = lazy(() => import('@features/realityCheck/RealityCheckPage').then(m => ({ default: m.RealityCheckPage })))
const HypnagogicPage = lazy(() => import('@features/hypnagogic/HypnagogicPage').then(m => ({ default: m.HypnagogicPage })))
const SleepEnvPage = lazy(() => import('@features/sleepEnv/SleepEnvPage').then(m => ({ default: m.SleepEnvPage })))
const ProtocolsPage = lazy(() => import('@features/protocols/ProtocolsPage').then(m => ({ default: m.ProtocolsPage })))
const ProtocolEditorPage = lazy(() => import('@features/protocols/ProtocolEditorPage').then(m => ({ default: m.ProtocolEditorPage })))
const ProtocolRunPage = lazy(() => import('@features/protocols/ProtocolRunPage').then(m => ({ default: m.ProtocolRunPage })))
const RitualsPage = lazy(() => import('@features/rituals/RitualsPage').then(m => ({ default: m.RitualsPage })))
const ShadowWorkPage = lazy(() => import('@features/shadowWork/ShadowWorkPage').then(m => ({ default: m.ShadowWorkPage })))
const AnalyticsPage = lazy(() => import('@features/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const IncubationPage = lazy(() => import('@features/incubation/IncubationPage').then(m => ({ default: m.IncubationPage })))
const IntegrationPage = lazy(() => import('@features/integration/IntegrationPage').then(m => ({ default: m.IntegrationPage })))
const RetreatPage = lazy(() => import('@features/retreat/RetreatPage').then(m => ({ default: m.RetreatPage })))
const TimelinePage = lazy(() => import('@features/timeline/TimelinePage').then(m => ({ default: m.TimelinePage })))
const SettingsPage = lazy(() => import('@features/settings/SettingsPage').then(m => ({ default: m.SettingsPage })))
const PracticePage = lazy(() => import('@features/practice/PracticePage').then(m => ({ default: m.PracticePage })))
const SleepHubPage = lazy(() => import('@features/sleep/SleepHubPage').then(m => ({ default: m.SleepHubPage })))
const LogHubPage   = lazy(() => import('@features/log/LogHubPage').then(m => ({ default: m.LogHubPage })))
const ExplorePage  = lazy(() => import('@features/explore/ExplorePage').then(m => ({ default: m.ExplorePage })))

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
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

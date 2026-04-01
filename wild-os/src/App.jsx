import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'
import { useAccessStore } from '@store/accessStore'
import { Spinner } from '@shared/ui/Spinner'
import { AuthGuard } from '@shared/guards/AuthGuard'

// Auth pages — not lazy, always small
import { LoginPage } from '@features/auth/LoginPage'
import { RegisterPage } from '@features/auth/RegisterPage'
import { UnlockPage } from '@features/auth/UnlockPage'

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

function AppInitialiser({ children }) {
  const { initAuth } = useAuthStore()
  const { initAccess } = useAccessStore()

  useEffect(() => {
    initAuth()
    initAccess()
  }, [initAuth, initAccess])

  return children
}

export default function App() {
  return (
    <AppInitialiser>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Auth routes — public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Unlock — requires auth but no tier */}
          <Route path="/unlock" element={
            <AuthGuard>
              <UnlockPage />
            </AuthGuard>
          } />

          {/* All app routes — require auth */}
          <Route path="/" element={<AuthGuard><DashboardPage /></AuthGuard>} />
          <Route path="/practice" element={<AuthGuard><PracticePage /></AuthGuard>} />
          <Route path="/sleep"    element={<AuthGuard><SleepHubPage /></AuthGuard>} />
          <Route path="/log"      element={<AuthGuard><LogHubPage /></AuthGuard>} />
          <Route path="/explore"  element={<AuthGuard><ExplorePage /></AuthGuard>} />
          <Route path="/breathe" element={<AuthGuard><BreathingPage /></AuthGuard>} />
          <Route path="/breathe/session/:patternId" element={<AuthGuard><BreathingSessionPage /></AuthGuard>} />
          <Route path="/meditate" element={<AuthGuard><MeditationPage /></AuthGuard>} />
          <Route path="/journal" element={<AuthGuard><JournalPage /></AuthGuard>} />
          <Route path="/journal/new" element={<AuthGuard><JournalEntryPage /></AuthGuard>} />
          <Route path="/journal/:id" element={<AuthGuard><JournalViewPage /></AuthGuard>} />
          <Route path="/journal/:id/edit" element={<AuthGuard><JournalEntryPage /></AuthGuard>} />
          <Route path="/tracker" element={<AuthGuard><TrackerPage /></AuthGuard>} />
          <Route path="/symbols" element={<AuthGuard><SymbolLibraryPage /></AuthGuard>} />
          <Route path="/sleep-calc" element={<AuthGuard><SleepCalcPage /></AuthGuard>} />
          <Route path="/binaural" element={<AuthGuard><BinauralPage /></AuthGuard>} />
          <Route path="/attempts" element={<AuthGuard><AttemptLogPage /></AuthGuard>} />
          <Route path="/attempts/new" element={<AuthGuard><AttemptEntryPage /></AuthGuard>} />
          <Route path="/supplements" element={<AuthGuard><SupplementPage /></AuthGuard>} />
          <Route path="/reality-check" element={<AuthGuard><RealityCheckPage /></AuthGuard>} />
          <Route path="/hypnagogic" element={<AuthGuard><HypnagogicPage /></AuthGuard>} />
          <Route path="/sleep-env" element={<AuthGuard><SleepEnvPage /></AuthGuard>} />
          <Route path="/protocols" element={<AuthGuard><ProtocolsPage /></AuthGuard>} />
          <Route path="/protocols/new" element={<AuthGuard><ProtocolEditorPage /></AuthGuard>} />
          <Route path="/protocols/:id/edit" element={<AuthGuard><ProtocolEditorPage /></AuthGuard>} />
          <Route path="/protocols/:id/run" element={<AuthGuard><ProtocolRunPage /></AuthGuard>} />
          <Route path="/rituals" element={<AuthGuard><RitualsPage /></AuthGuard>} />
          <Route path="/shadow" element={<AuthGuard><ShadowWorkPage /></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard><AnalyticsPage /></AuthGuard>} />
          <Route path="/incubation" element={<AuthGuard><IncubationPage /></AuthGuard>} />
          <Route path="/integration" element={<AuthGuard><IntegrationPage /></AuthGuard>} />
          <Route path="/retreat" element={<AuthGuard><RetreatPage /></AuthGuard>} />
          <Route path="/timeline" element={<AuthGuard><TimelinePage /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppInitialiser>
  )
}

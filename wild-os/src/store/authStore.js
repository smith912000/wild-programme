import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@lib/supabase'
import { useAccessStore } from '@store/accessStore'

const MOCK_SESSION_KEY = 'wos_mock_session'

const TEST_ACCOUNTS = {
  // Master tester — unlocks all tiers
  'memberof31@truth.com': { password: 'SeekTruthIn13', tier: 'T3' },
  // Tier 1 tester
  'tier1@truth.com':      { password: 'SeekTruthIn1',  tier: 'T1' },
  // Tier 2 tester
  'tier2@truth.com':      { password: 'SeekTruthIn2',  tier: 'T2' },
}

function getMockSession() {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setMockSession(session) {
  if (session) {
    localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(MOCK_SESSION_KEY)
  }
}

function createMockUser(email) {
  return {
    id: 'mock-' + Math.random().toString(36).slice(2),
    email,
    created_at: new Date().toISOString(),
  }
}

// Module-level guards — prevent multiple initAuth runs from racing the Supabase
// auth-token lock, and prevent registering onAuthStateChange more than once.
let _initStarted = false
let _authListenerRegistered = false

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initAuth: async () => {
    // Run once. Subsequent calls (e.g. AuthGuard remounts) are no-ops.
    if (_initStarted) return
    _initStarted = true

    set({ loading: true, error: null })

    // PRIORITY 1: mock test session — bypass Supabase entirely.
    // Without this check, navigation after a test-account login causes
    // supabase.auth.getSession() to return null and wipe the mock user.
    const mockSession = getMockSession()
    if (mockSession) {
      set({ user: mockSession.user, session: mockSession, loading: false })
      return
    }

    if (!isSupabaseConfigured) {
      set({ user: null, session: null, loading: false })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, session, loading: false })

      // Register the listener only once for the lifetime of the app.
      if (!_authListenerRegistered) {
        _authListenerRegistered = true
        supabase.auth.onAuthStateChange((_event, session) => {
          // If a mock session is active, ignore Supabase state changes.
          if (getMockSession()) return
          set({ user: session?.user || null, session })
        })
      }
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })

    // Test accounts always bypass Supabase regardless of configuration
    const testAccount = TEST_ACCOUNTS[email.toLowerCase()]
    if (testAccount) {
      if (testAccount.password !== password) {
        set({ error: 'Invalid email or password', loading: false })
        return { error: { message: 'Invalid email or password' } }
      }
      const mockUser = createMockUser(email)
      const mockSession = { user: mockUser, access_token: 'mock-token' }
      setMockSession(mockSession)
      useAccessStore.getState().setTier(testAccount.tier)
      set({ user: mockUser, session: mockSession, loading: false })
      return { error: null, user: mockUser }
    }

    if (!isSupabaseConfigured) {
      // Generic mock mode — accept any credentials
      const mockUser = createMockUser(email)
      const mockSession = { user: mockUser, access_token: 'mock-token' }
      setMockSession(mockSession)
      set({ user: mockUser, session: mockSession, loading: false })
      return { error: null }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        set({ error: error.message, loading: false })
        return { error }
      }
      set({ user: data.user, session: data.session, loading: false })
      return { error: null, user: data.user }
    } catch (e) {
      set({ error: e.message, loading: false })
      return { error: e }
    }
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null })

    if (!isSupabaseConfigured) {
      const mockUser = createMockUser(email)
      const mockSession = { user: mockUser, access_token: 'mock-token' }
      setMockSession(mockSession)
      set({ user: mockUser, session: mockSession, loading: false })
      return { error: null }
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        set({ error: error.message, loading: false })
        return { error }
      }
      set({ user: data.user, session: data.session, loading: false })
      return { error: null }
    } catch (e) {
      set({ error: e.message, loading: false })
      return { error: e }
    }
  },

  signInWithGoogle: async () => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Supabase not configured' } }
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { error: error || null }
  },

  signOut: async () => {
    // Always clear mock session + tier first (covers test-account logouts
    // even when Supabase is configured).
    const wasMock = !!getMockSession()
    setMockSession(null)
    useAccessStore.getState().clearAccess()

    // Only call Supabase signOut for real Supabase sessions.
    if (!wasMock && isSupabaseConfigured) {
      try { await supabase.auth.signOut() } catch (_) { /* non-fatal */ }
    }

    set({ user: null, session: null })
  },

  setSession: (session) => {
    set({ user: session?.user || null, session })
  },

  clearError: () => set({ error: null }),
}))

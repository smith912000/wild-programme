import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@lib/supabase'

const MOCK_SESSION_KEY = 'wos_mock_session'

const TEST_ACCOUNTS = {
  'memberof31@truth.com': { password: 'SeekTruthIn13', tier: 'T3' },
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

export const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initAuth: async () => {
    set({ loading: true, error: null })

    if (!isSupabaseConfigured) {
      const mockSession = getMockSession()
      if (mockSession) {
        set({ user: mockSession.user, session: mockSession, loading: false })
      } else {
        set({ user: null, session: null, loading: false })
      }
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, session, loading: false })

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, session })
      })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null })

    if (!isSupabaseConfigured) {
      // Check hardcoded test accounts first
      const testAccount = TEST_ACCOUNTS[email.toLowerCase()]
      if (testAccount) {
        if (testAccount.password !== password) {
          set({ error: 'Invalid password', loading: false })
          return { error: { message: 'Invalid password' } }
        }
        const mockUser = createMockUser(email)
        const mockSession = { user: mockUser, access_token: 'mock-token' }
        setMockSession(mockSession)
        localStorage.setItem('wos_tier', testAccount.tier)
        set({ user: mockUser, session: mockSession, loading: false })
        return { error: null }
      }
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
    if (!isSupabaseConfigured) {
      setMockSession(null)
      set({ user: null, session: null })
      return
    }
    await supabase.auth.signOut()
    set({ user: null, session: null })
  },

  setSession: (session) => {
    set({ user: session?.user || null, session })
  },

  clearError: () => set({ error: null }),
}))

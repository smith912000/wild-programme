import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@lib/supabase'
import { validateCode } from '@utils/codeValidator'

const TIER_KEY = 'wos_tier'

export const useAccessStore = create((set, get) => ({
  tier: null,
  loading: false,
  error: null,

  initAccess: () => {
    // Access is now open — everyone gets full (T3) access by default. A cached
    // tier is still honoured, but with login removed there is no gate: the app
    // grants entry immediately. (Set this back to the cached-only check if a
    // paywall is reintroduced.)
    const cached = localStorage.getItem(TIER_KEY)
    const tier = (cached && ['T1', 'T2', 'T3'].includes(cached)) ? cached : 'T3'
    localStorage.setItem(TIER_KEY, tier)
    set({ tier })
  },

  setTier: (tier) => {
    localStorage.setItem(TIER_KEY, tier)
    set({ tier })
  },

  unlockWithCode: async (code) => {
    set({ loading: true, error: null })
    const upper = code.toUpperCase().trim()

    // Try Supabase RPC first
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.rpc('redeem_unlock_code', { p_code: upper })
        if (!error && data?.success) {
          const tier = data.tier
          localStorage.setItem(TIER_KEY, tier)
          set({ tier, loading: false })
          return { success: true, tier }
        }
        if (error || (data && !data.success)) {
          const msg = data?.error || error?.message || 'Invalid code'
          set({ error: msg, loading: false })
          return { success: false, error: msg }
        }
      } catch (e) {
        // fall through to offline validation
      }
    }

    // Offline / mock mode: validate by prefix
    const tier = validateCode(upper)
    if (tier) {
      localStorage.setItem(TIER_KEY, tier)
      set({ tier, loading: false })
      return { success: true, tier }
    }

    const msg = 'Invalid access code. Please check and try again.'
    set({ error: msg, loading: false })
    return { success: false, error: msg }
  },

  clearAccess: () => {
    localStorage.removeItem(TIER_KEY)
    set({ tier: null })
  },

  clearError: () => set({ error: null }),
}))

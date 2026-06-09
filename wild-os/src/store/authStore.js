import { create } from 'zustand'

/* ── Auth removed ────────────────────────────────────────────────────────
   WILD OS now opens directly with a local guest profile. There is no login,
   no registration, and no network auth call — which also removes the
   "network error" some users hit when the Supabase auth endpoint was
   unreachable. All user data lives locally (see the feature stores), so no
   account is required. The tier/unlock system (accessStore) is unchanged and
   still gates premium content by redeemed access code.

   NOTE: the old hardcoded test-account credentials and master-email backdoor
   that used to live here have been deleted. They were exposed in the public
   repo and must be treated as compromised — rotate/delete those Supabase
   accounts.
   ──────────────────────────────────────────────────────────────────────── */

const GUEST = { id: 'local-guest', email: null, created_at: '1970-01-01T00:00:00.000Z' }
const GUEST_SESSION = { user: GUEST, access_token: 'local' }

export const useAuthStore = create((set) => ({
  user: GUEST,
  session: GUEST_SESSION,
  loading: false,
  error: null,

  // Synchronous, no network — the app is usable the instant it mounts.
  initAuth: () => set({ user: GUEST, session: GUEST_SESSION, loading: false, error: null }),

  // Retained as local no-ops so any legacy caller keeps working without a
  // network round-trip. There is no real sign-in/up flow any more.
  signIn: async () => ({ error: null, user: GUEST }),
  signUp: async () => ({ error: null, user: GUEST }),
  signInWithGoogle: async () => ({ error: null }),
  signOut: async () => {},

  setSession: () => {},
  clearError: () => set({ error: null }),
}))

import { create } from 'zustand'
import {
  WHOP_CLIENT_ID,
  WHOP_AUTHORIZE_URL,
  WHOP_SCOPE,
  REDIRECT_URI,
  OFFLINE_GRACE_MS,
  isAuthConfigured,
  AUTH_MOCK,
} from '@config/whop'
import { decodeToken, exchangeCode, verifyToken, AuthRejected } from '@lib/memberAuth'

// Not prefixed wos_, so "Export data" and "Clear local data" never touch the token.
const TOKEN_KEY = 'wild_member_token'
const NAME_KEY = 'wild_member_name'
const PKCE_KEY = 'wild_oauth_pkce'

const read = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch { /* private mode */ } }

function b64url(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const randomString = (n = 32) => b64url(crypto.getRandomValues(new Uint8Array(n)))
async function challengeFor(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return b64url(new Uint8Array(digest))
}

// stale: member token too old to trust offline.
// member: paid up. expired: signed in, no active membership. guest: no token.
function statusFor(payload) {
  if (!payload) return 'guest'
  const until = payload.valid_until ? Date.parse(payload.valid_until) : 0
  return until > Date.now() ? 'member' : 'expired'
}

function apply(set, token, name) {
  const payload = decodeToken(token)
  write(TOKEN_KEY, token)
  if (name) write(NAME_KEY, name)
  set({
    token,
    name: name || read(NAME_KEY) || null,
    email: payload?.email || null,
    validUntil: payload?.valid_until || null,
    status: statusFor(payload),
    error: null,
  })
}

export const useMemberStore = create((set, get) => ({
  status: 'unknown', // unknown | guest | member | expired | stale
  token: null,
  name: null,
  email: null,
  validUntil: null,
  error: null,
  loading: false,

  // Runs on every launch. Cached member tokens open the app straight away; verify
  // then refreshes in the background. Offline, a token under 7 days old still passes.
  refresh: async () => {
    const token = read(TOKEN_KEY)
    const payload = token ? decodeToken(token) : null
    if (!payload) {
      write(TOKEN_KEY, null)
      set({ status: 'guest', token: null })
      return
    }
    const ageMs = Date.now() - (payload.iat || 0) * 1000
    const cachedStatus = statusFor(payload)
    set({
      token,
      name: read(NAME_KEY),
      email: payload.email || null,
      validUntil: payload.valid_until || null,
      status: cachedStatus,
    })
    try {
      const res = await verifyToken(token)
      apply(set, res.token, res.name)
    } catch (e) {
      if (e instanceof AuthRejected) {
        get().signOut()
        return
      }
      // Network failure: keep the cached answer while the token is young enough.
      const wasMember = payload.valid_until && Date.parse(payload.valid_until) > (payload.iat || 0) * 1000
      if (wasMember) set({ status: ageMs < OFFLINE_GRACE_MS ? 'member' : 'stale' })
      else set({ status: cachedStatus })
    }
  },

  signIn: async () => {
    if (!isAuthConfigured && !AUTH_MOCK) {
      set({ error: 'Sign-in is not switched on yet. Try again soon.' })
      return
    }
    if (AUTH_MOCK) {
      apply(set, (await exchangeCode('mock', REDIRECT_URI, 'mock')).token, 'Mock Member')
      return
    }
    const verifier = randomString(48)
    const state = randomString(16)
    sessionStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state }))
    const params = new URLSearchParams({
      client_id: WHOP_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: WHOP_SCOPE,
      state,
      code_challenge: await challengeFor(verifier),
      code_challenge_method: 'S256',
    })
    window.location.assign(`${WHOP_AUTHORIZE_URL}?${params}`)
  },

  // Route /auth/callback. Returns true when a token was stored.
  handleCallback: async (code, state) => {
    set({ loading: true, error: null })
    let saved = null
    try { saved = JSON.parse(sessionStorage.getItem(PKCE_KEY) || 'null') } catch { /* ignore */ }
    sessionStorage.removeItem(PKCE_KEY)
    if (!code || !saved || saved.state !== state) {
      set({ loading: false, error: 'That sign-in link has expired. Start again.' })
      return false
    }
    try {
      const res = await exchangeCode(code, REDIRECT_URI, saved.verifier)
      apply(set, res.token, res.name)
      set({ loading: false })
      return true
    } catch (e) {
      set({
        loading: false,
        error: e instanceof AuthRejected
          ? 'Whop did not accept that sign-in. Start again.'
          : 'Could not reach the sign-in service. Check your connection and try again.',
      })
      return false
    }
  },

  signOut: () => {
    write(TOKEN_KEY, null)
    write(NAME_KEY, null)
    set({ status: 'guest', token: null, name: null, email: null, validUntil: null })
  },

  clearError: () => set({ error: null }),
}))

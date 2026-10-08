import { create } from 'zustand'
import {
  WHOP_CLIENT_ID,
  WHOP_AUTHORIZE_URL,
  WHOP_SCOPE,
  REDIRECT_URI,
  isAuthConfigured,
  AUTH_MOCK,
} from '@config/whop'
import { jwtClaims, exchangeCode, verifyToken, AuthRejected } from '@lib/memberAuth'

// Not prefixed wos_, so "Export data" and "Clear local data" never touch the token.
const SESSION_KEY = 'wild_member_session'
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

// stale: member answer too old to trust offline.
// member: paid up. expired: signed in, no active membership. guest: no session.
// The saved record is what n8n last said: { token, member, name, email, expiresAt }.
function load() {
  try { return JSON.parse(read(SESSION_KEY) || 'null') } catch { return null }
}

function apply(set, res) {
  const record = {
    token: res.token,
    member: !!res.member,
    name: res.name || null,
    email: jwtClaims(res.token).email || null,
    expiresAt: res.expiresAt || null,
  }
  write(SESSION_KEY, JSON.stringify(record))
  set({ ...view(record), error: null })
}

function view(r) {
  return {
    token: r.token,
    name: r.name,
    email: r.email,
    expiresAt: r.expiresAt,
    status: r.member ? 'member' : 'expired',
  }
}

export const useMemberStore = create((set, get) => ({
  status: 'unknown', // unknown | guest | member | expired | stale
  token: null,
  name: null,
  email: null,
  expiresAt: null,
  error: null,
  loading: false,

  // Runs on every launch. A cached member opens the app straight away; verify then
  // refreshes in the background. Offline, the cached answer holds until its expiresAt.
  refresh: async () => {
    const saved = load()
    if (!saved?.token) {
      set({ status: 'guest', token: null })
      return
    }
    set(view(saved))
    try {
      apply(set, await verifyToken(saved.token))
    } catch (e) {
      if (e instanceof AuthRejected) {
        get().signOut()
        return
      }
      const fresh = saved.expiresAt && Date.parse(saved.expiresAt) > Date.now()
      if (saved.member && !fresh) set({ status: 'stale' })
    }
  },

  signIn: async () => {
    if (!isAuthConfigured && !AUTH_MOCK) {
      set({ error: 'Sign-in is not switched on yet. Try again soon.' })
      return
    }
    if (AUTH_MOCK) {
      apply(set, await exchangeCode('mock', REDIRECT_URI, 'mock'))
      return
    }
    const verifier = randomString(48)
    const state = randomString(16)
    const nonce = randomString(16) // Whop requires one with the openid scope
    sessionStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state }))
    const params = new URLSearchParams({
      client_id: WHOP_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: WHOP_SCOPE,
      state,
      nonce,
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
      apply(set, res)
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
    write(SESSION_KEY, null)
    set({ status: 'guest', token: null, name: null, email: null, expiresAt: null })
  },

  clearError: () => set({ error: null }),
}))

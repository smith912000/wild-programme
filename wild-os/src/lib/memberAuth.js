import {
  AUTH_MOCK,
  CALLBACK_ENDPOINT,
  VERIFY_ENDPOINT,
} from '@config/whop'

/* Client for the two n8n endpoints (contract: wild/review/whop-accounts-build-spec.md, A).
   Token = base64url(JSON payload) + '.' + HMAC signature. The client only reads the
   payload for display and offline decisions; n8n is the one that verifies the signature.
   Payload: { uid, email, valid_until (ISO or null), iat (seconds) }.
   Responses: 200 { token, name } | 401/403 { error } | network failure throws NetworkError. */

export class NetworkError extends Error {}
export class AuthRejected extends Error {}

export function decodeToken(token) {
  try {
    const part = token.split('.')[0].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(escape(atob(part + '='.repeat((4 - (part.length % 4)) % 4))))
    return JSON.parse(json)
  } catch {
    return null
  }
}

function mockToken(kind) {
  const now = Math.floor(Date.now() / 1000)
  const payload = {
    uid: 'user_mock',
    email: 'member@example.com',
    valid_until: kind === 'expired' ? new Date(Date.now() - 86400000).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
    iat: now,
  }
  return btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') + '.mock'
}

async function post(url, body) {
  if (AUTH_MOCK) return { token: mockToken(AUTH_MOCK), name: 'Mock Member' }
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new NetworkError('offline')
  }
  if (res.status === 401 || res.status === 403) throw new AuthRejected('rejected')
  if (!res.ok) throw new NetworkError(`status ${res.status}`)
  const data = await res.json().catch(() => null)
  if (!data?.token) throw new NetworkError('bad response')
  return data
}

export const exchangeCode = (code, redirectUri, codeVerifier) =>
  post(CALLBACK_ENDPOINT, { code, redirect_uri: redirectUri, code_verifier: codeVerifier })

export const verifyToken = (token) => post(VERIFY_ENDPOINT, { token })

import {
  AUTH_MOCK,
  CALLBACK_ENDPOINT,
  VERIFY_ENDPOINT,
} from '@config/whop'

/* Client for the n8n workflow "WILD - Whop auth".
   POST /wild/auth/callback { code, redirect_uri, code_verifier }
   POST /wild/auth/verify   { token }
   Both answer 200 { ok, token, member, name, expiresAt }. The token is an HS256 JWT valid
   7 days; n8n re-checks Whop once it is over 24 hours old. Failures answer 401.
   n8n is the source of truth: the client trusts `member` and `expiresAt` and never
   verifies the JWT itself. Network failures throw NetworkError. */

export class NetworkError extends Error {}
export class AuthRejected extends Error {}

// Best effort read of the JWT payload, for the email claim only.
export function jwtClaims(token) {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(decodeURIComponent(escape(atob(part + '='.repeat((4 - (part.length % 4)) % 4)))))
  } catch {
    return {}
  }
}

function mockResponse(kind) {
  const claims = btoa(JSON.stringify({ email: 'member@example.com' })).replace(/=+$/, '')
  return {
    ok: true,
    token: `mock.${claims}.mock`,
    member: kind !== 'expired',
    name: 'Mock Member',
    expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
  }
}

async function post(url, body) {
  if (AUTH_MOCK) return mockResponse(AUTH_MOCK)
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
  if (data.ok === false) throw new AuthRejected('rejected')
  return data
}

export const exchangeCode = (code, redirectUri, codeVerifier) =>
  post(CALLBACK_ENDPOINT, { code, redirect_uri: redirectUri, code_verifier: codeVerifier })

export const verifyToken = (token) => post(VERIFY_ENDPOINT, { token })

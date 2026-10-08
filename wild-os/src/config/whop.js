// Whop sign-in and n8n auth endpoints. Values come from the build environment;
// the placeholders below are intentional until the Whop app and the n8n
// workflow "WILD - Whop auth" exist. See README.md for the contract.

const env = import.meta.env

export const WHOP_CLIENT_ID = env.VITE_WHOP_CLIENT_ID || 'WHOP_CLIENT_ID_PLACEHOLDER'
export const WHOP_AUTHORIZE_URL = env.VITE_WHOP_AUTHORIZE_URL || 'https://api.whop.com/oauth/authorize'
// Scope names to be confirmed against Whop's current docs (identity + memberships).
export const WHOP_SCOPE = env.VITE_WHOP_SCOPE || 'openid profile email'
export const WHOP_JOIN_URL = env.VITE_WHOP_UPGRADE_URL || 'https://whop.com/wild-programme/'

export const REDIRECT_URI = env.VITE_AUTH_REDIRECT_URI || 'https://smith912000.github.io/wild-os/auth/callback'

// Base URL of the n8n webhooks: POST {base}/wild/auth/callback and /wild/auth/verify
export const N8N_AUTH_BASE = env.VITE_N8N_AUTH_BASE || 'https://smith912000.app.n8n.cloud/webhook'
export const CALLBACK_ENDPOINT = `${N8N_AUTH_BASE}/wild/auth/callback`
export const VERIFY_ENDPOINT = `${N8N_AUTH_BASE}/wild/auth/verify`

export const isAuthConfigured = !WHOP_CLIENT_ID.includes('PLACEHOLDER')

// Dev-only: VITE_WHOP_AUTH_MOCK=member|expired fakes the n8n endpoints so the
// gates can be exercised before the workflow is live. Never active in a build.
export const AUTH_MOCK = import.meta.env.DEV ? (env.VITE_WHOP_AUTH_MOCK || '') : ''

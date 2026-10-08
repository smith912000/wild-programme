// Whop sign-in and n8n auth endpoints. Values come from the build environment;
// the placeholders below are intentional until the Whop app and the n8n
// workflow "WILD - Whop auth" exist. See README.md for the contract.

const env = import.meta.env

export const WHOP_CLIENT_ID = env.VITE_WHOP_CLIENT_ID || 'app_sBkrxfbNvViybN' // public id of the WILD OS app; the secret lives in n8n
export const WHOP_AUTHORIZE_URL = env.VITE_WHOP_AUTHORIZE_URL || 'https://api.whop.com/oauth/authorize'
// Scope names to be confirmed against Whop's current docs (identity + memberships).
export const WHOP_SCOPE = env.VITE_WHOP_SCOPE || 'openid profile email'
// Checkout links (plan ids from the Whop dashboard).
export const WHOP_MONTHLY_URL = env.VITE_WHOP_MONTHLY_URL || 'https://whop.com/checkout/plan_rC0YO0w8EAM9G/'
export const WHOP_ANNUAL_URL = env.VITE_WHOP_ANNUAL_URL || 'https://whop.com/checkout/plan_h7BCmUwJo2VLX/'

export const REDIRECT_URI = env.VITE_AUTH_REDIRECT_URI || 'https://smith912000.github.io/wild-os/auth/callback'

// Base URL of the n8n webhooks: POST {base}/wild/auth/callback and /wild/auth/verify
export const N8N_AUTH_BASE = env.VITE_N8N_AUTH_BASE || 'https://smith912000.app.n8n.cloud/webhook'
export const CALLBACK_ENDPOINT = `${N8N_AUTH_BASE}/wild/auth/callback`
export const VERIFY_ENDPOINT = `${N8N_AUTH_BASE}/wild/auth/verify`

export const isAuthConfigured = !!WHOP_CLIENT_ID

// Dev-only: VITE_WHOP_AUTH_MOCK=member|expired fakes the n8n endpoints so the
// gates can be exercised before the workflow is live. Never active in a build.
export const AUTH_MOCK = import.meta.env.DEV ? (env.VITE_WHOP_AUTH_MOCK || '') : ''

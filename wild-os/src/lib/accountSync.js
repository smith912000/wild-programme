import { N8N_AUTH_BASE, AUTH_MOCK } from '@config/whop'
import { jwtClaims } from '@lib/memberAuth'
import { STORES, DELETED_KEY, exportAllData, replaceAllData, clearAllData } from '@lib/db'

/* Per-account storage. The device keeps a working copy (IndexedDB + wos_ localStorage keys)
   so the app works offline; n8n workflow "WILD - Member data" keeps the account copy,
   one JSON document per Whop user id (the token's sub) in data table wild_member_data.
   POST /wild/data { token }        -> { ok, data, updatedAt }   (data null if none yet)
   POST /wild/data { token, data }  -> { ok, updatedAt }
   401 = bad token, 413 = too large.

   Merge rules: journal and log records are joined by id, the newer updatedAt/createdAt wins,
   and ids deleted on any device stay deleted. Settings and flags (wos_ keys, e.g. the intro
   being seen) are joined the first time a device syncs an account; after that the device's
   own values are pushed as they are. */

export const DATA_ENDPOINT = `${N8N_AUTH_BASE}/wild/data`
const OWNER_KEY = 'wild_data_owner' // Whop user id whose data is on this device
const STASH_PREFIX = 'wild_data_stash_' // unsynced data left by a sign-out, per user id

const ls = {
  get: (k) => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch { /* ignore */ } },
  keys: () => { try { return Object.keys(localStorage) } catch { return [] } },
}
const parse = (s, d) => { try { return JSON.parse(s) ?? d } catch { return d } }

export const userIdOf = (token) => jwtClaims(token).sub || null

async function snapshot() {
  const local = {}
  for (const k of ls.keys()) if (k.startsWith('wos_')) local[k] = ls.get(k)
  return { v: 1, stores: await exportAllData(), local, deleted: parse(ls.get(DELETED_KEY), {}) }
}

async function apply(snap) {
  await replaceAllData(snap.stores)
  for (const k of ls.keys()) if (k.startsWith('wos_') && !(k in snap.local)) ls.set(k, null)
  for (const [k, v] of Object.entries(snap.local)) ls.set(k, v)
  ls.set(DELETED_KEY, JSON.stringify(snap.deleted))
}

async function wipeLocal() {
  await clearAllData()
  for (const k of ls.keys()) if (k.startsWith('wos_')) ls.set(k, null)
  ls.set(DELETED_KEY, null)
}

const stamp = (r) => r?.updatedAt || r?.createdAt || r?.startedAt || r?.attemptDate || r?.date || ''

function merge(mine, theirs, joining) {
  const deleted = { ...theirs.deleted, ...mine.deleted }
  const stores = {}
  for (const s of STORES) {
    const byId = new Map()
    for (const r of [...(theirs.stores?.[s] || []), ...(mine.stores?.[s] || [])]) {
      if (deleted[`${s}/${r.id}`]) continue
      const had = byId.get(r.id)
      if (!had || stamp(r) >= stamp(had)) byId.set(r.id, r)
    }
    stores[s] = [...byId.values()]
  }
  const local = joining ? { ...theirs.local, ...mine.local } : { ...mine.local }
  if (theirs.local?.wos_onboarded === '1') local.wos_onboarded = '1' // the intro never shows twice
  return { v: 1, stores, local, deleted }
}

async function call(token, data) {
  const res = await fetch(DATA_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data ? { token, data } : { token }),
  })
  const body = await res.json().catch(() => null)
  if (!res.ok || !body?.ok) throw new Error(body?.error || `status ${res.status}`)
  return body
}

let running = null
let lastSent = null

/* Pull, merge, write locally, push. Safe to call often; concurrent calls share one run.
   Throws on network failure (the local copy is untouched in that case). */
export function syncAccount(token) {
  if (!token || AUTH_MOCK) return Promise.resolve(false)
  if (!running) running = run(token).finally(() => { running = null })
  return running
}

async function run(token) {
  const uid = userIdOf(token)
  if (!uid) return false
  const owner = ls.get(OWNER_KEY)
  if (owner && owner !== uid) {
    // Someone else's data is on this device: set it aside for them, start clean.
    ls.set(STASH_PREFIX + owner, JSON.stringify(await snapshot()))
    await wipeLocal()
  }
  const joining = owner !== uid
  let mine = await snapshot()
  const stash = parse(ls.get(STASH_PREFIX + uid), null)
  if (stash) mine = merge(mine, stash, true)

  const remote = await call(token)
  const merged = remote.data ? merge(mine, remote.data, joining) : mine
  await apply(merged)
  ls.set(OWNER_KEY, uid) // existing local-only data now belongs to this account
  ls.set(STASH_PREFIX + uid, null)

  const out = JSON.stringify(merged)
  if (out !== JSON.stringify(remote.data) && out !== lastSent) {
    await call(token, merged)
    lastSent = out
  }
  return true
}

// True when this device has already synced this account (no need to wait on the network).
export const isDeviceJoined = (token) => !!token && ls.get(OWNER_KEY) === userIdOf(token)

/* Sign-out: sync what is here, then clear the device so the next account starts clean.
   If the push fails the data is stashed on the device and merged back next sign-in. */
export async function leaveAccount(token) {
  const uid = ls.get(OWNER_KEY) || (token && userIdOf(token))
  if (!uid) return
  try {
    if (!(await syncAccount(token))) throw new Error('not synced')
  } catch {
    ls.set(STASH_PREFIX + uid, JSON.stringify(await snapshot()))
  }
  await wipeLocal()
  ls.set(OWNER_KEY, null)
  lastSent = null
}

// First-run state, per device. Plain localStorage helpers, no store needed.
const DONE_KEY = 'wos_onboarded'
const PREFS_KEY = 'wos_sleep_prefs'

export const hasOnboarded = () => { try { return localStorage.getItem(DONE_KEY) === '1' } catch { return true } }
export const markOnboarded = () => { try { localStorage.setItem(DONE_KEY, '1') } catch { /* ignore */ } }

export function getSleepPrefs() {
  try { return JSON.parse(localStorage.getItem(PREFS_KEY) || 'null') || {} } catch { return {} }
}
export function saveSleepPrefs(prefs) {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify({ ...getSleepPrefs(), ...prefs })) } catch { /* ignore */ }
}

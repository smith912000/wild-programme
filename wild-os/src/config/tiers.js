// Numeric tier values for guards
export const TIER = { FREE: 0, T1: 1, T2: 2, T3: 3 }

// Human-readable labels (used in settings, badges, etc.)
export const TIER_LABELS = { 0: 'Free', 1: 'Foundations', 2: 'Advanced', 3: 'Master' }

export const TIERS = {
  T1: { id: 'T1', label: 'Foundations', color: '#c9a84c', prefix: 'FOUND-' },
  T2: { id: 'T2', label: 'Advanced', color: '#3b82f6', prefix: 'ADVAN-' },
  T3: { id: 'T3', label: 'Master', color: '#a855f7', prefix: 'MASTE-' },
}

export const FEATURE_TIERS = {
  breathing_basic: 'T1',
  meditation: 'T1',
  journal: 'T1',
  tracker: 'T1',
  symbol_library: 'T1',
  breathing_advanced: 'T2',
  sleep_calc: 'T2',
  binaural: 'T2',
  attempt_log: 'T2',
  supplements: 'T2',
  reality_check: 'T2',
  hypnagogic: 'T2',
  sleep_env: 'T2',
  protocols: 'T3',
  rituals: 'T3',
  shadow_work: 'T3',
  analytics: 'T3',
  integration: 'T3',
  dream_incubation: 'T3',
  retreat_mode: 'T3',
  consciousness_timeline: 'T3',
  archetype_map: 'T3',
}

export function tierCanAccess(userTier, featureKey) {
  const tierOrder = { T1: 1, T2: 2, T3: 3 }
  const required = FEATURE_TIERS[featureKey]
  if (!required || !userTier) return false
  return tierOrder[userTier] >= tierOrder[required]
}

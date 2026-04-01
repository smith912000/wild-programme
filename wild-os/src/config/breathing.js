export const BREATHING_PATTERNS = [
  {
    id: '4-7-8',
    name: '4-7-8 Relaxation',
    description: 'Dr. Weil\'s sleep-induction technique. Powerful nervous system reset before WILD attempts.',
    tier: 'T1',
    phases: [
      { name: 'INHALE', duration: 4, color: '#3b82f6' },
      { name: 'HOLD', duration: 7, color: '#c9a84c' },
      { name: 'EXHALE', duration: 8, color: '#a855f7' },
    ],
    totalCycleDuration: 19,
    defaultCycles: 8,
    cues: { inhale: 'inhale', hold: 'hold', exhale: 'exhale', holdOut: null },
    isWimHof: false,
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Navy SEAL stress-regulation technique. Equal sides build rhythmic focus for pre-sleep.',
    tier: 'T1',
    phases: [
      { name: 'INHALE', duration: 4, color: '#3b82f6' },
      { name: 'HOLD', duration: 4, color: '#c9a84c' },
      { name: 'EXHALE', duration: 4, color: '#a855f7' },
      { name: 'HOLD_OUT', duration: 4, color: '#525770' },
    ],
    totalCycleDuration: 16,
    defaultCycles: 10,
    cues: { inhale: 'inhale', hold: 'hold', exhale: 'exhale', holdOut: 'hold' },
    isWimHof: false,
  },
  {
    id: 'diaphragmatic',
    name: 'Diaphragmatic',
    description: 'Extended exhale activates the parasympathetic system. Foundation technique for all practitioners.',
    tier: 'T1',
    phases: [
      { name: 'INHALE', duration: 4, color: '#3b82f6' },
      { name: 'EXHALE', duration: 6, color: '#a855f7' },
    ],
    totalCycleDuration: 10,
    defaultCycles: 15,
    cues: { inhale: 'inhale', hold: null, exhale: 'exhale', holdOut: null },
    isWimHof: false,
  },
  {
    id: 'relaxation',
    name: 'Simple Relaxation',
    description: 'Gentle 5-5 count for beginners. Eases into a calm, receptive state perfect for WILD entry.',
    tier: 'T1',
    phases: [
      { name: 'INHALE', duration: 5, color: '#3b82f6' },
      { name: 'EXHALE', duration: 5, color: '#a855f7' },
    ],
    totalCycleDuration: 10,
    defaultCycles: 12,
    cues: { inhale: 'inhale', hold: null, exhale: 'exhale', holdOut: null },
    isWimHof: false,
  },
  {
    id: 'wim-hof',
    name: 'Wim Hof Method',
    description: 'Hyperventilation + retention cycles. Alkalises the body, induces altered states ideal for WILD access.',
    tier: 'T2',
    phases: [
      { name: 'INHALE', duration: 1.5, color: '#0ea5e9' },
      { name: 'EXHALE', duration: 1.5, color: '#a855f7' },
    ],
    totalCycleDuration: 3,
    defaultCycles: 3,
    breathsPerCycle: 30,
    retentionDuration: 90,
    recoveryDuration: 15,
    cues: { inhale: 'inhale', hold: 'hold', exhale: 'exhale', holdOut: null },
    isWimHof: true,
  },
  {
    id: 'ssild',
    name: 'SSILD Cycles',
    description: 'Senses Initiated Lucid Dream breathing. Short rapid cycles prime the brain for hypnagogic imagery.',
    tier: 'T2',
    phases: [
      { name: 'INHALE', duration: 3, color: '#0ea5e9' },
      { name: 'EXHALE', duration: 3, color: '#a855f7' },
    ],
    totalCycleDuration: 6,
    defaultCycles: 20,
    cues: { inhale: 'inhale', hold: null, exhale: 'exhale', holdOut: null },
    isWimHof: false,
  },
  {
    id: 'pranayama',
    name: 'Alternate Nostril',
    description: 'Nadi Shodhana pranayama balances brain hemispheres and deepens meditative absorption.',
    tier: 'T2',
    phases: [
      { name: 'INHALE', duration: 4, color: '#3b82f6' },
      { name: 'HOLD', duration: 4, color: '#c9a84c' },
      { name: 'EXHALE', duration: 8, color: '#a855f7' },
      { name: 'HOLD_OUT', duration: 4, color: '#525770' },
    ],
    totalCycleDuration: 20,
    defaultCycles: 10,
    cues: { inhale: 'inhale', hold: 'hold', exhale: 'exhale', holdOut: 'hold' },
    isWimHof: false,
    notes: 'Alternate nostrils each cycle. Right nostril first, then left.',
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    description: '5.5 breath per minute resonance frequency. Maximises HRV and parasympathetic tone.',
    tier: 'T2',
    phases: [
      { name: 'INHALE', duration: 5.5, color: '#3b82f6' },
      { name: 'EXHALE', duration: 5.5, color: '#a855f7' },
    ],
    totalCycleDuration: 11,
    defaultCycles: 15,
    cues: { inhale: 'inhale', hold: null, exhale: 'exhale', holdOut: null },
    isWimHof: false,
  },
]

export function getPatternById(id) {
  return BREATHING_PATTERNS.find(p => p.id === id) || null
}

export function getPatternsByTier(tier) {
  const tierOrder = { T1: 1, T2: 2, T3: 3 }
  return BREATHING_PATTERNS.filter(p => tierOrder[p.tier] <= tierOrder[tier])
}

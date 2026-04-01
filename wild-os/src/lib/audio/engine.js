let Tone = null
let synth = null
let bellSynth = null
let leftOsc = null
let rightOsc = null
let leftPanner = null
let rightPanner = null
let leftGain = null
let rightGain = null
let masterGain = null
let binauralRunning = false
let initialised = false
let initialising = false

const BINAURAL_CARRIER = 200

const BEAT_FREQUENCIES = {
  delta: 2,
  theta: 6,
  alpha: 10,
  beta: 18,
  gamma: 40,
}

export function isInitialised() {
  return initialised
}

export async function initAudio() {
  if (initialised || initialising) return
  initialising = true
  try {
    const mod = await import('tone')
    Tone = mod
    await Tone.start()
    masterGain = new Tone.Gain(0.8).toDestination()
    initialised = true
  } catch (e) {
    console.warn('Audio engine failed to init:', e)
  } finally {
    initialising = false
  }
}

export async function playBell(times = 1) {
  if (!initialised) return
  try {
    if (!bellSynth) {
      bellSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 2.5, sustain: 0, release: 3 },
      }).connect(masterGain)
      bellSynth.volume.value = -18
    }
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        try { bellSynth.triggerAttackRelease('C5', '4n') } catch (_) {}
      }, i * 1400)
    }
  } catch (e) {
    console.warn('Bell error:', e)
  }
}

export async function playPhaseCue(phase) {
  if (!initialised) return
  const freqMap = {
    inhale: 'C4',
    hold: 'E4',
    exhale: 'G3',
    holdOut: 'A3',
  }
  const freq = freqMap[phase]
  if (!freq) return
  try {
    if (!synth) {
      synth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 0.5 },
      }).connect(masterGain)
      synth.volume.value = -24
    }
    synth.triggerAttackRelease(freq, '8n', Tone.now() + 0.05)
  } catch (e) {
    console.warn('Phase cue error:', e)
  }
}

export async function startBinaural(band = 'theta', volume = 0.5, carrier = BINAURAL_CARRIER) {
  if (!initialised) return
  if (binauralRunning) stopBinaural()
  try {
    const beatFreq = BEAT_FREQUENCIES[band] || BEAT_FREQUENCIES.theta
    const leftFreq = carrier
    const rightFreq = carrier + beatFreq

    leftPanner = new Tone.Panner(-1).connect(masterGain)
    rightPanner = new Tone.Panner(1).connect(masterGain)

    leftGain = new Tone.Gain(volume).connect(leftPanner)
    rightGain = new Tone.Gain(volume).connect(rightPanner)

    leftOsc = new Tone.Oscillator(leftFreq, 'sine').connect(leftGain)
    rightOsc = new Tone.Oscillator(rightFreq, 'sine').connect(rightGain)

    leftOsc.start()
    rightOsc.start()
    binauralRunning = true
  } catch (e) {
    console.warn('Binaural start error:', e)
  }
}

export function stopBinaural() {
  try {
    if (leftOsc) { leftOsc.stop(); leftOsc.dispose(); leftOsc = null }
    if (rightOsc) { rightOsc.stop(); rightOsc.dispose(); rightOsc = null }
    if (leftGain) { leftGain.dispose(); leftGain = null }
    if (rightGain) { rightGain.dispose(); rightGain = null }
    if (leftPanner) { leftPanner.dispose(); leftPanner = null }
    if (rightPanner) { rightPanner.dispose(); rightPanner = null }
  } catch (e) {
    console.warn('Binaural stop error:', e)
  }
  binauralRunning = false
}

export function setBinauralVolume(val) {
  if (!binauralRunning) return
  try {
    if (leftGain) leftGain.gain.rampTo(val, 0.1)
    if (rightGain) rightGain.gain.rampTo(val, 0.1)
  } catch (e) {}
}

export function setBinauralCarrier(carrier, band) {
  if (!binauralRunning) return
  try {
    const beatFreq = BEAT_FREQUENCIES[band] || BEAT_FREQUENCIES.theta
    if (leftOsc) leftOsc.frequency.rampTo(carrier, 0.1)
    if (rightOsc) rightOsc.frequency.rampTo(carrier + beatFreq, 0.1)
  } catch (e) {}
}

export function isBinauralRunning() {
  return binauralRunning
}

// ─── Zha'aric Lucidic Protocol v2 ──────────────────────────────────────────
// Layer 1 — Induction:     110 Hz (L) / 114 Hz (R)   → 4 Hz beat
// Layer 2 — Stabilization: 220 Hz (L) / 227.83 Hz (R) → 7.83 Hz beat
// Layer 3 — Awareness:     880 Hz (L) / 894 Hz (R)   → 14 Hz beat
// Layer 4 — Gamma bursts:  500 Hz (L) / 540 Hz (R)   → 40 Hz beat, every 45s for 1.5s
// Layer 5 — AM modulation: 0.15 Hz LFO on master gain
// ────────────────────────────────────────────────────────────────────────────

const ZHAARIC_LAYERS = [
  { leftFreq: 110,  rightFreq: 114,    gain: 0.38 },
  { leftFreq: 220,  rightFreq: 227.83, gain: 0.30 },
  { leftFreq: 880,  rightFreq: 894,    gain: 0.22 },
]

let zhaaricNodes = []
let zhaaricGammaNodes = null
let zhaaricLFO = null
let zhaaricMaster = null
let zhaaricRunning = false
let zhaaricGammaCallback = null

export async function startZhaaric(volume = 0.5) {
  if (!initialised) return
  if (zhaaricRunning) stopZhaaric()
  try {
    // Master gain for all Zhaaric layers
    zhaaricMaster = new Tone.Gain(volume).connect(masterGain)

    // Layer 5 — 0.15 Hz AM modulation (LFO oscillates gain between 0.55 and 1.0)
    zhaaricLFO = new Tone.LFO({ frequency: 0.15, min: 0.55, max: 1.0 })
    zhaaricLFO.connect(zhaaricMaster.gain)
    zhaaricLFO.start()

    // Layers 1–3 — binaural pairs
    zhaaricNodes = []
    for (const layer of ZHAARIC_LAYERS) {
      const lPan = new Tone.Panner(-1).connect(zhaaricMaster)
      const rPan = new Tone.Panner(1).connect(zhaaricMaster)
      const lGain = new Tone.Gain(layer.gain).connect(lPan)
      const rGain = new Tone.Gain(layer.gain).connect(rPan)
      const lOsc = new Tone.Oscillator(layer.leftFreq, 'sine').connect(lGain)
      const rOsc = new Tone.Oscillator(layer.rightFreq, 'sine').connect(rGain)
      lOsc.start()
      rOsc.start()
      zhaaricNodes.push({ lOsc, rOsc, lGain, rGain, lPan, rPan })
    }

    // Layer 4 — 40 Hz gamma burst (500/540 Hz → 40 Hz beat)
    const gLPan = new Tone.Panner(-1).connect(zhaaricMaster)
    const gRPan = new Tone.Panner(1).connect(zhaaricMaster)
    const gLGain = new Tone.Gain(0).connect(gLPan) // silent until burst
    const gRGain = new Tone.Gain(0).connect(gRPan)
    const gLOsc = new Tone.Oscillator(500, 'sine').connect(gLGain)
    const gROsc = new Tone.Oscillator(540, 'sine').connect(gRGain)
    gLOsc.start()
    gROsc.start()
    zhaaricGammaNodes = { gLOsc, gROsc, gLGain, gRGain, gLPan, gRPan }

    // Gamma burst scheduler — fires at 10s, then every 45s
    let burstCount = 0
    const triggerBurst = () => {
      if (!zhaaricRunning) return
      burstCount++
      gLGain.gain.rampTo(0.45, 0.05)
      gRGain.gain.rampTo(0.45, 0.05)
      if (zhaaricGammaCallback) zhaaricGammaCallback(burstCount)
      setTimeout(() => {
        if (zhaaricRunning) {
          gLGain.gain.rampTo(0, 0.15)
          gRGain.gain.rampTo(0, 0.15)
        }
      }, 1500)
    }

    const firstTimer = setTimeout(triggerBurst, 10000)
    const interval = setInterval(triggerBurst, 45000)
    zhaaricGammaNodes._firstTimer = firstTimer
    zhaaricGammaNodes._interval = interval

    zhaaricRunning = true
  } catch (e) {
    console.warn('Zhaaric start error:', e)
  }
}

export function stopZhaaric() {
  try {
    if (zhaaricGammaNodes) {
      clearInterval(zhaaricGammaNodes._interval)
      clearTimeout(zhaaricGammaNodes._firstTimer)
      zhaaricGammaNodes.gLOsc.stop(); zhaaricGammaNodes.gLOsc.dispose()
      zhaaricGammaNodes.gROsc.stop(); zhaaricGammaNodes.gROsc.dispose()
      zhaaricGammaNodes.gLGain.dispose(); zhaaricGammaNodes.gRGain.dispose()
      zhaaricGammaNodes.gLPan.dispose(); zhaaricGammaNodes.gRPan.dispose()
      zhaaricGammaNodes = null
    }
    for (const n of zhaaricNodes) {
      n.lOsc.stop(); n.lOsc.dispose()
      n.rOsc.stop(); n.rOsc.dispose()
      n.lGain.dispose(); n.rGain.dispose()
      n.lPan.dispose(); n.rPan.dispose()
    }
    zhaaricNodes = []
    if (zhaaricLFO) { zhaaricLFO.stop(); zhaaricLFO.dispose(); zhaaricLFO = null }
    if (zhaaricMaster) { zhaaricMaster.dispose(); zhaaricMaster = null }
  } catch (e) {
    console.warn('Zhaaric stop error:', e)
  }
  zhaaricRunning = false
  zhaaricGammaCallback = null
}

export function setZhaaricVolume(val) {
  if (!zhaaricRunning || !zhaaricMaster) return
  try { zhaaricMaster.gain.rampTo(val, 0.15) } catch (e) {}
}

export function onZhaaricGammaBurst(cb) {
  zhaaricGammaCallback = cb
}

export function isZhaaricRunning() {
  return zhaaricRunning
}

/* ════════════════════════════════════════════════════════════════════════
   WILD — Threshold Audio Engine  (harmonic brainwave morph, v2)
   A state-morphing Web Audio journey in three phases:

     Phase 1 — THE HOOK        alert, aware, slightly ominous   (the creative ad)
     Phase 2 — THE MORPH       ~12s harmonic transition
     Phase 3 — THE RESOLUTION  calm, tranquil pentatonic pad    (the landing page)

   ── The harmonic design ────────────────────────────────────────────────
   Everything is in A, over a STABLE 110 Hz pedal (A2). The pedal never moves —
   a fixed ground is what makes the journey feel like *arriving home* rather
   than a queasy pitch-slide. Three things resolve, all at once, during the morph:

     1. BINAURAL BEAT descends by exact octaves: 8 → 4 → 2 Hz, i.e.
        alpha/theta border (alert) → theta → delta (deep calm). Driven by a
        GEOMETRIC curve, so it passes through exactly 4 Hz at the midpoint —
        each phase boundary is a true 2:1 octave. Harmonic scaling, literally.

     2. An ominous ♭2 TENSION tone (just minor-2nd, 16/15) sounds a minor-9th
        against the pedal's overtone in the hook (Phrygian dread), then glides
        DOWN a just semitone to the root (16/15 → 1/1) and fades — a real
        harmonic resolution, tension melting into repose.

     3. The PAD is tuned in pure JUST INTONATION (1/1, 9/8, 5/4, 3/2, 5/3):
        beatless, *still* consonance, weighted toward root & fifth so the
        arrival feels settled. It blooms in reverb as the drone sinks beneath it.

   The hook's edge comes from the 8 Hz beat + the ♭2 + a touch more brightness —
   NOT from a harsh waveform. It stays a low warm hum throughout.

   Public API (all transitions are AudioParam-automated, click-safe):
     WildAudio.start()            // begin Phase 1 (call from a user gesture)
     WildAudio.morph(seconds)     // trigger Phase 1 -> 3 over `seconds` (default 12)
     WildAudio.startResolved()    // skip the hook, begin already-calm (direct landing)
     WildAudio.setMasterVolume(v) // 0..1
     WildAudio.stop(fadeSeconds)  // gentle fade-out + teardown
     WildAudio.isPlaying()        // bool

   Headphones give true binaural separation; speakers degrade gracefully to a
   monaural amplitude beat. Either way it stays subtle.
   ════════════════════════════════════════════════════════════════════════ */

const WildAudio = (function () {
  'use strict';

  // ── Tunable constants ──────────────────────────────────────────────────
  const CARRIER      = 110;     // Hz — A2 pedal. Stable tonic ground throughout.

  // Binaural beat: octave halvings 8 → 4 → 2 (alpha/theta → theta → delta).
  const BEAT_HOOK    = 8;       // Hz — alpha/theta border (alert, aware)
  const BEAT_REST    = 2;       // Hz — delta (deep calm). Midpoint is 4 Hz theta.

  const CUTOFF_HOOK  = 560;     // Hz — LPF: a little presence/edge, still warm
  const CUTOFF_REST  = 300;     // Hz — LPF closed: muffled, soft, a low hum

  const DRONE_HOOK   = 0.34;    // drone level in Phase 1 (primary) — matched up so the
                                //   lone hook reads as present as the layered resolution
  const DRONE_REST   = 0.15;    // drone level in Phase 3 (background undertone)

  // Ominous ♭2 tension voice (Phrygian dread) — resolves ♭2 → root in the morph.
  const TENSION_BASE = 220;     // A3 (root, two octaves above the pedal)
  const TENSION_FREQ = TENSION_BASE * 16 / 15; // ≈234.67 Hz — just minor 2nd
  const TENSION_REST = TENSION_BASE;           // resolve down to the root (220)
  const TENSION_HOOK = 0.06;    // level of the unease tone in the hook

  const PAD_REST     = 0.30;    // pad level in Phase 3 (the new focus)
  const MASTER_DEF   = 0.5;     // overall headroom — kept gentle on purpose
  const BREATH_RATE  = 0.1;     // Hz — ~10s restful breath cycle
  const BREATH_DEPTH = 0.045;   // breathing swell depth (Phase 3)

  // ── Pad: pure JUST-INTONATION major pentatonic on A (ROOT = A3) ──────────
  // Pure ratios = no beating = a "still", tranquil pad.
  const ROOT = 220;                                   // A3
  const JUST = [1/1, 9/8, 5/4, 3/2, 5/3,              // A  B  C# E  F#
                2/1, 9/4, 5/2, 3/1, 10/3];            // +octave
  const PENTA = JUST.map(r => ROOT * r);
  // Weighted pool — tonic (A) and fifth (E) recur most, so the resolution settles.
  const PENTA_POOL = [
    PENTA[0], PENTA[0],   // A  root  ×2
    PENTA[1],             // B
    PENTA[2],             // C#
    PENTA[3], PENTA[3],   // E  fifth ×2
    PENTA[4],             // F#
    PENTA[5], PENTA[5],   // A  octave ×2
    PENTA[6], PENTA[7],   // B  C#
    PENTA[8],             // E
    PENTA[9],             // F#
  ];

  // ── State ──────────────────────────────────────────────────────────────
  let ctx = null, master = null;
  let reverb = null, reverbReturn = null;        // shared reverb bus
  let oscL = null, oscR = null;                   // binaural pair
  let droneFilter = null, droneGain = null;       // drone tone + level
  let droneDry = null, droneWet = null;           // drone dry vs reverb-send (the "wash")
  let tensionOsc = null, tensionGain = null;      // the ominous ♭2 voice
  let breathLFO = null, breathDepth = null;       // slow breathing swell
  let padBus = null, padGain = null;              // generative pad sum
  let padDry = null, padWet = null;
  let padTimer = null, nextNoteTime = 0;
  let playing = false, morphing = false, currentProgress = 0;

  // ── Synthetic reverb impulse (no external file needed) ─────────────────
  function makeImpulse(seconds, decay) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        // decaying white noise -> a soft, long ambient tail
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  // ── Geometric beat curve: oscR follows CARRIER + beat, beat halving evenly ──
  // A geometric (octave-even) descent passes through exactly 4 Hz at the
  // midpoint of an 8 → 2 sweep, so every phase boundary is a true 2:1 octave.
  function beatCurve(fromBeat, toBeat, n) {
    const arr = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = CARRIER + fromBeat * Math.pow(toBeat / fromBeat, i / (n - 1));
    }
    return arr;
  }

  // ── Build the full graph (idempotent) ──────────────────────────────────
  function build() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();

    master = ctx.createGain();
    master.gain.value = MASTER_DEF;
    master.connect(ctx.destination);

    // Shared lush reverb bus
    reverb = ctx.createConvolver();
    reverb.buffer = makeImpulse(4.5, 3.2);
    reverbReturn = ctx.createGain();
    reverbReturn.gain.value = 0.9;
    reverb.connect(reverbReturn).connect(master);

    // ── DRONE (binaural pair -> filter -> level -> dry/wet) ──────────────
    oscL = ctx.createOscillator(); oscR = ctx.createOscillator();
    oscL.type = 'triangle'; oscR.type = 'triangle'; // soft harmonics -> a low warm hum
    oscL.frequency.value = CARRIER;
    oscR.frequency.value = CARRIER + BEAT_HOOK;

    const panL = new StereoPannerNode(ctx, { pan: -1 });
    const panR = new StereoPannerNode(ctx, { pan:  1 });

    droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = CUTOFF_HOOK;
    droneFilter.Q.value = 0.7;

    droneGain = ctx.createGain();
    droneGain.gain.value = DRONE_HOOK;

    // Breathing LFO modulates the drone level around its automated centre.
    breathLFO = ctx.createOscillator();
    breathLFO.type = 'sine';
    breathLFO.frequency.value = BREATH_RATE;
    breathDepth = ctx.createGain();
    breathDepth.gain.value = 0;           // off in the hook; ramped in during morph
    breathLFO.connect(breathDepth).connect(droneGain.gain);

    droneDry = ctx.createGain(); droneDry.gain.value = 0.9; // mostly dry in the hook
    droneWet = ctx.createGain(); droneWet.gain.value = 0.1; // little reverb in the hook

    oscL.connect(panL).connect(droneFilter);
    oscR.connect(panR).connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(droneDry).connect(master);
    droneGain.connect(droneWet).connect(reverb);

    // ── TENSION (the ominous ♭2 -> resolves to root) ─────────────────────
    tensionOsc = ctx.createOscillator();
    tensionOsc.type = 'triangle';
    tensionOsc.frequency.value = TENSION_FREQ;
    tensionOsc.detune.value = 5;          // a few cents -> a slow ominous shimmer
    tensionGain = ctx.createGain();
    tensionGain.gain.value = 0;           // set per-entry (hook: TENSION_HOOK; resolved: 0)
    tensionOsc.connect(tensionGain).connect(master);

    // ── PAD (generative voices summed here) ──────────────────────────────
    padBus = ctx.createGain(); padBus.gain.value = 1;
    padGain = ctx.createGain(); padGain.gain.value = 0; // silent until morph
    padDry = ctx.createGain(); padDry.gain.value = 0.45;
    padWet = ctx.createGain(); padWet.gain.value = 0.7; // pad sits in lots of reverb
    padBus.connect(padGain);
    padGain.connect(padDry).connect(master);
    padGain.connect(padWet).connect(reverb);
  }

  // ── One generative pad note (slow swell, long overlap, just-intoned) ─────
  function playPadNote(when) {
    const freq = PENTA_POOL[(Math.random() * PENTA_POOL.length) | 0];
    const dur  = 8 + Math.random() * 4;            // 8–12s, so notes overlap

    // two minutely detuned voices = a living, chorused pad (kept tiny to
    // preserve the purity of the just intervals — shimmer, not beating)
    const a = ctx.createOscillator(), b = ctx.createOscillator();
    a.type = 'sine'; b.type = 'triangle';
    a.frequency.value = freq;
    b.frequency.value = freq;
    b.detune.value = 4;                            // ~4 cents apart

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(0.18, when + 3.0);          // slow attack
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);        // slow release

    a.connect(g); b.connect(g); g.connect(padBus);
    a.start(when); b.start(when);
    a.stop(when + dur + 0.1); b.stop(when + dur + 0.1);
  }

  function startPadScheduler() {
    if (padTimer) return;
    nextNoteTime = ctx.currentTime + 0.2;
    padTimer = setInterval(function () {
      while (nextNoteTime < ctx.currentTime + 0.6) {   // 0.6s lookahead
        playPadNote(nextNoteTime);
        nextNoteTime += 3 + Math.random() * 3;          // new note every 3–6s
      }
    }, 250);
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────
  function start() {
    build();
    if (ctx.state === 'suspended') ctx.resume();
    if (playing) return;
    const t = ctx.currentTime;
    tensionGain.gain.setValueAtTime(TENSION_HOOK, t);   // the unease is present
    oscL.start(t); oscR.start(t); tensionOsc.start(t); breathLFO.start(t);
    // gentle fade-in so the hook arrives rather than snaps on
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(MASTER_DEF, t + 1.5);
    playing = true;
  }

  // ── Harmonic progress model ─────────────────────────────────────────────
  // progress 0 = the Hook (alert / slightly ominous), 1 = the Resolution
  // (calm / tranquil). applyState() ramps EVERY parameter to its interpolated
  // value at `target`, so the journey can advance in stages (one step per
  // "Yes") or all at once. The binaural beat follows a geometric (octave-even)
  // law, so the descent stays harmonic at any partial progress.
  function beatAt(p) { return BEAT_HOOK * Math.pow(BEAT_REST / BEAT_HOOK, p); }
  function lin(a, b, p) { return a + (b - a) * p; }
  function expo(a, b, p) { return a * Math.pow(b / a, p); }

  function applyState(target, seconds) {
    if (!playing) return;
    target = Math.max(0, Math.min(1, target));
    const D = Math.max(0.3, seconds || 12);
    const t = ctx.currentTime;
    const end = t + D;

    // re-targetable linear ramp (cancel any in-flight automation first)
    const ramp = function (param, value) {
      param.cancelScheduledValues(t);
      param.setValueAtTime(param.value, t);
      param.linearRampToValueAtTime(value, end);
    };

    // Brightness: warm presence -> closed/muffled (exponential = natural for Hz)
    droneFilter.frequency.cancelScheduledValues(t);
    droneFilter.frequency.setValueAtTime(droneFilter.frequency.value, t);
    droneFilter.frequency.exponentialRampToValueAtTime(expo(CUTOFF_HOOK, CUTOFF_REST, target), end);

    // Binaural beat: octave-even descent 8 -> 4 -> 2 Hz (alpha/theta -> delta)
    ramp(oscR.frequency, CARRIER + beatAt(target));

    // Drone recedes; washes from dry into reverb
    ramp(droneGain.gain, lin(DRONE_HOOK, DRONE_REST, target));
    ramp(droneDry.gain, lin(0.9, 0.18, target));
    ramp(droneWet.gain, lin(0.1, 0.85, target));

    // Ominous flat-2 resolves DOWN a just semitone to the root and fades out
    // by ~60% of the journey — tension melting into repose.
    const tp = Math.min(1, target / 0.6);
    tensionOsc.frequency.cancelScheduledValues(t);
    tensionOsc.frequency.setValueAtTime(tensionOsc.frequency.value, t);
    tensionOsc.frequency.exponentialRampToValueAtTime(expo(TENSION_FREQ, TENSION_REST, tp), end);
    tensionGain.gain.cancelScheduledValues(t);
    tensionGain.gain.setValueAtTime(Math.max(0.0001, tensionGain.gain.value), t);
    tensionGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, TENSION_HOOK * (1 - tp)), end);

    // Breathing swell eases in
    ramp(breathDepth.gain, lin(0, BREATH_DEPTH, target));

    // Generative pad blooms with progress
    if (target > 0.12) startPadScheduler();
    ramp(padGain.gain, target <= 0.12 ? 0.0001 : Math.max(0.0001, PAD_REST * target));

    currentProgress = target;
  }

  /* PHASE 2 — THE MORPH. Drive the whole journey to the Resolution at once. */
  function morph(seconds) {
    if (!playing) return;
    morphing = true;
    applyState(1, Math.max(6, seconds || 12));
  }

  /* Advance the journey partway (0 = Hook .. 1 = Resolution). Re-callable —
     e.g. one step per question answered. Default glide 4s. */
  function morphTo(target, seconds) {
    if (!playing) return;
    morphing = true;
    applyState(target, seconds || 4);
  }

  /* Skip the hook — begin already resolved (visitor lands directly, no ad). */
  function startResolved() {
    build();
    if (ctx.state === 'suspended') ctx.resume();
    if (playing) { morph(0.001); return; }
    // pre-set every param to its Phase-3 value, then start
    oscL.type = 'sine'; oscR.type = 'sine';
    oscR.frequency.value = CARRIER + BEAT_REST;     // 2 Hz delta beat
    droneFilter.frequency.value = CUTOFF_REST;
    droneGain.gain.value = DRONE_REST;
    droneDry.gain.value = 0.18; droneWet.gain.value = 0.85;
    breathDepth.gain.value = BREATH_DEPTH;
    const t = ctx.currentTime;
    tensionGain.gain.setValueAtTime(0, t);          // no unease on a direct landing
    oscL.start(t); oscR.start(t); tensionOsc.start(t); breathLFO.start(t);
    startPadScheduler();
    padGain.gain.setValueAtTime(0.0001, t);
    padGain.gain.exponentialRampToValueAtTime(PAD_REST, t + 4);
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(MASTER_DEF, t + 3);
    playing = true; morphing = true; currentProgress = 1;
  }

  function setMasterVolume(v) {
    if (!master) return;
    master.gain.linearRampToValueAtTime(
      Math.max(0, Math.min(1, v)), ctx.currentTime + 0.3);
  }

  function stop(fade) {
    if (!ctx || !playing) return;
    const f = fade || 2;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(0.0001, t + f);
    setTimeout(function () {
      if (padTimer) { clearInterval(padTimer); padTimer = null; }
      try { ctx.close(); } catch (e) {}
      ctx = null; playing = false; morphing = false;
    }, (f + 0.2) * 1000);
  }

  return {
    start: start,
    morph: morph,
    morphTo: morphTo,
    startResolved: startResolved,
    setMasterVolume: setMasterVolume,
    stop: stop,
    isPlaying: function () { return playing; },
    getProgress: function () { return currentProgress; },
  };
})();

/* Expose for module + plain-script use */
if (typeof module !== 'undefined' && module.exports) module.exports = WildAudio;
if (typeof window !== 'undefined') window.WildAudio = WildAudio;

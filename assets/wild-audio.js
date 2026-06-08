/* ════════════════════════════════════════════════════════════════════════
   WILD — Threshold Audio Engine
   A state-morphing Web Audio journey in three phases:

     Phase 1 — THE HOOK        restless, edgy beta-wave drone   (the creative ad)
     Phase 2 — THE MORPH       ~12s automated transition
     Phase 3 — THE RESOLUTION  calm generative pentatonic pad   (the landing page)

   Design intent: the drone is NOT meant to be obnoxious. In the hook it is the
   primary, slightly tense element; by the resolution it has sunk to a physical
   undertone (~15% level, washed in reverb) beneath a soothing generative pad.

   Public API (all transitions are AudioParam-automated, click-safe):
     WildAudio.start()            // begin Phase 1 (call from a user gesture)
     WildAudio.morph(seconds)     // trigger Phase 1 -> 3 over `seconds` (default 12)
     WildAudio.startResolved()    // skip the hook, begin already-calm (direct landing)
     WildAudio.setMasterVolume(v) // 0..1
     WildAudio.stop(fadeSeconds)  // gentle fade-out + teardown
     WildAudio.isPlaying()        // bool

   Headphones give true binaural separation; speakers degrade gracefully to a
   monaural beat. Either way it stays subtle.
   ════════════════════════════════════════════════════════════════════════ */

const WildAudio = (function () {
  'use strict';

  // ── Tunable constants ──────────────────────────────────────────────────
  const CARRIER      = 110;     // Hz — base carrier (A2). Warm, low, non-fatiguing.
  const BEAT_START   = 13;      // Hz — restless Beta (tension / anticipation)
  const BEAT_END     = 5;       // Hz — relaxing Theta (let-go)
  const CUTOFF_START = 700;     // Hz — LPF: lets a little movement through, but warm not harsh
  const CUTOFF_END   = 350;     // Hz — LPF closed: muffled, soft
  const DRONE_HOOK   = 0.26;    // drone level in Phase 1 (primary)
  const DRONE_REST   = 0.15;    // drone level in Phase 3 (background undertone)
  const PAD_REST     = 0.32;    // pad level in Phase 3 (the new focus)
  const MASTER_DEF   = 0.5;     // overall headroom — kept gentle on purpose

  // Major pentatonic on A (warm, consonant): offsets 0,2,4,7,9 semitones,
  // spread across two octaves for a slow, overlapping ambient texture.
  const ROOT = 220; // A3
  const PENTA_SEMITONES = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  const PENTA = PENTA_SEMITONES.map(s => ROOT * Math.pow(2, s / 12));

  // ── State ──────────────────────────────────────────────────────────────
  let ctx = null, master = null;
  let reverb = null, reverbReturn = null;        // shared reverb bus
  let oscL = null, oscR = null;                   // binaural pair
  let droneFilter = null, droneGain = null;       // drone tone + level
  let droneDry = null, droneWet = null;           // drone dry vs reverb-send (the "wash")
  let breathLFO = null, breathDepth = null;       // slow breathing swell
  let padBus = null, padGain = null;              // generative pad sum
  let padDry = null, padWet = null;
  let padTimer = null, nextNoteTime = 0;
  let playing = false, morphing = false;

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
    oscL.type = 'triangle'; oscR.type = 'triangle'; // soft, gentle harmonics -> a low warm hum (not a buzzy square)
    oscL.frequency.value = CARRIER;
    oscR.frequency.value = CARRIER + BEAT_START;

    const panL = new StereoPannerNode(ctx, { pan: -1 });
    const panR = new StereoPannerNode(ctx, { pan:  1 });

    droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = CUTOFF_START;
    droneFilter.Q.value = 0.7;

    droneGain = ctx.createGain();
    droneGain.gain.value = DRONE_HOOK;

    // Breathing LFO modulates the drone level around its automated centre.
    breathLFO = ctx.createOscillator();
    breathLFO.type = 'sine';
    breathLFO.frequency.value = 0.12;     // ~5s in / 5s out
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

    // ── PAD (generative voices summed here) ──────────────────────────────
    padBus = ctx.createGain(); padBus.gain.value = 1;
    padGain = ctx.createGain(); padGain.gain.value = 0; // silent until morph
    padDry = ctx.createGain(); padDry.gain.value = 0.45;
    padWet = ctx.createGain(); padWet.gain.value = 0.7; // pad sits in lots of reverb
    padBus.connect(padGain);
    padGain.connect(padDry).connect(master);
    padGain.connect(padWet).connect(reverb);
  }

  // ── One generative pad note (slow swell, long overlap) ──────────────────
  function playPadNote(when) {
    const freq = PENTA[(Math.random() * PENTA.length) | 0];
    const dur  = 8 + Math.random() * 4;            // 8–12s, so notes overlap

    // two gently detuned voices = a living, chorused pad
    const a = ctx.createOscillator(), b = ctx.createOscillator();
    a.type = 'sine'; b.type = 'triangle';
    a.frequency.value = freq;
    b.frequency.value = freq;
    b.detune.value = 6;                            // a few cents apart

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
    oscL.start(t); oscR.start(t); breathLFO.start(t);
    // gentle fade-in so the hook arrives rather than snaps on
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(MASTER_DEF, t + 1.5);
    playing = true;
  }

  /* PHASE 2 — THE MORPH. Everything below is one coordinated automation. */
  function morph(seconds) {
    if (!playing || morphing) return;
    morphing = true;
    const D = Math.max(6, seconds || 12);
    const t = ctx.currentTime;
    const end = t + D;

    // Filter sweep: open/edgy -> closed/muffled
    droneFilter.frequency.cancelScheduledValues(t);
    droneFilter.frequency.setValueAtTime(droneFilter.frequency.value, t);
    droneFilter.frequency.linearRampToValueAtTime(CUTOFF_END, end);

    // Binaural slowdown: Beta -> Theta (ramp the right ear toward the carrier)
    oscR.frequency.setValueAtTime(CARRIER + BEAT_START, t);
    oscR.frequency.linearRampToValueAtTime(CARRIER + BEAT_END, end);

    // Drone recedes to a background undertone
    droneGain.gain.setValueAtTime(droneGain.gain.value, t);
    droneGain.gain.linearRampToValueAtTime(DRONE_REST, end);

    // Wash the drone: pull it out of the dry path and into the reverb
    droneDry.gain.setValueAtTime(droneDry.gain.value, t);
    droneDry.gain.linearRampToValueAtTime(0.18, end);
    droneWet.gain.setValueAtTime(droneWet.gain.value, t);
    droneWet.gain.linearRampToValueAtTime(0.85, end);

    // Breathing swell fades in
    breathDepth.gain.setValueAtTime(0, t);
    breathDepth.gain.linearRampToValueAtTime(0.045, end);

    // Crossfade in the generative pad
    startPadScheduler();
    padGain.gain.setValueAtTime(0.0001, t);
    padGain.gain.linearRampToValueAtTime(PAD_REST, end);
  }

  /* Skip the hook — begin already resolved (visitor lands directly, no ad). */
  function startResolved() {
    build();
    if (ctx.state === 'suspended') ctx.resume();
    if (playing) { morph(0.001); return; }
    // pre-set every param to its Phase-3 value, then start
    oscL.type = 'sine'; oscR.type = 'sine';
    oscR.frequency.value = CARRIER + BEAT_END;
    droneFilter.frequency.value = CUTOFF_END;
    droneGain.gain.value = DRONE_REST;
    droneDry.gain.value = 0.18; droneWet.gain.value = 0.85;
    breathDepth.gain.value = 0.045;
    const t = ctx.currentTime;
    oscL.start(t); oscR.start(t); breathLFO.start(t);
    startPadScheduler();
    padGain.gain.setValueAtTime(0.0001, t);
    padGain.gain.exponentialRampToValueAtTime(PAD_REST, t + 4);
    master.gain.setValueAtTime(0.0001, t);
    master.gain.exponentialRampToValueAtTime(MASTER_DEF, t + 3);
    playing = true; morphing = true;
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
    startResolved: startResolved,
    setMasterVolume: setMasterVolume,
    stop: stop,
    isPlaying: function () { return playing; },
  };
})();

/* Expose for module + plain-script use */
if (typeof module !== 'undefined' && module.exports) module.exports = WildAudio;
if (typeof window !== 'undefined') window.WildAudio = WildAudio;

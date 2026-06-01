# Micropage 1 — "The Hidden Third"

**Status:** Spec for build. Not yet implemented as HTML.
**URL when live:** `wildprogramme.com/i/hidden-third` (the `/i/` reads as *initiate* or *inside* — consistent code across all micropages)
**Persona served:** Universal entry point — works for all six personas. Lowest-aggression, highest-shareability.
**Function:** First door into the WILD experience. Recognition gate. Funnels to integrated landing page if recognition succeeds.
**Source manifesto:** `01 - Strategy/WILD_Manifesto.md`

---

## Reader experience — beat by beat

| Beat | Time | What happens | Audio |
|---|---|---|---|
| 1 | 0–2s | Black screen. Single line fades in centred: **"You sleep about 8 hours a night."** | Low ambient drone fades in (60-80Hz range) |
| 2 | 2–4s | The "8" subtly animates — eight small marks appear in sequence below the line, like notches on a clock face. Drone continues. | Continued drone, no change |
| 3 | 4–5s | Screen darkens by 15%. A second line types itself in below the first, slower than reading speed: **"You have never been awake for one of them."** | **STRIKE.** Single low sub-bass thump (~50Hz) on the word "never". A sustained higher note (200-300Hz) holds underneath. |
| 4 | 5–8s | Both lines hold on screen. No movement. The reader processes. | Drone + sustained note continue. No new sound. |
| 5 | 8–10s | Recognition gate appears below. Two buttons emerge with soft fade. | Subtle high-frequency texture enters (like distant wind) |
| — | indefinite | Reader chooses. Page waits. | Looping drone holds the moment |

### The recognition gate

Two buttons. Equal weight. No "primary" CTA styling — they're presented as a real choice, not a funnel.

```
┌──────────────────────────┐    ┌──────────────────────────┐
│  This applies to me.     │    │  I am not sure yet.      │
└──────────────────────────┘    └──────────────────────────┘
```

**On hover (either button):**
- Subtle glow effect (soft white outline)
- Small audio cue: single soft chime at ~440Hz (pleasant, not aggressive)
- Mobile: gentle haptic feedback (`navigator.vibrate(20)`)

### Branch A — "This applies to me"

| Beat | Time | What happens | Audio |
|---|---|---|---|
| A1 | 0–1s | Button confirms with brief flash. Text fades to black. | Soft ascending chord (3 notes, ~1.5s) |
| A2 | 1–3s | New text fades in, centered: **"Then we go to the next door."** | Drone returns, slightly brighter timbre |
| A3 | 3–5s | Single button appears: **"Continue →"** | Drone holds |
| A4 | on click | Transition to **Micropage 2: "The Fraction"** OR directly to the integrated landing page (depending on the configured journey — see Routing below) | Soft chime + transition fade |

### Branch B — "I am not sure yet"

| Beat | Time | What happens | Audio |
|---|---|---|---|
| B1 | 0–1s | Button confirms quietly. Text fades to black. | Soft descending minor cadence (3 notes, ~2s) |
| B2 | 1–3s | New text fades in: **"Then this is not for you today."** | Single sustained low note, no drone |
| B3 | 3–5s | Beat. Just text. | Silence (very subtle ambient hush) |
| B4 | 5–8s | Second line fades in below: **"Come back when something shifts."** | Single bell-like note (~660Hz, gentle) |
| B5 | 8–∞ | Page sits. Nothing more happens. Small text appears in corner after 10s: *"You can close this tab."* | Silence resumes |

**Critical:** Branch B does NOT capture an email. It does NOT offer a consolation download. It does NOT have a "well, but you might still like..." softener. The exclusivity only works if it is real.

---

## Copy — every word that appears

```
[Beat 1, large centred text]
You sleep about 8 hours a night.

[Beat 3, below the first line]
You have never been awake for one of them.

[Beat 5, recognition gate buttons]
This applies to me.
I am not sure yet.

[Branch A reveal]
Then we go to the next door.

[Branch A button]
Continue →

[Branch B reveal — first line]
Then this is not for you today.

[Branch B reveal — second line, 5 seconds later]
Come back when something shifts.

[Branch B, after 10 seconds]
You can close this tab.
```

That's the entire word count. Everything else is space, timing, and sound.

---

## Visual design language

| Element | Specification |
|---|---|
| Background | Pure black (`#000000`). Always. No gradient. No image. |
| Primary text colour | Off-white (`#F4F1ED`). Not pure white — pure white reads clinical, off-white reads warm. |
| Accent colour | Single — deep indigo (`#2D1B69`) OR amber (`#C9A84C`). Used sparingly for button outlines, sub-bass strike colour shifts. **[USER: pick one — connects to glyph palette later]** |
| Typeface | Single serif throughout. Recommended: **New Spirit Medium** (Pangram Pangram, free), or **Lora** (Google Fonts, free), or **Cormorant Garamond** (Google Fonts, free, most premium). NO sans-serif. NO display fonts. |
| Type sizing | Hook text: 32-40px desktop / 24-28px mobile. Buttons: 16-18px. Closing micro-copy: 12-13px. |
| Line spacing | 1.6× for hook text. Generous breathing room. |
| Animations | All text appears via opacity fade only (no slide, no bounce, no scale). Durations: 600-1200ms ease-in-out. The restraint IS the design. |
| Cursor | Default. No custom cursor. Custom cursors feel like 2005 portfolio sites. |
| Layout | Centred vertically and horizontally. Generous margins. On mobile, 32px side padding minimum. |

**Aesthetic reference points (not for copying, for spirit):**
- The opening seconds of a Bergman film
- The pause before someone says something they have been holding
- A meditation app stripped of all its UI
- The text-only sections of Apple's iPhone product pages
- The pages of a serious book opened to a single underlined line

---

## Audio design

Three layers, all built from defensible acoustic principles. **No Solfeggio frequency claims. No "528Hz love frequency" marketing. No pseudoscience.**

| Layer | What it is | When it plays | Why |
|---|---|---|---|
| **Ambient drone** | Slow, evolving low-frequency drone in the 60-80Hz range with subtle harmonic overtones | Continuous from page load through Beat 4 | Low-frequency continuous sound is well-documented to shift physiological state — slower breathing, reduced cortical arousal. This effect doesn't require specific "magical" frequencies, just sustained low-frequency content. |
| **Strike thump** | Single sub-bass thump at ~50Hz, fast attack, ~1.2s decay | Once, at Beat 3 on the word "never" | Sub-bass content lands physically — felt in the body more than heard. Marks the strike viscerally. |
| **Sustained interval** | Single note ~200-300Hz, sustained 4-6 seconds | Begins on Beat 3, decays through Beat 5 | A sustained pitched note creates a moment of held attention; the brain locks onto sustained tones in a way it doesn't with silence |
| **Recognition gate chime** | Brief 440Hz chime on button hover | On hover | Reinforces the choice as ritual, not transactional |
| **Branch A ascending** | Three-note ascending chord (C-E-G, ~1.5s total) | On Branch A click | Tonal resolution = "continuation" feeling |
| **Branch B descending** | Three-note descending minor cadence (A-F-C, ~2s) | On Branch B click | Tonal resolution = "ending" feeling. Not mournful, not punishing. Just closed. |

**Tech recommendation:** Use [Howler.js](https://howlerjs.com) for cross-browser audio. Pre-load all sounds on page-load. Auto-play the drone after first interaction (browser autoplay restrictions). Provide a mute toggle in the corner — small, easy to dismiss but always available.

**Headphones prompt (optional but recommended):**
Before the experience begins, a single tiny line at the bottom of the page: *"Headphones recommended."* No popup, no insistence. Just a quiet note.

---

## Recognition gate logic — technical

```javascript
// Pseudocode for the recognition gate behaviour

function showRecognitionGate() {
  fadeIn('#gate-buttons', 800);
  playAudio('ambient-hush');

  on('#applies-to-me', 'click', () => {
    track('recognition_yes', { micropage: 'hidden-third' });
    playAudio('ascending-chord');
    transition('branch-a');
  });

  on('#not-sure-yet', 'click', () => {
    track('recognition_no', { micropage: 'hidden-third' });
    playAudio('descending-cadence');
    transition('branch-b');
  });
}

function branchA() {
  fadeText('Then we go to the next door.', 1200);
  setTimeout(() => showContinueButton(), 2000);
  on('#continue', 'click', () => {
    navigateTo('/landing'); // or next micropage per routing config
  });
}

function branchB() {
  fadeText('Then this is not for you today.', 1200);
  setTimeout(() => fadeText('Come back when something shifts.', 1200), 5000);
  setTimeout(() => showCloseHint(), 10000);
  // No further interaction available. No email capture. No softening.
}
```

**Analytics events to fire (for measuring later):**
- `micropage_loaded` — page reached
- `strike_completed` — reader saw the strike beat (8 seconds elapsed)
- `recognition_yes` / `recognition_no` — branch chosen
- `continued_forward` — clicked through Branch A
- `time_to_recognition` — seconds between gate appearing and choice made

The `recognition_no` rate is your most important brand-health metric. If it's >70%, your ad targeting is wrong. If it's <10%, your gate is too lenient. Healthy band: 25-50%.

---

## Routing — where Branch A leads

Two configurations possible:

**Option 1: Direct to integrated landing**
`Hidden Third → Branch A → Integrated landing page`
- Simpler funnel. Fewer drop-off points.
- The integrated landing carries the full weight of conversion.

**Option 2: Chained micropages**
`Hidden Third → Branch A → Fraction (Micropage 2) → Branch A → Other Version (Micropage 3) → Branch A → Integrated landing`
- Deeper initiation arc. Each step earns the next.
- More drop-off but higher-quality readers at the destination.
- Each subsequent micropage's recognition gate is implicit (they passed Micropage 1, so they're in)

**Recommendation:** Start with Option 1 (single micropage → integrated landing). Add chained micropages as Option 2 after measuring drop-off — chaining is a re-engagement layer for repeat visitors, not a first-time funnel.

---

## Tech build notes

**Stack:**
- Single HTML file with inline CSS + JS (no build step) OR
- Vite + React component if integrating with existing wild-os app
- Howler.js for audio (4kb gzipped)
- No tracking pixels initially — just first-party analytics events to your stack of choice (Plausible / Umami / GA4)

**Build time estimate:** ~4-6 hours for a competent frontend developer. ~10-15 hours if also producing the audio.

**Audio production:**
- Drone: synthesised via Ableton / Logic / free tools like LMMS. Or licensed from Splice / Artlist (~£10/track license).
- Chimes: same tools, simple sine/triangle waves.
- Alternative: hire from Fiverr / Upwork — competent ambient sound designer can produce all 6 audio files for £100-200.
- File format: MP3 or OGG, target <100kb per file for fast load.

**Mobile:**
- Page MUST work on mobile (most traffic). The recognition gate buttons need to be 44px minimum tap target. The animation timings stay the same.
- Audio: iOS Safari requires user interaction to start audio. The "Continue →" or "Start" button on first load handles this.

**Accessibility:**
- All audio has visual equivalents (no information conveyed by sound only)
- Keyboard navigation works (tab through buttons)
- Mute toggle clearly accessible
- Text contrast WCAG AA minimum (off-white on black easily passes)

---

## Anti-fabrication audit

| Claim made on page | Verifiable? | Notes |
|---|---|---|
| "You sleep about 8 hours a night." | ✅ | Average adult sleep is 7-9 hours; "about 8" is defensible |
| "You have never been awake for one of them." | ✅ | True for nearly everyone who hasn't trained lucid dreaming. Defensible. |
| No specific success stats. No "join 10,000 others." No fabricated quotes or community claims. | ✅ | Page contains literally no other factual claims. |

Audio design notes (in this spec file, not on the page): I've claimed low-frequency drones produce physiological-state shifts. This is well-documented in psychoacoustic research and matches my anti-fabrication rule (defensible). I have explicitly NOT made Solfeggio or "magical frequency" claims.

---

## Decisions log (for future maintenance)

| Decision | Why | Locked in |
|---|---|---|
| Black background, off-white text | Maximum focus on words. Removes design noise. Reads as serious / contemplative. | This spec |
| Single serif typeface | Avoids design-by-committee feel. Restraint as signal. | This spec |
| 5-second strike rule | Per user spec | Original one-shot prompt |
| Recognition gate dead-ends if "not sure" | Per user decision | Locked previous turn |
| "They have always been you" for Micropage 3 close | Per user decision | Locked previous turn |
| Single accent colour (indigo OR amber) | Connects to forthcoming glyph palette | **[USER: pick one]** |
| Sound design avoids pseudoscience frequency claims | Anti-fabrication rule | This spec |
| Branch B captures no email | Real exclusivity, not theatre | This spec |

---

## What's next after this spec lands

1. User reacts to this spec
2. Apply same structure to Micropages 2 and 3 (Fraction, Other Version) — much faster once Micropage 1 is locked
3. Integrated landing page spec
4. HTML prototype build (developer or Claude can generate the HTML/CSS/JS)
5. Audio production (designer or licensed library)
6. Live test with a small audience (Discord members? Friends?) before paid traffic

---

*WILD Programme — Micropage 1 spec*
*© 2026 Negotium Maximus Ltd. All rights reserved.*
*Build from this file. Treat it as the source of truth for The Hidden Third.*

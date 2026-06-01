# Micropage 3 — "The Other Version"

**Status:** Spec for build.
**URL when live:** `wildprogramme.com/i/other-version`
**Persona served:** Identity-shift / mid-life questioner / contemplative practitioner / anyone who has sensed there is "more of them" than they meet day-to-day
**Function:** Third parallel door into the WILD experience. Identity-shift angle. Recognition gate. Funnels to integrated landing on Branch A.
**Source manifesto:** `01 - Strategy/WILD_Manifesto.md`

**Inherits from Micropage 1:** all visual design, audio design, recognition-gate logic, tech build notes, accessibility specs, and routing config. **Only the hook, visual reveal, and Branch A line differ.** See `01_the_hidden_third.md` for shared specs.

---

## Reader experience — beat by beat

| Beat | Time | What happens | Audio |
|---|---|---|---|
| 1 | 0–2s | Black screen. Single line fades in centred: **"Every night you become someone you have never met."** | Low ambient drone fades in (60-80Hz) |
| 2 | 2–4s | A second line of identical text fades in faintly *behind* the first — like a reflection or a shadow of the same words. Slightly displaced, slightly transparent, slightly indigo-tinted. The visual implication: there are two of these statements coexisting. | Continued drone. A second very subtle low note enters at ~40Hz, just barely audible. |
| 3 | 4–5s | Screen darkens 15%. Second line types itself in below: **"They have always been you."** | **STRIKE.** Sub-bass thump (~50Hz) on the word "always". Sustained 200-300Hz note holds underneath. |
| 4 | 5–8s | Both lines hold. The faint "reflection" of the first line is still visible behind it — the visual stays. The reader sees the two-selves metaphor without it being explained. | Drone + sustained note + the subtle 40Hz second drone all hold. |
| 5 | 8s+ | Recognition gate appears (same as Micropage 1). | Subtle high-frequency texture enters |

### Branch A — "This applies to me"

| Beat | What happens | Audio |
|---|---|---|
| A1 | Button confirms. Text fades to black. The two faint reflections briefly converge into one before disappearing — visual moment of "the two become recognised as one." | Soft ascending chord (3 notes, ~1.5s) |
| A2 | New text fades in: **"Then it is time you met."** | Drone returns, slightly brighter |
| A3 | Single button appears: **"Continue →"** | Drone holds |
| A4 | On click → integrated landing page | Soft chime + transition fade |

### Branch B — same as Micropage 1

Identical dead-end. No email. No softener.

---

## Copy — every word

```
[Beat 1, large centred]
Every night you become someone you have never met.

[Beat 2, faint behind/below the first line — same text repeated, ghostly]
Every night you become someone you have never met.

[Beat 3, new line that types in below]
They have always been you.

[Beat 5, recognition gate]
This applies to me.
I am not sure yet.

[Branch A reveal]
Then it is time you met.

[Branch A button]
Continue →

[Branch B — identical to Micropage 1]
Then this is not for you today.
Come back when something shifts.
You can close this tab.
```

---

## What's unique to this micropage

| Element | Reason |
|---|---|
| **The double-text reflection at Beat 2** | Visual carrying of the "two selves" metaphor — the daylight self and the night self, coexisting. The reflection is the night version. When they converge on Branch A, it's the moment of recognition. Wordless. |
| **Strike word: "always"** | The strike isn't the revelation that there's another version — that's a familiar idea. The strike is **"always"** — they have been with you the whole time, and you have spent your life not knowing. The sub-bass on "always" is the weight of that lifelong missing. |
| **Branch A line: "Then it is time you met."** | Quiet imperative. No exclamation, no urgency, no marketing language. The reader is given permission for an introduction that has been waiting. |
| **Subtle 40Hz second drone at Beat 2** | The "other version" has its own audio signature — felt more than heard. Reinforces the two-presence feeling. Decays out by Beat 5 so the recognition gate is unencumbered. |

---

## Closing line history

Canonical for Micropage 3 close (locked previous turn): **"They have always been you."**

Alternatives considered but not used:
- "Until you do." (kept for ad creative / shareable assets)
- "They have things to tell you." (kept as a future option)
- "Steps into the room." (kept as a possible animated reveal in v2 build)

---

## Anti-fabrication audit

| On-page claim | Verifiable? | Notes |
|---|---|---|
| "Every night you become someone you have never met." | ✅ | True at multiple levels: (a) REM-state brain activity is measurably different from waking-state activity; (b) the unconscious mind is, by definition, unknown to the conscious mind; (c) the manifesto already establishes the two-selves framing. Defensible. |
| "They have always been you." | ✅ (philosophical) | Aligned with the manifesto's claim about latent capability and hidden self. Defensible as the brand's foundational position. |
| "Then it is time you met." | ✅ | Reader-internal claim — true if Branch A is selected. |

No stats, no citations, no fabricated outcomes. Clean.

---

## Designer notes for Beat 2 (the reflection effect)

The double-text effect needs careful execution to land. Specs:

- The "reflection" text is identical copy, same typeface
- Positioned ~8px below and ~4px right of the first line (slight displacement, not a mirror)
- Opacity: 25-30% — visible but clearly subordinate
- Colour: indigo tint (`#2D1B69` at 30% opacity) rather than pure off-white
- Fade-in: 1.5s slower than the primary text, creating the "ghost appearing after" effect
- On Branch A: both lines converge to the centre over ~600ms before fading to black together. **This convergence is the most important micro-moment in the entire micropage suite.** Get it right.

Alternative if the double-text reads as a design bug rather than a metaphor: replace with a single line of text that "splits" momentarily into two and rejoins — a subtler version of the same idea. **[USER: prototype both, pick the one that lands.]**

---

*WILD Programme — Micropage 3 spec*
*© 2026 Negotium Maximus Ltd. All rights reserved.*

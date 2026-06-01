# WILD — Integrated Landing Page Spec

**Status:** Spec for build. Source of truth for the HTML prototype.
**URL when live:** `wildprogramme.com` (root domain) OR `wildprogramme.com/door` if the micropages live at root
**Function:** The destination. All three micropages funnel here on Branch A. The single page where readers either commit (buy the book) or leave knowing what was offered.
**Source manifesto:** `01 - Strategy/WILD_Manifesto.md`
**Inherits visual + audio design from:** `02 - Landing Pages/micropages/01_the_hidden_third.md`

---

## Strategic goals

The integrated landing has to do six things without feeling like it's doing any of them:

1. **Carry the manifesto in full** — without it reading as a wall of text
2. **Earn trust through mechanical specificity** — the "brutal breakdown of what the fuck this actually is" you specified
3. **Present the book as primary CTA** — not the course, not the email signup, the book
4. **Soft-pointer to the course** — for the small percentage already ready to go deeper
5. **Point to Discord community** — as aftermath, not pre-requisite
6. **Maintain voice integrity throughout** — dark, plain, hauntingly authoritative, never preaching, refusing to over-explain

The reader leaves having either bought the book or knowing they're not ready, and either is fine. The page does not chase, beg, or insist.

---

## Page architecture — nine sections

```
┌─────────────────────────────────────────────────────────┐
│  1. THE THRESHOLD (hero)                                 │
│     Single line. Held. Scroll prompt.                   │
├─────────────────────────────────────────────────────────┤
│  2. THE DIAGNOSIS                                        │
│     The manifesto in full. Pacing matters.              │
├─────────────────────────────────────────────────────────┤
│  3. THE MECHANISM                                        │
│     What actually happens when you sleep.                │
│     Interactive timeline. The "show your work" section.  │
├─────────────────────────────────────────────────────────┤
│  4. THE PRACTICE                                         │
│     The protocol distilled. Three things have to align.  │
├─────────────────────────────────────────────────────────┤
│  5. THE LINEAGE                                          │
│     1,000 years of tradition + the neurology.            │
├─────────────────────────────────────────────────────────┤
│  6. THE BOOK         ← primary CTA                       │
│     "There is a book." Buy.                              │
├─────────────────────────────────────────────────────────┤
│  7. THE DEEPER PATH  ← soft course pointer               │
│     "If the book is the door..."                         │
├─────────────────────────────────────────────────────────┤
│  8. THE OTHERS                                           │
│     Discord. WILD SCIENCE + WILD SPIRIT.                 │
├─────────────────────────────────────────────────────────┤
│  9. THE CLOSING                                          │
│     "The door is here. The practice is real."           │
└─────────────────────────────────────────────────────────┘
```

Reader can leave at any section and the page still resolves. Each section earns the next. The book CTA appears at ~60-70% scroll depth — they have been earned by then.

---

## SECTION 1 — The Threshold (Hero)

### Purpose
First impression. Hold the reader's attention with restraint, not noise.

### Reader experience

| Beat | Time | What happens | Audio |
|---|---|---|---|
| 1 | 0–800ms | Page loads black. Faint texture (subtle film grain at 4% opacity). | Silence |
| 2 | 800ms–2s | Ambient drone fades in (same 60-80Hz as micropages). | Drone fades in |
| 3 | 2s–4s | Single line fades in centred, Cormorant Garamond, large (48px desktop / 32px mobile): **"You are larger than you have been allowed to know."** | Drone continues |
| 4 | 4s+ | Below the line, small text appears after 2 second delay: *"Scroll."* In deep indigo, small (14px). Slight pulsing animation — 1 cycle every 3s, subtle. | Drone holds |

### Copy

```
[Hero line]
You are larger than you have been allowed to know.

[Scroll prompt]
Scroll.
```

That's it. The entire above-the-fold is one sentence and a prompt.

### Visual notes
- Centre alignment, vertical and horizontal
- Margin: at least 40vh top, generous breathing room
- Film grain texture overlay (very subtle, 4% opacity, animated for slight movement)
- Scroll prompt: pulse 1 cycle every 3s, opacity 0.4 → 0.7 → 0.4

### Animation principle introduced here
**Restraint is the design.** No slide-in. No bounce. No fancy entrance. Just opacity fades, paced to breathing rhythm.

---

## SECTION 2 — The Diagnosis (The Manifesto)

### Purpose
Carry the manifesto in full. The reader who scrolled is committed enough to receive the diagnosis.

### Reader experience

- Triggers on scroll into viewport
- Each paragraph fades in as it enters the viewport (Intersection Observer, fade duration 800ms)
- The drone continues uninterrupted from Section 1
- No images, no break-up — just the text, breathing

### Copy

```
[Section title — small caps, indigo, 14px, sits 2vh above the text]
THE DIAGNOSIS

[Body, full manifesto, Cormorant Garamond, 20px desktop / 17px mobile, 1.7 line-height]

Most of what you are is hidden from you.

The version of yourself that runs your nights — the one your conscious mind has never been awake for.

The version that runs your defaults during the day, below the level you can see.

Both are larger than the part of you that you call "I."

You have been working with a fraction of what is in you.

And you have been told that fraction is all there is.

This is not a metaphor. It is structural.

The mind has access to itself that most people are never taught to train.

The capacity is already there.

The door is locked because no one handed you the key.
```

Note: each line break above is intentional. Sentences sit as their own paragraphs for rhythm. The manifesto in continuous prose reads heavy; broken into discrete sentences with breathing room, it reads as inevitable.

### Visual notes
- Max-width on text container: 640px desktop, 100% mobile with 32px side padding
- Each sentence-paragraph: 24px margin below
- The section-title "THE DIAGNOSIS" uses Cormorant Garamond Light, letter-spacing 0.2em
- No images, no diagrams. The text alone.

### Animation
- Fade-in per paragraph as it scrolls into 70% viewport height
- Duration 800ms, ease-out
- No stagger animation, no fancy text reveals — just clean fades

---

## SECTION 3 — The Mechanism (The "brutal breakdown")

### Purpose
Earn trust through mechanical specificity. Show that you know what happens biologically. This is the section that converts the curious-but-skeptical reader.

### Reader experience

An interactive sleep-cycle timeline. The reader can scroll through 8 hours of sleep and see what actually happens in their brain — including the moments WILD trains them to be conscious for.

### Copy and structure

```
[Section title]
THE MECHANISM

[Lead paragraph, 20px]
This is what is happening tonight, whether you know it or not.

[The interactive diagram begins below]
```

### The interactive sleep-cycle diagram

A horizontal timeline across the viewport showing 8 hours of sleep. Below the timeline, vertical bars represent REM intensity per cycle. The user can hover or tap to reveal what happens at each cycle.

```
HOURS:  0     1     2     3     4     5     6     7     8
        ▼─────▼─────▼─────▼─────▼─────▼─────▼─────▼─────▼
                              SLEEP STARTS HERE

REM:    █     ██    ███   ████  █████  ████  ███
        ↑     ↑     ↑     ↑     ↑      ↑     ↑
        Cycle 1     Cycle 2     Cycle 3      Cycle 4
        5 min       15 min      25 min       30+ min
```

**Interaction:**
- On hover/tap of each cycle bar: a panel appears below the diagram with a 2-3 sentence description of that cycle
- The descriptions are honest, brief, specific

```
[Cycle 1 panel — appears on interaction]
Roughly 90 minutes after you fall asleep. REM is short here — about 5 minutes.
Your body has just settled. The dreaming brain is barely online.
This is not where the work happens.

[Cycle 2 panel]
Around 3 hours in. REM extends to 15 minutes.
Your nervous system is calmer. The dreaming brain is more active.
Some people have their first lucid dream here by accident.

[Cycle 3 panel]
Around 4.5 hours in. REM is now 25 minutes.
Cortisol is starting to rise. The brain is preparing for waking.
This is the door.

[Cycle 4 panel]
Roughly 6 hours in. REM peaks at 30+ minutes.
Your prefrontal cortex is active. Your visual cortex is firing.
This is where the work is done.
```

Below the diagram:

```
You have walked past this door every night of your life.
The protocol teaches you how to stop walking past it.
```

### Visual notes
- The timeline uses fine lines, deep indigo
- REM bars: filled indigo, height proportional to REM duration
- Hover/active state: bar fills with off-white, glows subtle
- Cycle panel: appears with 400ms fade-in below diagram, replaces previous panel content
- Mobile: timeline becomes vertical scrollable list of cycles

### Animation
- On first scroll-into-view: the cycles draw themselves in left-to-right over 2s
- Subtle: a single dot pulses at the location of "the door" (around Cycle 3/4) to draw the eye

### Why this section matters strategically
This is where the page proves it knows what it's talking about. Most "spiritual" sites avoid mechanical specificity; most "biohacker" sites overdose on it. This section shows the user can have the specificity AND the depth. They are not in different rooms.

---

## SECTION 4 — The Practice

### Purpose
Distil the protocol to its essence. Show that WILD is teachable, not vague.

### Copy

```
[Section title]
THE PRACTICE

[Lead paragraph]
Three things have to align. None of them are difficult.
All of them require attention you are not currently giving them.

[Three card components below]
```

### Three cards

Side by side on desktop, stacked on mobile. Each card has a number, a title, a brief description, and a subtle interaction.

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   ONE        │    │   TWO        │    │   THREE      │
│              │    │              │    │              │
│  Timing      │    │  Awareness   │    │  Stability   │
│              │    │              │    │              │
│  Be awake    │    │  Hold        │    │  When        │
│  at the      │    │  attention   │    │  lucid,      │
│  hour the    │    │  through     │    │  do not      │
│  brain is    │    │  the         │    │  grasp.      │
│  ready.      │    │  threshold.  │    │  The dream   │
│              │    │              │    │  collapses   │
│              │    │              │    │  from        │
│              │    │              │    │  grasping.   │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Visual notes
- Card background: subtle dark indigo tint (`#0F0A1F`), 1px border (indigo at 30% opacity)
- Number: large (60px), Cormorant Garamond, indigo accent
- Title: 24px, off-white
- Body: 16px, off-white, 1.6 line-height
- On hover: subtle glow effect, audio cue (soft chime)
- Card padding: 32px

### Animation
- Cards fade-in on scroll-into-view, staggered 200ms apart
- On hover: subtle scale (1.0 → 1.02), border brightens, audio cue
- Mobile: tap reveals an expanded panel below with one extra sentence per card

### Copy continued below cards

```
This is the entire protocol.
Everything else is supporting structure.
```

The simplicity of the framing earns trust. The reader who has seen 50 "9-step lucid dreaming guides" recognises this is different.

---

## SECTION 5 — The Lineage

### Purpose
Two-pillar legitimacy. Tibetan tradition + modern neuroscience. Brief, never preachy.

### Copy

```
[Section title]
THE LINEAGE

[Two-column layout, equal weight]

[Left column]
A thousand years ago, Tibetan practitioners
in Bön and Nyingma traditions trained
this same capacity in retreat.
They called it dream yoga.
Their texts describe the protocol
in language that maps cleanly onto
the modern neuroscience.

[Right column]
In the 1980s, Stephen LaBerge at Stanford
verified the mechanism in a sleep lab.
EEG confirmed what the practitioners
already knew.
The neurology has been understood for forty years.
The practice has been understood for a thousand.

[Centred below, full width]
The same door.
Two ways of describing it.
One way of walking through.
```

### Visual notes
- Two-column layout on desktop, stacked on mobile
- A vertical line separates the columns — deep indigo, 1px, full height of section
- The closing three lines are centred below both columns
- Section feels balanced, intentional, like the two pillars are physically holding the section up

### Animation
- Each column fades in independently as scroll triggers
- The closing three lines fade in after both columns are present, 600ms delay
- The vertical divider draws itself top-down on first scroll-into-view (1.5s)

### Anti-fabrication note
- Stephen LaBerge / Stanford / 1980s / EEG verification — all defensible, well-documented
- "Bön and Nyingma traditions" — real Tibetan dream yoga traditions
- "Forty years" since 1980s neuroscience — defensible

---

## SECTION 6 — The Book (Primary CTA)

### Purpose
The merch-led monetisation. The book is the primary product on this page. Course is downstream.

### Copy

```
[Section title]
THERE IS A BOOK.

[Body, 22px, centre-aligned, generous spacing]

It contains the practice.
It contains the protocol.
It contains the symbol system the rest of the work is built on.

Without it, the deeper material is opaque.
With it, the door is in your hand.

[Book visualisation appears here — see Visual section below]

[Below the book]
Pocket-sized hardcover.
[USER: insert page count once finalised — recommend ~120pp]
[USER: insert price — recommend £35]

[The CTA button]
[ TAKE THE BOOK ]
```

### Visual — the book

A 3D-rendered or photorealistic image of the book, centred. Slow rotation: the book turns slowly on its vertical axis (one full rotation every 12 seconds, ease-in-out). The reader sees the cover, then the spine, then the back, then the cover again.

The cover should show the glyph (once designed) on indigo or amber, with the title in Cormorant Garamond.

**Placeholder until glyph is finalised:** the book cover is solid deep indigo with the wordmark "WILD" in Cormorant Garamond.

### The CTA button

```
┌─────────────────────────────────┐
│                                  │
│        TAKE THE BOOK             │
│                                  │
└─────────────────────────────────┘
```

- Width: 280px desktop / 100% mobile
- Height: 64px
- Background: deep indigo (`#2D1B69`)
- Text: off-white, Cormorant Garamond, letter-spacing 0.15em, 18px
- Border: 1px off-white
- On hover: background shifts to off-white, text shifts to indigo (inversion), audio cue
- On click: brief flash, page transitions to checkout

### Animation
- Section title "THERE IS A BOOK." fades in on scroll
- Body copy fades in line by line, 400ms stagger
- Book visualisation appears with a subtle reveal — almost as if it's materialising, opacity 0 → 1 over 1.5s
- Book begins rotating on full reveal
- CTA button fades in last, 600ms after book is present

### Why this section converts
- No price-shock — the reader knows the practice is real by now
- No "limited time" pressure — the book is the book
- The frame "without it, the deeper material is opaque" is the soft exclusivity hook
- The CTA verb "TAKE" not "BUY" — feels initiatory, not transactional

### Anti-fabrication note
- No fabricated reviews, ratings, "thousands of copies sold," "as featured in"
- Just the object, what it contains, what it costs, and the button

---

## SECTION 7 — The Deeper Path (Soft course pointer)

### Purpose
For the small percentage already ready to go beyond the book. The course is mentioned, not sold.

### Copy

```
[Section title]
IF THE BOOK IS THE DOOR.

[Body, 20px, centre-aligned, more compact than Section 6]

There is also a course.
It is for the people who finish the book and want to keep going.
It is not for everyone who buys the book.
It is for the people the book makes restless.

[Small inline link, not a button]
The deeper path → [link to tier1.html]
```

### Visual notes
- This section is intentionally smaller and quieter than Section 6
- No book visualisation
- The course link is text-link, not a button — soft, deferred
- Section padding is more compact (32px top/bottom vs 80px in Section 6)

### Why this works
- Doesn't compete with the book
- The reader who is ready notices it
- The reader who isn't ready passes it without friction
- "Not for everyone who buys the book" is the same exclusivity mechanism as the recognition gate — selection over persuasion

---

## SECTION 8 — The Others (Discord)

### Purpose
Community pointer. Two servers. The reader either joins (free) or doesn't.

### Copy

```
[Section title]
THE OTHERS

[Body, 18px]

There are two communities.
Both are free.
Both require nothing of you except your real presence.

[Two cards, side-by-side]

┌─────────────────────────┐    ┌─────────────────────────┐
│  WILD SCIENCE           │    │  WILD SPIRIT            │
│                          │    │                          │
│  Data. Protocol. Stack.  │    │  Tradition. Inquiry.    │
│  For the optimisers.     │    │  For the contemplative. │
│                          │    │                          │
│  [ ENTER ]               │    │  [ ENTER ]               │
└─────────────────────────┘    └─────────────────────────┘
```

### Visual notes
- Two cards, equal weight
- Each card has a subtle indigo border, 1px
- "ENTER" buttons styled identically to the book CTA but smaller (200px wide, 48px tall)
- On hover: card subtle glow, audio cue
- Mobile: cards stack vertically

### Animation
- Cards fade in side-by-side
- Hover state on cards: subtle scale + glow + audio chime

---

## SECTION 9 — The Closing

### Purpose
The final breath. The reader leaves with what they came for.

### Copy

```
[Section title — small, indigo, all caps]
THE END OF THIS PAGE.

[Three lines, centre-aligned, large, generous spacing — 1.5 line-height between]

The door is here.

The practice is real.

The work is the work.

[Below, very small, 14px, off-white at 40% opacity]
WILD Programme · 2026 · [USER: insert legal links — Privacy, Terms]
```

### Visual notes
- Maximum negative space below the closing triplet
- Each line of the triplet fades in with a 1-second pause between them
- After all three are present, hold for 2 seconds then the page is "complete"
- Drone fades out over 3 seconds, then silence
- Page does not auto-scroll, does not popup, does not chase

### Why this works
- No urgency, no upsell, no "wait, here's one more thing"
- The page resolves with the same restraint it opened with
- The reader leaves having had a complete experience, whether they bought or not

---

## Audio design — page-wide

The same audio architecture as the micropages, sustained throughout the page.

| Layer | When | What |
|---|---|---|
| Ambient drone | Continuous, from Section 1 through Section 9 | Same 60-80Hz drone as micropages |
| Section transitions | On scroll between sections | Very subtle sustained note shift — barely perceptible, marks the transition |
| Button hover | On hover of any CTA | Soft 440Hz chime, 200ms |
| Button click — book CTA | On click of "TAKE THE BOOK" | Single sustained note that resolves up — feels like commitment |
| Button click — Discord CTA | On click of "ENTER" | Soft chime, brief warm cluster |
| Closing | Final 3 lines | Drone gradually softens, ends in silence after the third line |

**Mute toggle:** small icon in top-right corner, accessible throughout. Audio is opt-out, not opt-in (autoplay restriction handled by the first user interaction on the page).

**Headphones prompt:** small text at the bottom of Section 1 hero, fades in 4s after page load: *"Headphones recommended."*

---

## Button design system

Every button on the page follows the same system:

### Primary CTA (book, course link, Discord)

```
┌─────────────────────────────────┐
│                                  │
│        BUTTON TEXT               │
│                                  │
└─────────────────────────────────┘
```

- Font: Cormorant Garamond Medium
- Size: 18px
- Letter-spacing: 0.15em
- Padding: 18px vertical, 32px horizontal
- Background: deep indigo (`#2D1B69`)
- Border: 1px off-white at 60% opacity
- Text: off-white

### Hover state

- Background fades to off-white (300ms ease-out)
- Text fades to indigo (300ms ease-out)
- Border fades to indigo (300ms ease-out)
- Soft chime plays (200ms, 440Hz)
- Subtle haptic on mobile (`navigator.vibrate(15)`)

### Active state (mid-click)

- Background flashes briefly to amber (`#C9A84C`) for 100ms then settles
- Audio: confirm tone (depends on which button)

### Disabled / loading state

- Background: indigo at 40% opacity
- Text: off-white at 60% opacity
- Cursor: wait
- No hover effects

---

## Animation principles (whole page)

| Principle | What it means | What it forbids |
|---|---|---|
| **Opacity over motion** | Every reveal is a fade. No slides, no bounces, no flips. | `transform: translate`, `bounce`, `flip` |
| **Breathing rhythm** | Animations pace to a slow breath — 4 seconds in, 4 seconds out. Hovers respond fast (200-300ms) but reveals are slow (600-1500ms). | Snappy, video-game-feeling micro-interactions |
| **Restraint as signal** | The default is stillness. Movement is significant when it happens. | Continuous loops, autoplay, animated backgrounds |
| **Audio reinforces, doesn't replace** | Every interaction has an audio cue, but the visual would still communicate it without the audio. | Audio-only feedback |
| **No surprise reveals** | The reader is in control of their journey. Scroll triggers reveal, no popups, no modal interrupts, no exit-intent panic offers. | Modals, popups, exit-intent overlays, scroll-locked sections |

---

## User journey — three reader paths

### Path A — The Committed (estimated ~5-15% of arrivals)

Sees hero → scrolls → reads diagnosis → engages with mechanism → reads practice → reaches book → **takes the book**.

Time on page: ~3-5 minutes. Bought without scrolling to Section 7-9.

### Path B — The Considerer (estimated ~30-50% of arrivals)

Reads everything. Scrolls slowly. Engages with the mechanism diagram. Reaches book → doesn't buy yet. Continues to course mention → not ready. Reaches Discord → joins. Leaves.

Time on page: ~5-8 minutes. Joins Discord. Will likely return.

### Path C — The Not-Yet (estimated ~40-60% of arrivals)

Scrolls partway, doesn't finish. The recognition didn't land for them today. They leave.

Time on page: ~30s–2 minutes. No conversion, no community. **This is correct.** The page selects, it does not chase.

---

## Mobile considerations

- The mechanism diagram in Section 3 becomes a vertical scrollable list of cycles rather than a horizontal timeline
- Three cards in Section 4 stack vertically with full-width
- Two Discord cards in Section 8 stack vertically
- Book visualisation in Section 6 reduces size, rotation still works
- Touch targets minimum 44px
- All audio works without explicit user interaction beyond first tap
- Font sizes scale: 48px → 32px hero, 20px → 17px body

---

## Technical build notes

**Stack:**
- Single HTML file with inline CSS + JS (no build step) OR
- Vite + lightweight framework (Astro or vanilla)
- Howler.js for audio (~4kb)
- Intersection Observer API for scroll-triggered reveals (native, no library)
- Three.js for book 3D rotation (or pre-rendered video loop as fallback)

**Performance targets:**
- Lighthouse score ≥ 90 across all categories
- Page load < 2.5s on 4G
- First Contentful Paint < 1.5s
- Total page weight < 1.5MB including audio

**Audio loading:**
- All audio files pre-loaded on first interaction
- Each file < 100kb, MP3 or OGG
- Lazy-load section-specific audio if section is below the fold

**Accessibility:**
- All interactive elements keyboard navigable
- All audio has visual equivalents
- WCAG AA contrast minimum
- Screen reader friendly section structure
- Reduced motion preference respected (`prefers-reduced-motion: reduce` disables fade animations, keeps content)

**Build time estimate:** ~16-24 hours for a competent frontend developer. ~8 hours additional for audio production.

---

## Anti-fabrication audit

| On-page claim | Verifiable? | Notes |
|---|---|---|
| Manifesto in full (Section 2) | ✅ | Already audited in manifesto file |
| REM cycle timing (5/15/25/30+ min, cycle 1-4) | ✅ | Defensible — well-documented in sleep science |
| "Tibetan practitioners did this for a thousand years" | ✅ | Bön and Nyingma dream yoga traditions, 1000+ years defensible |
| "Stephen LaBerge at Stanford verified the mechanism in a sleep lab" | ✅ | LaBerge's Lucidity Institute work; published research in the 1980s on signal-verified lucid dreaming |
| "EEG confirmed what the practitioners already knew" | ✅ | EEG correlates of lucid dreaming are established |
| Book contents claims ("contains the practice, the protocol, the symbol system") | 🟡 | Defensible IF the book is actually built that way. **[USER: confirm book scope matches]** |
| Discord cards ("Data. Protocol. Stack." / "Tradition. Inquiry.") | ✅ | Descriptive, not claim-based |
| Number of community members | NOT MADE | Deliberately omitted. No fake "join 5,000 others" claim. |
| Course outcomes | NOT MADE | Course section makes no outcome claims |
| Book reviews / testimonials | NOT MADE | Section 6 has zero social proof. Trust is earned by manifesto + mechanism, not by claimed reviews. |

No fabricated stats, no fake citations, no invented community sizes, no false urgency. Clean.

---

## Decisions log

| Decision | Why | Locked in |
|---|---|---|
| Black background throughout | Continuous with micropages — single brand visual world | This spec |
| Cormorant Garamond | Per user decision | Previous turn |
| Deep indigo accent | Per user decision | Previous turn |
| Book as primary CTA, course as secondary | Per user strategic pivot to merch-led monetisation | Previous turn |
| No email capture on this page | Per "kills conversions" principle in user's original one-shot | Previous turn |
| No social proof / testimonials | Anti-fabrication rule + brand voice | This spec |
| 9 sections, reader can leave at any point | Restraint over chase | This spec |
| Discord cards as separate CTA from book | Free community is the aftermath, not a competing conversion | This spec |
| Course mention sized intentionally smaller than book | Book is the merch lever; course is downstream | This spec |
| All audio = drone + chimes only, no music | Restraint as signal | This spec |

---

## What's next after this spec lands

1. User reacts to this spec
2. HTML prototype build (single page, vanilla HTML/CSS/JS) — I can produce this directly or you give it to a dev
3. Audio production (six files, ~£100-200 from Fiverr/Upwork OR I write detailed Ableton/Logic specs)
4. Book outline + first chapter
5. Glyph design brief (the dedicated focused session)
6. Apply same voice/design system to rewrite of existing tier pages

---

*WILD Programme — Integrated Landing Page spec*
*© 2026 Negotium Maximus Ltd. All rights reserved.*
*Build from this file. Treat as source of truth.*

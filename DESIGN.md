# WILD design system

One system for the hub (this repo's root pages), WILD OS (`wild-os/`), the social graphics
(`wild/content/automation/render.js` in the Wizardry project files) and anything built after them.
The tokens live in `assets/wild.css`. Change a value there and every surface follows.

## 1. The idea

Night, and one point of light. The ground is near-black indigo (`--wild-bg`), the structure is indigo
(`--wild-indigo`), and gold (`--wild-gold`) is reserved for the aperture: the one action, the one label,
the line that marks the threshold. If a screen has two gold things, one of them is wrong.

Voice follows `WILD_Manifesto.md`: short declarative sentences, no exclamation marks, no hype, British
English, "practice" the noun and "practise" the verb. The copy on the hub is the reference for every
other surface.

## 2. Tokens (`assets/wild.css`)

| Group | Token | Value | Use |
|---|---|---|---|
| Ground | `--wild-bg` | `#050309` | page and app background |
| | `--wild-bg-elev` | `#0A0612` | cards on the ground |
| | `--wild-surface` | `#120C1F` | inputs, panels, nav |
| | `--wild-surface-2` | `#19112B` | selected row, hover |
| | `--wild-border` | `rgba(244,241,237,.09)` | hairlines |
| | `--wild-border-lit` | `rgba(138,111,224,.45)` | focused or hovered border |
| Text | `--wild-text` | `#F4F1ED` | headings, body (16.7:1 on bg) |
| | `--wild-dim` | `rgba(244,241,237,.68)` | secondary text (8.5:1) |
| | `--wild-faint` | `rgba(244,241,237,.5)` | captions, 12px and up only (5:1) |
| | `--wild-on-gold` | `#0B0714` | text on a gold button (9.4:1) |
| Threshold | `--wild-indigo` | `#6349B8` | strokes, fills, halos. Never body text (2.8:1) |
| | `--wild-indigo-2` | `#8A6FE0` | icons, hover, large text (4.2:1) |
| | `--wild-indigo-3` | `#B9A9F0` | indigo when it has to be read (8.7:1) |
| | `--wild-gold` | `#C9A84C` | the primary action, eyebrows, the aperture (8.9:1) |
| | `--wild-gold-2` | `#E9C766` | hover, the lit aperture |
| Signals | `--wild-ok` / `--wild-warn` / `--wild-danger` | `#86B894` / `#E0A458` / `#E07A85` | one quiet hue each |
| Type | `--wild-serif` | Cormorant Garamond | display, headings, numerals that matter |
| | `--wild-sans` | DM Sans | body, UI, buttons, labels |
| | `--wild-mono` | JetBrains Mono | times and tabular numbers in the app |
| Scale | `--wild-fs-xs` to `--wild-fs-5xl` | 12 13 14 16 18 22 28 36 48 64 | type sizes (rem) |
| Space | `--wild-s1` to `--wild-s9` | 4 8 12 16 24 32 48 64 96 | padding and gaps (px) |
| Shape | `--wild-r-sm/md/lg/pill` | 10 14 18 999 | radii |
| Depth | `--wild-shadow-card`, `--wild-shadow-float`, `--wild-glow-gold` | | cards, menus, the gold button only |
| Motion | `--wild-ease`, `--wild-t-fast/t/t-slow` | .15 .3 .6s | respect `prefers-reduced-motion` |

Contrast ratios are against `--wild-bg`, measured with the script in section 6.

## 3. The mark

Direction A from `WILD_Glyph_Strategy.md`: a vertical vesica, two rings of indigo, with a gold
aperture in the centre.

- **Full mark** (hub hero, app gate screens, end slide of a carousel): two rings, 2.4 stroke on a
  100x120 box, gold line 51 to 69, optional indigo halo. Breathes on a 7s cycle, aperture glows on 5s.
  Markup is in `index.html` (hero) and `wild-os/src/shared/ui/Mark.jsx`.
- **Compact mark** (favicons, PWA icons, avatars, the shared app bar): the closed lens with a gold dot,
  from `wild/brand/wild-mark-gold.svg`. Same geometry, one colour, reads at 16px.
- The wordmark is WILD in Cormorant Garamond 600, letter-spaced `--wild-track-word`, with the
  cream-to-gold gradient (`.wild-wordmark` in the app, `.wordmark` on the hub).

## 4. Type

- Display: Cormorant Garamond 600 for headings, 500 italic for the kicker line under a heading.
  Cormorant has a small x-height, so display sizes run one step larger than the sans would.
- Body: DM Sans 400, 1.6 line height. Labels and eyebrows: DM Sans 700, 12px, uppercase,
  letter-spacing `.22em`, gold.
- Buttons: DM Sans 600, never the serif.
- Numbers in the app (streaks, nights, times): serif for the number itself, mono for clock times.

## 5. Components

| Component | Hub | WILD OS | Rule |
|---|---|---|---|
| Gold button | `.btn.btn-gold` | `<Button variant="gold">` | one per screen, 48px tall, pill |
| Ghost button | `.btn.btn-ghost` | `<Button variant="secondary">` | indigo outline on an indigo wash |
| Quiet action | text link | `<Button variant="ghost">` | dim text, no border |
| Eyebrow | `.eyebrow` | `.section-label` | gold, tracked, above a heading |
| Card | `.tile`, `.feat`, `.door` | `<Card>` | elevated gradient, 1px border, 18px radius |
| Tag | `.tag`, `.free-item .b` | `<Badge>` | 10px uppercase pill |
| Nav | `.nav` + `assets/wild-nav.js` | `TopBar`, `BottomNav` | night at .86 alpha, blurred, hairline |
| Tabs | | `SubTabs` | gold pill for the active tab, `role="tablist"` |
| Mark | hero SVG | `<Mark>` | section 3 |

States every interactive element has: hover (lift 2px or lit border), focus-visible (2px indigo-2
outline, 3px offset), active (scale .97), disabled (40% opacity).

## 6. Checks before shipping

- Contrast: run `node -e` with the WCAG formula against `--wild-bg` for any new colour; body text 4.5:1,
  large text 3:1. The ratios in section 2 are the current values.
- Touch targets at least 44px. Buttons are 48.
- `prefers-reduced-motion`: the aurora, the mark and page transitions stop.
- No exclamation marks on any surface (`grep -rn '!' --include=*.html --include=*.jsx` on copy strings).
- Screenshots at 390 and 1280 wide before a PR, saved under `design/screenshots/`.

## 7. Graphics

Carousel slides (`render.js`) use the same tokens: night ground with the indigo aurora, Cormorant
headline in `--wild-text`, kicker and footer in gold DM Sans, the compact mark on the cover and the full
mark on the end slide. Text stays inside the platform safe boxes defined in the renderer.

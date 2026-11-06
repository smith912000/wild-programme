# Performance checklist (every page, app and landing page)

Standing rule from Brandon, 6 Nov 2026, after the speed-up in PR #45 (landing 547 to 324 KB, open hub intro 1469 to 680 KB). Follow it by default on all new work. Measure with `node scripts/measure-page-weight.js` (gzip transfer sizes, headless Chromium), before and after, and put the table in the PR.

## Checklist
1. **Measure first.** Find what is actually heavy (largest three files per page) before changing anything. Most pages were already light; the weight sat in a few files.
2. **Minify vendored libraries** (three.js, anime, etc.). Never ship an unminified vendored file. Keep the module graph and exports untouched.
3. **Defer heavy, non-critical code.** Load 3D, charts and audio libraries after `window.load` plus an idle callback, so they never compete with text, fonts and CSS. Dynamic `import()` for anything below the fold or behind a click.
4. **Defer media that is not needed at load.** Video that plays after a click: `preload="metadata"` (upgrade after load) or `preload="none"`. Only the visible background video may preload, and it needs a poster.
5. **Re-encode media at the same visible quality.** Video: same size and length, lower bitrate, mp4 plus webm; check mean pixel difference against the original (under 1 level). Images: WebP or JPEG at about q75-80, never larger than the largest size shown.
6. **Lazy images.** `loading="lazy"`, `decoding="async"`, explicit `width` and `height` on every `<img>`. Big art (atlas cards, plates) loads when its view opens, is decoded once and cached.
7. **Lean bundles.** Code-split each tab or route (`lazy()`), put React in its own long-cached chunk (`manualChunks`), no whole-library imports for one function, no source maps in the published site.
8. **Own fonts only, subset, woff2.** No third-party requests on load (launch rule 1). Load only the weights used.
9. **Text pages stay tiny.** Plain HTML and CSS, system fonts where the design allows (the Q mentorship pages are about 13 KB in total).
10. **Check nothing broke.** The deferred thing still appears (for example the 3D mark gets `is-3d`), no console errors, behaviour unchanged.
11. **Caching.** GitHub Pages sets its own cache headers and they cannot be changed; use hashed filenames (Vite does) so files cache well anyway.

## Size budgets (gzip transfer, first load)
| Page type | Budget |
|---|---|
| Text or form page (quiz, legal, thank-you, course lesson, Q landing pages) | 100 KB |
| App or hub page (hub, parser, Maryada, WILD OS, SGE, Codex) | 250 KB, and under 350 KB with its ambient video |
| Public landing page with the 3D mark | 350 KB |
| Page that plays an intro film | 700 KB, film itself under 600 KB |
| One image | 300 KB (lazy-loaded art only) |

A change that takes a page over its budget needs a line in the PR saying why.

## State on 6 Nov 2026 (after PR #45)
Landing 324 KB, open hub with intro 680 KB, hub 97 KB, parser 313 KB (two videos), Maryada 96 KB, WILD OS 211 KB, SGE 188 KB (atlas art loads per card, on demand), Codex 53 KB, course pages about 80 KB, quiz 47 KB. All inside budget.

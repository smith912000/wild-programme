# WILD — Capabilities & Launch Readiness

**Date:** 2026-06-05
**Tested by:** Claude (Opus 4.8) — live endpoint checks, build tests, file/deploy verification
**Question answered:** What does the system do right now, and what's left before we can launch the WILD Programme?

---

## PART 1 — What the system CAN do right now (tested & working)

| Capability | Status | Evidence |
|---|---|---|
| **Hub / directory page** | 🟢 Live | `wild-programme/` → 200. Revamped brand-grade build (vesica mark, Cormorant type, indigo/amber). |
| **Integrated landing** (scroll experience) | 🟢 Live | 200. Audio + scroll choreography present (quality disputed — see blockers). |
| **3 micropages** (ad entry) | 🟢 Live | All 200. Question-gate + audio mechanics intact. |
| **Tier sales pages 1/2/3** | 🟢 Live | All 200. **PayPal hosted buttons present and live** — purchase path works. |
| **Community page** (Open Door / Inner Room) | 🟢 Live | 200. Two-room model, choose-a-room page. |
| **Old site redirect** | 🟢 Working | `wild-landing/` → redirects to canonical site. |
| **WILD OS app (PWA)** | 🟢 Live | `wild-os/` → 200. (Supabase auth needs a rebuild — see notes.) |
| **OG share image** | 🟢 Live | `og-image.png` → 200. Social shares render. |
| **Cookie consent** | 🟢 Working | Privacy-preserving banner on all funnel pages. |
| **Business workbook** | 🟢 Working | 18 tabs, opens clean. 1,103 sales, 11 supplier invoices, BUMP fees, packaging expenses, Accountant Pack, Balance Sheet. |
| **Bank-statement parser** | 🟢 Ready | `_parse_bank_statements.py` — runs the moment statements are dropped in. |
| **Workbook snapshot/backup** | 🟢 Working | `_make_snapshot.py` — verified; latest snapshot 2026-06-05. |
| **SGE app** | 🟢 Builds | Production build passes; all tabs ErrorBoundary-wrapped (no black screen). Local-only, not deployed. |
| **Invoice/receipt intake** | 🟢 Working | Dee's Dump → parsed → filed → logged to workbook (just ran on 29 files). |

**Bottom line:** the storefront is built and the purchase rail (PayPal on tiers) works. The gaps are in *what happens around the sale* — capturing leads, delivering what's bought, and the community destination.

---

## PART 2 — Launch BLOCKERS (must fix before driving traffic or taking money)

### 🔴 B1 — Paying customers can't access what they buy
Course content (`06 - Course Content/`) is **gitignored, so not deployed**. A customer pays via PayPal → `purchase-confirmed.html` links to `Tier_X_*.html` → **404**. The single most damaging gap: you'd be taking money for inaccessible product.
**Fix options:** (a) deploy the course content to a gated location (Whop/members area), or (b) host it publicly behind an obscure URL for now, or (c) deliver by email after purchase. Needs a decision on delivery mechanism.

### 🔴 B2 — The free lead magnets don't exist
All 3 lead-magnet PDFs the hub links to are **404** — `05 - Lead Magnet/` contains only a build script, no PDFs. The entire "free way in" funnel leads to broken downloads.
**Fix:** generate the 3 PDFs (Sleep Map, Five Signs, Threshold Guide) and deploy them, OR remove the links until they exist. *(I can generate threshold-tone PDFs from scratch if you want.)*

### 🔴 B3 — No email capture anywhere
Even if the PDFs existed, clicking them downloads a file and captures nothing. No Kit (email) integration. **You'd pay for traffic and keep zero leads.** The biggest top-of-funnel leak.
**Fix:** Kit signup + form embed + autoresponder. Founder-side (Kit account) + wiring.

### 🔴 B4 — Audio quality
You've judged the generated Web Audio tones unacceptable across the micropages + integrated landing. **On hold pending your exact spec** — no further audio edits until then. This is a launch blocker for the immersive pages specifically.

### 🔴 B5 — Community destinations are dead
`community.html` "Step in / Step inside" buttons and the hub's room buttons point to `[USER: paste Discord invite]` placeholders. The Inner Room (£10/mo) PayPal/subscription button is also a `[USER:]` placeholder. **Clicking any community CTA goes nowhere.**
**Fix:** real Discord invite link(s) + the Inner Room subscription button (PayPal or Whop).

---

## PART 3 — High-priority (fix before a *paid* launch, not blocking a soft share)

| # | Gap | Fix |
|---|---|---|
| 🟠 H1 | **GA not configured** (`G-XXXXXXXXXX`) — zero analytics at launch | Real Measurement ID |
| 🟠 H2 | **Testimonials are `[USER:]` placeholders** on tier + community pages | Real quotes (or remove the sections) |
| 🟠 H3 | **Merch links are `[USER:]` placeholders** on integrated landing | Real product URLs, or hide merch until ready |
| 🟠 H4 | **wild-os Supabase auth fails** on refresh (stale build) | Rebuild wild-os with correct env vars + redeploy `dist/` |
| 🟠 H5 | **Lead-magnet PDF filenames still say "Hypnagogic"/"5 Signs…Lucid"** | Rename on regeneration (B2) to match threshold tone |

---

## PART 4 — Recommended launch sequence

**Stage 0 — soft preview (shareable now):** already done. Pages are live and look right; safe to show friends/advisors. Just warn them the free downloads + community links are placeholders.

**Stage 1 — free funnel live (capture leads):**
1. Generate the 3 lead-magnet PDFs (B2)
2. Set up Kit + email capture + autoresponder (B3)
3. Configure GA (H1)
→ Now you can run ads to the free funnel and *keep* the leads.

**Stage 2 — paid launch (take money safely):**
4. Decide + implement course delivery so buyers get access (B1)
5. Real Discord invite + Inner Room subscription button (B5)
6. Real testimonials or remove the sections (H2)
7. Finalise audio once your spec lands (B4)
→ Now the full tier + community funnel is safe to monetise.

**Stage 3 — polish:** merch (H3), wild-os auth rebuild (H4), the deeper design rollout across tier/community pages.

---

## PART 5 — What's founder-side vs Claude-side

**Only you can provide:** Kit account, Discord server + invite links, PayPal/Whop Inner Room button, real testimonials, GA Measurement ID, merch product URLs, the audio spec, and the course-delivery decision.

**Claude can do once unblocked:** generate the lead-magnet PDFs, wire the email form once Kit exists, swap in real links/IDs/testimonials wherever you provide them, rebuild + redeploy wild-os, roll the new design language across the remaining pages, and rebuild the audio once you've written the spec.

**The pattern:** the build is largely done. The remaining launch blockers are mostly *inputs and decisions* only you can make — not more construction.

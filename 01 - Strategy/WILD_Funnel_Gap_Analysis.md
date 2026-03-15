# WILD Funnel Gap Analysis
**Date:** March 2026 | **Status:** Phase One Build Complete

---

## What's Built (Current Assets)

| Asset | Type | Status |
|---|---|---|
| `landing_page.html` | Lead magnet opt-in page | ✅ Live |
| `7_Night_WILD_Protocol.pdf` | Lead magnet (free PDF) | ✅ Complete |
| `tier1.html` | £50 Foundations landing page | ✅ Complete |
| `tier2.html` | £100 Advanced landing page | ✅ Complete |
| `tier3.html` | £200 Master landing page | ✅ Complete |
| `community.html` | £15–30/mo community landing page | ✅ Complete |
| `WILD_Phase_One_Marketing_Funnel.docx` | Strategy + content plan | ✅ Complete |
| `WILD_Command_Center.xlsx` | CRM + automation code | ✅ Complete |
| `WILD_3Month_Calendar.xlsx` | 3-month content calendar | ✅ Complete |
| `WILD_Community_Strategy.docx` | Discord + Telegram architecture | ✅ Complete |

---

## Critical Gaps (Must Fix Before First Sale)

### 1. NO PAYMENT LINKS (Blocking)
**Every CTA on all 4 landing pages links to placeholder text.**

- `YOUR_GUMROAD_TIER1_LINK` — not set up
- `YOUR_GUMROAD_TIER2_LINK` — not set up
- `YOUR_GUMROAD_TIER3_LINK` — not set up
- `YOUR_GUMROAD_COMMUNITY_DISCORD_LINK` — not set up
- `YOUR_GUMROAD_COMMUNITY_TELEGRAM_LINK` — not set up
- `YOUR_GUMROAD_COMMUNITY_BUNDLE_LINK` — not set up

**Action:** Create Gumroad products for all 4 tiers. Set prices (£50, £100, £200, and 3 subscription plans). Replace all placeholder links. Gumroad is free until first sale.

---

### 2. NO LEAD MAGNET DELIVERY SYSTEM (Blocking)
The opt-in form on `landing_page.html` has no backend. When someone submits their email, nothing happens — they receive no PDF and are added to no CRM.

**Action required:**
- Set up Google Form linked to the opt-in page (or embed form directly)
- Deploy the Apps Script email automation from `WILD_Command_Center.xlsx` (Sheet: "Apps Script Code")
- Upload `7_Night_WILD_Protocol.pdf` to Google Drive and set sharing to "anyone with the link"
- Update `CONFIG.LEAD_MAGNET_URL` in the Apps Script with the Drive link
- Test the full flow: form submit → email received → PDF accessible

---

### 3. NO GOOGLE SITES / HOSTING (Blocking)
The landing pages are HTML files sitting on a desktop. They are not live on the internet.

**Action required:**
- Create 5 Google Sites pages (one per HTML file) — or —
- Upload HTML files to GitHub Pages (free, custom domain possible) — or —
- Purchase a £2–5/year domain and use Cloudflare Pages for hosting (free)

Recommended given £20 budget: GitHub Pages + Namecheap domain (~£5/year).

---

### 4. MISSING EMAIL AUTOMATION CONFIG
The Apps Script automation in the Command Center contains placeholder values:

```
LEAD_MAGNET_URL: 'YOUR_GOOGLE_DRIVE_LINK_HERE'
COURSE_URL: 'YOUR_GUMROAD_LINK_HERE'
YOUR_NAME: 'YOUR NAME'
EMAIL_SIGNATURE: 'YOUR NAME'
```

**Action:** Fill these in before deploying. The 3-email sequence is fully written — it just needs the config data to fire correctly.

---

## High-Impact Gaps (Fix Within First 2 Weeks)

### 5. MISSING: Thank You / Confirmation Page
After someone submits their email for the free PDF, they land... nowhere. No thank-you page exists.

**Impact:** Immediate trust erosion. Converts an excited new subscriber into a confused one.

**Action:** Create a simple `thankyou.html` — dark theme, consistent design, 3 messages:
1. "Your PDF is on its way — check your inbox"
2. A soft pitch for the community (plant the seed early)
3. A "while you wait" — link to your first piece of social content

---

### 6. MISSING: Upsell Path From Tier 1 → Tier 2 → Tier 3
The landing pages compare tiers via a table but there is no **in-product upsell sequence**. Once someone buys Tier 1, they receive the course — and then nothing prompts them toward Tier 2.

**Action:** Add a post-purchase email sequence in the Command Center (currently only the lead magnet sequence exists):
- Email 4 (Day 7 post-purchase): "How's Night 3 going?" — check-in + module prompt
- Email 5 (Day 14): Soft introduce Tier 2 — "Some members ask about going deeper..."
- Email 6 (Day 30): Hard Tier 2 pitch — "You've completed the foundations. Here's what's next."

---

### 7. MISSING: Social Proof / Numbers
Every testimonial on all pages is placeholder copy. Realistic names have been generated but no real reviews exist yet.

**Short-term fix:** Remove or soften testimonials to beta/early-access language until real reviews are collected.

**Longer-term:** Add a review collection mechanism — post-module email asking for a short quote, incentivised with a community role upgrade.

---

### 8. MISSING: Analytics / Tracking
No Google Analytics, no Meta Pixel, no UTM tracking infrastructure is connected to the live pages.

**Action:**
- Add Google Analytics 4 (free) to all 5 HTML pages via a single `<script>` tag
- Set up conversion events: form submit, CTA click, Gumroad redirect
- UTM parameters already defined in the content calendar — ensure they're being tracked

---

## Medium-Priority Gaps (Month 1)

### 9. MISSING: Objection-Handling for the £200 Price Point
Tier 3 is priced at £200 — a significant spend for someone who's never had a lucid dream. The landing page handles this well with the coaching session value prop but there's no **risk reversal content** beyond the 30-day guarantee badge.

**Suggestion:** Add a short "Is Tier 3 right for you?" decision tool — a 3-question micro-quiz that routes visitors to the right tier. Builds self-selection and removes price objection at Tier 1/2.

---

### 10. MISSING: Community Platform Setup
The community landing page describes full Discord and Telegram architectures — 11 Discord channels, 7 Telegram groups, role progressions, weekly schedules — but **none of this exists yet**.

**Action order:**
1. Create Discord server with the 11 channels from the Server Layouts doc
2. Set up Telegram group + 7 sub-channels
3. Configure role bots (MEE6 or Carl-bot on Discord)
4. Post first welcome message and pin the onboarding guide
5. Only then link Gumroad → community invite

---

### 11. MISSING: Upgrade Credit System
All three tier pages mention "already own Tier 1 or 2? Email us for an upgrade code" but there's no process for handling this. No email address is listed. No upgrade pricing structure is formalized.

**Action:** Define upgrade pricing (T1→T2: £50, T1→T3: £150, T2→T3: £100). Create a Gumroad discount code system. Add a dedicated email address or contact form.

---

### 12. MISSING: Mobile Optimization Check
The HTML pages use responsive CSS (grid auto-fit, clamp fonts, media queries) but have not been tested on mobile. The comparison table on all tier pages in particular may overflow on small screens.

**Action:** Open each page on a phone or use browser DevTools mobile emulation. Specific risk areas: the 4-column comparison table, the 7-column weekly schedule grid on community.html.

---

## Lower Priority (Month 2–3)

### 13. SEO: No Meta Tags / Open Graph
Pages have basic `<meta description>` tags but no Open Graph or Twitter Card tags. Sharing a link on social will produce a blank preview.

**Action:** Add OG tags to all pages:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
```

---

### 14. MISSING: Refund / Legal Pages
No privacy policy, no terms of service, no refund policy page. This is a legal requirement under UK consumer law (Distance Selling Regulations) and is required by Gumroad for selling.

**Action:** Create a simple `legal.html` covering:
- Privacy policy (GDPR compliant — you're collecting emails)
- Terms of purchase
- Refund policy (matches the 30-day guarantee stated on pages)

---

### 15. MISSING: Affiliate / Referral System
No mechanism exists to reward students who refer others. Given the community structure and role progression system, a referral incentive could accelerate growth significantly.

**Suggestion:** Add Tier 1 as a free bonus for any member who refers 3 paying students. Or offer community months as referral credits.

---

## Prioritized Action List (Next 14 Days)

| Priority | Action | Time Required |
|---|---|---|
| 🔴 1 | Create Gumroad products + replace all placeholder links | 2 hours |
| 🔴 2 | Set up Google Form + deploy Apps Script email automation | 3 hours |
| 🔴 3 | Host pages (GitHub Pages or Google Sites) | 2 hours |
| 🔴 4 | Create `thankyou.html` page | 1 hour |
| 🟡 5 | Build post-purchase email sequence (Emails 4–6) | 2 hours |
| 🟡 6 | Add Google Analytics 4 to all pages | 30 min |
| 🟡 7 | Set up Discord server (11 channels) | 3 hours |
| 🟡 8 | Set up Telegram community | 1 hour |
| 🟠 9 | Mobile test all 5 pages | 1 hour |
| 🟠 10 | Soften/reframe testimonials to beta language | 30 min |
| 🟠 11 | Create `legal.html` (privacy + terms + refunds) | 1 hour |

**Total estimated time to first-sale-ready: ~16 hours of focused setup work.**

---

## Funnel Health Score

| Stage | Asset | Status |
|---|---|---|
| Awareness | Social content calendar (13 weeks) | ✅ Ready |
| Capture | Lead magnet opt-in page | ⚠️ Built, not connected |
| Deliver | 7-Night Protocol PDF | ✅ Ready |
| Nurture | 3-email biohacker sequence | ⚠️ Written, not deployed |
| Convert (T1) | Tier 1 landing page | ⚠️ Built, no payment link |
| Convert (T2) | Tier 2 landing page | ⚠️ Built, no payment link |
| Convert (T3) | Tier 3 landing page | ⚠️ Built, no payment link |
| Retain | Community pages | ⚠️ Built, platforms not live |
| Upsell | Post-purchase email sequence | ❌ Not yet built |
| Analytics | Tracking + conversion events | ❌ Not yet set up |

**The strategy and all content assets are complete. The gap is entirely operational setup — connecting the pieces that are already built.**

---

## Update — March 2026: New Assets + Platform Decision

### New Assets Added

| Asset | Type | Status |
|---|---|---|
| `thankyou.html` | Gated PDF download page (post-email-capture) | ✅ Complete |
| `WILD_Platform_Comparison.md` | Platform research + recommendation | ✅ Complete |
| `WILD_App_Plan.md` | Companion app planning document | ✅ Complete |

### Platform Decision: Replace Gumroad

**Recommended stack:**
- **Payhip** (payhip.com) — for course purchases (T1, T2, T3 one-off payments). Free until sale, 5% fee, handles UK VAT automatically, has course hosting + affiliate programme.
- **Whop** (whop.com) — for community subscriptions (£15/£20/£30/mo). Native Discord + Telegram gating. 3% fee. No monthly cost.
- **Kit** (kit.com, formerly ConvertKit) — for email capture + PDF delivery. Free up to 10,000 subscribers. Replaces Google Forms + Apps Script entirely.

**Action:** Sign up for all three (all free to start), connect them, replace placeholder links.

### Lead Magnet Flow: Fixed

The PDF download is now properly gated:
1. Visitor submits email on `landing_page.html`
2. Form submits in background to Google Form / Kit
3. User is redirected to `thankyou.html`
4. `thankyou.html` shows the download button (Google Drive link) + upsell cards
5. Kit (or Apps Script) sends a follow-up email with the same link + begins nurture sequence

**Remaining action:** Replace `YOUR_GOOGLE_DRIVE_PDF_LINK` placeholder in `thankyou.html` and `YOUR_GOOGLE_FORM_ACTION_URL` in `landing_page.html` with real values.

### App Plan: Documented

A full companion app has been planned (see `WILD_App_Plan.md`). Key decisions:
- Do not build now — validate demand first with first 100 customers
- MVP (Bubble.io) can be built for £0–£200 if demand is confirmed
- React PWA is the recommended build at Month 6 when revenue supports it (£2,000–£5,000)
- App creates a meaningful Tier 2/3 upsell and a standalone £7/mo subscription
- Free tier of app (breathing studio + 7 journal entries) serves as a second top-of-funnel entry point

### Revised Prioritized Action List

| Priority | Action | Time Required |
|---|---|---|
| 🔴 1 | Create Payhip products (T1 £50, T2 £100, T3 £200) | 1 hour |
| 🔴 2 | Create Whop products (community £15/£20/£30/mo) — connect Discord + Telegram | 2 hours |
| 🔴 3 | Create Kit account → form → PDF delivery automation | 1 hour |
| 🔴 4 | Replace ALL placeholders in landing_page.html, thankyou.html, tier1–3.html, community.html | 2 hours |
| 🔴 5 | Upload PDF to Google Drive → copy shareable link into thankyou.html | 15 min |
| 🔴 6 | Host all HTML files on GitHub Pages | 1 hour |
| 🟡 7 | Survey first customers: "Would you want a companion app?" | Ongoing |
| 🟡 8 | Set up Discord server (11 channels per WILD_Server_Layouts.docx) | 3 hours |
| 🟡 9 | Set up Telegram community | 1 hour |
| 🟠 10 | Build Bubble.io app MVP (breathing studio + dream journal only) | 3–6 weeks |

**Total to first-sale-ready: ~7 hours of setup work.**

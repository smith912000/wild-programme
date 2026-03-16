# WILD Programme — Master To Do List

## Status as of 16 March 2026

> Every item below is written to be immediately actionable. Pick it up, execute it, check it off.

---

## BLOCKING — Funnel broken without these

These items prevent the funnel from functioning. Nothing should be promoted publicly until all BLOCKING items are resolved.

---

### Email Platform Setup

**Why it's blocking:** The landing page opt-in form is currently pointing to a placeholder integration. No email is being captured from any visitor. Every person who visits the landing page is being lost.

**Steps:**
1. Go to [MailerLite.com](https://www.mailerlite.com) or [Brevo.com](https://www.brevo.com) and create a free account (both have free tiers supporting up to 1,000–2,500 subscribers)
2. Verify your sender domain (requires DNS access — add DKIM and SPF records via your domain registrar)
3. Create a new list called "WILD Biohacker Leads"
4. Create a second list called "WILD Spiritual Leads"
5. Build the biohacker welcome sequence: import the 7-email, 21-day sequence from `WILD_Email_Strategy.xlsx` → sheet "Biohacker Nurture"
6. Build the spiritual welcome sequence: import from `WILD_Email_Strategy.xlsx` → sheet "Spiritual Nurture"
7. Build the opt-in automation: when a subscriber joins "WILD Biohacker Leads" → immediately send Email 1 (Day 0) with the 7-Night Protocol PDF attached or as a download link
8. In MailerLite/Brevo, generate the embedded form code for the biohacker lead magnet
9. Open `C:\Users\freez\OneDrive\Desktop\WILD Bizz\landing_page.html` and replace the commented-out ConvertKit/ActiveCampaign placeholder with the live embedded form code
10. Test the form end-to-end: submit a test email, confirm the welcome email arrives with the PDF download link, confirm the subscriber appears in the list

**Definition of done:** A real email address submitted on landing_page.html receives the 7-Night Protocol PDF within 5 minutes, and the subscriber appears in the correct list with correct tags.

---

### PayPal Button IDs

**Why it's blocking:** The purchase buttons on tier1.html, tier2.html, and tier3.html are using placeholder PayPal button IDs. Clicking "Buy Now" currently leads to a broken PayPal page or error. Nobody can pay you.

**Steps:**
1. Log in to [paypal.com](https://www.paypal.com) → Business Tools → PayPal Buttons (or search "Create a Button" in the Business Dashboard)
2. Create a "Buy Now" button for Tier 1 — WILD Foundations: Price £50 GBP. Set the return URL to `https://lucidperformance.io/purchase-confirmed.html` (or current hosted URL)
3. Copy the generated hosted button ID (format: XXXXXXXXXXXXXXXXX)
4. Create a second button for Tier 2 — WILD Advanced Practitioner: Price £100 GBP
5. Create a third button for Tier 3 — WILD Master + Retreat: Price £200 GBP
6. Open each HTML file and replace the placeholder button IDs:
   - `C:\Users\freez\OneDrive\Desktop\WILD Bizz\06 - Course HTML\tier1.html` → update PayPal button ID
   - `C:\Users\freez\OneDrive\Desktop\WILD Bizz\06 - Course HTML\tier2.html` → update PayPal button ID
   - `C:\Users\freez\OneDrive\Desktop\WILD Bizz\06 - Course HTML\tier3.html` → update PayPal button ID
7. Also update `purchase-confirmed.html` if it references PayPal transaction variables
8. Test each button end-to-end using PayPal's sandbox test account before going live

**Alternative:** If preferred, set up Stripe instead — create products at [dashboard.stripe.com](https://dashboard.stripe.com), generate Payment Links, and replace the PayPal buttons with Stripe Payment Link buttons. Stripe has better analytics and lower friction for card payments.

**Definition of done:** Clicking the buy button on all three tier pages initiates a real PayPal/Stripe checkout at the correct price in GBP.

---

### Discord Server Creation

**Why it's blocking:** The index.html hub page and community.html reference the Discord community as a selling point and destination. If the Discord doesn't exist, the link is broken and the community promise is hollow.

**Steps:**
1. Create a Discord account if not already done (or use existing personal account — create a separate brand account if preferred)
2. Create a new server: click "+" in the sidebar → "Create My Own" → "For a club or community"
3. Name the server: "WILD Performance Lab" (or preferred brand name)
4. Follow `WILD_Server_Layouts.docx` Section 1 exactly — create all 8 categories and 28 channels as documented
5. Set up the 6 roles as per the roles table in Section 1: Guest, Explorer, Practitioner, Advanced, Master, Mod
6. Install Carl-bot: go to [carl.gg](https://carl.gg) → Invite to server → configure welcome message and role assignment
7. Install MEE6: go to [mee6.xyz](https://mee6.xyz) → Invite to server → configure XP/levelling and moderation rules
8. Set up the onboarding flow (6-step sequence from Section 1): create #welcome, #rules, #role-select channels and configure Carl-bot reaction roles
9. Create at least 3 starter posts in #general and #wild-technique to make the server look active before sharing the link
10. Get the permanent invite link: Server Settings → Invites → Create a link with no expiry
11. Update `index.html` → Discord card: replace `#` placeholder with the real discord.gg/XXXXXX invite URL
12. Update `community.html` → Discord section: update the join link

**Definition of done:** A new person can click the Discord link from index.html, join the server, see the onboarding flow, and self-assign their persona role.

---

### Telegram Channel Creation

**Why it's blocking:** Same reason as Discord — the Telegram links in the site are placeholders. The spiritual funnel has no community destination.

**Steps:**
1. Open Telegram on desktop or mobile
2. Create a new Channel: tap hamburger menu → New Channel → Name: "Dream Transmissions" → set as Public → username: @DreamTransmissions (or @WILDDreamLab if taken)
3. Write a channel description: "The neuroscience of lucid dreaming. WILD technique, REM optimisation, and consciousness research — distilled daily."
4. Set a channel profile image (use WILD Programme logo or dark neural imagery matching brand aesthetic)
5. Create the paid group: New Group → Name: "WILD Consciousness Circle" → set as Private (do not make public — this is the paid tier)
6. For paid access management: use [Combot](https://combot.org) or Telegram's built-in payment bot, or manually manage via invite links rotated per payment cycle
7. Install Combot in Dream Transmissions public channel for analytics
8. Install Rose Bot in WILD Consciousness Circle private group for moderation
9. Post at least 3 initial messages in Dream Transmissions before sharing the link (make it look active)
10. Get the public channel link: t.me/DreamTransmissions
11. Update `index.html` → Telegram card: replace `#` placeholder with t.me link
12. Update `community.html` → Telegram section: update the join link

**Definition of done:** Clicking the Telegram link from index.html opens the Dream Transmissions channel with visible content.

---

## IMPORTANT — Launch quality

These items are not funnel-breaking but significantly affect professional credibility and conversion rate. Fix before any meaningful promotion begins.

---

### GA4 Measurement ID

**Why it matters:** Without GA4, you have zero visibility into traffic sources, conversion paths, or which content is driving sign-ups. Flying blind.

**Steps:**
1. Go to [analytics.google.com](https://analytics.google.com) → Create Account → Account name: "WILD Programme" → Property name: "lucidperformance.io"
2. Set up a Web data stream → enter the domain → copy the Measurement ID (format: G-XXXXXXXXXX)
3. Search all HTML files for `G-XXXXXXXXXX` and replace with your real Measurement ID:
   - `index.html`
   - `landing_page.html`
   - `tier1.html`, `tier2.html`, `tier3.html`
   - `community.html`
   - `purchase-confirmed.html`
   - All remaining HTML files in the project
4. In GA4, set up Conversion Events: go to Configure → Events → mark these as conversions:
   - `form_submit` (email opt-in)
   - `purchase` (any tier buy)
   - `page_view` on `purchase-confirmed.html`
5. Install Google Tag Manager (optional but recommended for cleaner management of future tracking pixels)
6. Verify tracking is working: open your live site in one browser tab, open GA4 Realtime report in another → confirm your visit appears

**Definition of done:** Live GA4 dashboard showing real-time visitors with conversion events firing correctly on form submissions and purchases.

---

### og-image.png (Social Preview Image)

**Why it matters:** When anyone shares your URL on WhatsApp, iMessage, Slack, LinkedIn, or Twitter, the preview card shows the og-image. Currently it references `og-image.svg` which does not render correctly in all contexts. A 1200×630 PNG is the universal standard.

**Steps:**
1. Open `og-image.svg` in Canva, Figma, or Adobe Illustrator (File → Open)
2. Alternatively, open Canva → Custom size: 1200 × 630 pixels → design a dark-themed preview card with:
   - WILD Programme logo
   - Headline: "The 7-Night WILD Protocol — Free Download"
   - Dark background consistent with brand aesthetic
3. Export as PNG at 1200×630 pixels
4. Save as `og-image.png` in the same directory as your HTML files
5. Open all HTML files and update the og:image meta tag from `.svg` to `.png`
6. Test using [opengraph.xyz](https://www.opengraph.xyz) — paste your URL and check the preview renders correctly

**Definition of done:** Pasting the landing page URL into WhatsApp shows a clean, branded 1200×630 preview card.

---

### Whop Community Links

**Why it matters:** `community.html` references Whop as the subscription management platform for Discord and Telegram paid tiers. If no Whop products exist, these links are broken and the paid community has no payment gateway.

**Steps:**
1. Create an account at [whop.com](https://www.whop.com) (free to create, Whop takes a small % of transactions)
2. Create Product 1: "WILD Discord — Biohacker Lab" — £15/month or £25/month (choose based on WILD_Community_Strategy.docx pricing)
3. Link Product 1 to your Discord server via Whop's Discord integration (Whop auto-manages role assignment on payment)
4. Create Product 2: "WILD Consciousness Circle — Telegram" — £10/month or £20/month
5. Link Product 2 to your Telegram paid group via Whop's Telegram integration
6. Copy the Whop checkout URLs for each product
7. Update `community.html` → replace Whop placeholder links with real product URLs
8. Update `index.html` if community pricing cards have direct join links

**Definition of done:** Clicking "Join Community" on community.html initiates a real Whop subscription checkout at the correct monthly price.

---

### Domain Registration

**Why it matters:** All assets reference `lucidperformance.io` as a placeholder. Until the domain is registered and live, nothing can be properly deployed.

**Steps:**
1. Check availability of `lucidperformance.io` at [Namecheap](https://www.namecheap.com) or [Cloudflare Registrar](https://www.cloudflare.com/registrar/) (Cloudflare offers domains at cost price — recommended)
2. If taken: alternatives to check: `lucidperformance.co`, `wildprotocol.io`, `wildperformance.io`, `neuromodulate.io`
3. Register the chosen domain (£10–£25/year typically)
4. Point DNS to your hosting provider (Vercel, Netlify, Carrd, or GitHub Pages)
5. Deploy `index.html` as the site root
6. Set up SSL (HTTPS) — Vercel/Netlify do this automatically; Cloudflare provides it as a proxy
7. Find-and-replace `lucidperformance.io` across ALL HTML files, the PDF, and all Excel documents once the real domain is confirmed
8. Update the PDF's domain placeholder (`www.lucidperformance.io` on back page) — requires regenerating `7_Night_WILD_Protocol.pdf`

**Definition of done:** Visiting your chosen domain in a browser loads index.html over HTTPS with a valid SSL certificate.

---

### TikTok Account Creation

**Why it matters:** The Curious Achiever persona (the most likely impulsive buyer) primarily discovers new content via TikTok. The content calendar includes TikTok content but there is currently no account to post it to.

**Steps:**
1. Create TikTok account: username options — @NeuroModulate, @WILDProtocol, @LucidPerformance, @WILDtechnique (check availability)
2. Complete profile: profile photo (brand logo or professional headshot), bio (max 80 chars — e.g., "Wake-Induced Lucid Dreaming. Science-backed. 7-night protocol — link below"), add website link in bio
3. Connect TikTok account to the Hub page — add a TikTok card to `index.html` with the @handle and profile link
4. Post the first 3 videos within the first week to trigger algorithm onboarding boost (TikTok gives new accounts increased reach on first 5–10 posts)
5. First video script already written in `WILD_Phase_One_Marketing_Funnel.docx` → TikTok Scripts section — use Script 1 as the first post

**Definition of done:** TikTok profile is live with username, bio, website link, and at least 1 posted video. Profile URL is linked from index.html.

---

## CONTENT PRODUCTION — Post-launch

Begin these after all BLOCKING and IMPORTANT items are resolved.

---

### Tier 1 Course Videos (7 Modules)

**Brief:** Record 7 videos following the module structure in `WILD_Course_Calendar.xlsx` → Tier 1 Foundations sheet. Each video maps to one night of the 7-Night Protocol.

**Production checklist per video:**
- Script drafted (from Protocol content + Course Calendar module outline)
- Intro: 30-second hook (pattern interrupt + credibility + promise — see Platform Strategy doc, Section 4.3)
- Screen recordings or slide visuals prepared in Canva
- Recorded in a quiet environment with decent microphone (USB condenser or dynamic — Blue Yeti, Rode NT-USB, or similar)
- Edited in CapCut or DaVinci Resolve: add captions, cut dead air, add b-roll or slides
- Thumbnail created for each video (dark background, bold text — see Platform Strategy doc, Section 4.2)
- Uploaded to the hosting platform (Gumroad, Teachable, Thinkific, or Vimeo private links)
- Gated behind Tier 1 purchase (configure in payment platform)

**Module sequence:**
1. Module 1: Night 1 — Circadian Foundation & Sleep Architecture
2. Module 2: Night 2 — REM Optimisation & Sleep Timing
3. Module 3: Night 3 — Hypnagogic Entry Techniques
4. Module 4: Night 4 — Deepening the Transition
5. Module 5: Night 5 — Sleep Paralysis Demystified & Navigation
6. Module 6: Night 6 — Lucidity Stabilisation Methods
7. Module 7: Night 7 — Performance Integration & Protocol Continuation

**Target completion:** 4–6 weeks post-launch (Tier 1 can initially be text/PDF only, with videos added as "v2 upgrade")

---

### Course Audio Guides

**Brief:** Per `WILD_Media_Assets_Plan.md` — sleep-state audio guides designed to accompany each night's practice. These are a key differentiator vs text-only competitors.

**Requirements:**
- One audio per night (7 total)
- 10–20 minutes each
- Tone: calm, clinical, measured — not meditation-app soothing. Think NSDR (non-sleep deep rest) format, not Calm app.
- Scripted from Night content in `7_Night_WILD_Protocol.pdf`
- Recorded with clean microphone, minimal reverb
- Light binaural beat background (optional — 40Hz gamma for Nights 1–4, 4–8Hz theta for Night 5–7 transition guidance)
- Exported as MP3 at 320kbps, uploaded alongside video content or as standalone bonus

---

### Course Infographics and Visual Protocol Cards

**Brief:** Per `WILD_Media_Assets_Plan.md` — visual protocol cards for each night, suitable for saving/printing.

**Requirements:**
- One visual card per night (7 total) + one master overview infographic
- Design in Canva using dark theme brand colours
- Include: night title, key actions (3–5 bullet points), supplement timing (where applicable), what to track
- Exported as PNG at 2× resolution for crisp display on retina/high-DPI screens
- Used as: bonus inside course, standalone Instagram carousels, lead magnet upgrade

---

### Tier 2 Production

Begin planning after Tier 1 is live and generating revenue. Tier 2 content is documented in `WILD_Course_Calendar.xlsx` → Tier 2 Advanced Practitioner sheet. Modules cover DEILD, SSILD, extended duration training, EEG-based feedback, nootropics protocol (galantamine/Alpha-GPC detailed dosing), reality testing systems, dream control techniques, advanced tracking, and personal system design.

Target start: 6–8 weeks after Tier 1 launch.

---

### Tier 3 Production

Begin after Tier 2 is live. Tier 3 is primarily a live programme (monthly Q&A, quarterly workshop, annual 3-day virtual retreat — 30 seats max). Content to produce: structured retreat curriculum for the 3-day virtual event, Q&A hosting format, member progression tracking framework.

Target start: 12–16 weeks after Tier 1 launch.

---

## SOCIAL MEDIA — See content calendar files

---

### Content Calendar Execution

The 91-day content calendar is documented in the 3-Month Calendar Excel files. Execute daily per the calendar.

**Immediate actions:**
1. Open `WILD_3Month_Calendar.xlsx` → Social Media Calendar sheet
2. Review all posts scheduled for the current week
3. Batch-create this week's content in a single session (see Platform Strategy doc, Section 7.1)
4. Schedule in Buffer or Hypefury before the week begins

---

### Buffer or Hypefury Setup

**Steps:**
1. Create a Buffer account at [buffer.com](https://www.buffer.com) — Essentials plan ($18/mo) supports Instagram, Facebook, X, LinkedIn, TikTok scheduling
2. Connect all social accounts: X, Instagram, Facebook Page, Facebook Group (note: Group scheduling is limited — use Buffer for Page, schedule Group posts manually or via a Group scheduling tool)
3. Set up a posting schedule for each platform matching the optimal times documented in `02_Platform_Strategy_and_Best_Practices.md`
4. If X/Twitter is a priority platform: add Hypefury ($19/mo) for thread scheduling and X-specific analytics — Buffer's X scheduling is functional but Hypefury is purpose-built for threads

---

### Canva Template Library

**Build once, reuse indefinitely.**

**Templates to create:**
1. Instagram carousel slide (dark background, brand fonts, numbered format) — 10-slide master template
2. Instagram Reel cover frame
3. Instagram Story (poll format, quiz format, announcement format)
4. YouTube thumbnail (dark, bold text, accent colour variant)
5. YouTube end screen graphic
6. X/Twitter quote graphic (for high-performing tweets — turn into shareable image)
7. Reddit "data visualisation" table format (for reporting personal experiment results)

**Steps:**
1. Open Canva Pro → Create new design → set custom dimensions for each format
2. Design each template with brand colours (deep navy background, white/electric blue text, Inter or Space Grotesk font)
3. Save each as a Canva template (not just a design — use "Create Template" feature)
4. Add to a shared Canva team folder for easy access

---

### YouTube Video Production (Weeks 1–2)

**Week 1 video (highest priority):**
- Title: "WILD Technique Explained: The Neuroscience Behind Wake-Induced Lucid Dreaming"
- This is the foundational explainer — everything else links back to it
- Target length: 15–20 minutes
- SEO keywords front-loaded: "WILD Technique" appears first in title
- Publish on a Thursday to peak on Friday/Saturday browsing

**Week 2 video:**
- Title: "7 Nights of WILD Practice: My Complete Protocol and Results"
- Personal experiment format — highest trust signal for new channels
- Reference the free 7-Night Protocol PDF at the end with clear CTA

---

### Blog Setup

**Steps:**
1. Choose platform: GitHub Pages (free, technical setup) or Ghost (from $9/mo, purpose-built for content creators — recommended)
2. Ghost setup: go to [ghost.org](https://ghost.org) → start free trial → connect custom domain (blog.lucidperformance.io or lucidperformance.io/blog)
3. Configure Ghost with dark theme matching brand aesthetic (Ghost has dark themes available in marketplace)
4. Write and publish Week 1 post:
   - Title: "The Neuroscience of WILD: What Actually Happens in Your Brain During Wake-Induced Lucid Dreaming"
   - Target keyword: "WILD technique neuroscience"
   - Length: 2,000–2,500 words
   - Include: PubMed citations, one embeddable diagram or sleep stage graphic, CTA to download the 7-Night Protocol PDF
5. Submit the blog URL to Google Search Console for indexing
6. Add blog link to `index.html` navigation and footer

---

### Reddit Karma Building

**This must begin now — it has a time delay that cannot be compressed.**

**Steps (start immediately, before any promotional activity):**
1. Create or designate a Reddit account for WILD Programme community engagement
2. For the next 4–6 weeks: spend 20–30 minutes daily in the following subreddits:
   - r/luciddreaming — answer technique questions from genuine experience
   - r/nootropics — contribute to galantamine, Alpha-GPC, and sleep stack discussions
   - r/biohacking — share relevant studies and self-experiment data
   - r/WILDtechnique — this is the most targeted sub — engage with every active post
3. Target: 500+ karma before attempting any post that could be construed as promotional
4. Target: 1,000+ karma before posting AMA or results post
5. Track karma weekly in `WILD_Command_Center.xlsx` → KPI Dashboard

**Do not rush this. A shadowbanned Reddit account provides zero value and cannot be recovered.**

---

## COMPLETED

The following items were completed prior to 16 March 2026.

---

- [x] **WILD_Phase_One_Marketing_Funnel.docx** — Full Phase One strategy document written. Contains revenue model, social strategy, content scripts, lead magnet outline, 3-email nurture sequence, automation architecture. *(Completed pre-March 2026)*

- [x] **WILD_Community_Strategy.docx** — Dual-platform community strategy written. Contains 5-stage user journey, Discord + Telegram architecture, spiritual funnel content, retention mechanics, revenue projections. *(Completed pre-March 2026)*

- [x] **7_Night_WILD_Protocol.pdf** — 16-page professional PDF lead magnet written and formatted. Covers all 7 nights, tracking template, course bridge, glossary, references. *(Completed pre-March 2026)*

- [x] **WILD_Command_Center.xlsx** — Master operations spreadsheet built. Sheets: KPI Dashboard, Revenue Projection, Content Calendar, Lead CRM, Email Sequences, Analytics, 14-Day Sprint, Apps Script Code. *(Completed pre-March 2026)*

- [x] **WILD_3Month_Calendar.xlsx** — 91-day content calendar built. 193 rows of social content (Mar 17–Jun 14 2026), Discord and Telegram weekly programming, dual-funnel email sequences, KPI tracker, revenue model. *(Completed pre-March 2026)*

- [x] **WILD_Course_Calendar.xlsx** — Complete course content calendar for all 3 tiers. Tier 1 (7 modules), Tier 2 (10 modules), Tier 3 (6 modules + live sessions), upsell sequences. *(Completed pre-March 2026)*

- [x] **WILD_Server_Layouts.docx** — Full Discord + Telegram server architecture guide (27KB). Section 1 (Discord): 8 categories, 28 channels, 6 roles, bot setup, onboarding flow, weekly calendar. Section 2 (Telegram): full architecture, broadcast schedule. Section 3 (Cross-Platform): funnel flow, automation integration, revenue model. *(Completed pre-March 2026)*

- [x] **landing_page.html** — Dark-themed email capture landing page built (21,073 chars). Fixed nav, hero opt-in form, stat bar, problem section, included items, 7-Night structure, outcomes checklist, footer. ConvertKit/ActiveCampaign integration pattern commented in. *(Completed pre-March 2026)*

- [x] **WILD_Email_Strategy.xlsx** — Comprehensive email system built (7 sheets). Strategy overview (14 sequences, 12 tags), biohacker nurture (7 emails, 21 days), spiritual nurture (7 emails, 21 days), upsell sequences (T1→T2 + T2→T3), buyer onboarding, re-engagement sequence (4 emails), 15 automation rules. *(Completed pre-March 2026)*

- [x] **Hub index page** — Custom Linktree replacement (index.html) built. Links to all WILD assets in one place. *(Completed March 2026 — commit dd272f4)*

- [x] **Tier 1, Tier 2, Tier 3 course HTML files** — Styled course HTML pages built for all three tiers. *(Completed March 2026 — commit 3fc5803)*

- [x] **purchase-confirmed.html** — Post-purchase confirmation page built and linked from all tier pages. *(Completed March 2026 — commit 3fc5803)*

- [x] **Google Drive URLs** — Live Google Drive URLs wired into purchase-confirmed.html for course delivery. *(Completed March 2026 — commit 1d64657)*

- [x] **WILD_Media_Assets_Plan.md** — Course media assets plan written. Documents audio guide specs, infographic requirements, video production checklist. *(Completed March 2026 — commit 8763656)*

- [x] **Analytics implementation** — GA4 tracking code, OG tags, conversion events, and testimonial credibility pass applied across HTML pages. *(Completed March 2026 — commit bcb1c3c)*

- [x] **Market Research & Audience Analysis** — `01_Market_Research_and_Audience_Analysis.md` written. Full TAM/SAM/SOM analysis, 3 detailed personas, competitive landscape, keyword analysis, content consumption patterns, pricing psychology, funnel model examples, risk register. *(Completed 16 March 2026)*

- [x] **Platform Strategy & Best Practices** — `02_Platform_Strategy_and_Best_Practices.md` written. Comprehensive strategy for X, Instagram, Facebook, YouTube, Reddit including proven formats, optimal timing, KPIs, and content repurposing matrix. *(Completed 16 March 2026)*

- [x] **Master To Do List** — This document. *(Completed 16 March 2026)*

---

*Last updated: 16 March 2026*
*WILD Programme — lucidperformance.io (domain TBC)*

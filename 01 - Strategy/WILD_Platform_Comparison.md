# WILD Programme — Platform Comparison & Recommendation
**Prepared:** March 2026 | **Budget:** £20 | **Timeline:** First sale within 2 weeks

---

## Why Gumroad Isn't Ideal for This Niche

Gumroad works for generic digital products (ebooks, presets, templates) but has real weaknesses for what WILD is building:

- **No community gating** — can't tie Discord/Telegram access to active subscriptions automatically
- **No course hosting** — videos, modules, and progress tracking aren't supported
- **UK VAT handling is manual** — you're responsible for collecting and remitting VAT yourself
- **No affiliate programme** — can't build referral incentives
- **Brand perception** — Gumroad reads as "side project seller," not as a serious programme

---

## Shortlist: 8 Platforms Evaluated

| Platform | Free Tier | Transaction Fee | Courses | Subscriptions | UK VAT Auto | Community Gating |
|---|---|---|---|---|---|---|
| **Payhip** | ✅ Yes | 5% (free) / 0% (£22/mo) | ✅ Yes | ✅ Yes | ✅ Auto | ⚠️ Basic |
| **Whop** | ✅ Yes | 3% | ⚠️ Limited | ✅ Yes | ✅ Auto | ✅ Native Discord/Telegram |
| **Lemon Squeezy** | ✅ Yes | 5% + $0.50 | ⚠️ Limited | ✅ Yes | ✅ Auto | ❌ No |
| **Stan Store** | ❌ $29/mo | 0% | ✅ Yes | ✅ Yes | ✅ Auto | ❌ No |
| **Skool** | ❌ $99/mo | 0% | ✅ Yes | ✅ Yes | ✅ Auto | ✅ Built-in |
| **Mighty Networks** | ❌ $41/mo | 2–3% | ✅ Yes | ✅ Yes | ⚠️ Partial | ✅ Built-in |
| **Teachable** | ✅ (limited) | 10% free / 0% paid | ✅ Full | ✅ Yes | ✅ Auto | ❌ No |
| **Patreon** | ✅ Yes | 5–12% | ❌ No | ✅ Yes | ✅ Auto | ⚠️ Basic |

---

## Platform Deep-Dives

### ⭐ Payhip — Recommended Primary Platform

**What it is:** A UK-friendly digital product store supporting courses, memberships, downloads, and coaching.

**Why it fits WILD:**
- Free until you sell — no upfront cost
- 5% per transaction on the free plan (drops to 0% at £22/mo — achievable after first ~10 sales)
- **Handles UK and EU VAT automatically** — legally required, otherwise your problem
- Supports all four products: one-off course purchases (T1, T2, T3), recurring subscriptions (community)
- Has a course builder with modules, videos, and completion tracking
- Affiliate programme built in — lets you incentivise referrals from Day 1
- Can embed checkout directly into your existing HTML landing pages via Payhip's embed code

**Weaknesses:** No native Discord/Telegram gating — community access still requires a manual or Zapier-based link trigger. But paired with Whop (below), this is solved.

**Pricing:** Free → 5% per sale. At £22/mo you get 0% transaction fee.

---

### ⭐ Whop — Recommended for Community Gating

**What it is:** The fastest-growing platform for gated digital communities, Discord + Telegram integration, and software-as-a-subscription.

**Why it fits WILD:**
- **Native Discord and Telegram gating** — the #1 problem for WILD's community model. When a member cancels, they're auto-removed. When they pay, they're auto-added. Zero manual management.
- 3% transaction fee — lower than most competitors
- No monthly subscription required
- Growing rapidly in wellness, trading, and niche education spaces (143K+ products in 2025)
- Has a marketplace — your products can be discovered by Whop's existing audience
- Works as a storefront AND as a gating layer on top of your Discord/Telegram communities

**Best use for WILD:** Use Whop specifically for the Community membership (£15, £20, £30/mo plans). Whop manages the Discord/Telegram access automatically. Use Payhip for the course tiers (T1, T2, T3).

**Pricing:** Free. 3% per transaction.

---

### Lemon Squeezy — Runner-Up for VAT Compliance

**What it is:** A Stripe-like payments platform for digital products with excellent EU/UK VAT handling.

**Why it's interesting:** Extremely clean checkout experience, excellent for SaaS-style subscriptions and one-off payments. Handles VAT as the Merchant of Record.

**Why it doesn't win:** 5% + $0.50 per transaction is higher cost than Payhip. No course hosting. No community gating.

**When to use it:** Consider as a payment processor layer if you build a custom checkout in future. Not the right choice for Phase One.

---

### Skool — Future Consideration (Month 3+)

**What it is:** Alex Hormozi-backed all-in-one course + community platform. Growing rapidly.

**Why it's interesting:** Courses, community, and gamification in one place. Strong affiliate ecosystem. Clean UX.

**Why not now:** $99/mo minimum. Not viable at £20 budget. Re-evaluate once revenue covers the cost.

---

### Mighty Networks — Future Consideration

**What it is:** Premium community-first platform used heavily in wellness, spirituality, and coaching niches.

**Why it's interesting:** Purpose-built for the consciousness/wellness audience. Has live events, courses, and app-based delivery. Very strong brand in the spiritual creator space.

**Why not now:** Starts at $41/mo. Worth revisiting at Month 3–4 when community has momentum and revenue.

---

## Recommended Stack (Phase One — £0/mo to start)

```
COURSE SALES (T1, T2, T3 one-off purchases)
└── Payhip (free, 5% fee, UK VAT auto, course hosting, affiliate programme)

COMMUNITY SUBSCRIPTIONS (£15/£20/£30/mo)
└── Whop (free, 3% fee, auto Discord + Telegram gating)

EMAIL + LEAD CAPTURE
└── Kit (formerly ConvertKit) — free up to 10,000 subscribers
    → Handles form embed, email sequence, PDF delivery in one place
    → Replaces Google Forms + Apps Script setup entirely

LANDING PAGES
└── Your existing HTML pages (hosted on GitHub Pages — free)
    → Payhip checkout embed on tier pages
    → Kit form embed on landing_page.html
```

**Total monthly cost at launch: £0**
**Transaction fees at first sale: 5% (Payhip) + 3% (Whop)**

---

## Action: What to Set Up First (In Order)

1. **Create Payhip account** → payhip.com — add 3 products: T1 (£50), T2 (£100), T3 (£200)
2. **Create Whop account** → whop.com — add 3 community products: Discord £20/mo, Telegram £15/mo, Bundle £30/mo — connect your Discord server and Telegram group
3. **Create Kit account** → kit.com — set up lead magnet automation: form → tag → sequence → PDF delivery
4. **Replace all placeholder links** in tier1.html, tier2.html, tier3.html, community.html with Payhip/Whop URLs
5. **Update landing_page.html** to embed Kit form instead of Google Form
6. **Host on GitHub Pages** — push all HTML files to a free GitHub repo, enable Pages, point a domain if budget allows

---

## Scale Path (Month 3–6)

| Revenue | Platform Move |
|---|---|
| First £500 | Stay on Payhip free + Whop |
| £500–£2,000/mo | Upgrade Payhip to £22/mo plan (0% fees, net positive at ~£440 revenue) |
| £2,000+/mo | Evaluate Skool ($99/mo) or Mighty Networks ($41/mo) for unified experience |
| £5,000+/mo | Commission custom app or white-label Kajabi deployment |

---

## Sources

- [Payhip vs Lemon Squeezy comparison](https://payhip.com/payhip-vs-lemon-squeezy)
- [Best Gumroad Alternatives 2026 — Payhip](https://payhip.com/blog/gumroad-alternatives/)
- [Whop 2025 Year in Review](https://whoptrends.com/blog/whop-2025-year-in-review)
- [Lemon Squeezy Fees](https://docs.lemonsqueezy.com/help/getting-started/fees)
- [Stan Store Pricing 2026](https://www.schoolmaker.com/blog/stan-store-pricing)
- [Best Online Course Platforms 2026](https://www.learningrevolution.net/best-online-course-platforms/)

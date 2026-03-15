# WILD Business — Automation Setup Guide
**Gmail account:** seektruth@gmail.com

Two scripts. Five minutes to configure. Run them once and your email admin is mostly handled.

---

## Script 1: Gmail Automation (`gmail_automation.py`)

Sets up labels, auto-filters, and response draft templates in your Gmail inbox.

### Step 1 — Enable Gmail API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project — name it `WILD Business`
3. Click **APIs & Services > Enable APIs & Services**
4. Search for **Gmail API** and enable it

### Step 2 — Create OAuth Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth client ID**
3. Application type: **Desktop app**
4. Name: `WILD Gmail Automation`
5. Click **Create**, then **Download JSON**
6. Rename the downloaded file to `credentials.json`
7. Move it into this folder (`07 - Automation/`)

> First time only: you may need to set up an OAuth consent screen.
> Go to **APIs & Services > OAuth consent screen**, choose External,
> fill in App name (`WILD Business`) and your email, save.

### Step 3 — Install dependencies

```bash
pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

### Step 4 — Run

```bash
python gmail_automation.py
```

A browser window will open. **Sign in as seektruth@gmail.com** — if you're already
signed into a different Google account, click "Use another account" first.
After you approve, it saves a `token.json` file and runs automatically from then on.

> If you accidentally authenticate with the wrong account, just delete `token.json`
> and re-run the script.

### What it creates

**Labels (colour-coded in Gmail sidebar):**
- `WILD Business/Purchases` — all Payhip orders
- `WILD Business/Purchases/Tier 1 - £50`
- `WILD Business/Purchases/Tier 2 - £100`
- `WILD Business/Purchases/Tier 3 - £200`
- `WILD Business/Purchases/Community`
- `WILD Business/Payhip` — all Payhip emails
- `WILD Business/Whop` — all Whop emails
- `WILD Business/Kit` — all Kit emails
- `WILD Business/Support` — customer queries
- `WILD Business/Support/Urgent` — refund requests (starred)
- `WILD Business/Biohacker Stream`
- `WILD Business/Consciousness Stream`

**Filters (auto-applied to incoming email):**
- Payhip receipts → routed to Purchases, skip inbox
- Whop alerts → routed to Whop, skip inbox
- Kit notifications → routed to Kit, skip inbox
- Emails with "refund" in subject → Urgent Support + starred
- Emails with "download", "access", "not working" → Support
- Emails mentioning Discord/Telegram → correct stream label

**Response drafts (in your Gmail Drafts folder):**
- Re: Course access question
- Re: Download not working
- Re: Refund request
- Re: Upgrading to the next tier
- Re: Community Discord / Telegram question
- Re: What's the difference between the tiers?

To use these as one-click templates when replying:
Gmail Settings > See all settings > Advanced > Enable Canned Responses.
When composing a reply, click the three-dot menu > Canned responses.

---

## Script 2: Kit Automation (`kit_automation.py`)

Manages your email list — tags subscribers by tier and stream, exports lists, syncs Payhip purchase data.

### Step 1 — Get your Kit API key

1. Go to [app.kit.com](https://app.kit.com)
2. Click your profile > **Settings > Developer**
3. Copy your **API Key** (v3 key)

### Step 2 — Create a .env file

Create a file called `.env` in this folder (`07 - Automation/`) with:

```
KIT_API_KEY=your_api_key_here
```

### Step 3 — Install dependencies

```bash
pip install requests python-dotenv
```

### Step 4 — Set up tags (run once)

```bash
python kit_automation.py setup-tags
```

This creates all the subscriber tags your business needs in Kit.

### Step 5 — Sync purchases (run after each Payhip export)

1. In your Payhip dashboard, export orders as CSV
2. Run:

```bash
python kit_automation.py sync-payhip ~/Downloads/payhip_orders.csv
```

Each buyer gets tagged automatically by tier.

### All commands

```bash
# See subscriber counts by tag
python kit_automation.py status

# Create all required tags
python kit_automation.py setup-tags

# Export full list to CSV
python kit_automation.py export

# Tag one subscriber manually
python kit_automation.py tag customer@email.com "Tier 1 - Foundation"

# Sync a Payhip orders CSV
python kit_automation.py sync-payhip orders.csv

# List your email sequences
python kit_automation.py sequences
```

---

## Recommended workflow

**Daily (30 seconds):**
- Gmail labels auto-sort everything. Check `WILD Business/Support/Urgent` first.
- Use saved drafts to reply to common queries in one click.

**Weekly:**
```bash
python kit_automation.py status
```
Check subscriber growth and which tiers are converting.

**After each Payhip payout export:**
```bash
python kit_automation.py sync-payhip payhip_export.csv
```
Keeps Kit tags current so your email sequences hit the right people.

**Monthly:**
```bash
python kit_automation.py export
```
Backup your full subscriber list locally.

---

## Files in this folder

| File | Purpose |
|---|---|
| `gmail_automation.py` | Gmail labels, filters, response templates |
| `kit_automation.py` | Kit list management, tagging, sync |
| `credentials.json` | Google OAuth credentials *(you add this)* |
| `token.json` | Google auth token *(auto-generated)* |
| `.env` | Kit API key *(you create this)* |
| `SETUP.md` | This guide |

> **Security note:** Never share `credentials.json`, `token.json`, or `.env`.
> They are already in `.gitignore` if you're using version control.

#!/usr/bin/env python3
"""
WILD Business — Gmail Automation
=================================
Configured for: seektruth@gmail.com

Sets up labels, filters, and canned response drafts for all
incoming business email (Payhip purchases, Whop community alerts,
Kit subscriber notifications, customer support).

Run once to configure your Gmail inbox. Safe to re-run — existing
labels and filters are detected before creating new ones.

Requirements:
    pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client

Setup:
    1. See SETUP.md for Google Cloud Console OAuth steps
    2. Place credentials.json in this folder
    3. Run:  python gmail_automation.py
    4. Sign in as seektruth@gmail.com when the browser opens
"""

GMAIL_ACCOUNT = 'seektruth@gmail.com'

import os, json, base64
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# ── Scopes ────────────────────────────────────────────────────────────────────
SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.settings.basic',
]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# ── Auth ──────────────────────────────────────────────────────────────────────

def get_service():
    creds = None
    token_path = os.path.join(BASE_DIR, 'token.json')
    creds_path = os.path.join(BASE_DIR, 'credentials.json')

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(creds_path):
                print("ERROR: credentials.json not found.")
                print("See SETUP.md for how to create it.")
                raise SystemExit(1)
            flow = InstalledAppFlow.from_client_secrets_file(creds_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, 'w') as f:
            f.write(creds.to_json())

    service = build('gmail', 'v1', credentials=creds)

    # Verify we're authenticated as the correct account
    profile = service.users().getProfile(userId='me').execute()
    authed_as = profile.get('emailAddress', '')
    if authed_as.lower() != GMAIL_ACCOUNT.lower():
        print(f"\nWARNING: Authenticated as {authed_as}")
        print(f"         Expected: {GMAIL_ACCOUNT}")
        print("         Delete token.json and re-run, signing in as the correct account.\n")
        raise SystemExit(1)

    print(f"Authenticated as: {authed_as}")
    return service


# ── Label definitions ─────────────────────────────────────────────────────────

LABELS = [
    # Parent
    {'name': 'WILD Business',         'bg': '#16537e', 'fg': '#ffffff'},
    # Purchases
    {'name': 'WILD Business/Purchases',   'bg': '#0d7377', 'fg': '#ffffff'},
    {'name': 'WILD Business/Purchases/Tier 1 - £50',  'bg': '#1a9b8a', 'fg': '#ffffff'},
    {'name': 'WILD Business/Purchases/Tier 2 - £100', 'bg': '#0d7377', 'fg': '#ffffff'},
    {'name': 'WILD Business/Purchases/Tier 3 - £200', 'bg': '#9333ea', 'fg': '#ffffff'},
    {'name': 'WILD Business/Purchases/Community',     'bg': '#5865f2', 'fg': '#ffffff'},
    # Sources
    {'name': 'WILD Business/Payhip',  'bg': '#e3a008', 'fg': '#000000'},
    {'name': 'WILD Business/Whop',    'bg': '#5865f2', 'fg': '#ffffff'},
    {'name': 'WILD Business/Kit',     'bg': '#3fb950', 'fg': '#000000'},
    # Support
    {'name': 'WILD Business/Support',         'bg': '#f85149', 'fg': '#ffffff'},
    {'name': 'WILD Business/Support/Urgent',  'bg': '#da3633', 'fg': '#ffffff'},
    {'name': 'WILD Business/Support/Replied', 'bg': '#6e7681', 'fg': '#ffffff'},
    # Streams
    {'name': 'WILD Business/Biohacker Stream',    'bg': '#1a9b8a', 'fg': '#ffffff'},
    {'name': 'WILD Business/Consciousness Stream','bg': '#9333ea', 'fg': '#ffffff'},
]


def get_existing_labels(service):
    result = service.users().labels().list(userId='me').execute()
    return {l['name']: l['id'] for l in result.get('labels', [])}


def create_labels(service):
    print("\n── Creating labels ──────────────────────────────────")
    existing = get_existing_labels(service)
    created = {}

    for label in LABELS:
        name = label['name']
        if name in existing:
            print(f"  exists : {name}")
            created[name] = existing[name]
        else:
            body = {
                'name': name,
                'labelListVisibility': 'labelShow',
                'messageListVisibility': 'show',
                'color': {
                    'backgroundColor': label.get('bg', '#444444'),
                    'textColor':       label.get('fg', '#ffffff'),
                }
            }
            result = service.users().labels().create(userId='me', body=body).execute()
            created[name] = result['id']
            print(f"  created: {name}")

    return created


# ── Filter definitions ────────────────────────────────────────────────────────
# Each filter maps incoming email criteria → label names to apply

def build_filters(label_ids):
    """Return list of filter specs. label_ids = {label_name: label_id}."""

    def ids(*names):
        return [label_ids[n] for n in names if n in label_ids]

    return [
        # ── Payhip purchase notifications ────────────────────────────────────
        {
            'criteria': {'from': 'noreply@payhip.com'},
            'action':   {'addLabelIds': ids('WILD Business/Payhip', 'WILD Business/Purchases'),
                         'removeLabelIds': ['INBOX']},
            'desc': 'Payhip → Purchases label',
        },
        {
            'criteria': {'from': 'payhip.com', 'subject': 'Tier 1'},
            'action':   {'addLabelIds': ids('WILD Business/Purchases/Tier 1 - £50')},
            'desc': 'Payhip Tier 1 purchase',
        },
        {
            'criteria': {'from': 'payhip.com', 'subject': 'Tier 2'},
            'action':   {'addLabelIds': ids('WILD Business/Purchases/Tier 2 - £100')},
            'desc': 'Payhip Tier 2 purchase',
        },
        {
            'criteria': {'from': 'payhip.com', 'subject': 'Tier 3'},
            'action':   {'addLabelIds': ids('WILD Business/Purchases/Tier 3 - £200')},
            'desc': 'Payhip Tier 3 purchase',
        },
        # ── Whop community alerts ─────────────────────────────────────────────
        {
            'criteria': {'from': 'noreply@whop.com'},
            'action':   {'addLabelIds': ids('WILD Business/Whop'),
                         'removeLabelIds': ['INBOX']},
            'desc': 'Whop notifications',
        },
        {
            'criteria': {'from': 'whop.com', 'subject': 'community'},
            'action':   {'addLabelIds': ids('WILD Business/Purchases/Community')},
            'desc': 'Whop community subscriptions',
        },
        # ── Kit (email list) ──────────────────────────────────────────────────
        {
            'criteria': {'from': 'mail.kit.com'},
            'action':   {'addLabelIds': ids('WILD Business/Kit'),
                         'removeLabelIds': ['INBOX']},
            'desc': 'Kit notifications',
        },
        {
            'criteria': {'from': 'app.kit.com'},
            'action':   {'addLabelIds': ids('WILD Business/Kit'),
                         'removeLabelIds': ['INBOX']},
            'desc': 'Kit app notifications',
        },
        # ── Customer support keywords ────────────────────────────────────────
        {
            'criteria': {'subject': 'refund'},
            'action':   {'addLabelIds': ids('WILD Business/Support', 'WILD Business/Support/Urgent'),
                         'starId': 'STARRED'},
            'desc': 'Refund requests → Urgent support',
        },
        {
            'criteria': {'subject': 'not working'},
            'action':   {'addLabelIds': ids('WILD Business/Support')},
            'desc': 'Technical issues → Support',
        },
        {
            'criteria': {'subject': 'download'},
            'action':   {'addLabelIds': ids('WILD Business/Support')},
            'desc': 'Download issues → Support',
        },
        {
            'criteria': {'subject': 'access'},
            'action':   {'addLabelIds': ids('WILD Business/Support')},
            'desc': 'Access issues → Support',
        },
        {
            'criteria': {'subject': 'upgrade'},
            'action':   {'addLabelIds': ids('WILD Business/Support')},
            'desc': 'Upgrade queries → Support',
        },
        # ── Stream self-identification ───────────────────────────────────────
        {
            'criteria': {'subject': 'biohacker', 'query': 'from:(*@*)'},
            'action':   {'addLabelIds': ids('WILD Business/Biohacker Stream')},
            'desc': 'Biohacker stream enquiries',
        },
        {
            'criteria': {'subject': 'telegram'},
            'action':   {'addLabelIds': ids('WILD Business/Biohacker Stream')},
            'desc': 'Telegram enquiries → Biohacker',
        },
        {
            'criteria': {'subject': 'discord'},
            'action':   {'addLabelIds': ids('WILD Business/Consciousness Stream')},
            'desc': 'Discord enquiries → Consciousness',
        },
    ]


def get_existing_filters(service):
    result = service.users().settings().filters().list(userId='me').execute()
    return result.get('filter', [])


def create_filters(service, label_ids):
    print("\n── Creating filters ──────────────────────────────────")
    existing = get_existing_filters(service)
    existing_froms = {
        f.get('criteria', {}).get('from', '') for f in existing
    }

    for filt in build_filters(label_ids):
        criteria = filt['criteria']
        from_addr = criteria.get('from', '')

        # Simple duplicate check on 'from' address
        if from_addr and from_addr in existing_froms:
            print(f"  exists : {filt['desc']}")
            continue

        body = {
            'criteria': criteria,
            'action': filt['action'],
        }
        try:
            service.users().settings().filters().create(userId='me', body=body).execute()
            print(f"  created: {filt['desc']}")
        except Exception as e:
            print(f"  error  : {filt['desc']} — {e}")


# ── Canned response drafts ────────────────────────────────────────────────────

RESPONSE_TEMPLATES = [
    {
        'subject': 'Re: Course access question',
        'body': """Hi,

Thanks for getting in touch about the WILD Programme.

Your course is available immediately after purchase through your Payhip account. Here's how to access it:

1. Go to https://payhip.com and log in with the email you used to purchase
2. Click "My Purchases" in the top right
3. Your course files will be listed there — click to download

If you purchased a community subscription, your Whop access link was emailed to you at the time of purchase. Check your spam folder if you haven't received it.

If you're still having trouble, reply here with your purchase email and I'll sort it out manually.

Best,
Smith
WILD Programme
seektruth@gmail.com"""
    },
    {
        'subject': 'Re: Download not working',
        'body': """Hi,

Sorry to hear you're having trouble with the download. Let's get this sorted.

A few things to try first:
- Make sure you're logged into Payhip with the same email used at purchase
- Try a different browser (Chrome works most reliably)
- Check your spam folder for the original purchase confirmation

If none of those work, reply with:
- The email address you used to purchase
- Which course/product you bought

I'll send you a direct download link within 24 hours.

Best,
Smith
WILD Programme
seektruth@gmail.com"""
    },
    {
        'subject': 'Re: Refund request',
        'body': """Hi,

Thanks for getting in touch. I'm sorry to hear the course hasn't been what you expected.

Before I process a refund, I'd genuinely like to understand what didn't work for you — both so I can improve the programme and to see if there's anything I can do to help you get results first.

Could you tell me:
- Which tier did you purchase?
- How far did you get through the material?
- What specifically wasn't working in your practice?

If after that conversation you still want a refund, I'll process it with no issue. My goal is for you to get value from this, not to keep your money if it's not the right fit.

Best,
Smith
WILD Programme
seektruth@gmail.com"""
    },
    {
        'subject': 'Re: Upgrading to the next tier',
        'body': """Hi,

Great to hear you're ready to go deeper — that's exactly the progression the programme is designed for.

To upgrade:
1. Go to wildpractice.com/tier[2 or 3]
2. Purchase the next tier at the listed price
3. You'll get immediate access through Payhip

There's no bundle discount currently, but if you've already completed Tier 1 and are purchasing Tier 2, reply here and I'll apply a loyalty discount manually.

Well done on completing the foundation work — it's the most important step.

Best,
Smith
WILD Programme
seektruth@gmail.com"""
    },
    {
        'subject': 'Re: Community Discord / Telegram question',
        'body': """Hi,

Here's how to join the community:

BIOHACKER STREAM (science / data focus):
→ Telegram group — £15/month
→ wildpractice.com/community

CONSCIOUSNESS STREAM (spiritual / contemplative focus):
→ Discord server — £20/month
→ wildpractice.com/community

Both are gated through Whop. Once you sign up, you'll receive an invite link by email within a few minutes.

If you've already subscribed and haven't received your invite, reply with your subscription email and I'll send the link directly.

Best,
Smith
WILD Programme
seektruth@gmail.com"""
    },
    {
        'subject': 'Re: What\'s the difference between the tiers?',
        'body': """Hi,

Here's the quick breakdown:

TIER 1 — Foundation (£50, one-time)
7 lessons covering sleep architecture, WBTB method, dream recall, hypnagogic navigation, and your first 7-night protocol. This is where everyone starts.

TIER 2 — Advanced Practitioner (£100, one-time)
12 lessons for people who've completed Tier 1 and can reach the threshold state. Covers supplement protocols, SSILD/FILD/DEILD techniques, dream stabilisation, failure analysis, and a 30-day advanced programme.

TIER 3 — Master Course (£200, one-time)
18 lessons for reliable WILD practitioners. Goes into extended lucidity (30-90 min), shadow integration, somatic healing, creative maximisation, shared dreaming research, and teaching the practice.

COMMUNITY (£15-20/month)
Optional — Telegram (biohacker stream) or Discord (consciousness stream). Live community, weekly practice calls, daily accountability.

Most people start with Tier 1 and upgrade when they're ready.

Best,
Smith
WILD Programme
seektruth@gmail.com"""
    },
]


def create_draft_templates(service):
    print("\n── Creating response draft templates ─────────────────")

    for tmpl in RESPONSE_TEMPLATES:
        msg = MIMEText(tmpl['body'])
        msg['Subject'] = tmpl['subject']
        msg['From']    = GMAIL_ACCOUNT
        raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
        body = {'message': {'raw': raw}}
        try:
            service.users().drafts().create(userId='me', body=body).execute()
            print(f"  draft  : {tmpl['subject']}")
        except Exception as e:
            print(f"  error  : {tmpl['subject']} — {e}")


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("WILD Business — Gmail Setup")
    print("=" * 50)
    service = get_service()

    label_ids = create_labels(service)
    create_filters(service, label_ids)
    create_draft_templates(service)

    print("\n── Complete ───────────────────────────────────────────")
    print("Labels, filters, and response drafts are set up.")
    print("Find drafts in Gmail under Drafts — copy them into")
    print("Settings > See all settings > Advanced > Canned Responses")
    print("to use them as one-click templates when replying.\n")


if __name__ == '__main__':
    main()

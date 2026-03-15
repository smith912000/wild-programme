#!/usr/bin/env python3
"""
WILD Business — Kit (ConvertKit) API Automation
================================================
Manages your email list: tags subscribers by tier and stream,
pulls subscriber stats, exports lists, and syncs purchase data
from Payhip webhooks into Kit tags.

Usage:
    python kit_automation.py [command]

Commands:
    status          — show subscriber counts by tag
    tag-subscriber  — manually tag a subscriber (email + tag)
    export          — export full subscriber list to CSV
    sync-payhip     — process a Payhip purchase CSV and tag buyers
    setup-tags      — create all required tags in Kit
    sequences       — list all sequences and subscriber counts

Requirements:
    pip install requests python-dotenv

Setup:
    1. Get your Kit API key: app.kit.com > Settings > Developer
    2. Create a .env file in this folder:
           KIT_API_KEY=your_api_key_here
    3. Run: python kit_automation.py setup-tags
"""

import os, sys, csv, json
from datetime import datetime
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

API_KEY  = os.getenv('KIT_API_KEY', '')
BASE_URL = 'https://api.convertkit.com/v3'


# ── Helpers ───────────────────────────────────────────────────────────────────

def api(method, endpoint, **kwargs):
    url = BASE_URL + endpoint
    params = kwargs.pop('params', {})
    params['api_key'] = API_KEY
    resp = requests.request(method, url, params=params, **kwargs)
    if resp.status_code not in (200, 201):
        print(f"  API error {resp.status_code}: {resp.text[:200]}")
        return None
    return resp.json()


def get(endpoint, **kwargs):
    return api('GET', endpoint, **kwargs)

def post(endpoint, **kwargs):
    return api('POST', endpoint, **kwargs)


# ── Tag definitions ───────────────────────────────────────────────────────────

REQUIRED_TAGS = [
    # Purchase tiers
    'Tier 1 - Foundation',
    'Tier 2 - Advanced',
    'Tier 3 - Master',
    # Streams
    'Stream - Biohacker',
    'Stream - Consciousness',
    # Community
    'Community - Telegram',
    'Community - Discord',
    # Lead magnet
    'Lead Magnet - 7 Night Protocol',
    'Lead Magnet - Sleep Architecture Map',
    'Lead Magnet - 5 Signs Ready',
    'Lead Magnet - Hypnagogic Gateway',
    # Funnel stage
    'Stage - Lead',
    'Stage - Buyer',
    'Stage - Community Member',
    # Engagement
    'Engaged - High',
    'Engaged - Low',
    'Churned',
]


# ── Commands ──────────────────────────────────────────────────────────────────

def cmd_setup_tags():
    """Create all required tags in Kit if they don't exist."""
    print("Setting up Kit tags...")
    existing = get('/tags')
    if not existing:
        return
    existing_names = {t['name'] for t in existing.get('tags', [])}

    for tag_name in REQUIRED_TAGS:
        if tag_name in existing_names:
            print(f"  exists : {tag_name}")
        else:
            result = post('/tags', json={'tag': {'name': tag_name}})
            if result:
                print(f"  created: {tag_name}")
            else:
                print(f"  failed : {tag_name}")

    print(f"\nDone. {len(REQUIRED_TAGS)} tags configured.")


def cmd_status():
    """Show subscriber counts by tag."""
    print("WILD Business — Kit Subscriber Status")
    print("=" * 45)

    # Total subscribers
    subs = get('/subscribers', params={'sort_order': 'desc'})
    if subs:
        total = subs.get('total_subscribers', 0)
        print(f"\nTotal subscribers: {total:,}")

    # Tags breakdown
    tags = get('/tags')
    if not tags:
        return

    print("\nBy tag:")
    for tag in sorted(tags.get('tags', []), key=lambda t: t['name']):
        tag_id = tag['id']
        tag_subs = get(f'/tags/{tag_id}/subscriptions',
                       params={'sort_order': 'desc'})
        count = tag_subs.get('total_subscriptions', 0) if tag_subs else 0
        print(f"  {tag['name']:<40} {count:>5}")


def cmd_tag_subscriber(email, tag_name):
    """Tag a single subscriber by email."""
    # Find or create subscriber
    result = post('/subscribers', json={
        'api_key': API_KEY,
        'email': email,
    })

    # Find tag ID
    tags = get('/tags')
    if not tags:
        return
    tag = next((t for t in tags.get('tags', []) if t['name'] == tag_name), None)
    if not tag:
        print(f"Tag not found: {tag_name}")
        print("Run 'setup-tags' first, or check spelling.")
        return

    tag_id = tag['id']

    # Add tag to subscriber
    result = post(f'/tags/{tag_id}/subscribe', json={
        'api_key': API_KEY,
        'email': email,
    })
    if result:
        print(f"  Tagged {email} with '{tag_name}'")
    else:
        print(f"  Failed to tag {email}")


def cmd_export():
    """Export full subscriber list to CSV."""
    print("Exporting subscribers...")
    all_subs = []
    page = 1

    while True:
        result = get('/subscribers', params={
            'page': page,
            'sort_order': 'asc',
        })
        if not result:
            break
        subs = result.get('subscribers', [])
        if not subs:
            break
        all_subs.extend(subs)
        total = result.get('total_subscribers', 0)
        print(f"  Fetched {len(all_subs)}/{total}...")
        if len(all_subs) >= total:
            break
        page += 1

    if not all_subs:
        print("No subscribers found.")
        return

    out_path = os.path.join(
        os.path.dirname(__file__),
        f'subscribers_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    )
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'id', 'email', 'first_name', 'state', 'created_at'
        ])
        writer.writeheader()
        for s in all_subs:
            writer.writerow({
                'id':         s.get('id', ''),
                'email':      s.get('email_address', ''),
                'first_name': s.get('first_name', ''),
                'state':      s.get('state', ''),
                'created_at': s.get('created_at', ''),
            })

    print(f"\nExported {len(all_subs)} subscribers to:\n  {out_path}")


def cmd_sync_payhip(csv_path):
    """
    Read a Payhip purchase export CSV and tag buyers in Kit.

    Payhip CSV headers expected: Email, Product Name, Date
    Products are matched to tags by keyword:
        "Tier 1" / "Foundation" → Tier 1 - Foundation
        "Tier 2" / "Advanced"   → Tier 2 - Advanced
        "Tier 3" / "Master"     → Tier 3 - Master
        "Community"             → Community - Telegram or Discord
    """
    if not os.path.exists(csv_path):
        print(f"File not found: {csv_path}")
        return

    print(f"Syncing Payhip purchases from: {csv_path}")

    # Load tags
    tags_result = get('/tags')
    if not tags_result:
        return
    tag_map = {t['name']: t['id'] for t in tags_result.get('tags', [])}

    def tag_sub(email, tag_name):
        tag_id = tag_map.get(tag_name)
        if not tag_id:
            print(f"  MISSING TAG: {tag_name} — run setup-tags first")
            return
        post(f'/tags/{tag_id}/subscribe', json={'api_key': API_KEY, 'email': email})

    processed = 0
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            email   = row.get('Email', '').strip().lower()
            product = row.get('Product Name', '').strip()

            if not email:
                continue

            # Always mark as buyer
            tag_sub(email, 'Stage - Buyer')

            # Tier tags
            if any(k in product for k in ('Tier 1', 'Foundation', 'tier1')):
                tag_sub(email, 'Tier 1 - Foundation')
                print(f"  Tier 1  : {email}")
            elif any(k in product for k in ('Tier 2', 'Advanced', 'tier2')):
                tag_sub(email, 'Tier 2 - Advanced')
                print(f"  Tier 2  : {email}")
            elif any(k in product for k in ('Tier 3', 'Master', 'tier3')):
                tag_sub(email, 'Tier 3 - Master')
                print(f"  Tier 3  : {email}")

            # Community tags
            if 'Telegram' in product:
                tag_sub(email, 'Community - Telegram')
                tag_sub(email, 'Stream - Biohacker')
            elif 'Discord' in product:
                tag_sub(email, 'Community - Discord')
                tag_sub(email, 'Stream - Consciousness')
            elif 'community' in product.lower():
                tag_sub(email, 'Stage - Community Member')

            processed += 1

    print(f"\nSynced {processed} purchases to Kit.")


def cmd_sequences():
    """List all Kit sequences and subscriber counts."""
    result = get('/sequences')
    if not result:
        return
    print("\nKit Sequences:")
    for seq in result.get('courses', []):
        print(f"  [{seq['id']}] {seq['name']}")


# ── CLI ───────────────────────────────────────────────────────────────────────

USAGE = """
WILD Business — Kit Automation

Commands:
  status                    Show subscriber counts by tag
  setup-tags                Create all required tags in Kit
  export                    Export subscriber list to CSV
  sequences                 List email sequences
  tag <email> <tag>         Tag a single subscriber
  sync-payhip <file.csv>    Sync a Payhip export to Kit tags

Examples:
  python kit_automation.py status
  python kit_automation.py setup-tags
  python kit_automation.py tag smith@email.com "Tier 1 - Foundation"
  python kit_automation.py sync-payhip ~/Downloads/payhip_orders.csv
"""

def main():
    if not API_KEY:
        print("ERROR: KIT_API_KEY not set.")
        print("Create a .env file with: KIT_API_KEY=your_key_here")
        print("Get your key at: app.kit.com > Settings > Developer")
        raise SystemExit(1)

    args = sys.argv[1:]
    if not args:
        print(USAGE)
        return

    cmd = args[0].lower()

    if cmd == 'status':
        cmd_status()
    elif cmd == 'setup-tags':
        cmd_setup_tags()
    elif cmd == 'export':
        cmd_export()
    elif cmd == 'sequences':
        cmd_sequences()
    elif cmd == 'tag' and len(args) >= 3:
        cmd_tag_subscriber(args[1], args[2])
    elif cmd == 'sync-payhip' and len(args) >= 2:
        cmd_sync_payhip(args[1])
    else:
        print(USAGE)


if __name__ == '__main__':
    main()

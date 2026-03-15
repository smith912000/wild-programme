#!/usr/bin/env python3
"""
WILD Programme — Google Drive Setup Script
Creates the full folder hierarchy, uploads lead magnet PDFs,
sets sharing permissions, and prints all delivery URLs.

Prerequisites (same as gmail_automation.py):
    pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client
    Place credentials.json in this folder (07 - Automation/)

Run:
    python drive_setup.py

On first run a browser window opens for OAuth.
Subsequent runs use the saved token.json.
"""

import os, json, sys
from pathlib import Path

# ── OAuth / API setup ──────────────────────────────────────────────────────────
SCOPES = [
    'https://www.googleapis.com/auth/drive',
]

THIS_DIR  = Path(__file__).parent
ROOT_DIR  = THIS_DIR.parent
CREDS_FILE = THIS_DIR / 'credentials.json'
TOKEN_FILE = THIS_DIR / 'token.json'

# Output file — all URLs saved here for easy copy-paste
LINKS_FILE = THIS_DIR / 'drive_links.json'

# ── Folder structure ───────────────────────────────────────────────────────────
FOLDER_TREE = {
    'WILD Programme': {
        '01 — Lead Magnets': {},
        '02 — Tier 1 Foundations': {
            'Biohacker Stream': {},
            'Consciousness Stream': {},
        },
        '03 — Tier 2 Advanced': {
            'Biohacker Stream': {},
            'Consciousness Stream': {},
        },
        '04 — Tier 3 Master': {
            'Biohacker Stream': {},
            'Consciousness Stream': {},
        },
        '05 — Community Assets': {},
        '06 — Automation Exports': {},
    }
}

# ── PDFs to upload into "01 — Lead Magnets" ───────────────────────────────────
LEAD_MAGNET_DIR  = ROOT_DIR / '05 - Lead Magnet'
LEAD_MAGNET_FILES = [
    '7_Night_WILD_Protocol.pdf',
    '7_Night_Lucid_Dream_Initiation.pdf',
    'WILD_Sleep_Architecture_Map.pdf',
    'WILD_Hypnagogic_Gateway.pdf',
    'WILD_5_Signs_Youre_Ready.pdf',
]

# ── Course HTML files (after build_course_html.py has been run) ───────────────
COURSE_DIR   = ROOT_DIR / '06 - Course Content'
COURSE_FILES = {
    '03 — Tier 2 Advanced/Biohacker Stream':    'Tier_2_Biohacker_Advanced.html',
    '03 — Tier 2 Advanced/Consciousness Stream': 'Tier_2_Spiritual_Advanced.html',
    '04 — Tier 3 Master/Biohacker Stream':       'Tier_3_Biohacker_Master.html',
    '04 — Tier 3 Master/Consciousness Stream':   'Tier_3_Spiritual_Master.html',
}


# ──────────────────────────────────────────────────────────────────────────────
def get_service():
    """Authenticate and return a Drive API service object."""
    try:
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
        from google.auth.transport.requests import Request
        from googleapiclient.discovery import build
    except ImportError:
        print('\n  ✗  Missing dependencies. Run:\n')
        print('     pip install google-auth google-auth-oauthlib google-auth-httplib2 google-api-python-client\n')
        sys.exit(1)

    if not CREDS_FILE.exists():
        print(f'\n  ✗  credentials.json not found in {THIS_DIR}')
        print('     See SETUP.md → Script 1, Step 2 for how to create it.\n')
        sys.exit(1)

    creds = None
    if TOKEN_FILE.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_FILE), SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(CREDS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())

    return build('drive', 'v3', credentials=creds)


def get_or_create_folder(service, name, parent_id=None):
    """Return existing folder ID or create it."""
    query = f"name='{name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    results = service.files().list(q=query, spaces='drive', fields='files(id,name)').execute()
    files = results.get('files', [])
    if files:
        return files[0]['id']
    meta = {'name': name, 'mimeType': 'application/vnd.google-apps.folder'}
    if parent_id:
        meta['parents'] = [parent_id]
    folder = service.files().create(body=meta, fields='id').execute()
    return folder['id']


def build_folder_tree(service, tree, parent_id=None, path=''):
    """Recursively create folders, return {path: id} mapping."""
    ids = {}
    for name, children in tree.items():
        folder_path = f'{path}/{name}' if path else name
        fid = get_or_create_folder(service, name, parent_id)
        ids[folder_path] = fid
        print(f'  📁  {folder_path}  ({fid})')
        if children:
            child_ids = build_folder_tree(service, children, fid, folder_path)
            ids.update(child_ids)
    return ids


def set_anyone_reader(service, file_id):
    """Set file/folder to 'anyone with the link can view'."""
    service.permissions().create(
        fileId=file_id,
        body={'type': 'anyone', 'role': 'reader'},
    ).execute()


def upload_file(service, local_path, parent_id, mime_type='application/pdf'):
    """Upload a file, return its Drive file ID."""
    from googleapiclient.http import MediaFileUpload
    name = os.path.basename(local_path)

    # Check if already exists
    query = f"name='{name}' and '{parent_id}' in parents and trashed=false"
    results = service.files().list(q=query, fields='files(id,name)').execute()
    if results.get('files'):
        fid = results['files'][0]['id']
        print(f'  ↩  Already exists: {name}  (skipped)')
        return fid

    meta  = {'name': name, 'parents': [parent_id]}
    media = MediaFileUpload(local_path, mimetype=mime_type, resumable=True)
    f = service.files().create(body=meta, media_body=media, fields='id').execute()
    print(f'  ⬆  Uploaded: {name}')
    return f['id']


def get_webview_link(service, file_id):
    f = service.files().get(fileId=file_id, fields='webViewLink,webContentLink').execute()
    return f.get('webViewLink', ''), f.get('webContentLink', '')


# ──────────────────────────────────────────────────────────────────────────────
def main():
    print('\n━━ WILD Programme — Google Drive Setup ━━\n')
    service = get_service()
    links   = {}

    # 1. Build folder tree
    print('Creating folder structure...\n')
    folder_ids = build_folder_tree(service, FOLDER_TREE)
    links['folders'] = {k: f'https://drive.google.com/drive/folders/{v}' for k, v in folder_ids.items()}

    # Root WILD Programme folder
    root_id = folder_ids.get('WILD Programme')

    # 2. Upload lead magnet PDFs
    print('\nUploading lead magnet PDFs...\n')
    lm_folder_id = folder_ids.get('WILD Programme/01 — Lead Magnets')
    links['lead_magnets'] = {}

    for fname in LEAD_MAGNET_FILES:
        fpath = LEAD_MAGNET_DIR / fname
        if not fpath.exists():
            print(f'  ✗  Not found locally: {fname}  (skipping)')
            continue
        fid = upload_file(service, str(fpath), lm_folder_id)
        set_anyone_reader(service, fid)
        view, download = get_webview_link(service, fid)
        links['lead_magnets'][fname] = {
            'view':     view,
            'download': download,
            'drive_id': fid,
        }
        print(f'     View:     {view}')
        print(f'     Download: {download}\n')

    # 3. Upload course HTML files (if they exist)
    print('Uploading course HTML files...\n')
    links['course_files'] = {}

    for folder_subpath, html_fname in COURSE_FILES.items():
        html_path = COURSE_DIR / html_fname
        if not html_path.exists():
            print(f'  ✗  Not found: {html_fname}  — run build_course_html.py first')
            continue
        folder_key = f'WILD Programme/{folder_subpath}'
        fol_id = folder_ids.get(folder_key)
        if not fol_id:
            print(f'  ✗  Folder not found in map: {folder_key}')
            continue
        fid = upload_file(service, str(html_path), fol_id, 'text/html')
        set_anyone_reader(service, fid)
        view, _ = get_webview_link(service, fid)
        links['course_files'][html_fname] = {'view': view, 'drive_id': fid}
        print(f'     View: {view}\n')

    # 4. Save links.json
    with open(LINKS_FILE, 'w') as f:
        json.dump(links, f, indent=2)

    print(f'\n✓  All done. URLs saved to:\n   {LINKS_FILE}\n')
    print('━━ NEXT STEPS ━━')
    print('1. Copy the lead magnet "download" links into thankyou.html (replace Google Drive placeholders)')
    print('2. Copy the course HTML "view" links into purchase-confirmed.html (replace YOUR_TIER*_GOOGLE_DRIVE_LINK)')
    print('3. Those links are permanent and "anyone with the link" can view — no sign-in required')
    print('4. Test each link in an incognito tab before sending to customers\n')


if __name__ == '__main__':
    main()

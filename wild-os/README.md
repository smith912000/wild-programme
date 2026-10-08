# WILD OS

The practice companion for WILD members: breathwork, meditation, dream journal, seven night tracker, sleep calculator and the protocol library. React, Vite and a PWA. Journal and logs stay on the device (IndexedDB and localStorage).

## Access

Whop is the account system. The app is open only to members with an active Whop membership.

1. `Sign in with Whop` sends the visitor to Whop's OAuth page (PKCE, `state` checked on return).
2. Whop returns to `/auth/callback`; the app posts the code to the n8n webhook `POST /wild/auth/callback`.
3. n8n exchanges the code, checks the membership and answers `{ token, name }`. The token is `base64url(payload).signature`, payload `{ uid, email, valid_until, iat }`.
4. On every launch the app posts the token to `POST /wild/auth/verify` and stores the fresh token it gets back. A 401 or 403 signs the visitor out.
5. Offline, a member token under 7 days old still opens the app. Older than that, the app asks to reconnect.

Screens: guest (sign in or join), lapsed (renew), three screen first run (once per device), then the app.

Spec: `wild/review/whop-accounts-build-spec.md` in the Wizardry project files.

## Configuration

Copy `.env.example` to `.env`. Nothing secret belongs in this repo; the Whop client secret and the signing secret live in n8n only.

## Develop

```
npm install
npm run dev
```

`VITE_WHOP_AUTH_MOCK=member` (or `expired`) in `.env.local` fakes the n8n endpoints in dev so the gates can be tried before the workflow is live. It is ignored in production builds.

`npm run build` writes `dist/`; the built output is deployed to the `smith912000/wild-os` repo (GitHub Pages, base path `/wild-os/`).

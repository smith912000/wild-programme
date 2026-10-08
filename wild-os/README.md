# WILD OS

The practice companion for WILD members: breathwork, meditation, dream journal, seven night tracker, sleep calculator and the protocol library. React, Vite and a PWA. Journal and logs stay on the device (IndexedDB and localStorage).

## Access

Whop is the account system. The app is open only to members with an active Whop membership.

1. `Sign in with Whop` sends the visitor to Whop's OAuth page (PKCE, `state` checked on return; scopes profile, email; the openid scope is left out because Whop then demands a nonce that its own login step drops).
2. Whop returns to `/auth/callback`; the app posts `{ code, redirect_uri, code_verifier }` to the n8n webhook `POST /wild/auth/callback`.
3. n8n exchanges the code, checks the membership and answers `{ ok, token, member, name, expiresAt }`. The token is an HS256 JWT valid 7 days; n8n re-checks Whop once it is over 24 hours old. n8n is the source of truth.
4. On every launch the app posts `{ token }` to `POST /wild/auth/verify` (same response shape) and stores the answer. A 401 signs the visitor out.
5. Offline, a cached member answer holds until its `expiresAt`. After that the app asks to reconnect.

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

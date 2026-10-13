import { N8N_AUTH_BASE } from '@config/whop'

/* Client for the n8n workflow "WILD - Member intake".
   POST /wild/intake { token }           -> { ok, answers, reading, intakeAt } (what is saved, or nulls)
   POST /wild/intake { token, answers }  -> { ok, reading, intakeAt }
   Answers are stored against the member's Whop user id (the token's sub). 401 = bad token,
   403 = not a member. */

export const INTAKE_ENDPOINT = `${N8N_AUTH_BASE}/wild/intake`

export async function intake(token, answers) {
  const res = await fetch(INTAKE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers ? { token, answers } : { token }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data?.ok) throw new Error(data?.error || `status ${res.status}`)
  return data
}

# Boulder Pain Relief

A clinical web application for a licensed massage therapy practice in Boulder, CO. Built for practitioners who specialize in evidence-based pain relief for desk workers, athletes, and the CrossFit community.

Clients use the app to document where they hurt, describe their activity context, and receive an AI-generated clinical assessment before their session. Practitioners see a structured dashboard with full pain histories, AI pre-session summaries, and appointment data from Acuity Scheduling.

---

## Features

### Client Experience
- **Interactive body map** — SVG front/back figure; clients tap to mark pain locations with variable sizing (pinpoint, regional, diffuse) and intensity (0–10 color scale)
- **Activity context** — per-region free-text describing what triggered or aggravates pain
- **AI clinical assessment** — structured response from Claude identifying movement category, likely muscles affected, compensation chain risk (low/medium/high), and correlation notes
- **Pain history dashboard** — view all past reports, review AI assessments, and submit reports to the practitioner
- **Secure accounts** — email/password auth with confirmation, 15-minute inactivity timeout

### Practitioner Dashboard
- **Today's sessions** — appointments pulled from Acuity Scheduling, enriched with client pain history
- **AI pre-session notes** — Claude-generated pattern summary per client: dominant movement category, intensity trend (escalating/improving/stable), compensation risk level, and a plain-language session prep note
- **Client list** — all clients with submitted reports, body map thumbnails, pending review badges
- **Full pain timeline** — per-client view of every submitted report with clinical assessment cards
- **Mark as reviewed** — workflow to track which reports have been acted on

### HIPAA Compliance
- Row Level Security on all Supabase tables — clients see only their own data; practitioners see all
- PHI sanitization before any external API call — name, email, and location identifiers stripped before reaching Claude
- Audit log table (`audit_logs`) — records who accessed what and when, with no PHI stored in the log
- Security headers: HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, Referrer-Policy
- HTTPS enforced in production; all health data responses served with `Cache-Control: no-store`
- Acuity webhook validated with HMAC-SHA256 signature before any data is processed

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16.2.1 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database & Auth | Supabase (Postgres + Row Level Security) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Booking | Acuity Scheduling (iframe embed + webhook) |
| Deployment | Vercel |

---

## Development

```bash
npm install
npm run dev      # localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

### Environment variables

Create `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
ACUITY_WEBHOOK_SECRET=
ACUITY_PRACTITIONER_USER_ID=
```

---

## Setup Required Before Launch

### Supabase
- [ ] Run SQL migrations: `audit_logs` table, `appointments` table, `activity_notes` and `ai_interpretation` columns on `pain_reports`
- [ ] Create `is_practitioner()` SQL function and apply RLS policies
- [ ] Set practitioner account role to `'practitioner'` in `client_profiles`
- [ ] Configure auth redirect URL: `https://yourdomain.com/auth/callback`

### Business Associate Agreements (BAAs)
- [ ] Supabase HIPAA BAA — required before storing PHI in production
- [ ] Anthropic BAA — required before sending health data to the Claude API
- [ ] Acuity Scheduling BAA — required if appointment data includes health information

### Acuity Scheduling
- [ ] Add webhook in Acuity → Integrations → Webhooks
  - URL: `https://yourdomain.com/api/webhooks/acuity`
  - Events: `appointment.scheduled`, `appointment.rescheduled`
- [ ] Copy the generated secret → set as `ACUITY_WEBHOOK_SECRET`

See [`HIPAA_CHECKLIST.md`](./HIPAA_CHECKLIST.md) for the full compliance checklist and [`PRIVACY_NOTICE.md`](./PRIVACY_NOTICE.md) for the data handling policy.

---

## License

Private. All rights reserved. Not open for public contribution or redistribution.

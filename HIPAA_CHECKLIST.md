# HIPAA Compliance Checklist — Boulder Pain Relief

This document tracks technical and administrative safeguards implemented or required.
**Last updated:** March 23, 2026

---

## Technical Safeguards (Implemented in Code)

### Authentication & Access Control
- [x] Supabase Auth — email/password with email confirmation required
- [x] Server-side role check in `app/practitioner/layout.tsx` — redirects non-practitioners
- [x] Row Level Security (RLS) enabled on all tables (`pain_reports`, `submitted_reports`, `client_profiles`, `audit_logs`, `appointments`)
- [x] `is_practitioner()` SQL helper function used in RLS policies — role stored in DB, not client
- [x] Route protection in `proxy.ts` — `/dashboard` and `/practitioner` redirect to login if unauthenticated

### Session Management
- [x] 15-minute inactivity timeout (`components/session/SessionGuard.tsx`)
- [x] 12-minute warning modal with countdown timer
- [x] Session expiry redirects to `/auth/login?reason=session_expired`
- [x] Session refresh on every request via `supabase.auth.getUser()` in `proxy.ts`

### Data Transmission Security
- [x] HTTPS enforced in production — HTTP requests redirected to HTTPS in `proxy.ts`
- [x] HSTS header: `max-age=63072000; includeSubDomains; preload`
- [x] `X-Frame-Options: DENY` (prevents clickjacking)
- [x] `X-Content-Type-Options: nosniff`
- [x] `Referrer-Policy: strict-origin-when-cross-origin`
- [x] `Permissions-Policy` — disables camera, microphone, geolocation

### Minimum Necessary / De-identification
- [x] `lib/hipaa/sanitize.ts` — `sanitizeSpotsForAI()` strips `regionId`, `cx`, `cy`, `view`, client info before Claude API calls
- [x] `assertNoPHI()` — regex checks activity text for email, phone, SSN patterns before sending to external APIs
- [x] Acuity webhook: email used only to look up `client_id`; all downstream operations use UUID only
- [x] No client name or email ever written to `audit_logs`
- [x] No PHI logged to `console.log` (grep codebase periodically to verify)

### Audit Logging
- [x] `lib/hipaa/auditLog.ts` — `logAuditEvent(userId, action, ip)`
- [x] `audit_logs` table: `user_id`, `action_type`, `ip_address`, `created_at` — no PHI columns
- [x] Events logged: login, logout, ai_assessment_requested, report_saved, submit_report, view_dashboard, practitioner_viewed_client, practitioner_viewed_reports, practitioner_marked_reviewed, appointment_webhook_received
- [x] Audit failures silently swallowed — never block user-facing requests
- [x] RLS on `audit_logs`: authenticated users insert own events; practitioner reads all

### Webhook Security
- [x] Acuity webhook HMAC-SHA256 signature validation (`app/api/webhooks/acuity/route.ts`)
- [x] Constant-time comparison to prevent timing attacks
- [x] Raw body read before parsing — prevents signature bypass

### AI Integration
- [x] Only anonymized pain pattern data sent to Claude — no name, email, or identifiers
- [x] System prompt instructs Claude not to include PHI in responses
- [x] Non-streaming JSON response — structured data parsed and validated before storage
- [x] `Cache-Control: no-store` on all health-data API responses

### Consent
- [x] Consent line on signup form: "Your information is encrypted and only shared with your care provider"
- [x] Consent line on pain tool form (lock icon)
- [x] Privacy Notice (`PRIVACY_NOTICE.md`) explains data collection, retention, and rights

---

## Administrative Safeguards (Manual Actions Required)

### Business Associate Agreements (BAAs)
- [ ] **Supabase BAA** — required before storing any PHI. Sign at: https://supabase.com/docs/guides/platform/hipaa
- [ ] **Anthropic BAA** — required before sending health data to Claude API. Contact: privacy@anthropic.com
- [ ] **Acuity Scheduling BAA** — required if appointment data includes health information. Contact Acuity support.

### Environment Variables (Set in Production)
- [ ] `SUPABASE_URL` and `SUPABASE_ANON_KEY` — set in hosting environment (not `.env.local`)
- [ ] `ANTHROPIC_API_KEY` — set in hosting environment
- [ ] `ACUITY_WEBHOOK_SECRET` — generate a strong random secret, configure matching value in Acuity dashboard
- [ ] `ACUITY_PRACTITIONER_USER_ID` — your Supabase user UUID (find in Supabase → Auth → Users)

### Supabase Configuration
- [ ] Run SQL for `audit_logs` table (see `DATABASE_SETUP.md` or prior session notes)
- [ ] Run SQL to add `activity_notes` and `ai_interpretation` columns to `pain_reports`
- [ ] Run SQL to create `appointments` table
- [ ] Set `is_practitioner()` SQL function
- [ ] Set your account's `role = 'practitioner'` in `client_profiles`
- [ ] Configure redirect URLs in Supabase Auth settings: `https://yourdomain.com/auth/callback`
- [ ] Enable email confirmations in Supabase Auth settings

### Acuity Scheduling
- [ ] Add webhook URL in Acuity: Integrations → Webhooks
  - URL: `https://yourdomain.com/api/webhooks/acuity`
  - Events: `appointment.scheduled`, `appointment.rescheduled`
- [ ] Copy the webhook secret Acuity generates → set as `ACUITY_WEBHOOK_SECRET`

### Operational Policies
- [ ] Workforce training on PHI handling (annual)
- [ ] Written incident response plan for breaches
- [ ] Risk analysis documentation (required by HIPAA Security Rule §164.308(a)(1))
- [ ] Written retention and destruction policy for records

### HIPAA Notice of Privacy Practices
- [ ] Display `PRIVACY_NOTICE.md` content on a public `/privacy` page in the app
- [ ] Provide paper copy to clients at first appointment (HIPAA NPP requirement)
- [ ] Include signature line for clients to acknowledge receipt

---

## Periodic Review

- [ ] Monthly: grep codebase for `console.log` containing PHI patterns
- [ ] Monthly: review `audit_logs` for unexpected access patterns
- [ ] Quarterly: rotate `ACUITY_WEBHOOK_SECRET`
- [ ] Annually: repeat risk analysis and workforce training
- [ ] On any breach: notify affected individuals within 60 days (HIPAA Breach Notification Rule)

---

> **Disclaimer:** This checklist reflects technical implementation decisions made during development. It is not legal advice. Consult a HIPAA compliance attorney or certified consultant before treating this app as fully HIPAA-compliant.

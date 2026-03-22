# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

**Boulder Pain Relief Massage** — a client-facing web app for a clinical massage therapy practice in Boulder, CO. The owner is a licensed massage therapist specializing in evidence-based pain relief for desk workers, athletes, and the CrossFit community.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint (eslint-config-next/core-web-vitals + typescript)
```

No test runner is configured.

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16.2.1, App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Auth | Clerk |
| Payments | Lemon Squeezy (digital products) |
| AI | Anthropic Claude API (pain tool) |
| Video | Vimeo (course hosting) |
| Booking | Acuity Scheduling (iframe embed) |
| Session payments | Venmo Business + Zelle (display-only on booking page) |

**Important:** Next.js 16, React 19, and Tailwind CSS v4 all have breaking changes from earlier versions. Always read `node_modules/next/dist/docs/` before writing Next.js code.

Path alias: `@/` → repo root.

## Route Map

```
app/
  page.tsx                          # Homepage
  about/page.tsx                    # About the therapist
  resources/
    page.tsx                        # Self-care library (filterable by body part + condition)
    [slug]/page.tsx                 # Individual resource article
  pain-tool/page.tsx                # AI pain troubleshooting chat (Claude API)
  courses/
    page.tsx                        # Course hub (free previews + gated paid content)
    [slug]/page.tsx                 # Course overview + lesson list
    [slug]/[lesson]/page.tsx        # Individual lesson (gated via Clerk + Lemon Squeezy)
  shop/page.tsx                     # Affiliate product shop (links only, no checkout)
  blog/
    page.tsx                        # Blog index
    [slug]/page.tsx                 # Blog post
  anatomy/
    page.tsx                        # Anatomy education index
    [slug]/page.tsx                 # Anatomy article
  booking/page.tsx                  # Acuity embed + Venmo/Zelle payment info
  dashboard/
    page.tsx                        # User dashboard (Clerk-protected)
    courses/page.tsx                # Purchased course access
  api/
    pain-tool/route.ts              # POST — streams Claude API response
    webhooks/lemon-squeezy/route.ts # POST — handles purchase events, grants course access
```

## Architecture Notes

**Auth & gating:** Clerk handles auth. Course access is granted by the Lemon Squeezy webhook (`api/webhooks/lemon-squeezy/route.ts`) which records purchases and is checked in `courses/[slug]/[lesson]/page.tsx`.

**Pain tool:** `pain-tool/page.tsx` renders `components/pain-tool/PainToolForm.tsx` (client component). The form POSTs to `api/pain-tool/route.ts`, which calls the Anthropic API. Responses should recommend self-care, explain muscle/fascia mechanics in plain language, and suggest booking with an Acuity link when appropriate.

**Courses:** Free-preview lessons (`isFreePreview: true` on the `Lesson` type) are publicly accessible. Gated lessons check Clerk auth + a Lemon Squeezy purchase record. Vimeo provides the embed via `lib/vimeo.ts` and `components/courses/VideoPlayer.tsx`.

**Resources:** Filterable by `BodyPart` and `Condition` (see `types/index.ts`). `components/resources/FilterBar.tsx` is a client component; the page itself can be a server component that passes data down.

**Shop:** Affiliate links only — no cart, no checkout. Product data lives in `types/index.ts` (`Product` type with `affiliateUrl`).

## Key Files

- `types/index.ts` — all shared types (Resource, Course, Lesson, Product, BlogPost, PainToolMessage)
- `lib/anthropic.ts` — Anthropic client + pain tool message handler
- `lib/lemon-squeezy.ts` — purchase verification + webhook signature validation
- `lib/vimeo.ts` — embed URL generation + access control
- `components/layout/Header.tsx`, `Footer.tsx` — site-wide layout

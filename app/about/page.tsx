import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Lao Kemper",
  description:
    "Lao Kemper is a licensed and certified massage therapist at Boulder Pain Relief, located at CrossFit Sanitas in Boulder, CO. Specializing in evidence-based pain relief for desk workers, athletes, and the CrossFit community.",
};

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief Massage
          </p>
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Lao Kemper
          </h1>
          <p className="mb-6 text-lg text-teal-200/80">
            Licensed &amp; Certified Massage Therapist &middot; Boulder, CO
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "Evidence-Based Practice",
              "CrossFit Sanitas",
              "Collaborative Care",
            ].map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-teal-500/30 bg-teal-800/40 px-3.5 py-1 text-xs font-medium text-teal-200"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Intro: photo + bio ─────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[320px_1fr] lg:items-start lg:gap-16">
          {/* Photo placeholder */}
          <div className="mx-auto w-full max-w-xs lg:mx-0">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 aspect-[4/5]">
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                <PersonSilhouette />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-teal-200/80 to-transparent" />
              {/* Replace this div with <Image> once a headshot is available */}
            </div>
            <p className="mt-2 text-center text-xs text-slate-400">
              Photo coming soon
            </p>
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-600">
                About
              </p>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Clinical work that goes deeper than the surface.
              </h2>
            </div>

            <p className="text-base leading-7 text-slate-600">
              I&apos;m Lao Kemper, a licensed and certified massage therapist
              based in Boulder, CO. My practice is built on a simple premise:
              most chronic or acute pain and movement limitations have a soft-tissue
              pattern that can be identified and addressed — and massage therapy, done
              well, is one of the most effective tools we have for doing that.
            </p>
            <p className="text-base leading-7 text-slate-600">
              I work out of{" "}
              <strong className="font-medium text-slate-800">
                CrossFit Sanitas
              </strong>{" "}
              in Boulder, which tells you something about my client base: people
              who move hard, work long hours, and want real results — not just
              an hour of relaxation. Whether you&apos;re a desk worker with
              persistent neck and shoulder tension, a CrossFit athlete dealing
              with training-related soreness, or someone managing a
              longer-standing injury, the approach is the same: understand your
              body&apos;s specific patterns, address the tissues that are
              actually driving the problem, and give you the tools to maintain
              progress between sessions.
            </p>
            <p className="text-base leading-7 text-slate-600">
              A significant part of how I work is through collaboration with
              other practitioners — physical therapists, chiropractors,
              physicians, and dentists — who refer clients to me and with whom
              I coordinate care when a case calls for it. That relationship with
              the broader healthcare community has shaped how I think about the
              body: as an integrated system where movement, load, and soft
              tissue health are inseparable from the rest of someone&apos;s
              health picture.
            </p>
            <p className="text-base leading-7 text-slate-600">
              That collaborative model means clients who come to me through a
              referral get continuity — I communicate with their referring
              provider, and the work I do fits into their larger care plan
              rather than existing in isolation. And clients who find me on
              their own get the same benefit: when something is outside the
              scope of massage, I&apos;ll tell you, and I can point you toward
              the right person.
            </p>
          </div>
        </div>
      </section>

      {/* ── Approach ──────────────────────────────────────────────── */}
      <section className="bg-teal-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-600">
              Philosophy
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Evidence-based. Specific. Results-focused.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                Icon: ScienceIcon,
                title: "Grounded in research",
                body: "Every technique I use has a rationale rooted in anatomy, biomechanics, and current manual therapy research. I don't do things because they've always been done — I do them because they work.",
              },
              {
                Icon: TargetIcon,
                title: "Specific to your body",
                body: "No two sessions are the same. Before I put my hands on you, I want to understand your history, your patterns, and your goals for that day. Generic massage misses the point.",
              },
              {
                Icon: ContinuityIcon,
                title: "Built for continuity",
                body: "A session is a starting point, not the whole solution. I give every client specific homework — stretches, mobilizations, or habit changes — so the work we do compounds over time.",
              },
            ].map(({ Icon, title, body }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who I work with ───────────────────────────────────────── */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-600">
              Who I Work With
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Three groups. One approach.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                Icon: DeskIcon,
                label: "Desk Workers",
                headline: "Your body isn't designed for 8 hours at a screen.",
                body: "Prolonged sitting compresses the lumbar spine, shortens the hip flexors, rounds the thoracic spine, and loads the cervical extensors. I work specifically on the patterns that accumulate from sedentary work — and give you the tools to slow their return.",
              },
              {
                Icon: AthleticsIcon,
                label: "Athletes",
                headline: "More training only helps if you can recover from it.",
                body: "I work with endurance athletes, strength athletes, and recreational movers dealing with training-related soreness, nagging tightness, and injury prevention. The goal: keep you in the game and performing at the level you want.",
              },
              {
                Icon: CrossFitIcon,
                label: "CrossFit Community",
                headline: "CrossFit demands a lot. Your body needs to match it.",
                body: "Based at CrossFit Sanitas, I understand the demands of the sport — the Olympic lifts, the gymnastics, the metcons. I work on the specific patterns that hold CrossFit athletes back: hip mobility, thoracic extension, shoulder overhead mechanics.",
              },
            ].map(({ Icon, label, headline, body }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                    {label}
                  </span>
                </div>
                <p className="text-sm font-semibold leading-6 text-slate-900">
                  {headline}
                </p>
                <p className="text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Background strip ──────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Background &amp; Affiliations
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Licensed & Certified Massage Therapist",
                detail: "Colorado State Licensed",
              },
              {
                title: "Collaborative Care Network",
                detail:
                  "Works alongside physical therapists, chiropractors, physicians, and dentists",
              },
              {
                title: "CrossFit Sanitas",
                detail: "Based in Boulder, CO — serving the CrossFit community",
              },
            ].map(({ title, detail }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4"
              >
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-teal-900 to-slate-900 px-6 py-20 text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Ready to work together?
          </h2>
          <p className="text-base text-teal-100/70">
            Book directly online or try the free AI Pain Tool to get a sense of
            what a session might address for you.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-teal-900 shadow-md transition hover:bg-teal-50"
            >
              Book a Session
              <ArrowRightIcon className="h-4 w-4" />
            </a>
            <Link
              href="/pain-tool"
              className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-800/40 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-teal-700/60"
            >
              Try the AI Pain Tool
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── SVG Components ────────────────────────────────────────────────────────────

function PersonSilhouette() {
  return (
    <svg
      aria-hidden="true"
      className="h-52 w-52 text-teal-400/40"
      viewBox="0 0 120 160"
      fill="currentColor"
    >
      <circle cx="60" cy="35" r="28" />
      <path d="M15 160 C15 105 35 85 60 82 C85 85 105 105 105 160 Z" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function ScienceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10.5 3.798v5.02a3 3 0 0 1-.879 2.121l-2.377 2.377a9.845 9.845 0 0 1 5.091 1.013 8.315 8.315 0 0 0 5.713.636l.285-.071-3.954-3.955a3 3 0 0 1-.879-2.121v-5.02a23.614 23.614 0 0 0-3 0Zm4.5.138a.75.75 0 0 0 .093-1.495A24.837 24.837 0 0 0 12 2.25a25.048 25.048 0 0 0-3.093.191A.75.75 0 0 0 9 3.936v4.882a1.5 1.5 0 0 1-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0 1 15 8.818V3.936Z" clipRule="evenodd" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM6.375 12a5.625 5.625 0 1 1 11.25 0 5.625 5.625 0 0 1-11.25 0Z" clipRule="evenodd" />
    </svg>
  );
}

function ContinuityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clipRule="evenodd" />
    </svg>
  );
}

function DeskIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v9.75a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

function AthleticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.636 4.575a.75.75 0 0 1 0 1.06 9 9 0 0 0 0 12.729.75.75 0 0 1-1.06 1.06c-4.101-4.1-4.101-10.748 0-14.849a.75.75 0 0 1 1.06 0Zm12.728 0a.75.75 0 0 1 1.06 0c4.101 4.1 4.101 10.749 0 14.85a.75.75 0 1 1-1.06-1.061 9 9 0 0 0 0-12.728.75.75 0 0 1 0-1.06ZM7.757 6.697a.75.75 0 0 1 0 1.06 6 6 0 0 0 0 8.486.75.75 0 0 1-1.06 1.06 7.5 7.5 0 0 1 0-10.606.75.75 0 0 1 1.06 0Zm8.486 0a.75.75 0 0 1 1.06 0 7.5 7.5 0 0 1 0 10.606.75.75 0 0 1-1.06-1.06 6 6 0 0 0 0-8.486.75.75 0 0 1 0-1.06ZM12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" clipRule="evenodd" />
    </svg>
  );
}

function CrossFitIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}

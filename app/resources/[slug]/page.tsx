import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  resources,
  BODY_PART_LABELS,
  CONDITION_LABELS,
} from "@/lib/resources";

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Static params ──────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.description,
  };
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function ResourcePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = resources.find((r) => r.slug === slug);
  if (!resource) notFound();

  const related = resources
    .filter(
      (r) =>
        r.slug !== resource.slug &&
        (r.bodyPart === resource.bodyPart || r.condition === resource.condition)
    )
    .slice(0, 4);

  const bodyLabel = BODY_PART_LABELS[resource.bodyPart];
  const condLabel = CONDITION_LABELS[resource.condition];

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-teal-300/70">
            <Link href="/" className="hover:text-teal-200">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/resources" className="hover:text-teal-200">
              Resources
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-teal-100/60 line-clamp-1">
              {resource.title}
            </span>
          </nav>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-teal-400/40 bg-teal-800/50 px-3 py-1 text-xs font-medium text-teal-200">
              {bodyLabel}
            </span>
            <span className="rounded-full border border-teal-400/40 bg-teal-800/50 px-3 py-1 text-xs font-medium text-teal-200">
              {condLabel}
            </span>
          </div>

          <h1 className="text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            {resource.title}
          </h1>
        </div>
      </div>

      {/* ── Content + sidebar ─────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          {/* ── Main article ──────────────────────────────────────── */}
          <article>
            {/* Introduction */}
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-teal-600">
                Overview
              </h2>
              <p className="text-base leading-7 text-slate-700">
                {resource.description}
              </p>
            </div>

            {/* Step-by-step */}
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="mb-5 text-lg font-semibold text-slate-900">
                Step-by-Step Instructions
              </h2>
              <ol className="flex flex-col gap-6">
                {PLACEHOLDER_STEPS.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <p className="mb-1 font-semibold text-slate-900">
                        {step.title}
                      </p>
                      <p className="text-sm leading-6 text-slate-600">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* When to back off */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-7">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-800">
                <WarningIcon className="h-4 w-4" />
                When to Stop and Seek Care
              </h2>
              <ul className="flex flex-col gap-2 text-sm leading-6 text-amber-800">
                <li>
                  Pain that worsens significantly during or after the routine
                </li>
                <li>
                  Numbness, tingling, or radiating symptoms into an arm or leg
                </li>
                <li>
                  Symptoms that have persisted beyond 6 weeks without improvement
                </li>
                <li>Any recent trauma, fracture, or acute injury</li>
              </ul>
              <p className="mt-4 text-xs text-amber-700">
                This guide is educational, not a substitute for diagnosis or
                treatment. When in doubt, book a session so we can assess
                directly.
              </p>
            </div>
          </article>

          {/* ── Sidebar ───────────────────────────────────────────── */}
          <aside className="flex flex-col gap-6">
            {/* Booking CTA */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6">
              <p className="mb-1 font-semibold text-teal-900">
                Need hands-on help?
              </p>
              <p className="mb-5 text-sm leading-6 text-teal-800">
                Self-care moves the needle, but some patterns need direct work
                to fully resolve. Book a session and we&apos;ll address{" "}
                {bodyLabel.toLowerCase()} issues directly.
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Book a Session
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Related resources */}
            {related.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
                  Related Resources
                </h3>
                <ul className="flex flex-col gap-4">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={`/resources/${r.slug}`}
                        className="group flex flex-col gap-1"
                      >
                        <span className="text-sm font-medium leading-snug text-slate-800 group-hover:text-teal-700">
                          {r.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          {BODY_PART_LABELS[r.bodyPart]} ·{" "}
                          {CONDITION_LABELS[r.condition]}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/resources"
                  className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                >
                  View all resources
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Pain tool nudge */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Not sure what&apos;s causing it?
              </p>
              <p className="mb-4 text-xs leading-5 text-slate-600">
                Describe your symptoms to the AI Pain Tool and get a
                plain-language explanation of what may be happening.
              </p>
              <Link
                href="/pain-tool"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Try the Pain Tool
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Placeholder step content ───────────────────────────────────────────────────
// Replace with real content per resource when writing the full articles.

const PLACEHOLDER_STEPS = [
  {
    title: "Assess your starting range",
    body: "Before beginning, note your current range of motion and any discomfort. Move slowly through the target range and identify where restriction or tension begins. This becomes your baseline to measure progress against.",
  },
  {
    title: "Apply targeted pressure or mobilization",
    body: "Using the technique described for this area — lacrosse ball, foam roller, or manual stretch — position yourself appropriately. Apply steady pressure at a 6–7 out of 10 intensity: enough to feel it, not enough to brace against it. Hold for 60–90 seconds.",
  },
  {
    title: "Move through the newly available range",
    body: "Immediately after releasing tension, move the area through its full range slowly and deliberately. This signals to the nervous system that the new range is safe and helps the change persist rather than reverting within minutes.",
  },
  {
    title: "Reinforce with a loaded stretch",
    body: "Finish with a 2-minute loaded stretch in the end range. Gentle load — like holding a light position or using your own body weight — creates lasting fascial change that passive stretching alone doesn't achieve.",
  },
];

// ── Icons ──────────────────────────────────────────────────────────────────────

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

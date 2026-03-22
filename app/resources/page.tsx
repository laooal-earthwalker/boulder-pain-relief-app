import type { Metadata } from "next";
import ResourceLibrary from "@/components/resources/ResourceLibrary";
import { resources } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Self-Care Resource Library",
  description:
    "Filterable self-care guides for neck, shoulders, back, hips, knees, and feet — organized by body part and condition type for desk workers, athletes, and the CrossFit community.",
};

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Self-Care Resource Library
          </h1>
          <p className="text-base text-teal-100/75">
            Practical guides for what to do between sessions — filter by body
            part or condition type to find what&apos;s relevant to you.
          </p>
        </div>
      </div>

      {/* ── Filterable library (client component) ─────────────────── */}
      <ResourceLibrary resources={resources} />

      {/* ── Booking CTA ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white px-6 py-12 text-center">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-base font-semibold text-slate-900">
            Self-care not cutting it?
          </p>
          <p className="mb-6 text-sm text-slate-600">
            These guides help maintain progress, but some patterns need hands-on
            work to fully shift. Book a session and we&apos;ll address the root
            cause directly.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Book a Session
            <svg
              className="h-4 w-4"
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
          </a>
        </div>
      </div>
    </div>
  );
}

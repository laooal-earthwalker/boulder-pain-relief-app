import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Welcome — Boulder Pain Relief",
  description:
    "Map your pain patterns before your massage therapy session. Understand what's happening in your body — before you arrive.",
};

const STEPS = [
  {
    n: "01",
    icon: (
      <svg
        className="h-5 w-5 text-teal-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    title: "Mark where it hurts",
    body: "Tap an anatomical body map to place pain markers with intensity ratings — front and back views.",
  },
  {
    n: "02",
    icon: (
      <svg
        className="h-5 w-5 text-teal-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </svg>
    ),
    title: "Describe what you were doing",
    body: "Sitting at a desk? Overhead pressing? Context turns a pain location into a movement pattern.",
  },
  {
    n: "03",
    icon: (
      <svg
        className="h-5 w-5 text-teal-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "We find the pattern",
    body: "An AI trained on clinical movement science identifies likely tissues involved and compensation chain risks.",
  },
];

export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      {/* Top wordmark bar */}
      <div className="border-b border-slate-100 px-6 py-4">
        <p className="text-center text-sm font-semibold tracking-wide text-teal-700">
          Boulder Pain Relief
        </p>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 sm:py-20">
        <div className="w-full max-w-lg">
          {/* Label */}
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-teal-600">
            Boulder Pain Relief
          </p>

          {/* Headline */}
          <h1 className="mb-4 text-center text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Meet PainMap
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-center text-base leading-relaxed text-slate-500 sm:mb-12">
            Before your session, use PainMap to mark where you hurt, describe
            what triggered it, and get a structured clinical summary — ready for
            your therapist when you arrive.
          </p>

          {/* 3-step cards */}
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            {STEPS.map(({ n, icon, title, body }) => (
              <div
                key={n}
                className="flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                    {icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-300">
                    {n}
                  </span>
                </div>
                <p className="mb-1 text-sm font-semibold text-slate-900">
                  {title}
                </p>
                <p className="text-xs leading-relaxed text-slate-500">{body}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signup"
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-8 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Get Started
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="/painmap"
              className="flex items-center justify-center gap-2 rounded-full border border-slate-200 py-3.5 text-sm font-medium text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
            >
              Try PainMap without an account
            </Link>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-teal-600 hover:text-teal-700"
              >
                Log in
              </Link>
            </p>
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-slate-100 pt-8">
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg
                className="h-3.5 w-3.5 text-teal-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
                  clipRule="evenodd"
                />
              </svg>
              HIPAA-compliant
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg
                className="h-3.5 w-3.5 text-teal-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Powered by Claude AI
            </p>
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg
                className="h-3.5 w-3.5 text-teal-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Reviewed by licensed therapists
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

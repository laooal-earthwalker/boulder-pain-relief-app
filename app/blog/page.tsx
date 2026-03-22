import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Pain education, self-care tips, athlete recovery, and desk worker health — written by Lao Kemper, licensed and certified massage therapist at Boulder Pain Relief in Boulder, CO.",
};

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Types & data ──────────────────────────────────────────────────────────────

type Category =
  | "Pain Education"
  | "Self-Care Tips"
  | "Athlete Recovery"
  | "Desk Worker Health";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category: Category;
  excerpt: string;
  readingTime: string;
}

const CATEGORY_STYLES: Record<
  Category,
  { bg: string; text: string }
> = {
  "Pain Education": { bg: "bg-teal-100", text: "text-teal-700" },
  "Self-Care Tips": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Athlete Recovery": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Desk Worker Health": { bg: "bg-sky-100", text: "text-sky-700" },
};

const posts: BlogPost[] = [
  {
    slug: "why-your-lower-back-hurts-at-your-desk",
    title: "Why Your Lower Back Hurts at Your Desk (And What to Do About It)",
    date: "2026-03-01",
    category: "Desk Worker Health",
    excerpt:
      "Sitting isn't inherently bad for your back — but the way most people sit is. This breaks down the three most common mechanical patterns that drive lower back pain in desk workers, and gives you a prioritized list of changes to make this week.",
    readingTime: "6 min read",
  },
  {
    slug: "fascial-connection-pain-elsewhere",
    title:
      "The Fascial Connection: Why One Tight Spot Can Cause Pain Somewhere Else",
    date: "2026-02-15",
    category: "Pain Education",
    excerpt:
      "Most people treat pain where it lives. But the fascia — the connective tissue web that wraps every muscle, bone, and organ — means tightness in one region can load a distant area past its tolerance. Here's how to think about referred tension patterns.",
    readingTime: "7 min read",
  },
  {
    slug: "recovery-between-crossfit-wods",
    title: "Recovery Between CrossFit WODs: What Actually Helps",
    date: "2026-02-01",
    category: "Athlete Recovery",
    excerpt:
      "There's a lot of noise in the recovery space — cold plunges, compression boots, red light therapy. This breaks down what the evidence actually supports, what's probably just feel-good placebo, and the non-negotiables most athletes skip.",
    readingTime: "8 min read",
  },
  {
    slug: "5-self-care-habits-keep-you-out-of-my-office",
    title: "5 Self-Care Habits That Will Actually Keep You Out of My Office",
    date: "2026-01-20",
    category: "Self-Care Tips",
    excerpt:
      "The goal of good bodywork is to need it less over time, not more. These are the five habits — simple, time-efficient, and free — that I give almost every client because the research is solid and the barrier to starting is low.",
    readingTime: "5 min read",
  },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Blog
          </h1>
          <p className="text-base text-teal-100/75">
            Pain education, self-care, and recovery — written from a clinical
            perspective by a licensed and certified massage therapist.
          </p>
        </div>
      </div>

      {/* ── Category legend ───────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Categories
          </span>
          {(Object.keys(CATEGORY_STYLES) as Category[]).map((cat) => (
            <span
              key={cat}
              className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_STYLES[cat].bg} ${CATEGORY_STYLES[cat].text}`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* ── Posts grid ────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => {
            const catStyle = CATEGORY_STYLES[post.category];
            return (
              <article
                key={post.slug}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                {/* Meta row */}
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${catStyle.bg} ${catStyle.text}`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {post.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mb-3 text-base font-semibold leading-snug text-slate-900 group-hover:text-teal-800">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                {/* Excerpt */}
                <p className="flex-1 text-sm leading-6 text-slate-600">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <time
                    dateTime={post.date}
                    className="text-xs text-slate-400"
                  >
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:gap-2 hover:text-teal-600"
                  >
                    Read
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
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* More posts note */}
        <p className="mt-10 text-center text-sm text-slate-400">
          More articles coming soon. Check back regularly.
        </p>
      </div>

      {/* ── Booking CTA ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white px-6 py-12 text-center">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-base font-semibold text-slate-900">
            Ready to put this into practice?
          </p>
          <p className="mb-6 text-sm text-slate-600">
            Reading helps, but hands-on work moves faster. Book a session and
            we&apos;ll apply this directly to what&apos;s going on in your body.
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
                d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

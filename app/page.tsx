import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Boulder Pain Relief Massage | Clinical Massage Therapy in Boulder, CO",
  description:
    "Evidence-based clinical massage therapy for desk workers, athletes, and the CrossFit community in Boulder, CO. Book a session or try the AI pain tool.",
};

// Acuity Scheduling — replace with actual URL before launch
const BOOKING_URL = "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Homepage ─────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutTeaser />
      <ServicesSection />
      <ToolsSection />
      <CtaBanner />
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-teal-950 via-teal-900 to-slate-900 px-6 text-center">
      {/* Decorative mountain silhouette */}
      <MountainSilhouette />

      <div className="relative z-10 flex flex-col items-center gap-7 py-24">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-800/40 px-4 py-1.5 text-sm font-medium text-teal-200 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
          Clinical Massage Therapy &middot; Boulder, CO
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-balance text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Move without pain.{" "}
          <span className="text-teal-300">Live without limits.</span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl text-balance text-lg text-teal-100/75 sm:text-xl">
          Evidence-based massage therapy for desk workers, athletes, and the
          CrossFit community &mdash; rooted in anatomy, delivered with care.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-teal-900 shadow-lg transition hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Book a Session
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <Link
            href="/pain-tool"
            className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-800/40 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-teal-700/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Try the AI Pain Tool
          </Link>
        </div>

        {/* Trust note */}
        <p className="text-sm text-teal-300/60">
          Licensed Massage Therapist &middot; Evidence-Based Practice
        </p>
      </div>
    </section>
  );
}

// ── About Teaser ──────────────────────────────────────────────────────────────

function AboutTeaser() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Avatar placeholder */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative h-72 w-72 overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 sm:h-80 sm:w-80">
            {/* Replace with <Image> once a photo is available */}
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <PersonSilhouette />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-teal-200/80 to-transparent" />
          </div>
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            About the Practice
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Massage therapy that actually addresses the cause.
          </h2>
          <p className="text-base leading-7 text-slate-600">
            Boulder Pain Relief Massage is a clinical massage therapy practice
            built around one goal: helping you move and feel better. Using
            evidence-based techniques drawn from sports medicine, anatomy, and
            fascia research, each session is customized to your body, your
            history, and your goals.
          </p>
          <p className="text-base leading-7 text-slate-600">
            Whether you sit at a desk for eight hours, train CrossFit five days
            a week, or are managing a nagging injury, the approach here goes
            beyond relaxation &mdash; it&apos;s targeted, specific, and built
            to get results.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-600"
          >
            Learn more about the approach
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────

const services = [
  {
    Icon: PainReliefIcon,
    title: "Deep Tissue & Pain Relief",
    description:
      "Targeted work on chronic tension, postural imbalances, and persistent pain patterns. Gets under the surface to address what&apos;s actually limiting you.",
  },
  {
    Icon: AthleticsIcon,
    title: "Sports & CrossFit Recovery",
    description:
      "Performance-focused therapy for athletes managing training load, acute soreness, and injury prevention. Train harder, recover faster.",
  },
  {
    Icon: FasciaIcon,
    title: "Myofascial Release",
    description:
      "Sustained pressure and slow stretching to release fascial restrictions and restore full range of motion. Addresses the connective tissue other modalities miss.",
  },
  {
    Icon: DeskIcon,
    title: "Desk Worker Restoration",
    description:
      "Specific protocols for neck, shoulder, and lower back dysfunction from prolonged sitting and screen time. Designed for people who live at a computer.",
  },
] as const;

function ServicesSection() {
  return (
    <section className="bg-teal-50 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            Services
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Every session is different. Every session is yours.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            No two bodies are the same. Sessions draw from multiple modalities
            and are built around your specific patterns, history, and goals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map(({ Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-5 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm"
            >
              <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-slate-900">
                  {title}
                </h3>
                <p
                  className="text-sm leading-6 text-slate-600"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Booking note */}
        <div className="mt-10 text-center">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Book a Session
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Tools & Resources ─────────────────────────────────────────────────────────

function ToolsSection() {
  return (
    <section className="bg-white px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
            Tools &amp; Resources
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Support between sessions.
          </h2>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            Your results don&apos;t live only in the treatment room. These tools
            extend your care into daily life.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* AI Pain Tool */}
          <Link
            href="/pain-tool"
            className="group flex flex-col gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-7 transition hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
                <BrainIcon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700">
                Free
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-slate-900">
                AI Pain Tool
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Describe your symptoms, location, and activities. Get a
                plain-language explanation of what may be happening in your
                muscles and fascia &mdash; plus personalized self-care guidance
                and a booking suggestion.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition group-hover:gap-2">
              Try it now <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>

          {/* Self-Care Library */}
          <Link
            href="/resources"
            className="group flex flex-col gap-4 rounded-2xl border border-sky-200 bg-sky-50 p-7 transition hover:border-sky-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white">
                <BookIcon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                Free
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-slate-900">
                Self-Care Library
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Filterable guides for stretches, mobilizations, and recovery
                techniques &mdash; organized by body part and condition so you
                can find what&apos;s relevant to you fast.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition group-hover:gap-2">
              Browse the library <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>

          {/* Video Courses */}
          <Link
            href="/courses"
            className="group flex flex-col gap-4 rounded-2xl border border-indigo-200 bg-indigo-50 p-7 transition hover:border-indigo-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <VideoIcon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700">
                Free previews
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-slate-900">
                Video Courses
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Structured programs to build lasting habits &mdash; from desk
                worker mobility routines to CrossFit recovery protocols. Learn
                at your own pace.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 transition group-hover:gap-2">
              View courses <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>

          {/* Recovery Shop */}
          <Link
            href="/shop"
            className="group flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-7 transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <ShopIcon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Vetted picks
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-slate-900">
                Recovery Shop
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Curated ergonomic, travel, and recovery tools that are
                personally vetted. Every product earns its place &mdash; no
                filler, no noise.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition group-hover:gap-2">
              Shop products <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Final CTA Banner ──────────────────────────────────────────────────────────

function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 to-slate-900 px-6 py-20 text-center sm:py-28">
      {/* Subtle background rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[500px] w-[500px] rounded-full border border-teal-500/10" />
        <div className="absolute h-[350px] w-[350px] rounded-full border border-teal-500/10" />
        <div className="absolute h-[200px] w-[200px] rounded-full border border-teal-500/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Ready to feel better?
        </h2>
        <p className="max-w-md text-base text-teal-100/70">
          Book a session online or start with the free AI pain tool to get
          personalized guidance before your first visit.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-teal-900 shadow-lg transition hover:bg-teal-50"
          >
            Book a Session
            <ArrowRightIcon className="h-4 w-4" />
          </a>
          <Link
            href="/pain-tool"
            className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-800/40 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-teal-700/60"
          >
            Try the AI Pain Tool
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── SVG Components ────────────────────────────────────────────────────────────

function MountainSilhouette() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 w-full"
      viewBox="0 0 1440 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      {/* Far range — lighter */}
      <path
        d="M0 220 L0 160 L100 90 L200 130 L320 55 L440 110 L560 40 L680 95 L800 50 L920 105 L1040 60 L1160 115 L1280 70 L1440 120 L1440 220 Z"
        fill="rgba(255,255,255,0.04)"
      />
      {/* Mid range */}
      <path
        d="M0 220 L0 175 L150 115 L300 155 L450 85 L600 135 L750 75 L900 130 L1050 88 L1200 140 L1350 100 L1440 145 L1440 220 Z"
        fill="rgba(255,255,255,0.06)"
      />
      {/* Near range — most visible */}
      <path
        d="M0 220 L0 195 L180 150 L360 180 L540 130 L720 168 L900 128 L1080 165 L1260 138 L1440 170 L1440 220 Z"
        fill="rgba(255,255,255,0.05)"
      />
    </svg>
  );
}

function PersonSilhouette() {
  return (
    <svg
      aria-hidden="true"
      className="h-52 w-52 text-teal-400/40"
      viewBox="0 0 120 160"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="60" cy="28" r="22" />
      <path d="M20 160 C20 110 35 88 60 85 C85 88 100 110 100 160 Z" />
    </svg>
  );
}

interface IconProps {
  className?: string;
}

function ArrowRightIcon({ className }: IconProps) {
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

function PainReliefIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}

function AthleticsIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.636 4.575a.75.75 0 0 1 0 1.06 9 9 0 0 0 0 12.729.75.75 0 0 1-1.06 1.06c-4.101-4.1-4.101-10.748 0-14.849a.75.75 0 0 1 1.06 0Zm12.728 0a.75.75 0 0 1 1.06 0c4.101 4.1 4.101 10.749 0 14.85a.75.75 0 1 1-1.06-1.061 9 9 0 0 0 0-12.728.75.75 0 0 1 0-1.06ZM7.757 6.697a.75.75 0 0 1 0 1.06 6 6 0 0 0 0 8.486.75.75 0 0 1-1.06 1.06 7.5 7.5 0 0 1 0-10.606.75.75 0 0 1 1.06 0Zm8.486 0a.75.75 0 0 1 1.06 0 7.5 7.5 0 0 1 0 10.606.75.75 0 0 1-1.06-1.06 6 6 0 0 0 0-8.486.75.75 0 0 1 0-1.06ZM12 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FasciaIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 21.75h6a2.25 2.25 0 0 0 2.25-2.25V12.75h-8.25v9Z" />
    </svg>
  );
}

function DeskIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v9.75a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BrainIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 7.5h-9v9h9v-9Z" />
      <path
        fillRule="evenodd"
        d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BookIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
    </svg>
  );
}

function VideoIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z" />
    </svg>
  );
}

function ShopIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
    </svg>
  );
}

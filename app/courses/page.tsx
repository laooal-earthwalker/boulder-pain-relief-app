import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Courses | Boulder Pain Relief",
  description:
    "Structured video programs for chronic pain relief, desk worker mobility, and CrossFit recovery — from a licensed massage therapist in Boulder, CO. Free lesson previews available.",
};

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Types & data ──────────────────────────────────────────────────────────────

type CourseLevel = "Beginner" | "Intermediate" | "All Levels";
type CourseStatus = "available" | "coming-soon";

interface Lesson {
  title: string;
  duration: string;
  free: boolean;
}

interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  level: CourseLevel;
  lessonCount: number;
  totalDuration: string;
  tags: string[];
  status: CourseStatus;
  accentColor: string;
  lessons: Lesson[];
}

const courses: Course[] = [
  {
    slug: "desk-worker-mobility-reset",
    title: "Desk Worker Mobility Reset",
    subtitle: "A 4-week program for the chronically tight",
    description:
      "Designed specifically for people who sit at a computer for most of the day. This program works through the full desk-worker compensation pattern: stiff thoracic spine, shortened hip flexors, inhibited glutes, and locked-up cervical spine. Each session is 15–25 minutes and requires no equipment.",
    level: "All Levels",
    lessonCount: 12,
    totalDuration: "3h 20min",
    tags: ["Desk Health", "Mobility", "Lower Back", "Neck & Shoulders"],
    status: "available",
    accentColor: "sky",
    lessons: [
      { title: "Introduction: Understanding the Desk Pattern", duration: "8 min", free: true },
      { title: "Thoracic Spine Assessment & First Release", duration: "18 min", free: true },
      { title: "Hip Flexor Reset — Week 1", duration: "22 min", free: false },
      { title: "Cervical Spine & Suboccipital Release", duration: "16 min", free: false },
      { title: "Glute Activation Fundamentals", duration: "20 min", free: false },
      { title: "Thoracic Rotation Restoration", duration: "19 min", free: false },
      { title: "Mid-Program Check-In", duration: "10 min", free: false },
      { title: "Deep Hip Flexor Work — Week 3", duration: "24 min", free: false },
      { title: "Shoulder Girdle Decompression", duration: "21 min", free: false },
      { title: "Lumbar Decompression Sequence", duration: "18 min", free: false },
      { title: "Integration: Full Upper Body Flow", duration: "26 min", free: false },
      { title: "Integration: Full Lower Body Flow", duration: "25 min", free: false },
    ],
  },
  {
    slug: "crossfit-recovery-protocols",
    title: "CrossFit Recovery Protocols",
    subtitle: "Train harder, recover smarter",
    description:
      "Targeted recovery sequences for the most common CrossFit movement patterns: overhead pressing, pulling, squatting, and high-volume conditioning. Learn to identify what's accumulating in your tissue, address it systematically, and stay out of the injury cycle. Includes pre-WOD prep and post-WOD decompression protocols.",
    level: "Intermediate",
    lessonCount: 10,
    totalDuration: "4h 05min",
    tags: ["CrossFit", "Athlete Recovery", "Shoulder", "Hip", "Posterior Chain"],
    status: "available",
    accentColor: "indigo",
    lessons: [
      { title: "The Athlete's Tissue Problem", duration: "12 min", free: true },
      { title: "Pre-WOD Primer: Overhead Days", duration: "14 min", free: true },
      { title: "Post-WOD Decompression: Shoulder & Lat", duration: "22 min", free: false },
      { title: "Hip Flexor & Quad Recovery After Squat Days", duration: "25 min", free: false },
      { title: "Posterior Chain Reset: Hamstrings & Glutes", duration: "28 min", free: false },
      { title: "Thoracic Spine for Overhead Athletes", duration: "24 min", free: false },
      { title: "Forearm & Grip Recovery After Pull Days", duration: "18 min", free: false },
      { title: "The Full-Body Recovery Flow (Rest Day Protocol)", duration: "35 min", free: false },
      { title: "Managing Accumulated Tightness Over a Training Week", duration: "20 min", free: false },
      { title: "When to Rest vs. When to Move", duration: "15 min", free: false },
    ],
  },
  {
    slug: "chronic-pain-foundations",
    title: "Chronic Pain Foundations",
    subtitle: "Understand what's happening in your body",
    description:
      "A clinically-grounded education course on why chronic soft-tissue pain develops, persists, and — importantly — how it changes. Covers the neuroscience of pain, the role of fascia and connective tissue, compensation patterns, and the evidence behind different treatment approaches. Required viewing for anyone who has been dealing with pain for more than three months.",
    level: "All Levels",
    lessonCount: 8,
    totalDuration: "2h 40min",
    tags: ["Pain Education", "Fascia", "Nervous System", "Self-Care"],
    status: "available",
    accentColor: "teal",
    lessons: [
      { title: "What Is Pain? A Clinical Introduction", duration: "15 min", free: true },
      { title: "The Tissue vs. the Nervous System", duration: "20 min", free: true },
      { title: "How Fascia Becomes a Problem", duration: "22 min", free: false },
      { title: "Compensation Chains: Why It Hurts There", duration: "24 min", free: false },
      { title: "Central Sensitization Explained", duration: "18 min", free: false },
      { title: "What Massage Therapy Actually Does", duration: "20 min", free: false },
      { title: "Evidence-Based Self-Care: What Works", duration: "25 min", free: false },
      { title: "Building Your Maintenance Plan", duration: "20 min", free: false },
    ],
  },
  {
    slug: "runners-hip-and-knee",
    title: "Runner's Hip & Knee",
    subtitle: "Address the patterns that create running injuries",
    description:
      "Most running injuries aren't really running injuries — they're load-management and biomechanical pattern problems that happen to show up during running. This course addresses IT band syndrome, patellofemoral pain, hip flexor problems, and posterior chain tightness with targeted soft-tissue techniques and movement drills.",
    level: "Intermediate",
    lessonCount: 9,
    totalDuration: "3h 15min",
    tags: ["Running", "Athlete Recovery", "Hip", "Knee", "IT Band"],
    status: "coming-soon",
    accentColor: "emerald",
    lessons: [],
  },
];

const ACCENT: Record<string, { border: string; bg: string; badge: string; badgeText: string; link: string }> = {
  sky: {
    border: "border-sky-200",
    bg: "bg-sky-50",
    badge: "bg-sky-100",
    badgeText: "text-sky-700",
    link: "text-sky-700 hover:text-sky-600",
  },
  indigo: {
    border: "border-indigo-200",
    bg: "bg-indigo-50",
    badge: "bg-indigo-100",
    badgeText: "text-indigo-700",
    link: "text-indigo-700 hover:text-indigo-600",
  },
  teal: {
    border: "border-teal-200",
    bg: "bg-teal-50",
    badge: "bg-teal-100",
    badgeText: "text-teal-700",
    link: "text-teal-700 hover:text-teal-600",
  },
  emerald: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100",
    badgeText: "text-emerald-700",
    link: "text-emerald-700 hover:text-emerald-600",
  },
};

const LEVEL_STYLE: Record<CourseLevel, string> = {
  "All Levels": "bg-slate-100 text-slate-600",
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
};

function LockIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-slate-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      className="h-3.5 w-3.5 text-teal-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CoursesPage() {
  const availableCourses = courses.filter((c) => c.status === "available");
  const comingSoonCourses = courses.filter((c) => c.status === "coming-soon");

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Courses
          </h1>
          <p className="text-base text-teal-100/75">
            Structured programs for chronic pain relief, mobility, and
            recovery — built from clinical practice, designed for real life.
            First two lessons of every course are free.
          </p>
        </div>
      </div>

      {/* ── How it works banner ───────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <PlayIcon />
            First 2 lessons always free
          </span>
          <span className="text-slate-300" aria-hidden>|</span>
          <span className="flex items-center gap-2">
            <LockIcon />
            Full course requires a free account
          </span>
          <span className="text-slate-300" aria-hidden>|</span>
          <span className="flex items-center gap-2">
            <svg className="h-3.5 w-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
            </svg>
            Learn at your own pace
          </span>
        </div>
      </div>

      {/* ── Course list ───────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <div className="flex flex-col gap-8">
          {availableCourses.map((course) => {
            const accent = ACCENT[course.accentColor];
            const freeLessons = course.lessons.filter((l) => l.free);
            const paidLessons = course.lessons.filter((l) => !l.free);
            return (
              <div
                key={course.slug}
                className={`overflow-hidden rounded-2xl border ${accent.border} bg-white shadow-sm`}
              >
                {/* Card header */}
                <div className={`${accent.bg} px-7 py-6`}>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_STYLE[course.level]}`}
                    >
                      {course.level}
                    </span>
                    {course.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.badge} ${accent.badgeText}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="mb-1 text-xl font-semibold text-slate-900">
                    {course.title}
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    {course.subtitle}
                  </p>
                </div>

                {/* Card body */}
                <div className="px-7 py-5">
                  <p className="mb-5 text-sm leading-6 text-slate-600">
                    {course.description}
                  </p>

                  {/* Stats row */}
                  <div className="mb-6 flex flex-wrap gap-5 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M3.25 4A2.25 2.25 0 0 0 1 6.25v7.5A2.25 2.25 0 0 0 3.25 16h7.5A2.25 2.25 0 0 0 13 13.75v-7.5A2.25 2.25 0 0 0 10.75 4h-7.5ZM19 4.75a.75.75 0 0 0-1.28-.53l-3 3a.75.75 0 0 0-.22.53v4.5c0 .199.079.39.22.53l3 3a.75.75 0 0 0 1.28-.53V4.75Z" />
                      </svg>
                      {course.lessonCount} lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
                      </svg>
                      {course.totalDuration} total
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PlayIcon />
                      {freeLessons.length} free lessons
                    </span>
                  </div>

                  {/* Lesson list */}
                  <div className="mb-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {freeLessons.map((lesson, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <PlayIcon />
                          <span className="text-sm text-slate-700">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {lesson.duration}
                          </span>
                          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-600">
                            Free
                          </span>
                        </div>
                      </div>
                    ))}
                    {paidLessons.slice(0, 3).map((lesson, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-slate-50/50 px-4 py-3 opacity-60"
                      >
                        <div className="flex items-center gap-2.5">
                          <LockIcon />
                          <span className="text-sm text-slate-600">
                            {lesson.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {lesson.duration}
                        </span>
                      </div>
                    ))}
                    {paidLessons.length > 3 && (
                      <div className="flex items-center justify-between bg-slate-50/50 px-4 py-3 opacity-50">
                        <div className="flex items-center gap-2.5">
                          <LockIcon />
                          <span className="text-sm text-slate-500 italic">
                            + {paidLessons.length - 3} more lessons with account
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                    >
                      <PlayIcon />
                      Start free preview
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
                    >
                      <LockIcon />
                      Create account for full access
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Coming soon ───────────────────────────────────────── */}
        {comingSoonCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Coming Soon
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {comingSoonCourses.map((course) => {
                const accent = ACCENT[course.accentColor];
                return (
                  <div
                    key={course.slug}
                    className={`rounded-2xl border ${accent.border} bg-white p-6 opacity-70`}
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                        Coming Soon
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_STYLE[course.level]}`}
                      >
                        {course.level}
                      </span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-slate-900">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500">{course.subtitle}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${accent.badge} ${accent.badgeText}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Booking CTA ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white px-6 py-12 text-center">
        <div className="mx-auto max-w-xl">
          <p className="mb-2 text-base font-semibold text-slate-900">
            Want results faster?
          </p>
          <p className="mb-6 text-sm text-slate-600">
            Courses are great for ongoing maintenance. But if you&apos;re
            dealing with something specific, hands-on work will move faster.
            Book a session and we&apos;ll get right to it.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
          >
            Book a Session
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

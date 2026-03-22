"use client";

import Link from "next/link";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type BodyPart =
  | "neck"
  | "shoulders"
  | "upper-back"
  | "lower-back"
  | "hips"
  | "knees"
  | "feet";

export type Condition =
  | "desk-worker"
  | "athlete"
  | "crossfit"
  | "post-session"
  | "general";

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  bodyPart: BodyPart;
  condition: Condition;
  description: string;
}

// ── Label maps ────────────────────────────────────────────────────────────────

const BODY_PART_LABELS: Record<BodyPart, string> = {
  neck: "Neck",
  shoulders: "Shoulders",
  "upper-back": "Upper Back",
  "lower-back": "Lower Back",
  hips: "Hips",
  knees: "Knees",
  feet: "Feet",
};

const CONDITION_LABELS: Record<Condition, string> = {
  "desk-worker": "Desk Worker",
  athlete: "Athlete",
  crossfit: "CrossFit",
  "post-session": "Post-Session Care",
  general: "General Wellness",
};

const CONDITION_COLORS: Record<
  Condition,
  { bg: string; text: string; activeBg: string; activeText: string }
> = {
  "desk-worker": {
    bg: "bg-sky-50 text-sky-700 border-sky-200",
    text: "text-sky-700",
    activeBg: "bg-sky-600",
    activeText: "text-white",
  },
  athlete: {
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    text: "text-indigo-700",
    activeBg: "bg-indigo-600",
    activeText: "text-white",
  },
  crossfit: {
    bg: "bg-orange-50 text-orange-700 border-orange-200",
    text: "text-orange-700",
    activeBg: "bg-orange-600",
    activeText: "text-white",
  },
  "post-session": {
    bg: "bg-teal-50 text-teal-700 border-teal-200",
    text: "text-teal-700",
    activeBg: "bg-teal-600",
    activeText: "text-white",
  },
  general: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-700",
    activeBg: "bg-emerald-600",
    activeText: "text-white",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResourceLibrary({
  resources,
}: {
  resources: ResourceItem[];
}) {
  const [activeBodyPart, setActiveBodyPart] = useState<BodyPart | null>(null);
  const [activeCondition, setActiveCondition] = useState<Condition | null>(
    null
  );

  const filtered = resources.filter((r) => {
    const bodyMatch = activeBodyPart === null || r.bodyPart === activeBodyPart;
    const condMatch = activeCondition === null || r.condition === activeCondition;
    return bodyMatch && condMatch;
  });

  const hasFilter = activeBodyPart !== null || activeCondition !== null;

  function clearFilters() {
    setActiveBodyPart(null);
    setActiveCondition(null);
  }

  function toggleBodyPart(bp: BodyPart) {
    setActiveBodyPart((prev) => (prev === bp ? null : bp));
  }

  function toggleCondition(c: Condition) {
    setActiveCondition((prev) => (prev === c ? null : c));
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* ── Sticky filter bar ──────────────────────────────────── */}
      <div className="sticky top-[65px] z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4">
          {/* Body part row */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Body Part
            </span>
            {(Object.keys(BODY_PART_LABELS) as BodyPart[]).map((bp) => (
              <button
                key={bp}
                onClick={() => toggleBodyPart(bp)}
                className={`rounded-full border px-3.5 py-1 text-sm font-medium transition ${
                  activeBodyPart === bp
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:text-teal-700"
                }`}
              >
                {BODY_PART_LABELS[bp]}
              </button>
            ))}
          </div>

          {/* Condition row + count + clear */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Condition
            </span>
            {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => {
              const colors = CONDITION_COLORS[c];
              return (
                <button
                  key={c}
                  onClick={() => toggleCondition(c)}
                  className={`rounded-full border px-3.5 py-1 text-sm font-medium transition ${
                    activeCondition === c
                      ? `border-transparent ${colors.activeBg} ${colors.activeText}`
                      : `${colors.bg} hover:opacity-80`
                  }`}
                >
                  {CONDITION_LABELS[c]}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {filtered.length} of {resources.length}
              </span>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-teal-600 hover:text-teal-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Card grid ──────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-base font-medium text-slate-900">
              No resources match those filters.
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Clear and show all
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => {
              const condColors = CONDITION_COLORS[resource.condition];
              return (
                <div
                  key={resource.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                >
                  {/* Tags */}
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                      {BODY_PART_LABELS[resource.bodyPart]}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${condColors.bg}`}
                    >
                      {CONDITION_LABELS[resource.condition]}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-base font-semibold leading-snug text-slate-900 group-hover:text-teal-800">
                    {resource.title}
                  </h3>

                  {/* Description */}
                  <p className="flex-1 text-sm leading-6 text-slate-600">
                    {resource.description}
                  </p>

                  {/* Link */}
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:gap-2 hover:text-teal-600"
                  >
                    Read More
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
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

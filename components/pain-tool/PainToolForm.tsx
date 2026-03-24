"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import BodyMap, { type PainSpot, type SpotSize, spotColor } from "./BodyMap";

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

const DURATION_OPTIONS = [
  { value: "less-than-1-week", label: "Less than 1 week" },
  { value: "1-4-weeks", label: "1–4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months (chronic)" },
];

// Human-readable labels for Claude's movement_category values
const CATEGORY_LABELS: Record<string, string> = {
  "repetitive overhead": "Repetitive Overhead",
  "prolonged sitting": "Prolonged Sitting",
  "heavy loading": "Heavy Loading",
  "high impact": "High Impact",
  sedentary: "Sedentary",
  "repetitive gripping": "Repetitive Gripping",
  "spinal flexion": "Spinal Flexion",
  "lateral loading": "Lateral Loading",
  other: "Other",
};

const RISK_STYLES = {
  low: { badge: "bg-teal-50 text-teal-700", label: "Low Risk" },
  medium: { badge: "bg-amber-50 text-amber-700", label: "Medium Risk" },
  high: { badge: "bg-red-50 text-red-700", label: "High Risk" },
};

interface FormState {
  intensity: number;
  duration: string;
  worseWith: string;
  betterWith: string;
}

interface AiAssessmentItem {
  region: string;
  movement_category: string;
  likely_muscles_affected: string[];
  compensation_chain_risk: "low" | "medium" | "high";
  correlation_notes: string;
}

interface AiAssessment {
  assessments: AiAssessmentItem[];
}

const INITIAL_FORM: FormState = {
  intensity: 5,
  duration: "",
  worseWith: "",
  betterWith: "",
};

function intensityLabel(n: number): string {
  if (n <= 2) return "Very mild";
  if (n <= 4) return "Mild";
  if (n <= 6) return "Moderate";
  if (n <= 8) return "Significant";
  return "Severe";
}

function intensityColor(n: number): string {
  if (n <= 3) return "#16a34a";
  if (n <= 5) return "#ca8a04";
  if (n <= 7) return "#ea580c";
  return "#dc2626";
}

// ── Main form component ───────────────────────────────────────────────────────

export default function PainToolForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [painSpots, setPainSpots] = useState<PainSpot[]>([]);
  const [currentSize, setCurrentSize] = useState<SpotSize>("regional");
  // Per-spot activity text: key = `${regionId}-${view}`
  const [activityTexts, setActivityTexts] = useState<Record<string, string>>({});

  const [aiResponse, setAiResponse] = useState<AiAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleToggle(
    regionId: string,
    label: string,
    cx: number,
    cy: number,
    view: "front" | "back"
  ) {
    const key = `${regionId}-${view}`;
    setPainSpots((prev) => {
      const exists = prev.find(
        (s) => s.regionId === regionId && s.view === view
      );
      if (exists) {
        // Remove activity text when spot is removed
        setActivityTexts((at) => {
          const next = { ...at };
          delete next[key];
          return next;
        });
        return prev.filter(
          (s) => !(s.regionId === regionId && s.view === view)
        );
      }
      return [
        ...prev,
        {
          regionId,
          label,
          size: currentSize,
          intensity: form.intensity,
          cx,
          cy,
          view,
        },
      ];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAiResponse(null);
    setDone(false);
    setSavedId(null);
    setLoading(true);

    // Build sanitized payload — only clinical data, no identifiers
    const spots = painSpots.map((s) => ({
      label: s.label,
      intensity: s.intensity,
      size: s.size,
      activityText: activityTexts[`${s.regionId}-${s.view}`] ?? "",
    }));

    try {
      const res = await fetch("/api/ai/pain-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spots, duration: form.duration }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          (json as { error?: string }).error ??
            `Request failed (${res.status})`
        );
      }

      const data: AiAssessment = await res.json();
      setAiResponse(data);
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/pain-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spots: painSpots,
          activity_notes: painSpots.map((s) => ({
            regionId: s.regionId,
            label: s.label,
            activityText: activityTexts[`${s.regionId}-${s.view}`] ?? "",
          })),
          overall_intensity: form.intensity,
          duration: form.duration,
          worse_with: form.worseWith || null,
          better_with: form.betterWith || null,
          ai_interpretation: aiResponse,
        }),
      });
      const data = await res.json();
      if (res.ok) setSavedId(data.id);
    } finally {
      setSaving(false);
    }
  }

  const canSubmit = painSpots.length > 0 && form.duration !== "" && !loading;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-10">
      {/* ── Form panel ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Describe your pain
        </h2>
        <p className="mb-7 text-sm text-slate-500">
          Tap regions on the body map, then describe what you were doing. The
          more specific you are, the more useful the assessment.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* ── Body map ───────────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-slate-700">
                Step 1 — Where is the pain?
              </span>
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </div>

            {/* Size selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Spot type:</span>
              {(
                [
                  { size: "pinpoint" as SpotSize, label: "Pinpoint", r: 4 },
                  { size: "regional" as SpotSize, label: "Regional", r: 7 },
                  { size: "diffuse" as SpotSize, label: "Diffuse", r: 10 },
                ] as { size: SpotSize; label: string; r: number }[]
              ).map(({ size, label, r }) => {
                const active = currentSize === size;
                const color = spotColor(form.intensity);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setCurrentSize(size)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                      active
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    <svg
                      width={r * 2 + 2}
                      height={r * 2 + 2}
                      viewBox={`0 0 ${r * 2 + 2} ${r * 2 + 2}`}
                      aria-hidden="true"
                    >
                      <circle
                        cx={r + 1}
                        cy={r + 1}
                        r={r}
                        fill={active ? color : "#94a3b8"}
                        opacity={size === "diffuse" ? 0.7 : 0.9}
                      />
                    </svg>
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="mt-1 rounded-xl border border-slate-100 bg-slate-50 px-4 py-5">
              <BodyMap
                painSpots={painSpots}
                onToggle={handleToggle}
                currentSize={currentSize}
                intensity={form.intensity}
              />
            </div>
          </div>

          {/* ── Per-spot activity text ──────────────────────────────────── */}
          {painSpots.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-slate-700">
                Step 2 — What were you doing?{" "}
                <span className="font-normal text-slate-400">(optional but helpful)</span>
              </p>
              {painSpots.map((spot) => {
                const key = `${spot.regionId}-${spot.view}`;
                return (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`activity-${key}`}
                      className="text-xs font-medium text-slate-600"
                    >
                      <span
                        className="mr-1.5 inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: spotColor(spot.intensity) }}
                        aria-hidden="true"
                      />
                      {spot.label}:
                    </label>
                    <textarea
                      id={`activity-${key}`}
                      rows={2}
                      maxLength={600}
                      value={activityTexts[key] ?? ""}
                      onChange={(e) =>
                        setActivityTexts((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder={`What were you doing when you first noticed pain in your ${spot.label.toLowerCase()}?`}
                      className="resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Intensity slider ───────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="intensity"
                className="text-sm font-medium text-slate-700"
              >
                Overall pain intensity
              </label>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: intensityColor(form.intensity) }}
              >
                {form.intensity}/10 &mdash; {intensityLabel(form.intensity)}
              </span>
            </div>
            <input
              id="intensity"
              type="range"
              min={1}
              max={10}
              step={1}
              value={form.intensity}
              onChange={(e) =>
                setField("intensity", parseInt(e.target.value, 10))
              }
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>1 – Barely noticeable</span>
              <span>10 – Worst possible</span>
            </div>
          </div>

          {/* ── Duration ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="duration"
              className="text-sm font-medium text-slate-700"
            >
              How long have you had this?{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </label>
            <select
              id="duration"
              required
              value={form.duration}
              onChange={(e) => setField("duration", e.target.value)}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="" disabled>
                Select a timeframe
              </option>
              {DURATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── Optional context ───────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="worseWith"
              className="text-sm font-medium text-slate-700"
            >
              What makes it worse?
              <span className="ml-1 font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="worseWith"
              value={form.worseWith}
              onChange={(e) => setField("worseWith", e.target.value)}
              maxLength={400}
              rows={2}
              placeholder="e.g. sitting at my desk, overhead pressing, looking down"
              className="resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="betterWith"
              className="text-sm font-medium text-slate-700"
            >
              What makes it better?
              <span className="ml-1 font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="betterWith"
              value={form.betterWith}
              onChange={(e) => setField("betterWith", e.target.value)}
              maxLength={400}
              rows={2}
              placeholder="e.g. heat, stretching, moving around, rest"
              className="resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* ── Consent line (HIPAA requirement) ──────────────────────── */}
          <p className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-500" />
            Your information is encrypted and only shared with your care
            provider.
          </p>

          {/* ── Submit ─────────────────────────────────────────────────── */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <SpinnerIcon className="h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              "Get My Assessment"
            )}
          </button>
        </form>
      </div>

      {/* ── Response panel ──────────────────────────────────────────────── */}
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Panel header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
            <SparkleIcon className="h-4 w-4 text-teal-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Clinical Assessment
            </p>
            <p className="text-xs text-slate-500">
              Powered by Claude · Educational guidance only
            </p>
          </div>
          {loading && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" />
            </div>
          )}
        </div>

        <div className="min-h-64 px-7 py-6">
          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <ErrorIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Empty state */}
          {!aiResponse && !error && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <BodyIcon className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-400">
                Mark your pain regions, describe what you were doing, and submit
                for your assessment.
              </p>
            </div>
          )}

          {/* Clinical assessment cards */}
          {aiResponse?.assessments && (
            <div className="flex flex-col gap-4">
              {aiResponse.assessments.map((item, i) => {
                const risk = item.compensation_chain_risk ?? "low";
                const riskStyle =
                  RISK_STYLES[risk] ?? RISK_STYLES.low;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    {/* Region + badges */}
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {item.region}
                      </p>
                      <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                        {CATEGORY_LABELS[item.movement_category] ??
                          item.movement_category}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${riskStyle.badge}`}
                      >
                        {riskStyle.label}
                      </span>
                    </div>

                    {/* Correlation notes */}
                    <p className="mb-3 text-sm leading-6 text-slate-700">
                      {item.correlation_notes}
                    </p>

                    {/* Muscles affected */}
                    {item.likely_muscles_affected?.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Likely tissues involved
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.likely_muscles_affected.map((m, j) => (
                            <span
                              key={j}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <p className="text-xs text-slate-400">
                This is educational guidance based on what you&apos;ve shared,
                not a medical diagnosis.
              </p>
            </div>
          )}
        </div>

        {/* Footer — booking CTA + save */}
        {done && aiResponse && (
          <div className="border-t border-slate-100 px-7 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Ready to address this with hands-on work?
              </p>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                Book a Session
                <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Save to history */}
            <div className="mt-4 border-t border-slate-100 pt-4">
              {savedId ? (
                <p className="flex items-center gap-2 text-xs text-teal-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  Saved to your history —{" "}
                  <Link
                    href="/dashboard"
                    className="underline hover:text-teal-700"
                  >
                    view it
                  </Link>
                </p>
              ) : user ? (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-xs font-medium text-slate-500 transition hover:text-teal-600 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save this session to my history"}
                </button>
              ) : (
                <p className="text-xs text-slate-400">
                  <Link
                    href="/auth/login"
                    className="font-medium text-teal-600 hover:text-teal-700"
                  >
                    Log in
                  </Link>{" "}
                  to save this session and track your pain over time.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a2.625 2.625 0 0 0-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

function BodyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
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

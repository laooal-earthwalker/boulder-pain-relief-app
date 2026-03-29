"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import BodyMap, { type PainSpot, type SpotSize, spotColor } from "./BodyMap";
import type { SessionComparison, ClinicalInsight } from "@/types/painmap";
import {
  addSession,
  getSessions,
  buildComparison,
  computeInsights,
} from "@/lib/painmap-client";

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

const DURATION_OPTIONS = [
  { value: "less-than-1-week", label: "Less than 1 week" },
  { value: "1-4-weeks", label: "1–4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months (chronic)" },
];

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
  duration: "",
  worseWith: "",
  betterWith: "",
};

// ── Activity slide-up modal ────────────────────────────────────────────────────

const ACTIVITY_MAX = 600;

function ActivityModal({
  spot,
  value,
  visible,
  onChange,
  onClose,
}: {
  spot: PainSpot;
  value: string;
  visible: boolean;
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => textareaRef.current?.focus(), 160);
      return () => clearTimeout(t);
    }
  }, [visible]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const remaining = ACTIVITY_MAX - value.length;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Activity context for ${spot.label}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Bottom sheet */}
      <div
        className={`relative w-full max-w-lg rounded-t-3xl bg-white px-5 pb-8 pt-4 shadow-2xl transition-transform duration-300 ease-out sm:mx-4 sm:rounded-3xl sm:pb-6 ${
          visible ? "translate-y-0" : "translate-y-full sm:translate-y-4"
        }`}
      >
        {/* Drag handle — mobile only */}
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />

        {/* Region label + question */}
        <div className="mb-4 flex items-start gap-3">
          <span
            className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: spotColor(spot.intensity) }}
            aria-hidden
          />
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">{spot.label}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              What were you doing when you first noticed pain here?
            </p>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={4}
          maxLength={ACTIVITY_MAX}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. sitting at my desk for hours, overhead pressing at the gym, looking down at my phone…"
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
        />

        {/* Character counter */}
        <p
          className={`mt-1.5 text-right text-xs tabular-nums ${
            remaining < 80 ? "text-amber-600" : "text-slate-400"
          }`}
        >
          {remaining} remaining
        </p>

        {/* Actions */}
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-500 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-teal-600 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const INTENSITY_COLORS = ["#FCD34D", "#F59E0B", "#F97316", "#EF4444", "#DC2626"];

// ── Main form component ────────────────────────────────────────────────────────

export default function PainToolForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [painSpots, setPainSpots] = useState<PainSpot[]>([]);
  const [currentSize, setCurrentSize] = useState<SpotSize>("regional");
  const [currentIntensity, setCurrentIntensity] = useState<number>(3);
  // Per-spot activity text: key = `${regionId}-${view}`
  const [activityTexts, setActivityTexts] = useState<Record<string, string>>({});

  // Slide-up activity modal
  const [modalData, setModalData] = useState<{ key: string; spot: PainSpot } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // AI response
  const [aiResponse, setAiResponse] = useState<AiAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Longitudinal tracking
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [sessionComparison, setSessionComparison] = useState<SessionComparison | null>(null);
  const [sessionInsights, setSessionInsights] = useState<ClinicalInsight[]>([]);

  // Duration field validation
  const [durationError, setDurationError] = useState(false);
  const durationRef = useRef<HTMLSelectElement>(null);

  // Auto-scroll to response panel on mobile after submission
  const responsePanelRef = useRef<HTMLDivElement>(null);

  // Sticky floating controls
  const bodyMapRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyDismissed, setStickyDismissed] = useState(false);

  // Initialise anonymous client token for longitudinal tracking
  useEffect(() => {
    let token = localStorage.getItem("painmap_token");
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem("painmap_token", token);
    }
    setClientToken(token);
  }, []);

  // Show bar only while body map figures are on screen
  useEffect(() => {
    const el = bodyMapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(entry.isIntersecting);
        if (!entry.isIntersecting) setStickyDismissed(false);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    if (key === "duration") setDurationError(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const openModal = useCallback((key: string, spot: PainSpot) => {
    setModalData({ key, spot });
    // Double rAF: first waits for React commit, second triggers CSS transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setModalVisible(true));
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => setModalData(null), 300);
  }, []);

  const handleToggle = useCallback((
    regionId: string,
    label: string,
    cx: number,
    cy: number,
    view: "front" | "back"
  ) => {
    const key = `${regionId}-${view}`;
    const existingSpot = painSpots.find(
      (s) => s.regionId === regionId && s.view === view
    );

    if (existingSpot) {
      // Remove spot — also dismiss modal if it's open for this spot
      if (modalData?.key === key) closeModal();
      setActivityTexts((at) => {
        const next = { ...at };
        delete next[key];
        return next;
      });
      setPainSpots((prev) =>
        prev.filter((s) => !(s.regionId === regionId && s.view === view))
      );
    } else {
      // Add spot, then open activity context modal
      const newSpot: PainSpot = {
        regionId,
        label,
        size: currentSize,
        intensity: currentIntensity,
        cx,
        cy,
        view,
      };
      setPainSpots((prev) => [...prev, newSpot]);
      openModal(key, newSpot);
    }
  }, [painSpots, modalData, closeModal, currentSize, currentIntensity, openModal]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.duration) {
      setDurationError(true);
      durationRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      durationRef.current?.focus();
      return;
    }
    setError(null);
    setAiResponse(null);
    setDone(false);
    setLoading(true);

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
          (json as { error?: string }).error ?? `Request failed (${res.status})`
        );
      }

      const data: AiAssessment = await res.json();
      setAiResponse(data);
      setDone(true);

      // Auto-save session (Supabase → localStorage fallback)
      try {
        const saved = await addSession({
          clientToken: clientToken ?? "",
          timestamp: new Date().toISOString(),
          spots: painSpots,
          duration: form.duration,
          worseWith: form.worseWith || undefined,
          betterWith: form.betterWith || undefined,
          figure: "male",
        });
        const allSessions = await getSessions();
        setSessionComparison(buildComparison(saved, allSessions));
        setSessionInsights(computeInsights(allSessions));
      } catch {
        // Non-fatal — tracking failure should not break the main flow
      }

      // Scroll response panel into view on mobile
      setTimeout(() => {
        responsePanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = painSpots.length > 0 && !loading;

  return (
    <>
      {/* Activity context modal */}
      {modalData && (
        <ActivityModal
          spot={modalData.spot}
          value={activityTexts[modalData.key] ?? ""}
          visible={modalVisible}
          onChange={(v) =>
            setActivityTexts((prev) => ({ ...prev, [modalData.key]: v }))
          }
          onClose={closeModal}
        />
      )}

      <div className="mx-auto grid max-w-6xl gap-3 px-3 py-2 sm:px-6 sm:py-4 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-8">
        {/* ── Form panel ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-4">

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* ── Step 1: Body map ────────────────────────────────────── */}
            <div className="flex flex-col gap-2">

              {/* Body map — ref used to control floating bar visibility */}
              <div ref={bodyMapRef} className="rounded-xl border border-slate-100 bg-slate-50 px-1 py-2 sm:px-3">
                <BodyMap
                  painSpots={painSpots}
                  onToggle={handleToggle}
                  currentSize={currentSize}
                  intensity={currentIntensity}
                />
              </div>

              {/* Intensity legend — desktop only (mobile sees it in floating bar) */}
              <div className="hidden sm:flex items-center gap-3 px-1">
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Pain Intensity
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    {INTENSITY_COLORS.map((color, i) => (
                      <span
                        key={i}
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[9px] text-slate-400">Mild</span>
                    <span className="text-[9px] text-slate-400">Severe</span>
                  </div>
                </div>
              </div>

              {/* Tap nudge — only shown when no spots placed */}
              {painSpots.length === 0 && (
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v4.59L7.3 9.24a.75.75 0 0 0-1.1 1.02l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tap any region on the body map above to mark pain
                </p>
              )}
            </div>

            {/* ── Step 2: Activity context summaries ──────────────────── */}
            {painSpots.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-semibold text-slate-700">
                  Step 2 &mdash; Activity context{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (optional but improves accuracy)
                  </span>
                </p>
                <div className="flex flex-col gap-2">
                  {painSpots.map((spot) => {
                    const key = `${spot.regionId}-${spot.view}`;
                    const text = activityTexts[key];
                    return (
                      <div
                        key={key}
                        className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                      >
                        <span
                          className="mt-1 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: spotColor(spot.intensity) }}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-700">
                            {spot.label}
                          </p>
                          {text ? (
                            <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                              {text}
                            </p>
                          ) : (
                            <p className="mt-0.5 text-xs italic text-slate-400">
                              No context added
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openModal(key, spot)}
                          className="shrink-0 rounded-full border border-teal-200 bg-white px-2.5 py-1 text-xs font-medium text-teal-600 transition hover:bg-teal-50"
                        >
                          {text ? "Edit" : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Duration ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="duration"
                className="text-sm font-bold text-slate-700"
              >
                How long have you had this?{" "}
                <span className="text-red-500" aria-hidden>
                  *
                </span>
              </label>
              <select
                ref={durationRef}
                id="duration"
                value={form.duration}
                onChange={(e) => setField("duration", e.target.value)}
                className={`rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-2 ${
                  durationError
                    ? "border-red-500 ring-2 ring-red-500/20 focus:border-red-500 focus:ring-red-500/20"
                    : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/20"
                }`}
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
              {durationError && (
                <p className="text-xs font-medium text-red-500">Required to submit</p>
              )}
            </div>

            {/* ── Optional context — side by side on larger screens ───── */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="worseWith"
                  className="text-sm font-medium text-slate-700"
                >
                  What makes it worse?{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="worseWith"
                  value={form.worseWith}
                  onChange={(e) => setField("worseWith", e.target.value)}
                  maxLength={400}
                  rows={2}
                  placeholder="e.g. sitting at desk, overhead pressing"
                  className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="betterWith"
                  className="text-sm font-medium text-slate-700"
                >
                  What makes it better?{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="betterWith"
                  value={form.betterWith}
                  onChange={(e) => setField("betterWith", e.target.value)}
                  maxLength={400}
                  rows={2}
                  placeholder="e.g. heat, stretching, moving around"
                  className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {/* ── Consent line (HIPAA) ────────────────────────────────── */}
            <p className="flex items-start gap-2 rounded-xl bg-teal-50 px-3 py-2.5 text-xs text-teal-700">
              <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Your information is encrypted and only shared with your care
              provider.
            </p>

            {/* ── Submit ──────────────────────────────────────────────── */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <SpinnerIcon className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>

        {/* ── Response panel — hidden on mobile until spots placed ────────── */}
        <div
          ref={responsePanelRef}
          className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm scroll-mt-4 ${
            painSpots.length === 0 && !aiResponse && !loading && !error ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-7">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
              <SparkleIcon className="h-4 w-4 text-teal-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Clinical Assessment
              </p>
              <p className="text-xs text-teal-600">
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

          <div className="min-h-64 px-5 py-6 sm:px-7">
            {/* Error state */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <ErrorIcon className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Pre-submission empty state */}
            {!aiResponse && !error && (
              <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                  <BodyIcon className="h-7 w-7 text-slate-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Your assessment will appear here
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Mark pain regions and complete the form to get started.
                  </p>
                </div>
              </div>
            )}

            {/* Clinical assessment cards */}
            {aiResponse?.assessments && (
              <div className="flex flex-col gap-4">
                {aiResponse.assessments.map((item, i) => {
                  const risk = item.compensation_chain_risk ?? "low";
                  const riskStyle = RISK_STYLES[risk] ?? RISK_STYLES.low;
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {item.region}
                        </p>
                        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                          {CATEGORY_LABELS[item.movement_category] ??
                            item.movement_category}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskStyle.badge}`}
                        >
                          {riskStyle.label}
                        </span>
                      </div>
                      <p className="mb-3 text-sm leading-relaxed text-slate-700">
                        {item.correlation_notes}
                      </p>
                      {item.likely_muscles_affected?.length > 0 && (
                        <div>
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Likely tissues involved
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.likely_muscles_affected.map((m, j) => (
                              <span
                                key={j}
                                className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs text-slate-600"
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
                  Educational guidance based on what you&apos;ve shared — not a
                  medical diagnosis.
                </p>
              </div>
            )}
          </div>

          {/* ── Session comparison (View 3) ──────────────────────────── */}
          {done && sessionComparison && (
            <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
              <p className="mb-3 text-sm font-semibold text-slate-700">
                {sessionComparison.previousSession
                  ? "This session vs. your last"
                  : "First session recorded"}
              </p>

              {sessionComparison.previousSession ? (
                <div className="flex flex-col gap-2">
                  {sessionComparison.newRegions.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-red-500">
                        New regions
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionComparison.newRegions.map((r) => (
                          <span
                            key={r}
                            className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"
                          >
                            + {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sessionComparison.resolvedRegions.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-teal-600">
                        Resolved
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionComparison.resolvedRegions.map((r) => (
                          <span
                            key={r}
                            className="rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sessionComparison.persistentRegions.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">
                        Ongoing
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {sessionComparison.persistentRegions.map((r) => (
                          <span
                            key={r.label}
                            className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700"
                          >
                            {r.label}
                            <span className="opacity-60">
                              · {r.sessionCount} session{r.sessionCount !== 1 ? "s" : ""}
                              {r.intensityTrend === "down" ? " ↓" : r.intensityTrend === "up" ? " ↑" : ""}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sessionComparison.newRegions.length === 0 &&
                    sessionComparison.resolvedRegions.length === 0 &&
                    sessionComparison.persistentRegions.length === 0 && (
                      <p className="text-sm text-slate-400">No change from last session.</p>
                    )}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Your pain pattern is now being tracked. Come back after your next session to see how things change.
                </p>
              )}

              {/* History / patterns links */}
              <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3">
                <Link
                  href="/painmap/history"
                  className="text-xs font-medium text-teal-600 hover:text-teal-700"
                >
                  View full history →
                </Link>
                <Link
                  href="/painmap/patterns"
                  className="text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Pattern analysis →
                </Link>
              </div>
            </div>
          )}

          {/* ── Clinical insights (3+ sessions) ─────────────────────── */}
          {done && sessionInsights.length > 0 && (
            <div className="border-t border-amber-100 bg-amber-50 px-5 py-5 sm:px-7">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">!</span>
                <p className="text-sm font-semibold text-amber-900">Pattern Detected</p>
              </div>
              <div className="flex flex-col gap-3">
                {sessionInsights.map((insight, i) => (
                  <p key={i} className="text-sm leading-relaxed text-amber-800">
                    {insight.message}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Footer — booking CTA + save */}
          {done && aiResponse && (
            <div className="border-t border-slate-100 px-5 py-5 sm:px-7">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Ready to address this with hands-on work?
                </p>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Book a Session
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Sticky floating controls bar ─────────────────────────────────── */}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 transition-all duration-200"
        style={{
          opacity: showStickyBar && !stickyDismissed ? 1 : 0,
          transform: showStickyBar && !stickyDismissed ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div
          className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl px-4 py-3 shadow-2xl"
          style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* Spread size pills */}
          <div className="flex gap-1">
            {(["pinpoint", "regional", "diffuse"] as SpotSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setCurrentSize(size)}
                className="rounded-full px-2.5 py-1 text-xs font-semibold capitalize transition"
                style={{
                  background: currentSize === size ? "#0d9488" : "rgba(255,255,255,0.08)",
                  color: currentSize === size ? "#fff" : "#94a3b8",
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px shrink-0" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Intensity dots — always full color */}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => {
              const color = INTENSITY_COLORS[n - 1];
              const selected = n === currentIntensity;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCurrentIntensity(n)}
                  title={["Barely noticeable", "Mild", "Moderate", "Significant", "Severe"][n - 1]}
                  className="h-5 w-5 rounded-full focus:outline-none"
                  aria-pressed={selected}
                  style={{
                    backgroundColor: color,
                    opacity: selected ? 1 : 0.6,
                    transform: selected ? "scale(1.4)" : "scale(0.9)",
                    transition: "transform 0.15s, opacity 0.15s",
                    ["--dot-color" as string]: color,
                    animation: selected ? "intensity-ring-pulse 1.4s ease-in-out infinite" : "none",
                  } as React.CSSProperties}
                >
                  <span className="sr-only">{n}</span>
                </button>
              );
            })}
            </div>
            <div className="flex justify-between px-0.5">
              <span className="text-[9px] leading-none" style={{ color: "rgba(255,255,255,0.35)" }}>Mild</span>
              <span className="text-[9px] leading-none" style={{ color: "rgba(255,255,255,0.35)" }}>Severe</span>
            </div>
          </div>

          {/* Dismiss */}
          <button
            type="button"
            onClick={() => setStickyDismissed(true)}
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition"
            style={{ color: "#64748b" }}
            aria-label="Dismiss floating controls"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function LockIcon({ className }: { className?: string }) {
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
        d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
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
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258a2.625 2.625 0 0 0-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BodyIcon({ className }: { className?: string }) {
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
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
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
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
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

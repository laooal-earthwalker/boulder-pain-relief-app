"use client";

import Link from "next/link";
import { useState } from "react";

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

const DURATION_OPTIONS = [
  { value: "less-than-1-week", label: "Less than 1 week" },
  { value: "1-4-weeks", label: "1–4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "6-plus-months", label: "6+ months (chronic)" },
];

interface FormState {
  location: string;
  intensity: number;
  duration: string;
  worseWith: string;
  betterWith: string;
}

const INITIAL_FORM: FormState = {
  location: "",
  intensity: 5,
  duration: "",
  worseWith: "",
  betterWith: "",
};

// ── Intensity helpers ────────────────────────────────────────────────────────

function intensityLabel(n: number): string {
  if (n <= 2) return "Very mild";
  if (n <= 4) return "Mild";
  if (n <= 6) return "Moderate";
  if (n <= 8) return "Significant";
  return "Severe";
}

function intensityColor(n: number): string {
  if (n <= 3) return "#16a34a"; // green-600
  if (n <= 5) return "#ca8a04"; // yellow-600
  if (n <= 7) return "#ea580c"; // orange-600
  return "#dc2626"; // red-600
}

// ── Minimal Markdown renderer ─────────────────────────────────────────────────

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function MarkdownResponse({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, i) => {
        const lines = block.trim().split("\n");
        const first = lines[0];

        // Section heading: ## or ###
        if (/^#{1,3} /.test(first)) {
          const headingText = first.replace(/^#{1,3} /, "");
          return (
            <h3
              key={i}
              className="mt-1 text-sm font-semibold uppercase tracking-wide text-teal-700"
            >
              {headingText}
            </h3>
          );
        }

        // Numbered list: 1. 2. 3.
        if (lines.every((l) => /^\d+\.\s/.test(l.trim()) || !l.trim())) {
          return (
            <ol key={i} className="flex flex-col gap-3">
              {lines
                .filter((l) => l.trim())
                .map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                      {j + 1}
                    </span>
                    <span className="leading-6">
                      <InlineMarkdown
                        text={item.replace(/^\d+\.\s+/, "")}
                      />
                    </span>
                  </li>
                ))}
            </ol>
          );
        }

        // Bullet list: - or •
        if (lines.every((l) => /^[-•*]\s/.test(l.trim()) || !l.trim())) {
          return (
            <ul key={i} className="flex flex-col gap-2">
              {lines
                .filter((l) => l.trim())
                .map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-sm text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    <span className="leading-6">
                      <InlineMarkdown text={item.replace(/^[-•*]\s+/, "")} />
                    </span>
                  </li>
                ))}
            </ul>
          );
        }

        // Horizontal rule
        if (/^---+$/.test(first)) {
          return <hr key={i} className="border-slate-200" />;
        }

        // Default: paragraph
        return (
          <p key={i} className="text-sm leading-6 text-slate-700">
            <InlineMarkdown text={block.replace(/\n/g, " ")} />
          </p>
        );
      })}
    </div>
  );
}

// ── Main form component ───────────────────────────────────────────────────────

export default function PainToolForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [response, setResponse] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResponse("");
    setDone(false);
    setStreaming(true);

    try {
      const res = await fetch("/api/ai/pain-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          (json as { error?: string }).error ?? `Request failed (${res.status})`
        );
      }

      if (!res.body) throw new Error("No response stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        const chunk = decoder.decode(value, { stream: true });
        setResponse((prev) => prev + chunk);
      }

      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
    } finally {
      setStreaming(false);
    }
  }

  const canSubmit =
    form.location.trim().length > 0 && form.duration !== "" && !streaming;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-10">
      {/* ── Form panel ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">
          Describe your pain
        </h2>
        <p className="mb-7 text-sm text-slate-500">
          The more specific you are, the more useful the response.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="location"
              className="text-sm font-medium text-slate-700"
            >
              Where is the pain?{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </label>
            <input
              id="location"
              type="text"
              required
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              maxLength={200}
              placeholder="e.g. left side of neck, between shoulder blades, lower back on the right"
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Intensity */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="intensity"
                className="text-sm font-medium text-slate-700"
              >
                Pain intensity
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

          {/* Duration */}
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

          {/* Worse with */}
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
              placeholder="e.g. sitting at my desk, overhead pressing, looking down at my phone"
              className="resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Better with */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {streaming ? (
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
      <div className="flex flex-col gap-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Panel header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-7 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100">
            <SparkleIcon className="h-4 w-4 text-teal-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">
              Boulder Pain Relief — AI Assessment
            </p>
            <p className="text-xs text-slate-500">
              Powered by Claude · Educational guidance only
            </p>
          </div>
          {streaming && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-teal-500" />
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="min-h-64 px-7 py-6">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <ErrorIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {!response && !error && (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <BodyIcon className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-400">
                Fill out the form and submit to get your personalized
                assessment.
              </p>
            </div>
          )}

          {response && (
            <div className="relative">
              <MarkdownResponse text={response} />
              {/* Blinking cursor while streaming */}
              {streaming && (
                <span className="inline-block h-4 w-0.5 animate-pulse bg-teal-600" />
              )}
            </div>
          )}
        </div>

        {/* Booking CTA — shown when response is complete */}
        {done && response && (
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
          </div>
        )}
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

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
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
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

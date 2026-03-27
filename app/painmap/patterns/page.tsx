"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PatternData, RegionFrequency, ClinicalInsight, PainMapSession } from "@/types/painmap";
import { computeRegionFrequencies, computeInsights } from "@/lib/painmap-insights";

const TREND_CONFIG = {
  improving: { label: "Improving", color: "text-teal-600", bg: "bg-teal-50", icon: "↓" },
  worsening: { label: "Worsening", color: "text-red-600", bg: "bg-red-50", icon: "↑" },
  stable:    { label: "Stable",    color: "text-amber-600", bg: "bg-amber-50", icon: "→" },
  insufficient_data: { label: "New",    color: "text-slate-400", bg: "bg-slate-50", icon: "·" },
};

function FrequencyBar({ freq }: { freq: RegionFrequency }) {
  const pct = Math.round((freq.count / freq.total) * 100);
  const trend = TREND_CONFIG[freq.trend];

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-medium text-slate-800">{freq.label}</span>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${trend.color} ${trend.bg}`}>
            {trend.icon} {trend.label}
          </span>
          <span className="text-xs text-slate-400">
            {freq.count} of {freq.total} sessions
          </span>
        </div>
      </div>

      {/* Frequency bar */}
      <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-teal-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Intensity dots history */}
      {freq.intensityHistory.length > 1 && (
        <div className="mt-2.5 flex items-center gap-1">
          <span className="shrink-0 text-[10px] text-slate-400">Intensity</span>
          <div className="flex items-end gap-0.5">
            {freq.intensityHistory.map((v, i) => {
              const colors = ["bg-teal-400", "bg-yellow-400", "bg-orange-400", "bg-red-500", "bg-purple-600"];
              return (
                <div
                  key={i}
                  title={`Session ${i + 1}: ${v}/5`}
                  className={`w-3 rounded-sm ${colors[v - 1] ?? "bg-slate-300"}`}
                  style={{ height: `${v * 4 + 4}px` }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: { insight: ClinicalInsight }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white font-bold">!</span>
        <span className="text-sm font-semibold text-amber-900">Pattern Detected</span>
      </div>
      <p className="text-sm leading-relaxed text-amber-800">{insight.message}</p>
      {insight.regions.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {insight.regions.map((r) => (
            <span
              key={r}
              className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-xs font-medium text-amber-700"
            >
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PainMapPatternsPage() {
  const [data, setData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("painmap-sessions");
      const all: PainMapSession[] = raw ? JSON.parse(raw) : [];
      setData({
        frequencies: computeRegionFrequencies(all),
        insights: computeInsights(all),
        totalSessions: all.length,
      });
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  const topFrequencies = data?.frequencies.filter((f) => f.count > 0) ?? [];
  const insights = data?.insights ?? [];

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-300">PainMap</p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Pattern Analysis
        </h1>
        <p className="text-sm text-teal-100/70">
          How your pain regions compare across all your sessions.
        </p>
      </div>

      {/* Nav */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <Link href="/painmap" className="text-sm font-medium text-teal-600 hover:text-teal-700">
          ← New Session
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/painmap/history" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Session History →
        </Link>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Analyzing patterns…</p>
          </div>
        )}

        {!loading && topFrequencies.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <svg className="h-8 w-8 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-600">No patterns yet</p>
              <p className="mt-1 text-sm text-slate-400">Complete at least 2 sessions to see pattern analysis.</p>
            </div>
            <Link
              href="/painmap"
              className="mt-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Start a Session
            </Link>
          </div>
        )}

        {topFrequencies.length > 0 && (
          <div className="flex flex-col gap-6">
            {/* Session count */}
            <p className="text-sm text-slate-500">
              Based on {data!.totalSessions} session{data!.totalSessions !== 1 ? "s" : ""}
            </p>

            {/* Clinical insights — shown first if available */}
            {insights.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Clinical Insights
                </h2>
                <div className="flex flex-col gap-3">
                  {insights.map((insight, i) => (
                    <InsightCard key={i} insight={insight} />
                  ))}
                </div>
              </section>
            )}

            {/* Region frequency rankings */}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Region Frequency
              </h2>
              <div className="flex flex-col gap-2.5">
                {topFrequencies.map((freq) => (
                  <FrequencyBar key={freq.label} freq={freq} />
                ))}
              </div>
            </section>

            {data!.totalSessions < 3 && (
              <p className="text-center text-xs text-slate-400">
                Complete {3 - data!.totalSessions} more session{3 - data!.totalSessions !== 1 ? "s" : ""} to unlock clinical insights.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

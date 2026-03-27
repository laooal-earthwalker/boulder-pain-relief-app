"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MiniBodyMap from "@/components/pain-tool/MiniBodyMap";
import ConnectedTimeline from "@/components/pain-tool/ConnectedTimeline";
import type { PainMapSession } from "@/types/painmap";

function spotColor(intensity: number): string {
  if (intensity <= 1) return "#5eead4";
  if (intensity <= 2) return "#fbbf24";
  if (intensity <= 3) return "#f97316";
  if (intensity <= 4) return "#ef4444";
  return "#7c3aed";
}

function intensityLabel(n: number) {
  return ["Barely noticeable", "Mild", "Moderate", "Significant", "Severe"][n - 1] ?? "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PainMapHistoryPage() {
  const [sessions, setSessions] = useState<PainMapSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("painmap-sessions");
      const all: PainMapSession[] = raw ? JSON.parse(raw) : [];
      const sorted = [...all].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setSessions(sorted);
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal-300">PainMap</p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Session History
        </h1>
        <p className="text-sm text-teal-100/70">Every session you&apos;ve recorded, chronologically.</p>
      </div>

      {/* Nav */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3">
        <Link href="/painmap" className="text-sm font-medium text-teal-600 hover:text-teal-700">
          ← New Session
        </Link>
        <span className="text-slate-300">|</span>
        <Link href="/painmap/patterns" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          Pattern Analysis →
        </Link>
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading sessions…</p>
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <svg className="h-8 w-8 text-slate-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-slate-600">No sessions yet</p>
              <p className="mt-1 text-sm text-slate-400">Complete a PainMap session to start your history.</p>
            </div>
            <Link
              href="/painmap"
              className="mt-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Start a Session
            </Link>
          </div>
        )}

        {sessions.length > 0 && (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-slate-500">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} recorded
            </p>

            {/* ── Connected timeline visualization ── */}
            {sessions.length >= 2 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex flex-wrap items-baseline gap-3">
                  <h2 className="text-sm font-semibold text-slate-700">Pain Region Timeline</h2>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-0.5 w-4 rounded-full bg-[#2DD4BF]" />
                      Improving
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-0.5 w-4 rounded-full bg-[#F59E0B]" />
                      Stable
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="inline-block h-0.5 w-4 rounded-full bg-[#FB7185]" />
                      Worsening
                    </span>
                  </div>
                  <p className="ml-auto text-[10px] text-slate-400">Hover a line for details</p>
                </div>
                {/* Timeline is newest-last (chronological left→right) */}
                <ConnectedTimeline
                  sessions={[...sessions].sort(
                    (a, b) =>
                      new Date(a.timestamp).getTime() -
                      new Date(b.timestamp).getTime()
                  )}
                />
              </div>
            )}

            {/* ── Session cards ── */}
            <div className="flex flex-col gap-4">

            {sessions.map((session, idx) => {
              const maxIntensity = session.spots.reduce(
                (m, s) => Math.max(m, s.intensity), 0
              );
              const uniqueRegions = [
                ...new Set(session.spots.map((s) => s.label)),
              ];

              return (
                <div
                  key={session.id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  {/* Mini body map */}
                  <div className="shrink-0">
                    <MiniBodyMap spots={session.spots} width={56} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        Session {sessions.length - idx}
                      </span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-500">{formatDate(session.timestamp)}</span>
                      {maxIntensity > 0 && (
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                          style={{ backgroundColor: spotColor(maxIntensity) }}
                        >
                          {intensityLabel(maxIntensity)}
                        </span>
                      )}
                    </div>

                    {/* Pain points */}
                    <div className="flex flex-wrap gap-1.5">
                      {uniqueRegions.map((label) => {
                        const spot = session.spots.find((s) => s.label === label);
                        return (
                          <span
                            key={label}
                            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600"
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: spotColor(spot?.intensity ?? 3) }}
                            />
                            {label}
                          </span>
                        );
                      })}
                    </div>

                    {/* Duration */}
                    {session.duration && (
                      <p className="mt-2 text-xs text-slate-400">
                        Duration: {session.duration.replace(/-/g, " ")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            </div>{/* end session cards */}
          </div>
        )}
      </div>
    </div>
  );
}

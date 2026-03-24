"use client";

import { useState } from "react";
import type { PainReport, PainSpotRecord, AiAssessment } from "@/types/database";
import { spotColor } from "@/components/pain-tool/BodyMap";

const DURATION_LABELS: Record<string, string> = {
  "less-than-1-week": "Less than 1 week",
  "1-4-weeks": "1–4 weeks",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  "6-plus-months": "6+ months (chronic)",
};

interface Props {
  reports: PainReport[];
  submittedMap: Record<string, string>;
}

export default function PainHistory({ reports, submittedMap }: Props) {
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [localStatus, setLocalStatus] =
    useState<Record<string, string>>(submittedMap);

  async function submitReport(reportId: string) {
    setSubmitting(reportId);
    try {
      const res = await fetch(`/api/pain-reports/${reportId}/submit`, {
        method: "POST",
      });
      if (res.ok) {
        setLocalStatus((prev) => ({ ...prev, [reportId]: "pending" }));
      }
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((report) => {
        const status = localStatus[report.id];
        const spots = report.spots as PainSpotRecord[];
        const date = new Date(report.reported_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div
            key={report.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                {/* Date + duration */}
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {date}
                  </p>
                  {report.duration && (
                    <span className="text-xs text-slate-400">
                      · {DURATION_LABELS[report.duration] ?? report.duration}
                    </span>
                  )}
                </div>

                {/* Pain spots */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {spots.map((spot, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        borderColor: spotColor(spot.intensity),
                        color: spotColor(spot.intensity),
                        backgroundColor: `${spotColor(spot.intensity)}14`,
                      }}
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: spotColor(spot.intensity) }}
                      />
                      {spot.label}
                      <span className="opacity-60">
                        &middot; {spot.size} &middot; {spot.intensity}/10
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <div className="shrink-0">
                {status ? (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      status === "reviewed"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                    {status === "reviewed"
                      ? "Reviewed by practitioner"
                      : "Sent to practitioner"}
                  </span>
                ) : (
                  <button
                    onClick={() => submitReport(report.id)}
                    disabled={submitting === report.id}
                    className="rounded-full border border-teal-500 px-3 py-1.5 text-xs font-semibold text-teal-600 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting === report.id
                      ? "Sending…"
                      : "Submit to practitioner"}
                  </button>
                )}
              </div>
            </div>

            {/* AI clinical interpretation */}
            {report.ai_interpretation?.assessments && report.ai_interpretation.assessments.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-600">
                  View clinical assessment
                </summary>
                <div className="mt-2 flex flex-col gap-2">
                  {(report.ai_interpretation.assessments as AiAssessment[]).map((a, i) => (
                    <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{a.region}</p>
                        <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                          {a.movement_category}
                        </span>
                        <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                          a.compensation_chain_risk === "high"
                            ? "bg-red-50 text-red-700"
                            : a.compensation_chain_risk === "medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-teal-50 text-teal-700"
                        }`}>
                          {a.compensation_chain_risk} risk
                        </span>
                      </div>
                      <p className="mb-2 text-xs text-slate-500">{a.correlation_notes}</p>
                      <div className="flex flex-wrap gap-1">
                        {a.likely_muscles_affected.map((m, j) => (
                          <span key={j} className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-600">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Optional notes */}
            {(report.worse_with || report.better_with) && (
              <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-100 pt-3">
                {report.worse_with && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Worse with:</span>{" "}
                    {report.worse_with}
                  </p>
                )}
                {report.better_with && (
                  <p className="text-xs text-slate-500">
                    <span className="font-medium">Better with:</span>{" "}
                    {report.better_with}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
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
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

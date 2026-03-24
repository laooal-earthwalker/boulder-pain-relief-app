"use client";

import { useState } from "react";
import type { SubmittedReportWithDetails, PainSpotRecord } from "@/types/database";
import { spotColor } from "@/components/pain-tool/BodyMap";

const DURATION_LABELS: Record<string, string> = {
  "less-than-1-week": "Less than 1 week",
  "1-4-weeks": "1–4 weeks",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  "6-plus-months": "6+ months (chronic)",
};

interface Props {
  reports: SubmittedReportWithDetails[];
}

export default function PractitionerReports({ reports }: Props) {
  const [marking, setMarking] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<Record<string, string>>({});

  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">
          No reports submitted by clients yet.
        </p>
      </div>
    );
  }

  async function markReviewed(submittedId: string) {
    setMarking(submittedId);
    try {
      await fetch(`/api/pain-reports/review/${submittedId}`, {
        method: "PATCH",
      });
      setLocalStatus((prev) => ({ ...prev, [submittedId]: "reviewed" }));
    } finally {
      setMarking(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((r) => {
        const report = r.pain_reports;
        const client = report?.client_profiles;
        const status = localStatus[r.id] ?? r.status;
        const spots = (report?.spots ?? []) as PainSpotRecord[];
        const submittedDate = new Date(r.submitted_at).toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric", year: "numeric" }
        );

        return (
          <div
            key={r.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                {/* Client info */}
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">
                    {client?.full_name ?? "Unknown client"}
                  </p>
                  <span className="text-xs text-slate-400">
                    {client?.email}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">
                  Submitted {submittedDate}
                  {report?.duration
                    ? ` · ${DURATION_LABELS[report.duration] ?? report.duration}`
                    : ""}
                </p>

                {/* Pain spots */}
                <div className="mt-3 flex flex-wrap gap-1.5">
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
                      {spot.label} &middot; {spot.size} &middot;{" "}
                      {spot.intensity}/10
                    </span>
                  ))}
                </div>

                {/* Worse / better */}
                {(report?.worse_with || report?.better_with) && (
                  <div className="mt-3 flex flex-wrap gap-4">
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

              {/* Status + review action */}
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    status === "reviewed"
                      ? "bg-teal-50 text-teal-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {status === "reviewed" ? "Reviewed" : "Pending"}
                </span>
                {status !== "reviewed" && (
                  <button
                    onClick={() => markReviewed(r.id)}
                    disabled={marking === r.id}
                    className="text-xs text-slate-400 transition hover:text-teal-600 disabled:opacity-50"
                  >
                    {marking === r.id ? "Saving…" : "Mark as reviewed"}
                  </button>
                )}
              </div>
            </div>

            {/* AI clinical interpretation */}
            {report?.ai_interpretation?.assessments && report.ai_interpretation.assessments.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-xs font-medium text-slate-400 hover:text-slate-600">
                  View clinical assessment
                </summary>
                <div className="mt-2 flex flex-col gap-2">
                  {report.ai_interpretation.assessments.map((a, i) => (
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
          </div>
        );
      })}
    </div>
  );
}

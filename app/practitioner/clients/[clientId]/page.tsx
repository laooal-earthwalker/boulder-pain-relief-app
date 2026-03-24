import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/hipaa/auditLog";
import { spotColor } from "@/components/pain-tool/BodyMap";
import BodyThumbnail from "@/components/practitioner/BodyThumbnail";
import type { PainSpotRecord } from "@/types/database";

export const metadata: Metadata = { title: "Client Detail" };

const DURATION_LABELS: Record<string, string> = {
  "less-than-1-week": "< 1 week",
  "1-4-weeks": "1–4 weeks",
  "1-3-months": "1–3 months",
  "3-6-months": "3–6 months",
  "6-plus-months": "6+ months",
};

const RISK_COLORS = {
  low: "bg-teal-50 text-teal-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

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

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  // Verify client exists and has submitted reports (RLS enforces practitioner-only access)
  const { data: profile } = await supabase
    .from("client_profiles")
    .select("full_name, email, notes, created_at")
    .eq("id", clientId)
    .single();

  if (!profile) notFound();

  // Get all submitted pain reports for this client, with full data
  const { data: submissions } = await supabase
    .from("submitted_reports")
    .select(
      `
      id, status, submitted_at, reviewed_at,
      pain_reports (
        id, reported_at, spots, activity_notes, ai_interpretation,
        overall_intensity, duration, worse_with, better_with
      )
    `
    )
    .eq("client_id", clientId)
    .order("submitted_at", { ascending: false });

  // Audit: log this practitioner view (user ID only — no client name/email in log)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      "unknown";
    await logAuditEvent(user.id, "practitioner_viewed_client", ip);
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/practitioner"
            className="mb-4 inline-flex items-center gap-1 text-xs font-medium text-teal-300/70 hover:text-teal-200"
          >
            ← All Clients
          </Link>
          <h1 className="text-2xl font-semibold text-white">
            {profile.full_name ?? profile.email}
          </h1>
          <p className="mt-1 text-sm text-teal-200/70">
            {submissions?.length ?? 0} submitted report
            {submissions?.length !== 1 ? "s" : ""} · Client since{" "}
            {new Date(profile.created_at ?? "").toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl space-y-6 px-6 py-10">
        {/* Client notes */}
        {profile.notes && (
          <div className="rounded-2xl border border-teal-100 bg-teal-50 px-5 py-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
              Client Notes
            </p>
            <p className="text-sm text-slate-700">{profile.notes}</p>
          </div>
        )}

        {/* Pain timeline */}
        {!submissions || submissions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-400">No reports yet.</p>
          </div>
        ) : (
          submissions.map((sub) => {
            const report = (sub.pain_reports as unknown) as {
              id: string;
              reported_at: string;
              spots: PainSpotRecord[];
              activity_notes: Array<{
                regionId: string;
                label: string;
                activityText: string;
              }>;
              ai_interpretation: {
                assessments?: Array<{
                  region: string;
                  movement_category: string;
                  likely_muscles_affected: string[];
                  compensation_chain_risk: "low" | "medium" | "high";
                  correlation_notes: string;
                }>;
              } | null;
              overall_intensity: number | null;
              duration: string | null;
              worse_with: string | null;
              better_with: string | null;
            } | null;

            if (!report) return null;

            const date = new Date(report.reported_at).toLocaleDateString(
              "en-US",
              { weekday: "short", month: "short", day: "numeric", year: "numeric" }
            );

            return (
              <div
                key={sub.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                {/* Report header */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    {report.spots?.length > 0 && (
                      <BodyThumbnail spots={report.spots} width={36} />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {date}
                      </p>
                      {report.duration && (
                        <p className="text-xs text-slate-400">
                          {DURATION_LABELS[report.duration] ?? report.duration}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      sub.status === "reviewed"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {sub.status === "reviewed" ? "Reviewed" : "Pending"}
                  </span>
                </div>

                <div className="px-6 py-5 space-y-5">
                  {/* Pain spots */}
                  <div className="flex flex-wrap gap-1.5">
                    {report.spots?.map((spot, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          borderColor: spotColor(spot.intensity),
                          color: spotColor(spot.intensity),
                          backgroundColor: `${spotColor(spot.intensity)}12`,
                        }}
                      >
                        {spot.label} · {spot.intensity}/10
                      </span>
                    ))}
                  </div>

                  {/* Activity context */}
                  {report.activity_notes?.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Activity Context
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {report.activity_notes.map((note, i) =>
                          note.activityText ? (
                            <p key={i} className="text-sm text-slate-700">
                              <span className="font-medium">{note.label}:</span>{" "}
                              {note.activityText}
                            </p>
                          ) : null
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI clinical interpretation */}
                  {report.ai_interpretation?.assessments && (
                    <div>
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Clinical Assessment
                      </p>
                      <div className="flex flex-col gap-3">
                        {report.ai_interpretation.assessments.map((a, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                          >
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-sm text-slate-900">
                                {a.region}
                              </p>
                              <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                                {CATEGORY_LABELS[a.movement_category] ??
                                  a.movement_category}
                              </span>
                              <span
                                className={`rounded px-2 py-0.5 text-xs font-semibold ${
                                  RISK_COLORS[a.compensation_chain_risk] ??
                                  "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {a.compensation_chain_risk} risk
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">
                              {a.correlation_notes}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {a.likely_muscles_affected.map((m, j) => (
                                <span
                                  key={j}
                                  className="rounded bg-white border border-slate-200 px-1.5 py-0.5 text-xs text-slate-600"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Worse/better context */}
                  {(report.worse_with || report.better_with) && (
                    <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-4">
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

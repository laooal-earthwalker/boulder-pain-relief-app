import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BodyThumbnail from "@/components/practitioner/BodyThumbnail";
import type { PainSpotRecord } from "@/types/database";

export const metadata: Metadata = { title: "Practitioner Dashboard" };

export default async function PractitionerPage() {
  const supabase = await createClient();

  // ── Today's appointments (from Acuity webhook) ────────────────────────────
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const { data: todaysAppointments } = await supabase
    .from("appointments")
    .select("id, appointment_at, client_id, summary_json")
    .gte("appointment_at", todayStart.toISOString())
    .lt("appointment_at", todayEnd.toISOString())
    .order("appointment_at");

  // Enrich appointments with client names where available
  const enrichedAppointments = await Promise.all(
    (todaysAppointments ?? []).map(async (appt) => {
      if (!appt.client_id) return { ...appt, clientName: null };
      const { data: cp } = await supabase
        .from("client_profiles")
        .select("full_name")
        .eq("id", appt.client_id)
        .single();
      return { ...appt, clientName: cp?.full_name ?? null };
    })
  );

  // ── Client list (distinct clients with submitted reports) ─────────────────
  const { data: allSubmitted } = await supabase
    .from("submitted_reports")
    .select(
      `
      client_id,
      submitted_at,
      status,
      pain_reports ( reported_at, spots ),
      client_profiles ( full_name, email )
    `
    )
    .order("submitted_at", { ascending: false });

  // Deduplicate by client — keep most recent submission per client
  const clientMap = new Map<
    string,
    (typeof allSubmitted extends (infer T)[] | null ? T : never) & {
      pendingCount?: number;
    }
  >();
  const pendingCounts = new Map<string, number>();

  for (const row of allSubmitted ?? []) {
    const cid = row.client_id as string;
    if (!clientMap.has(cid)) {
      clientMap.set(cid, row);
    }
    if (row.status === "pending") {
      pendingCounts.set(cid, (pendingCounts.get(cid) ?? 0) + 1);
    }
  }

  const clients = Array.from(clientMap.values());
  const pendingTotal = (allSubmitted ?? []).filter(
    (r) => r.status === "pending"
  ).length;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
            Practitioner Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Client Overview
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className="text-sm text-teal-200/70">
              {clients.length} client{clients.length !== 1 ? "s" : ""} with
              submitted reports
            </p>
            {pendingTotal > 0 && (
              <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                {pendingTotal} pending review
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
        {/* ── Today's Sessions ─────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Today&apos;s Sessions
          </h2>

          {enrichedAppointments.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-sm text-slate-400">
                No appointments today — or Acuity webhook not yet configured.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                See{" "}
                <code className="rounded bg-slate-100 px-1">
                  HIPAA_CHECKLIST.md
                </code>{" "}
                for setup instructions.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {enrichedAppointments.map((appt) => {
                const time = new Date(appt.appointment_at).toLocaleTimeString(
                  "en-US",
                  { hour: "numeric", minute: "2-digit" }
                );
                const summary = appt.summary_json as {
                  session_note?: string;
                  intensity_trend?: string;
                  compensation_risk_level?: string;
                } | null;

                return (
                  <div
                    key={appt.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">
                          {time}
                        </p>
                        <p className="mt-0.5 font-semibold text-slate-900">
                          {appt.clientName ?? "Unmatched client"}
                        </p>
                        {appt.client_id && (
                          <Link
                            href={`/practitioner/clients/${appt.client_id}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
                          >
                            View full history →
                          </Link>
                        )}
                      </div>
                    </div>

                    {summary?.session_note && (
                      <div className="mt-3 rounded-xl bg-teal-50 px-4 py-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
                          Pre-Session Note (AI)
                        </p>
                        <p className="text-sm leading-6 text-slate-700">
                          {summary.session_note}
                        </p>
                        {summary.intensity_trend && (
                          <p className="mt-2 text-xs text-slate-500">
                            Intensity trend:{" "}
                            <span
                              className={`font-semibold ${
                                summary.intensity_trend === "escalating"
                                  ? "text-red-600"
                                  : summary.intensity_trend === "improving"
                                  ? "text-teal-600"
                                  : "text-slate-600"
                              }`}
                            >
                              {summary.intensity_trend}
                            </span>
                            {summary.compensation_risk_level && (
                              <>
                                {" · "}Compensation risk:{" "}
                                <span
                                  className={`font-semibold ${
                                    summary.compensation_risk_level === "high"
                                      ? "text-red-600"
                                      : summary.compensation_risk_level ===
                                        "medium"
                                      ? "text-amber-600"
                                      : "text-teal-600"
                                  }`}
                                >
                                  {summary.compensation_risk_level}
                                </span>
                              </>
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Client list ───────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            All Clients
          </h2>

          {clients.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-400">
                No clients have submitted reports yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {clients.map((row) => {
                const cid = row.client_id as string;
                const cp = (row.client_profiles as unknown) as {
                  full_name: string | null;
                  email: string;
                } | null;
                const pr = (row.pain_reports as unknown) as {
                  reported_at: string;
                  spots: PainSpotRecord[];
                } | null;
                const pending = pendingCounts.get(cid) ?? 0;
                const date = pr?.reported_at
                  ? new Date(pr.reported_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <Link
                    key={cid}
                    href={`/practitioner/clients/${cid}`}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-md"
                  >
                    {/* Body thumbnail */}
                    {pr?.spots && pr.spots.length > 0 ? (
                      <BodyThumbnail spots={pr.spots} width={48} />
                    ) : (
                      <div className="h-[68px] w-12 rounded bg-slate-100" />
                    )}

                    {/* Client info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        {cp?.full_name ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {cp?.email}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Last report: {date}
                      </p>
                    </div>

                    {/* Pending badge */}
                    {pending > 0 && (
                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        {pending} pending
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PainHistory from "@/components/dashboard/PainHistory";

export const metadata: Metadata = { title: "My Pain History" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  const { data: reports } = await supabase
    .from("pain_reports")
    .select("*")
    .eq("client_id", user!.id)
    .order("reported_at", { ascending: false });

  const { data: submitted } = await supabase
    .from("submitted_reports")
    .select("report_id, status")
    .eq("client_id", user!.id);

  const submittedMap = Object.fromEntries(
    (submitted ?? []).map((s) => [s.report_id, s.status as string])
  );

  const name = profile?.full_name ?? user!.email ?? "Your account";

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-300">
            My Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {name}&apos;s Pain History
          </h1>
          <p className="mt-1 text-sm text-teal-200/70">
            {reports?.length ?? 0} session
            {reports?.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        {reports && reports.length > 0 ? (
          <PainHistory reports={reports} submittedMap={submittedMap} />
        ) : (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm sm:p-14">
            {/* Body map icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50">
              <svg
                className="h-8 w-8 text-teal-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                <path d="M6.5 8.5C5 9.5 4 11 4 13c0 2 .5 4 1.5 5.5" />
                <path d="M17.5 8.5C19 9.5 20 11 20 13c0 2-.5 4-1.5 5.5" />
                <path d="M8 8.5v5L7 19h10l-1-5.5V8.5" />
              </svg>
            </div>

            <div>
              <p className="text-base font-semibold text-slate-900">
                No pain history yet
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                Start by mapping where you feel pain today. After you get your
                clinical assessment, save the session — it will appear here.
              </p>
            </div>

            <Link
              href="/pain-tool"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Start pain assessment
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

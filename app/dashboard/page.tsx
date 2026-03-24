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
    .from("client_profiles")
    .select("full_name, email")
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

  const name = profile?.full_name ?? profile?.email ?? "Your";

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
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">No sessions recorded yet.</p>
            <p className="mt-1 text-xs text-slate-400">
              Use the{" "}
              <Link href="/pain-tool" className="text-teal-600 hover:underline">
                Pain Tool
              </Link>{" "}
              and save your results to start tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

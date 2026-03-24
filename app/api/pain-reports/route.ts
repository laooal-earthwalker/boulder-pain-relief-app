/**
 * POST /api/pain-reports
 *
 * Saves a completed pain assessment to the pain_reports table.
 * Auth verified first. Action logged to audit_logs (no PHI in log).
 */

import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, getClientIp } from "@/lib/hipaa/auditLog";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // ── Auth check ─────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    spots,
    activity_notes,
    overall_intensity,
    duration,
    worse_with,
    better_with,
    ai_interpretation,
    notes,
  } = body;

  const { data, error } = await supabase
    .from("pain_reports")
    .insert({
      client_id: user.id,
      spots: spots ?? [],
      activity_notes: activity_notes ?? [],
      overall_intensity: overall_intensity ?? null,
      duration: duration ?? null,
      worse_with: worse_with ?? null,
      better_with: better_with ?? null,
      ai_interpretation: ai_interpretation ?? null,
      notes: notes ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save report." }, { status: 500 });
  }

  // Audit log — report ID only, no clinical content
  const ip = getClientIp(request);
  await logAuditEvent(user.id, "report_saved", ip);

  return NextResponse.json({ id: data.id });
}

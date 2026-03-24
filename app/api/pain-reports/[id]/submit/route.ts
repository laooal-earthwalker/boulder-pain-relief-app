import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, getClientIp } from "@/lib/hipaa/auditLog";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // RLS enforces this, but verify explicitly for defense-in-depth
  const { data: report } = await supabase
    .from("pain_reports")
    .select("id")
    .eq("id", id)
    .eq("client_id", user.id)
    .single();

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("submitted_reports")
    .insert({ report_id: id, client_id: user.id });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    return NextResponse.json({ error: "Failed to submit report." }, { status: 500 });
  }

  const ip = getClientIp(request);
  await logAuditEvent(user.id, "submit_report", ip);

  return NextResponse.json({ ok: true });
}

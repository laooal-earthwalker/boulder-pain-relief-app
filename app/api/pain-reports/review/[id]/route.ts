import { createClient } from "@/lib/supabase/server";
import { logAuditEvent, getClientIp } from "@/lib/hipaa/auditLog";
import { NextResponse } from "next/server";

export async function PATCH(
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

  // Server-side role verification — never trust client-side role checks alone
  const { data: profile } = await supabase
    .from("client_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "practitioner") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase
    .from("submitted_reports")
    .update({ status: "reviewed", reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }

  const ip = getClientIp(request);
  await logAuditEvent(user.id, "practitioner_marked_reviewed", ip);

  return NextResponse.json({ ok: true });
}

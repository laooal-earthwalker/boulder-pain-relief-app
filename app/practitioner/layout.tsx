import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/hipaa/auditLog";

export default async function PractitionerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/practitioner");

  // Server-side role check — role check must be on the server, never client-only
  const { data: profile } = await supabase
    .from("client_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "practitioner") redirect("/");

  // Audit: log practitioner access — user ID only, no PHI
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  await logAuditEvent(user.id, "practitioner_viewed_reports", ip);

  return <>{children}</>;
}

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/hipaa/auditLog";

const ComingSoon = () => (
  <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-20 text-center">
    <p className="text-sm font-semibold text-teal-700">Boulder Pain Relief</p>
    <h1 className="mt-3 text-xl font-semibold text-slate-900">
      Account features coming soon
    </h1>
    <p className="mt-2 text-sm text-slate-500">
      The practitioner dashboard will be available once our database is fully
      set up. Check back shortly.
    </p>
  </div>
);

export default async function PractitionerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) return <ComingSoon />;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login?redirect=/practitioner");

    // Server-side role check — must be on the server, never client-only
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
  } catch {
    return <ComingSoon />;
  }

  return <>{children}</>;
}

import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-20 text-center">
        <p className="text-sm font-semibold text-teal-700">Boulder Pain Relief</p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          Account features coming soon
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The client dashboard will be available once our database is fully set up.
          Check back shortly.
        </p>
      </div>
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login?redirect=/dashboard");
  } catch {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-20 text-center">
        <p className="text-sm font-semibold text-teal-700">Boulder Pain Relief</p>
        <h1 className="mt-3 text-xl font-semibold text-slate-900">
          Account features coming soon
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The client dashboard will be available once our database is fully set up.
          Check back shortly.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Log In — Boulder Pain Relief" };

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-14">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-teal-600">
          Boulder Pain Relief
        </p>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Log in to view your pain history and submitted reports.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <Suspense>
            <AuthForm mode="login" />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          New to Boulder Pain Relief?{" "}
          <Link
            href="/welcome"
            className="font-medium text-teal-600 hover:text-teal-700"
          >
            See how it works
          </Link>
        </p>
      </div>
    </div>
  );
}

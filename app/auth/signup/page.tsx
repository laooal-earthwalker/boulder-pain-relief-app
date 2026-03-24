import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Create Account — Boulder Pain Relief" };

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-14">
      <div className="w-full max-w-md">
        {/* Wordmark */}
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-teal-600">
          Boulder Pain Relief
        </p>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Track your pain patterns and share assessments with your practitioner.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <Suspense>
            <AuthForm mode="signup" />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Want to see how it works first?{" "}
          <Link
            href="/welcome"
            className="font-medium text-teal-600 hover:text-teal-700"
          >
            View the overview
          </Link>
        </p>
      </div>
    </div>
  );
}

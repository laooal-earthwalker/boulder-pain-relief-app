import type { Metadata } from "next";
import PainToolForm from "@/components/pain-tool/PainToolForm";

export const metadata: Metadata = {
  title: "AI Pain Tool",
  description:
    "Describe your symptoms and get a personalized assessment from our AI — what may be happening in your muscles or fascia, specific self-care steps, and whether you should book a session.",
};

export default function PainToolPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            AI Pain Assessment Tool
          </h1>
          <p className="text-base text-teal-100/75">
            Describe what&apos;s going on and get a plain-language explanation
            of what may be happening in your body — plus specific self-care
            steps you can use today.
          </p>
        </div>
      </div>

      {/* ── Disclaimer banner ─────────────────────────────────────────── */}
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-center">
        <p className="mx-auto max-w-3xl text-xs text-amber-800">
          <strong>Educational tool only.</strong> This is not a medical
          diagnosis. For acute injuries, severe symptoms, or anything involving
          numbness, tingling, or radiating pain, please consult a physician.
        </p>
      </div>

      {/* ── Form + Response ───────────────────────────────────────────── */}
      <PainToolForm />

      {/* ── Powered by Claude ─────────────────────────────────────────── */}
      <div className="border-t border-slate-200 py-4 text-center">
        <p className="text-xs text-slate-400">
          Powered by{" "}
          <span className="font-medium text-slate-500">Claude AI</span>
        </p>
      </div>
    </div>
  );
}

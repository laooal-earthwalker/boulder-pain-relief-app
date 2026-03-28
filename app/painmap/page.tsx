import type { Metadata } from "next";
import PainToolForm from "@/components/pain-tool/PainToolForm";

export const metadata: Metadata = {
  title: "PainMap | Boulder Pain Relief",
  description:
    "Use PainMap to describe your symptoms and get a personalized soft-tissue assessment — what may be happening in your muscles or fascia, specific self-care steps, and whether you should book a session.",
};

export default function PainMapPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header — hidden on mobile so figures are immediately visible */}
      <div className="hidden sm:block border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-4 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            PainMap
          </h1>
          <p className="text-xs text-teal-100/70">
            Mark where it hurts and get a plain-language soft-tissue assessment.
          </p>
        </div>
      </div>

      {/* ── Disclaimer banner ─────────────────────────────────────────── */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-center">
        <p className="mx-auto max-w-3xl text-[11px] text-amber-800">
          <strong>Educational tool only.</strong> Not a medical diagnosis — consult a physician for acute injuries, numbness, or radiating pain.
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

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a Session",
  description:
    "Schedule a clinical massage therapy session with Lao Kemper at Boulder Pain Relief. Online booking via Acuity Scheduling. Venmo and Zelle accepted.",
};

export default function BookingPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief Massage
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Book a Session
          </h1>
          <p className="text-base text-teal-100/75">
            Select a session type and time that works for you. All sessions are
            at CrossFit Sanitas in Boulder, CO.
          </p>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* ── Acuity embed ──────────────────────────────────────── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Select a time
            </h2>
            <p className="text-xs text-slate-500">
              Powered by Acuity Scheduling
            </p>
          </div>
          <iframe
            src="https://app.acuityscheduling.com/schedule.php?owner=38155939"
            title="Schedule a massage therapy session"
            width="100%"
            height="800"
            className="block border-0"
          />
        </div>

        {/* ── Sidebar ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {/* Payment methods */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100">
                <CreditCardIcon className="h-4 w-4 text-teal-700" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">
                Session Payments
              </h2>
            </div>
            <p className="mb-4 text-sm leading-6 text-slate-600">
              Payment is due at the time of your session. The following methods
              are accepted:
            </p>

            <div className="flex flex-col gap-3">
              {/* Venmo */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#3D95CE]">
                  <span className="text-xs font-bold text-white">V</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Venmo Business
                  </p>
                  <p className="text-xs text-slate-500">
                    @BoulderPainRelief
                  </p>
                </div>
              </div>

              {/* Zelle */}
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6D1ED4]">
                  <span className="text-xs font-bold text-white">Z</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Zelle</p>
                  <p className="text-xs text-slate-500">
                    Ask for details at booking
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Please send payment after your session is complete. Gratuity is
              always appreciated but never expected.
            </p>
          </div>

          {/* What to expect */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100">
                <ChecklistIcon className="h-4 w-4 text-teal-700" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">
                What to Expect
              </h2>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                "Arrive 5 minutes early for your first session to complete a brief intake",
                "Wear or bring comfortable clothing — you'll undress to your comfort level",
                "Sessions begin and end on time out of respect for all clients",
                "A brief assessment at the start helps tailor the work to your goals that day",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100">
                <LocationIcon className="h-4 w-4 text-teal-700" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">
                Location
              </h2>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-900">
              CrossFit Sanitas
            </p>
            <p className="text-sm leading-6 text-slate-600">
              Boulder, CO
            </p>
            <p className="mt-3 text-xs text-slate-400">
              Exact address provided in your booking confirmation.
            </p>
          </div>

          {/* Questions */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5">
            <p className="mb-2 text-sm font-medium text-teal-900">
              Questions before booking?
            </p>
            <p className="mb-4 text-sm text-teal-800/70">
              Not sure which session type is right for you? Try the free AI
              Pain Tool for a personalized recommendation.
            </p>
            <Link
              href="/pain-tool"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-600"
            >
              Try the AI Pain Tool
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
      <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
    </svg>
  );
}

function ChecklistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-2.003 3.5-4.697 3.5-8.867a8.25 8.25 0 0 0-16.5 0c0 4.17 1.557 6.865 3.501 8.867a19.58 19.58 0 0 0 2.683 2.282 16.975 16.975 0 0 0 1.144.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

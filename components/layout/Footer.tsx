import Link from "next/link";

const BOOKING_URL = "https://app.acuityscheduling.com/schedule.php?owner=38155939";

const explore = [
  { href: "/about", label: "About" },
  { href: "/pain-tool", label: "AI Pain Tool" },
  { href: "/resources", label: "Self-Care Library" },
  { href: "/courses", label: "Video Courses" },
  { href: "/shop", label: "Recovery Shop" },
  { href: "/blog", label: "Blog" },
  { href: "/anatomy", label: "Anatomy Education" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <p className="text-base font-semibold text-white">
              Boulder Pain Relief Massage
            </p>
            <p className="max-w-xs text-sm leading-6">
              Clinical massage therapy rooted in anatomy, biomechanics, and
              evidence-based practice. Serving Boulder, CO and surrounding
              communities.
            </p>
            <p className="text-sm">
              Lao Kemper, Licensed and Certified Massage Therapist
            </p>
            <p className="text-sm">Boulder, CO</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-teal-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Booking column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Book a Session
            </h3>
            <p className="text-sm leading-6">
              Sessions are available online via Acuity Scheduling. Questions?
              Reach out before booking.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-500"
            >
              Schedule Online
            </a>
            <div className="text-sm">
              <p className="mb-1 font-medium text-slate-300">
                Session Payments
              </p>
              <p>Venmo Business · Zelle</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-slate-800 pt-8 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Boulder Pain Relief Massage. All
            rights reserved.
          </p>
          <p className="text-slate-600">
            Not a substitute for medical diagnosis or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}

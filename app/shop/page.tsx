import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lao's Picks — Recovery Shop",
  description:
    "Curated ergonomic, travel, and recovery products personally vetted by Lao Kemper at Boulder Pain Relief. Affiliate links help support the practice.",
};

// ── Product data ──────────────────────────────────────────────────────────────
// Replace href values with your real affiliate links before launch

interface ShopProduct {
  id: string;
  name: string;
  priceRange: string;
  why: string;
  href: string; // TODO: replace with real affiliate URL
  accentColor: string;
  Icon: React.ComponentType<{ className?: string }>;
}

interface ShopCategory {
  id: string;
  label: string;
  description: string;
  HeaderIcon: React.ComponentType<{ className?: string }>;
  products: ShopProduct[];
}

const categories: ShopCategory[] = [
  {
    id: "ergonomic",
    label: "Ergonomic",
    description: "Tools for the 8 hours you spend at your desk.",
    HeaderIcon: DeskIcon,
    products: [
      {
        id: "lumbar-support",
        name: "ErgoFoam Adjustable Lumbar Support",
        priceRange: "$30–$50",
        why: "The single most impactful desk purchase for lower back pain. Positions the lumbar spine in neutral curve and reduces the hip flexor compression that accumulates over long sedentary sessions. Works on any chair.",
        href: "#", // TODO: affiliate link
        accentColor: "teal",
        Icon: LumbarIcon,
      },
      {
        id: "monitor-arm",
        name: "Ergotron LX Monitor Arm",
        priceRange: "$130–$160",
        why: "Most cervical pain I see in desk workers comes from a monitor that's too low, too close, or off to one side. An adjustable arm eliminates that variable entirely — and costs less than two sessions.",
        href: "#", // TODO: affiliate link
        accentColor: "teal",
        Icon: MonitorIcon,
      },
      {
        id: "standing-converter",
        name: "UPLIFT Standing Desk Converter",
        priceRange: "$200–$350",
        why: "For clients who can't upgrade their full workstation. Even 30-minute intervals of standing during the workday meaningfully reduces thoracic and hip flexor loading. Start with 20 minutes standing per hour.",
        href: "#", // TODO: affiliate link
        accentColor: "teal",
        Icon: StandingIcon,
      },
    ],
  },
  {
    id: "travel",
    label: "Travel",
    description: "Protect your spine when you're away from your setup.",
    HeaderIcon: PlaneIcon,
    products: [
      {
        id: "inflatable-lumbar",
        name: "FOVERA Inflatable Lumbar Roll",
        priceRange: "$20–$35",
        why: "Deflates to nothing in your bag. Airplane and car seats are engineered to flatten your lumbar curve — this reverses that. Non-negotiable for anyone with a history of lower back issues and a travel schedule.",
        href: "#", // TODO: affiliate link
        accentColor: "sky",
        Icon: LumbarIcon,
      },
      {
        id: "travel-pillow",
        name: "Cabeau Evolution S3 Travel Pillow",
        priceRange: "$55–$70",
        why: "The neck pillow category is full of junk that lets your head drop forward. This one actually holds the cervical spine in neutral with rear-lobe support. Essential for anyone who wakes up from a flight with neck stiffness.",
        href: "#", // TODO: affiliate link
        accentColor: "sky",
        Icon: PillowIcon,
      },
    ],
  },
  {
    id: "recovery",
    label: "Recovery",
    description: "What to use between sessions to maintain your progress.",
    HeaderIcon: RecoveryIcon,
    products: [
      {
        id: "massage-gun",
        name: "Theragun Mini 2.0",
        priceRange: "$150–$200",
        why: "Compact enough to actually use consistently. I use percussion therapy in sessions on certain clients and recommend it for post-workout quad, glute, and upper trap work. Amplitude matters more than raw power — this one gets it right.",
        href: "#", // TODO: affiliate link
        accentColor: "indigo",
        Icon: MassageGunIcon,
      },
      {
        id: "lacrosse-balls",
        name: "RAD Rounds Lacrosse Balls (2-pack)",
        priceRange: "$15–$25",
        why: "The most versatile recovery tool on this list. Two balls taped together creates a 'peanut' for thoracic spine extension over a desk — one of the most effective self-care moves I give clients. Also excellent for plantar fascia, glutes, and pec minor.",
        href: "#", // TODO: affiliate link
        accentColor: "indigo",
        Icon: BallIcon,
      },
      {
        id: "ice-pack",
        name: "Chattanooga ColPaC Reusable Ice Pack",
        priceRange: "$20–$40",
        why: "Stays cold significantly longer than gel packs, conforms to body contours, and is clinic-grade. My default recommendation for acute soft tissue inflammation and post-session icing. Buy the size that matches the area you're treating.",
        href: "#", // TODO: affiliate link
        accentColor: "indigo",
        Icon: IcePackIcon,
      },
    ],
  },
  {
    id: "car",
    label: "Car Support",
    description: "Your commute adds up. Stop letting your car hurt you.",
    HeaderIcon: CarIcon,
    products: [
      {
        id: "car-lumbar",
        name: "CONFORMAX Lumbar Car Seat Support",
        priceRange: "$35–$55",
        why: "Most car seats put the lumbar spine in flexion, which loads the posterior disc and compresses the lumbar erectors. This wedge positions you in neutral. Critical for anyone who commutes more than 20 minutes and already sits all day.",
        href: "#", // TODO: affiliate link
        accentColor: "emerald",
        Icon: LumbarIcon,
      },
      {
        id: "seat-cushion",
        name: "Xtreme Comforts Seat Cushion",
        priceRange: "$35–$50",
        why: "Reduces ischial tuberosity (sitting bone) and coccyx pressure during drives. Particularly useful for clients with SI joint, piriformis, or tailbone issues. The coccyx cutout actually makes a difference — most cushions don't have it.",
        href: "#", // TODO: affiliate link
        accentColor: "emerald",
        Icon: CushionIcon,
      },
    ],
  },
];

// ── Color maps (Tailwind classes must be complete strings, not dynamic) ────────

const accentMap: Record<
  string,
  { badge: string; iconBg: string; iconText: string; btn: string; btnHover: string }
> = {
  teal: {
    badge: "bg-teal-100 text-teal-700",
    iconBg: "bg-teal-50",
    iconText: "text-teal-600",
    btn: "bg-teal-600 hover:bg-teal-700",
    btnHover: "",
  },
  sky: {
    badge: "bg-sky-100 text-sky-700",
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
    btn: "bg-sky-600 hover:bg-sky-700",
    btnHover: "",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-700",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    btn: "bg-indigo-600 hover:bg-indigo-700",
    btnHover: "",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-700",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    btnHover: "",
  },
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Lao&apos;s Picks
          </h1>
          <p className="text-base text-teal-100/75">
            Products I personally use, recommend to clients, or have evaluated
            in a clinical context. No filler. Every item earns its place.
          </p>
        </div>
      </div>

      {/* ── Affiliate disclaimer ───────────────────────────────────── */}
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-center">
        <p className="mx-auto max-w-3xl text-xs text-amber-800">
          <strong>Affiliate disclosure:</strong> Some links on this page are
          affiliate links. I earn a small commission if you purchase, at no
          extra cost to you. I only list products I genuinely stand behind.
        </p>
      </div>

      {/* ── Category nav ──────────────────────────────────────────── */}
      <div className="sticky top-[65px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-6 py-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
            >
              <cat.HeaderIcon className="h-3.5 w-3.5" />
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Category sections ─────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-16">
          {categories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              {/* Section header */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                  <cat.HeaderIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {cat.label}
                  </h2>
                  <p className="text-sm text-slate-500">{cat.description}</p>
                </div>
              </div>

              {/* Product grid */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.products.map((product) => {
                  const accent = accentMap[product.accentColor];
                  return (
                    <div
                      key={product.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      {/* Image placeholder */}
                      <div
                        className={`flex h-40 items-center justify-center ${accent.iconBg}`}
                      >
                        <product.Icon
                          className={`h-14 w-14 ${accent.iconText} opacity-40`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        {/* Badge + price */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${accent.badge}`}
                          >
                            {cat.label}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            {product.priceRange}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="text-sm font-semibold leading-snug text-slate-900">
                          {product.name}
                        </h3>

                        {/* Why I recommend this */}
                        <div className="flex flex-1 flex-col gap-1.5">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Why I recommend it
                          </p>
                          <p className="text-sm leading-6 text-slate-600">
                            {product.why}
                          </p>
                        </div>

                        {/* CTA */}
                        <a
                          href={product.href}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className={`mt-auto flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition ${accent.btn}`}
                        >
                          View Product
                          <ExternalLinkIcon className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── Bottom note ───────────────────────────────────────────── */}
      <div className="border-t border-slate-200 bg-white px-6 py-8 text-center">
        <p className="mx-auto max-w-md text-sm text-slate-500">
          Have a question about whether a product is right for your situation?{" "}
          <a
            href="/pain-tool"
            className="font-medium text-teal-600 hover:text-teal-700"
          >
            Try the AI Pain Tool
          </a>{" "}
          or{" "}
          <a
            href="https://app.acuityscheduling.com/schedule.php?owner=38155939"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-600 hover:text-teal-700"
          >
            book a session
          </a>{" "}
          for personalized guidance.
        </p>
      </div>
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function DeskIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v9.75a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

function PlaneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
    </svg>
  );
}

function RecoveryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875H3.75a3 3 0 1 0 6 0h3a3 3 0 1 0 6 0h.375a1.875 1.875 0 0 0 1.875-1.875v-1.5c0-1.036-.84-1.875-1.875-1.875H13.5ZM8.25 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.75 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  );
}

function LumbarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v9.75a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

function StandingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1-1.06 1.06l-2.47-2.47V21a.75.75 0 0 1-1.5 0V4.81L8.78 7.28a.75.75 0 0 1-1.06-1.06l3.75-3.75Z" clipRule="evenodd" />
    </svg>
  );
}

function PillowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75c0-1.036.84-1.875 1.875-1.875h3.193A3.375 3.375 0 0 1 12 2.753a3.375 3.375 0 0 1 5.432 3.997h3.943c1.035 0 1.875.84 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875H12.75v-4.5h1.875a1.875 1.875 0 1 0-1.875-1.875V6.75h-1.5V4.875C11.25 3.839 10.41 3 9.375 3ZM11.25 12.75H3v6.75a2.25 2.25 0 0 0 2.25 2.25h6v-9ZM12.75 21.75h6a2.25 2.25 0 0 0 2.25-2.25V12.75h-8.25v9Z" />
    </svg>
  );
}

function MassageGunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.818a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .845-.143Z" clipRule="evenodd" />
    </svg>
  );
}

function BallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM6.375 12a5.625 5.625 0 1 1 11.25 0 5.625 5.625 0 0 1-11.25 0Z" clipRule="evenodd" />
    </svg>
  );
}

function IcePackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 0 1 1.032 0 11.209 11.209 0 0 0 7.877 3.08.75.75 0 0 1 .722.515 12.74 12.74 0 0 1 .635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 0 1-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 0 1 .722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75ZM12 15a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75H12Z" clipRule="evenodd" />
    </svg>
  );
}

function CushionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 0 0 1.06.053L16.5 4.44v2.81a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.553l-9.056 8.194a.75.75 0 0 0-.053 1.06Z" clipRule="evenodd" />
    </svg>
  );
}

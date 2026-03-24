import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anatomy Reference | Boulder Pain Relief",
  description:
    "Plain-language anatomy articles covering muscles, fascia, and movement patterns relevant to massage therapy and soft-tissue care — written by a licensed massage therapist in Boulder, CO.",
};

// ── Types & data ──────────────────────────────────────────────────────────────

type Region =
  | "Lower Back & Hip"
  | "Shoulder & Neck"
  | "Upper Back"
  | "Leg & Knee"
  | "Foot & Ankle"
  | "Core & Pelvis";

interface Article {
  slug: string;
  title: string;
  region: Region;
  summary: string;
  keywords: string[];
}

const articles: Article[] = [
  {
    slug: "iliopsoas",
    title: "Iliopsoas: The Hidden Driver of Lower Back Pain",
    region: "Lower Back & Hip",
    summary:
      "The iliopsoas is the primary hip flexor and one of the most clinically relevant muscles in the body. Learn where it attaches, why prolonged sitting shortens it, and how it contributes to anterior pelvic tilt and lumbar pain.",
    keywords: ["hip flexor", "lower back pain", "psoas", "anterior pelvic tilt"],
  },
  {
    slug: "thoracolumbar-fascia",
    title: "Thoracolumbar Fascia: The Sheet That Connects Everything",
    region: "Lower Back & Hip",
    summary:
      "The thoracolumbar fascia is a diamond-shaped sheet of dense connective tissue that spans the lower back, connecting the latissimus dorsi, glutes, and deep spinal muscles. A key structure in chronic lower back pain.",
    keywords: ["lower back", "fascia", "lat", "glute", "thoracolumbar fascia"],
  },
  {
    slug: "quadratus-lumborum",
    title: "Quadratus Lumborum: The \"Hip Hiker\" That Causes Back Spasms",
    region: "Lower Back & Hip",
    summary:
      "The QL sits deep in the lower back between the last rib and the iliac crest. It stabilizes the lumbar spine and elevates the hip — but when chronically overloaded or shortened, it's one of the most common sources of acute and chronic low back pain.",
    keywords: ["QL", "lower back spasm", "hip hiker", "quadratus lumborum", "low back pain"],
  },
  {
    slug: "upper-trapezius",
    title: "Upper Trapezius: Why Your Neck and Shoulders Are Always Tight",
    region: "Shoulder & Neck",
    summary:
      "The upper trap is one of the most commonly overloaded muscles in desk workers and overhead athletes. Learn why it becomes hypertonic, where it refers pain, and how to differentiate it from other causes of neck and shoulder tension.",
    keywords: ["upper trap", "neck pain", "shoulder tension", "trapezius", "desk worker"],
  },
  {
    slug: "suboccipitals",
    title: "Suboccipital Muscles: The Source of Tension Headaches",
    region: "Shoulder & Neck",
    summary:
      "Four small muscles at the base of the skull — the suboccipitals — are responsible for fine-tuning head position. When chronically shortened from forward head posture, they're a primary driver of tension headaches and cervical stiffness.",
    keywords: ["suboccipitals", "tension headache", "cervicogenic headache", "neck pain", "forward head posture"],
  },
  {
    slug: "levator-scapulae",
    title: "Levator Scapulae: The Muscle That Makes It Hard to Turn Your Head",
    region: "Shoulder & Neck",
    summary:
      "The levator scapulae connects the upper cervical vertebrae to the scapula. When tight, it restricts cervical rotation — particularly that \"I can't turn my head\" limitation — and contributes to a pattern of neck, shoulder, and upper trap tension.",
    keywords: ["levator scapulae", "neck stiffness", "shoulder pain", "cervical rotation"],
  },
  {
    slug: "thoracic-paraspinals",
    title: "Thoracic Paraspinals: Stiffness in the Mid-Back",
    region: "Upper Back",
    summary:
      "The thoracic paraspinals run alongside the thoracic spine and maintain extension and rotation of the mid-back. When the thoracic spine loses mobility — a nearly universal pattern in desk workers — these muscles are both overloaded and underused in different ways.",
    keywords: ["mid-back pain", "thoracic spine", "paraspinals", "mobility", "desk worker"],
  },
  {
    slug: "rhomboids",
    title: "Rhomboids: The Weak Link Behind the Shoulder Blades",
    region: "Upper Back",
    summary:
      "The rhomboids retract and downwardly rotate the scapula. They're chronically overstretched and weakened in people with rounded shoulders — which is almost everyone who uses a computer. Learn why \"just strengthen them\" isn't always the right approach.",
    keywords: ["rhomboids", "scapular retraction", "rounded shoulders", "upper back pain"],
  },
  {
    slug: "it-band",
    title: "IT Band: What It Is, What It Isn't, and Why Foam Rolling Doesn't Fix It",
    region: "Leg & Knee",
    summary:
      "The iliotibial band is not a muscle — it's a dense strip of fascia that runs from the hip to the lateral knee. IT band syndrome is almost never a problem with the IT band itself; it's a load management and hip abductor strength problem. Here's why that matters for treatment.",
    keywords: ["IT band", "iliotibial band syndrome", "runner's knee", "lateral knee pain", "foam rolling"],
  },
  {
    slug: "hamstrings",
    title: "Hamstrings: Why They're Tight, and Why Stretching Doesn't Always Work",
    region: "Leg & Knee",
    summary:
      "Most people with \"tight\" hamstrings actually have hamstrings that are neurally guarded, not truly shortened. The distinction changes everything about how you treat them. Learn the anatomy, the common patterns, and the difference between passive length and active control.",
    keywords: ["hamstrings", "tight hamstrings", "posterior chain", "hamstring flexibility", "hip hinge"],
  },
  {
    slug: "plantar-fascia",
    title: "Plantar Fascia: Understanding Plantar Fasciitis",
    region: "Foot & Ankle",
    summary:
      "Plantar fasciitis is one of the most common musculoskeletal complaints, but it's often mismanaged. Learn the anatomy of the plantar fascia, why heel pain is typically worse in the morning, and what the evidence says about effective treatment beyond just stretching.",
    keywords: ["plantar fasciitis", "heel pain", "plantar fascia", "foot pain", "morning heel pain"],
  },
  {
    slug: "psoas-major",
    title: "Psoas Major: Anatomy, Function, and Why Everyone Seems to Have Problems With It",
    region: "Core & Pelvis",
    summary:
      "The psoas major is the deepest and most powerful hip flexor, connecting the lumbar vertebrae directly to the femur. It's involved in nearly every movement pattern and implicated in a wide range of lower back, hip, and pelvis complaints.",
    keywords: ["psoas", "psoas major", "hip flexor", "lumbar spine", "lower back pain"],
  },
];

const REGION_COLORS: Record<Region, { bg: string; text: string }> = {
  "Lower Back & Hip": { bg: "bg-amber-100", text: "text-amber-700" },
  "Shoulder & Neck": { bg: "bg-sky-100", text: "text-sky-700" },
  "Upper Back": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Leg & Knee": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Foot & Ankle": { bg: "bg-teal-100", text: "text-teal-700" },
  "Core & Pelvis": { bg: "bg-rose-100", text: "text-rose-700" },
};

const REGIONS = Object.keys(REGION_COLORS) as Region[];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnatomyPage() {
  const grouped = REGIONS.map((region) => ({
    region,
    articles: articles.filter((a) => a.region === region),
  })).filter((g) => g.articles.length > 0);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-12 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            Boulder Pain Relief
          </p>
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Anatomy Reference
          </h1>
          <p className="text-base text-teal-100/75">
            Plain-language articles on the muscles, fascia, and movement
            patterns most relevant to soft-tissue therapy and chronic pain —
            written from a clinical massage therapy perspective.
          </p>
        </div>
      </div>

      {/* ── Region legend ─────────────────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 mr-1">
            Regions
          </span>
          {REGIONS.map((r) => {
            const s = REGION_COLORS[r];
            return (
              <span
                key={r}
                className={`rounded-full px-3 py-1 text-xs font-medium ${s.bg} ${s.text}`}
              >
                {r}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── Articles ──────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="flex flex-col gap-12">
          {grouped.map(({ region, articles: regionArticles }) => {
            const style = REGION_COLORS[region];
            return (
              <section key={region}>
                <div className="mb-6 flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${style.bg} ${style.text}`}
                  >
                    {region}
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {regionArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/anatomy/${article.slug}`}
                      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-teal-300 hover:shadow-md"
                    >
                      <h2 className="mb-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-teal-800">
                        {article.title}
                      </h2>
                      <p className="mb-4 flex-1 text-sm leading-6 text-slate-500">
                        {article.summary}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {article.keywords.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-slate-400">
          More articles added regularly. Suggest a topic via the booking page.
        </p>
      </div>
    </div>
  );
}

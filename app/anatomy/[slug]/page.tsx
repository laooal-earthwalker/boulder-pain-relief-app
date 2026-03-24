import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Article data ──────────────────────────────────────────────────────────────

interface AnatomySection {
  heading?: string;
  body: string;
}

interface AnatomyArticle {
  slug: string;
  title: string;
  region: string;
  metaDescription: string;
  quickFacts: { label: string; value: string }[];
  sections: AnatomySection[];
  relatedSlugs: string[];
}

const articles: AnatomyArticle[] = [
  {
    slug: "iliopsoas",
    title: "Iliopsoas: The Hidden Driver of Lower Back Pain",
    region: "Lower Back & Hip",
    metaDescription:
      "The iliopsoas is the primary hip flexor and one of the most clinically relevant muscles for lower back pain. A Boulder massage therapist explains its anatomy, how it shortens, and what to do about it.",
    quickFacts: [
      { label: "Muscles", value: "Iliacus + Psoas Major" },
      { label: "Origin", value: "Iliac fossa (iliacus); T12–L5 vertebrae (psoas)" },
      { label: "Insertion", value: "Lesser trochanter of femur" },
      { label: "Primary action", value: "Hip flexion; lumbar spine stabilization" },
      { label: "Common issue", value: "Adaptive shortening from prolonged sitting" },
    ],
    sections: [
      {
        heading: "What Is the Iliopsoas?",
        body: "The iliopsoas is technically two muscles — the iliacus and the psoas major — that share a common tendon and insertion point on the lesser trochanter of the femur. Together, they form the primary hip flexor. The psoas also attaches to the lumbar vertebrae (T12 through L5), making it the only muscle that directly connects the lumbar spine to the lower extremity. This is what makes it so clinically significant: when it's tight, it doesn't just affect hip mobility — it directly loads the lumbar spine.",
      },
      {
        heading: "Why It Becomes a Problem",
        body: "The iliopsoas is held in a shortened position whenever the hip is flexed — which is to say, whenever you're sitting. If you spend several hours per day sitting, the muscle adapts to that shortened length. Over time, it loses the ability to fully lengthen. When you stand up, tight hip flexors pull the pelvis into anterior tilt (forward rotation), which increases the lumbar curve and compresses the posterior structures of the lower back — facet joints, intervertebral discs, and supporting ligaments.",
      },
      {
        body: "The result is that dull, achy lower back pain that gets worse after sitting for a long time, improves briefly when you first stand, and then aches again after walking or standing for a while. Many people blame weak abs or a disc problem when the primary driver is adaptive shortening of the hip flexor complex.",
      },
      {
        heading: "Pain Referral Patterns",
        body: "The iliopsoas doesn't just cause local hip flexor tension. The psoas major, when it contains active trigger points, can refer pain to the lower back, the groin, and even the anterior thigh. This referred pain pattern is commonly misidentified as disc pathology or hip joint problems. A thorough soft-tissue assessment will include palpation and testing of the iliopsoas in any lower back pain presentation.",
      },
      {
        heading: "What Helps",
        body: "Sustained hip flexor stretching — particularly the 90/90 lunge position held for 2–3 minutes per side — is the highest-return self-care intervention. The emphasis on duration is important: connective tissue and muscle don't respond meaningfully to 15-second stretches. Two to three minutes of sustained load is where you start to see actual tissue length changes.",
      },
      {
        body: "Direct manual therapy to the iliopsoas — trigger point release and myofascial work — can significantly accelerate the process. The psoas is accessible through the abdomen with careful technique, and the iliacus is reachable just inside the iliac crest. This is work done regularly in Boulder massage therapy sessions for clients with chronic lower back and hip pain.",
      },
      {
        body: "Pairing hip flexor lengthening with glute strengthening is important. Tight hip flexors and inhibited glutes are almost always found together — they're two sides of the same compensation pattern.",
      },
    ],
    relatedSlugs: ["quadratus-lumborum", "psoas-major", "thoracolumbar-fascia"],
  },
  {
    slug: "upper-trapezius",
    title: "Upper Trapezius: Why Your Neck and Shoulders Are Always Tight",
    region: "Shoulder & Neck",
    metaDescription:
      "The upper trapezius is one of the most commonly overloaded muscles in desk workers and overhead athletes. A Boulder massage therapist explains why it becomes hypertonic and where it refers pain.",
    quickFacts: [
      { label: "Muscle", value: "Trapezius (upper fibers)" },
      { label: "Origin", value: "Occiput, ligamentum nuchae, C7 spinous process" },
      { label: "Insertion", value: "Lateral clavicle, acromion" },
      { label: "Primary action", value: "Scapular elevation; upper cervical extension" },
      { label: "Common issue", value: "Chronic hypertonia from sustained load and stress" },
    ],
    sections: [
      {
        heading: "Anatomy and Function",
        body: "The trapezius is a large, diamond-shaped muscle that covers most of the upper back and neck. Its upper fibers — the part most people are referring to when they say 'my traps are tight' — run from the base of the skull and the ligamentum nuchae down to the lateral clavicle and acromion. The upper trap elevates the scapula, upwardly rotates it during overhead movement, and helps extend the upper cervical spine.",
      },
      {
        heading: "Why It Becomes Overloaded",
        body: "The upper trapezius is particularly susceptible to chronic overload because of how many sustained tasks it participates in. Holding a phone, typing on a keyboard, carrying a bag, driving — all of these activities involve some degree of upper trap activation for prolonged periods. The muscle is designed for intermittent effort, not chronic low-level contraction.",
      },
      {
        body: "Forward head posture compounds the problem. Every centimeter the head moves forward from its neutral position over the shoulders increases the effective weight the cervical musculature has to support. At three inches of forward head posture, the upper trapezius and other cervical muscles are supporting approximately 42 pounds of load rather than the 12 pounds of a neutrally positioned head.",
      },
      {
        heading: "Pain Referral Patterns",
        body: "The upper trapezius is one of the classic trigger point muscles. Active trigger points in the upper trap reliably refer pain to the lateral neck, the temple, and behind the eye — which is one reason why upper trap tension is such a common contributor to cervicogenic headaches and is sometimes mistaken for migraines.",
      },
      {
        heading: "Treatment Approach",
        body: "Direct trigger point release to the upper trapezius provides significant short-term relief, but the tissue will reload if the underlying patterns — forward head posture, shoulder girdle rounding, sustained gripping or screen work — aren't addressed. Effective treatment includes soft-tissue work to the upper trap and surrounding structures (levator scapulae, suboccipitals, cervical paraspinals) combined with postural awareness and scapular stabilization work.",
      },
    ],
    relatedSlugs: ["suboccipitals", "levator-scapulae"],
  },
  {
    slug: "it-band",
    title: "IT Band: What It Is, What It Isn't, and Why Foam Rolling Doesn't Fix It",
    region: "Leg & Knee",
    metaDescription:
      "IT band syndrome is one of the most misunderstood running injuries. A Boulder sports massage therapist explains the anatomy, why the IT band itself isn't the problem, and what actually works.",
    quickFacts: [
      { label: "Structure", value: "Iliotibial band (fascia, not muscle)" },
      { label: "Origin", value: "Iliac crest; TFL and glute max insertions" },
      { label: "Insertion", value: "Gerdy's tubercle, lateral tibia" },
      { label: "Function", value: "Lateral knee stabilization; force transmission from hip" },
      { label: "Common issue", value: "IT band syndrome (lateral knee pain in runners)" },
    ],
    sections: [
      {
        heading: "What the IT Band Actually Is",
        body: "The iliotibial band is not a muscle — it's a thick strip of fascia that runs along the outside of the thigh from the iliac crest to just below the knee, inserting on Gerdy's tubercle on the lateral tibia. At its top, it receives fibers from the tensor fasciae latae (TFL) and the gluteus maximus. It functions primarily as a stabilizer of the lateral knee during gait and as a conduit for force transmission from the hip.",
      },
      {
        heading: "Why Foam Rolling Doesn't Fix It",
        body: "IT band syndrome — that sharp or burning lateral knee pain that typically develops in runners after a certain mileage — is almost universally presented as a tightness problem requiring aggressive foam rolling. This is mostly wrong. Dense fascia like the IT band doesn't meaningfully lengthen from foam rolling. The tissue is too stiff and too thick to deform significantly from body-weight pressure applied briefly. What foam rolling does do is temporarily reduce pain perception — useful, but not the same as treating the underlying problem.",
      },
      {
        heading: "The Actual Problem",
        body: "IT band syndrome is almost always a hip abductor strength and load management problem. When the hip abductors — particularly the gluteus medius — are weak or fatigued, the femur adducts (drops inward) during the stance phase of running. This increases the compression stress between the IT band and the lateral femoral condyle, creating the characteristic pain. The IT band is the victim of the problem, not the cause.",
      },
      {
        body: "Additionally, many runners simply take on too much mileage, too fast, without adequate recovery. IT band syndrome is a classic overuse injury with a predictable load-tolerance model: the tissue can handle a certain amount of stress before it breaks down, and that threshold is exceeded when training load increases faster than tissue capacity adapts.",
      },
      {
        heading: "What Actually Helps",
        body: "Addressing hip abductor strength — particularly hip abduction and single-leg stability work — is the most well-supported intervention. In the short term, reducing training load is often necessary. Soft-tissue work to the TFL, gluteus medius, and lateral hip can reduce the tension being transmitted through the IT band, which is useful as part of a broader plan. But strengthening is non-negotiable for lasting resolution.",
      },
    ],
    relatedSlugs: ["hamstrings", "plantar-fascia"],
  },
  {
    slug: "suboccipitals",
    title: "Suboccipital Muscles: The Source of Tension Headaches",
    region: "Shoulder & Neck",
    metaDescription:
      "Four small muscles at the base of the skull drive tension headaches and cervical stiffness when chronically shortened by forward head posture. A Boulder massage therapist explains their anatomy and treatment.",
    quickFacts: [
      { label: "Muscles", value: "Rectus capitis posterior major/minor; obliquus capitis superior/inferior" },
      { label: "Location", value: "Between occiput and C1–C2 vertebrae" },
      { label: "Function", value: "Fine head position control; upper cervical extension and rotation" },
      { label: "Common issue", value: "Chronic shortening from forward head posture; cervicogenic headache" },
    ],
    sections: [
      {
        heading: "What Are the Suboccipitals?",
        body: "The suboccipital muscle group consists of four small muscles located at the base of the skull, between the occiput and the first two cervical vertebrae (C1 and C2). Their primary function is fine-tuning head position — small, precise adjustments to maintain visual and vestibular orientation. They're not designed for prolonged static loading.",
      },
      {
        heading: "Why They Cause Headaches",
        body: "When the head moves forward from its neutral position — as happens with prolonged screen use, reading, or looking down at a phone — the suboccipitals are placed under sustained tension to maintain upright head position. Over time, they shorten and develop trigger points. Active trigger points in the suboccipitals refer pain across the back of the skull and into the temple and eye socket, producing the characteristic distribution of tension-type headaches.",
      },
      {
        body: "The suboccipital region also has a dense concentration of mechanoreceptors that contribute to proprioception. When the suboccipitals are chronically tight, they can impair proprioceptive signals from the cervical spine, which sometimes contributes to dizziness and balance disturbances.",
      },
      {
        heading: "Differentiating Cervicogenic from Other Headaches",
        body: "Cervicogenic headaches — those originating from the cervical spine and suboccipital muscles — typically start at the base of the skull and radiate forward. They're often worse with sustained neck flexion, screen work, or driving. They tend to be one-sided and associated with restricted cervical rotation. They are frequently misdiagnosed as tension headaches or migraines, and treated with medications that address the headache but not the source.",
      },
      {
        heading: "Treatment",
        body: "Direct manual therapy to the suboccipital muscles — including specific trigger point release and myofascial work — is highly effective for cervicogenic headaches. The muscles are accessible just below the occiput, and releasing them often produces immediate reduction in headache intensity. Pairing this with work on the upper trapezius, levator scapulae, and cervical paraspinals addresses the broader pattern. Postural correction and reducing sustained neck flexion are necessary for long-term results.",
      },
    ],
    relatedSlugs: ["upper-trapezius", "levator-scapulae"],
  },
  {
    slug: "plantar-fascia",
    title: "Plantar Fascia: Understanding Plantar Fasciitis",
    region: "Foot & Ankle",
    metaDescription:
      "Plantar fasciitis is one of the most common musculoskeletal complaints, but it's often mismanaged. A Boulder massage therapist explains the anatomy, the characteristic morning heel pain, and evidence-based treatment.",
    quickFacts: [
      { label: "Structure", value: "Plantar fascia (aponeurosis)" },
      { label: "Origin", value: "Medial calcaneal tubercle (heel bone)" },
      { label: "Insertion", value: "Proximal phalanges of toes" },
      { label: "Function", value: "Supports medial arch; transfers force during push-off" },
      { label: "Common issue", value: "Plantar fasciitis — insertional heel pain" },
    ],
    sections: [
      {
        heading: "Anatomy",
        body: "The plantar fascia is a thick band of connective tissue that spans the sole of the foot, running from the medial calcaneal tubercle (the bottom of the heel bone) to the bases of the toes. It supports the medial longitudinal arch and plays a critical role in the windlass mechanism — the stiffening of the arch during push-off that allows efficient propulsion in gait and running.",
      },
      {
        heading: "What Is Plantar Fasciitis?",
        body: "Plantar fasciitis is an overuse injury characterized by degeneration at the insertion of the plantar fascia on the heel bone. The term 'fasciitis' implies active inflammation, but research suggests the condition is more accurately described as a fasciosis — a degenerative process without significant acute inflammation — particularly in chronic cases. This distinction matters because anti-inflammatory medications are less effective for a degenerative condition than for an acutely inflamed one.",
      },
      {
        heading: "The Signature Morning Pain",
        body: "The most distinctive feature of plantar fasciitis is heel pain that is worst with the first steps in the morning. This happens because during sleep, the plantar fascia contracts to a shorter resting length. When you first stand up and the fascia is suddenly loaded, it is stressed beyond its resting length before it has had a chance to warm up and adapt. After a few minutes of walking, the pain typically improves — only to return with prolonged standing or walking.",
      },
      {
        heading: "Contributing Factors",
        body: "Plantar fasciitis is associated with reduced ankle dorsiflexion (the ability to flex the foot toward the shin), tight calf musculature (particularly the gastrocnemius and soleus), reduced intrinsic foot muscle strength, and sudden increases in standing or walking load. It's common in runners who increase mileage quickly, people who stand on hard floors for work, and those transitioning to minimal footwear without adequate preparation.",
      },
      {
        heading: "What Actually Works",
        body: "The strongest evidence supports: eccentric calf loading exercises, which reduce load on the plantar fascia by improving calf-complex strength and compliance; soft-tissue work to the calf, Achilles, and plantar fascia itself; and addressing ankle dorsiflexion restrictions. Simply stretching the plantar fascia helps with symptom management but doesn't address the load-capacity mismatch that's driving the condition. Most cases resolve within 6–12 months with consistent conservative management.",
      },
    ],
    relatedSlugs: ["it-band", "hamstrings"],
  },
  {
    slug: "quadratus-lumborum",
    title: "Quadratus Lumborum: The \"Hip Hiker\" That Causes Back Spasms",
    region: "Lower Back & Hip",
    metaDescription:
      "The quadratus lumborum sits deep in the lower back and is one of the most common sources of acute and chronic back pain. A Boulder massage therapist explains its anatomy, trigger points, and treatment.",
    quickFacts: [
      { label: "Muscle", value: "Quadratus lumborum (QL)" },
      { label: "Origin", value: "Posterior iliac crest" },
      { label: "Insertion", value: "12th rib; L1–L4 transverse processes" },
      { label: "Primary action", value: "Lateral trunk flexion; hip elevation; lumbar stabilization" },
      { label: "Common issue", value: "Trigger points causing back pain and lateral hip pain" },
    ],
    sections: [
      {
        heading: "Anatomy",
        body: "The quadratus lumborum (QL) is a quadrilateral muscle located deep in the posterior abdominal wall, between the 12th rib and the iliac crest. It connects the pelvis to the lower ribs and lumbar transverse processes. It's a primary lateral flexor of the trunk and stabilizer of the lumbar spine — and when it's unilaterally overloaded, it elevates the hip on that side, contributing to the appearance of a functional leg-length discrepancy.",
      },
      {
        heading: "Why It's a Problem",
        body: "The QL is one of the most common sources of acute lower back pain and back spasm. Its deep location and multiple functions mean it's recruited for virtually every movement that involves the trunk — lifting, twisting, even sustained standing. Asymmetric loading patterns (carrying a bag on one shoulder, sitting with a wallet in one back pocket, sleeping in certain positions) preferentially overload one side.",
      },
      {
        heading: "Trigger Point Referral",
        body: "Active QL trigger points refer pain in distinctive patterns: deep in the lower back near the SI joint, into the lateral hip and greater trochanter (which is commonly misdiagnosed as trochanteric bursitis), and occasionally into the groin and lower abdomen. The QL is frequently the source of the sharp, acute 'back spasm' that makes it hard to stand up straight.",
      },
      {
        heading: "Treatment",
        body: "The QL is not accessible with superficial massage — it lies deep to the erector spinae and requires specific technique to reach. Side-lying positioning allows the best access. In sessions, I address the QL with deep pressure and myofascial release as part of a broader lower back assessment that also includes the iliopsoas, hip rotators, and thoracolumbar fascia. Stretching: lateral side bends and the thread-the-needle stretch target the QL, though they should be held long enough (2+ minutes) to be effective.",
      },
    ],
    relatedSlugs: ["iliopsoas", "thoracolumbar-fascia"],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getArticle(slug: string): AnatomyArticle | undefined {
  return articles.find((a) => a.slug === slug);
}

function getRelated(slugs: string[]): AnatomyArticle[] {
  return slugs
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean) as AnatomyArticle[];
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Boulder Pain Relief Anatomy`,
    description: article.metaDescription,
  };
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AnatomyArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = getRelated(article.relatedSlugs);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            {article.region}
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {article.title}
          </h1>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-2xl px-6 py-12">
        {/* Quick facts */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Quick Reference
            </p>
          </div>
          <dl className="divide-y divide-slate-100">
            {article.quickFacts.map(({ label, value }) => (
              <div key={label} className="flex gap-4 px-5 py-3">
                <dt className="w-32 shrink-0 text-xs font-semibold text-slate-500">
                  {label}
                </dt>
                <dd className="text-sm text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Article sections */}
        <div className="flex flex-col gap-6">
          {article.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
                  {section.heading}
                </h2>
              )}
              <p className="leading-7 text-slate-600">{section.body}</p>
            </div>
          ))}
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Related Articles
            </h2>
            <div className="flex flex-col gap-3">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/anatomy/${rel.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 transition hover:border-teal-300"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-teal-800">
                      {rel.title}
                    </p>
                    <p className="text-xs text-slate-400">{rel.region}</p>
                  </div>
                  <svg
                    className="h-4 w-4 text-slate-400 transition group-hover:text-teal-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-1 text-sm font-semibold text-slate-900">
            Have questions about this in your own body?
          </p>
          <p className="mb-4 text-sm leading-6 text-slate-600">
            Book a session and we&apos;ll apply this directly to what&apos;s
            happening in your tissue — with a full assessment and hands-on
            treatment.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
            >
              Book a Session
            </a>
            <Link
              href="/anatomy"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-teal-200 hover:text-teal-700"
            >
              All anatomy articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

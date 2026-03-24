import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const BOOKING_URL =
  "https://app.acuityscheduling.com/schedule.php?owner=38155939";

// ── Post data ─────────────────────────────────────────────────────────────────

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  readingTime: string;
  metaDescription: string;
  sections: { heading?: string; subheading?: string; body: string }[];
}

const posts: Post[] = [
  {
    slug: "why-your-lower-back-hurts-at-your-desk",
    title: "Why Your Lower Back Hurts at Your Desk (And What to Do About It)",
    date: "2026-03-01",
    category: "Desk Worker Health",
    readingTime: "6 min read",
    metaDescription:
      "Sitting isn't inherently bad for your back — but the way most people sit is. A Boulder massage therapist breaks down the three most common mechanical patterns behind desk-worker lower back pain and what to do this week.",
    sections: [
      {
        body: "Lower back pain is the most common complaint I see in my Boulder, CO practice — and the majority of the time, the person is a desk worker. Not someone who lifts heavy things for a living, not a construction worker, not an extreme athlete. Someone who sits at a computer for eight hours and can't figure out why their back is slowly falling apart.",
      },
      {
        body: "Here's the thing: sitting isn't inherently bad for your back. But the way most people sit — and the patterns that develop over months and years of that sitting — absolutely is. Let me walk you through the three most common mechanical drivers I see, and what you can actually do about each of them.",
      },
      {
        heading: "1. Prolonged Hip Flexor Shortening",
        body: "When you sit, your hip flexors — primarily the iliopsoas — are held in a shortened position for hours at a stretch. Over time, they adaptively shorten. What does that mean in practice? When you stand up, tight hip flexors pull your pelvis into an anterior tilt (forward rotation), which increases the curve in your lower lumbar spine. That's called hyperlordosis, and it loads the facet joints and posterior structures of your lumbar spine in a way they're not designed to handle chronically.",
      },
      {
        body: "The result is a dull, achy pain in the low back that often feels worse after standing for a while, or after a long drive. It's often misattributed to 'weak abs' when the more immediate issue is that the hip flexors need to be lengthened and the glutes need to re-learn how to extend the hip.",
      },
      {
        body: "What helps: A daily 90/90 hip flexor stretch held for 2–3 minutes per side is one of the highest-return investments you can make. Pair it with glute bridges — not as a core exercise, but as a hip-extension motor-pattern drill. You're teaching your glutes to extend the hip so your lower back doesn't have to.",
      },
      {
        heading: "2. Thoracic Kyphosis Compensating Into the Lumbar Spine",
        body: "Most people with a desk-related lower back problem also have a stiff, flexed thoracic spine — the mid-back. When the thoracic spine can't extend, the body compensates by borrowing motion from somewhere else. That somewhere else is almost always the lumbar spine. You end up with a mid-back that moves like a brick wall and a lower back that's doing all the work, including rotational work it was never designed to handle efficiently.",
      },
      {
        body: "This shows up as lower back pain with rotation — turning to look over your shoulder in the car, reaching across your desk, or swinging a golf club or a kettlebell.",
      },
      {
        body: "What helps: Thoracic extension over a foam roller — just lying back over it and breathing — is a simple place to start. But to actually change tissue quality and restore segmental motion, you need hands-on soft-tissue work to the thoracic paraspinals, combined with consistent mobility work. This is something I address directly in massage therapy sessions using myofascial release and targeted joint mobilization.",
      },
      {
        heading: "3. Gluteal Inhibition (\"Dead Butt Syndrome\")",
        body: "When you sit on your glutes all day, the glute max gradually becomes inhibited — it learns not to fire. This is called reciprocal inhibition compounded by simple disuse. When your glutes don't do their job during gait, lifting, or even standing still, the lower back muscles — particularly the quadratus lumborum and the deep multifidus — pick up the slack.",
      },
      {
        body: "Muscles that are chronically overloaded accumulate metabolic waste, develop trigger points, and eventually just hurt. In clinical terms, this is a load-distribution problem. The lower back is doing the work of the hip, and it doesn't appreciate it.",
      },
      {
        body: "What helps: Before any strengthening, you need to wake the glutes up. Clamshells, side-lying hip abduction, and single-leg glute bridges are all good options — but form matters. Many people unconsciously use their lower back to complete these movements, defeating the purpose. Go slow, focus on actually feeling the glute contract, and do fewer reps with better quality rather than grinding through a set.",
      },
      {
        heading: "When to Come In",
        body: "If your lower back pain has been present for more than four to six weeks and isn't responding to the above, that's a good signal that the tissue itself needs direct work — not just exercises. Myofascial release, deep tissue work, and targeted trigger point therapy to the hip flexors, quadratus lumborum, and thoracolumbar fascia can make a significant difference, especially when combined with the movement habits above.",
      },
      {
        body: "I work with desk workers in Boulder, CO regularly, and this presentation — tight hips, stiff mid-back, inhibited glutes — is genuinely one of the most common and most correctable patterns I treat. If you're dealing with it, you don't have to just live with it.",
      },
    ],
  },
  {
    slug: "fascial-connection-pain-elsewhere",
    title:
      "The Fascial Connection: Why One Tight Spot Can Cause Pain Somewhere Else",
    date: "2026-02-15",
    category: "Pain Education",
    readingTime: "7 min read",
    metaDescription:
      "Fascia — the connective tissue web that wraps every structure in the body — means tightness in one region can load a distant area past its tolerance. A Boulder massage therapist explains referred tension patterns and how to think about them.",
    sections: [
      {
        body: "One of the most common experiences in my Boulder massage practice is someone coming in with pain in one spot — let's say the right shoulder — and being surprised when I spend a significant portion of the session working on their thoracic spine, their hip, or their opposite arm. \"Why are you working there?\" is a fair question, and the answer comes down to one word: fascia.",
      },
      {
        heading: "What Is Fascia?",
        body: "Fascia is the connective tissue that wraps, separates, and connects every muscle, bone, organ, and nerve in your body. Think of it as a three-dimensional web that is continuous from your scalp to the soles of your feet. Unlike muscle, which is organized into discrete units with defined origins and insertions, fascia has no beginning and no end. It is one continuous structure, just with areas of thickening and thinning.",
      },
      {
        body: "This continuity is what makes it both incredibly functional — it allows force to be transmitted across the body in coordinated ways — and the source of one of the most confusing aspects of pain: the fact that where you hurt and where the problem originates are often not the same place.",
      },
      {
        heading: "Tensegrity: The Architecture of Load",
        body: "Biomechanists use the concept of tensegrity to describe how the body distributes load. Rather than thinking of the skeleton as a stack of bones held together by compression, the body is better understood as a tension network — a system where rigid elements (bones) float within a continuous web of tension (fascia, ligaments, tendons). When one part of the network is altered — by tightness, injury, or adaptive shortening — the tension changes throughout the system.",
      },
      {
        body: "A classic example: a restriction in the plantar fascia of the foot can, via the posterior chain of the leg, create tension at the hamstring insertion, which loads the sacrotuberous ligament, which feeds into the thoracolumbar fascia, which can ultimately contribute to pain or restriction in the opposite shoulder. This is not speculation — it is the mechanical consequence of a tensional architecture.",
      },
      {
        heading: "Common Fascial Lines and Where They Manifest",
        body: "Thomas Myers, in his influential work on anatomy trains, mapped out several major myofascial continuities — pathways along which tension and force are transmitted. The Superficial Back Line runs from the plantar fascia up through the paraspinals and over the skull — restriction anywhere along this line can manifest as low back pain, hamstring tightness, or chronic headaches. The Spiral Line wraps around the body in a helical pattern, connecting the right hip and the left shoulder. The Deep Front Line runs through the hip flexors and psoas all the way up through the pericardium to the base of the skull — one of the most clinically significant lines for chronic lower back and hip pain.",
      },
      {
        heading: "What This Means for How You Think About Pain",
        body: "The practical implication is that treating only where you hurt is often insufficient, and sometimes counterproductive. If your right shoulder hurts because your right hip flexor is chronically shortened and pulling on the spiral line, releasing the shoulder alone will provide temporary relief at best. The tension will return because the source hasn't been addressed.",
      },
      {
        body: "A skilled massage therapist — particularly one trained in myofascial release and structural integration — will assess the whole pattern, not just the symptom site. This is one reason why, when clients come in for shoulder pain in my Boulder practice, the first session often doesn't begin at the shoulder at all.",
      },
      {
        heading: "Chronic Pain and Sensitization",
        body: "It's also worth noting that longstanding fascial restrictions don't just cause mechanical load changes — they can also contribute to central sensitization, a state where the nervous system becomes hypervigilant and generates pain signals out of proportion to actual tissue threat. This is why chronic soft-tissue pain is so complex, and why addressing it effectively requires both direct tissue work and a broader understanding of the whole system.",
      },
      {
        body: "If you've had pain for a long time that hasn't responded to conventional treatment, it may be worth getting a thorough soft-tissue assessment that looks at the whole body — not just the painful region. That's exactly the kind of work I do in my Boulder massage therapy practice.",
      },
    ],
  },
  {
    slug: "recovery-between-crossfit-wods",
    title: "Recovery Between CrossFit WODs: What Actually Helps",
    date: "2026-02-01",
    category: "Athlete Recovery",
    readingTime: "8 min read",
    metaDescription:
      "Cold plunges, compression boots, red light therapy — there's a lot of noise in the CrossFit recovery space. A Boulder sports massage therapist breaks down what the evidence actually supports and what most athletes still get wrong.",
    sections: [
      {
        body: "Boulder has a serious CrossFit culture, and I see a lot of CrossFit athletes in my massage practice. Many of them are doing everything right in the gym and almost nothing right in recovery. They're training five days a week, hitting PRs, and wondering why they feel chronically beat up, why they keep tweaking the same spots, and why their performance has plateaued.",
      },
      {
        body: "The recovery industry has also exploded in the last five years, which means there's more noise than ever about what actually works. Let me give you a clinical perspective on the most common recovery modalities — and more importantly, the non-negotiables that most athletes still skip.",
      },
      {
        heading: "What the Evidence Actually Supports",
        subheading: "Sleep: Still the Most Powerful Recovery Tool",
        body: "Seven to nine hours of sleep per night is not a soft recommendation. Sleep is when growth hormone is released, when muscle protein synthesis peaks, when the glymphatic system clears metabolic waste from the brain, and when tissue repair happens at the cellular level. No ice bath, no massage gun, and no compression boot compensates for consistently sleeping six hours a night. If you're training CrossFit seriously and sleeping less than seven hours, that is your number-one recovery intervention. Full stop.",
      },
      {
        subheading: "Soft-Tissue Work: Both Evidence-Based and Underutilized",
        body: "Sports massage has solid evidence for reducing delayed onset muscle soreness (DOMS), improving perceived recovery, and helping restore range of motion between sessions. More importantly, regular soft-tissue work from a skilled therapist can identify and address patterns before they become injuries. In my Boulder practice, I see athletes who come in only when they're hurt. The more effective approach is regular maintenance work — even monthly — to keep the tissue quality high and catch compensation patterns early.",
      },
      {
        subheading: "Active Recovery: Movement Is Medicine",
        body: "Low-intensity movement on rest days — zone 2 cardio, easy cycling, yoga, swimming — improves blood flow, reduces residual inflammation, and helps clear the metabolic byproducts of hard training without adding meaningful stress load. Zone 2 training has been one of the most researched and validated recovery modalities in sports science, and it's free. The minimum effective dose is 30–60 minutes under 65% of max heart rate.",
      },
      {
        heading: "What's Probably Just Placebo (But Not Harmful)",
        subheading: "Cold Water Immersion",
        body: "Cold water immersion has genuinely mixed evidence. It does reduce subjective soreness and inflammation in the short term. But some research suggests it blunts the anabolic signaling response to training — meaning it may impair the very adaptations you're training for if used immediately post-WOD. The current evidence suggests doing it several hours after training, not immediately after. The psychological benefit may be a legitimate reason to use it regardless.",
      },
      {
        subheading: "Compression Boots",
        body: "Pneumatic compression devices have some evidence for improving perceived recovery and reducing swelling in clinical populations. For healthy CrossFit athletes, the evidence is thinner, but they're not harmful. They're an expensive way to get something that light walking and elevation also achieves.",
      },
      {
        heading: "The Non-Negotiables Most Athletes Skip",
        body: "In my experience working with CrossFit athletes in Boulder, the recoveries that actually move the needle are the boring ones: sleep, nutrition (especially adequate protein — 1.6–2.2g per kg of bodyweight), stress management, regular soft-tissue work, and periodization — actually scheduling deload weeks and respecting them. If your body always feels beat up, the answer is almost certainly not a more aggressive ice bath protocol. It's probably better sleep, more protein, and occasional hands-on work from someone who can identify what's accumulating in the tissue before it becomes an injury.",
      },
    ],
  },
  {
    slug: "5-self-care-habits-keep-you-out-of-my-office",
    title: "5 Self-Care Habits That Will Actually Keep You Out of My Office",
    date: "2026-01-20",
    category: "Self-Care Tips",
    readingTime: "5 min read",
    metaDescription:
      "The goal of good massage therapy is to need it less over time. A Boulder massage therapist shares the five evidence-backed self-care habits he gives almost every client — simple, free, and genuinely effective.",
    sections: [
      {
        body: "The goal of good massage therapy isn't to create dependence — it's to get you to a place where you need it less. That's an unusual thing for a massage therapist to say, but I mean it. The work I do in a session addresses tissue quality, nervous system regulation, and movement patterns. But the habits you build outside the session are what determine whether those changes stick.",
      },
      {
        body: "Here are the five habits I recommend to almost every client in my Boulder practice, because the evidence behind them is solid and the barrier to starting is genuinely low.",
      },
      {
        heading: "1. A Daily Hip Flexor Stretch (90/90 Position)",
        body: "I have yet to meet a desk worker or CrossFit athlete in Boulder whose hip flexors aren't adaptively shortened. The 90/90 hip flexor stretch — one knee down, front foot forward, tall spine — held for two to three minutes per side daily is one of the highest-return investments I know of for lower back and hip health. The key is to actually hold it long enough. Connective tissue and muscle require sustained load over time to change. A 15-second stretch hits the nervous system but doesn't change tissue length. Two minutes is where you start to see structural adaptation.",
      },
      {
        heading: "2. Thoracic Extension (Foam Roller or Chair Back)",
        body: "The thoracic spine stiffens into flexion with prolonged sitting, screen time, and overhead loading. When it stops extending, the lower back and neck compensate. Spending five minutes per day extending over a foam roller directly counteracts this pattern. This is not about cracking your back. It's about applying a sustained extension load across multiple segments to restore the thoracic curve. Breathe slowly, let your sternum drop toward the floor, and work different levels of the thoracic spine.",
      },
      {
        heading: "3. Daily Walking (20–30 Minutes, Continuous)",
        body: "Walking is one of the most underrated recovery and maintenance tools available. It improves lymphatic drainage, keeps connective tissue hydrated, maintains hip extension motor patterns, reduces residual inflammation, and is associated with lower rates of chronic musculoskeletal pain in the research literature. The minimum effective dose appears to be around 20–30 minutes of continuous walking. Broken into smaller chunks is better than nothing, but continuous walking activates the gait cycle in a way that's specifically beneficial for hip mechanics and lumbar mobility.",
      },
      {
        heading: "4. Nasal Breathing During Low-Intensity Activity",
        body: "Chronic mouth breathing and shallow chest breathing upregulate the sympathetic nervous system — the stress response — which increases muscle tension systemically, particularly in the neck, shoulders, and upper back. Clients who learn to breathe nasally and use their diaphragm fully almost always report reduced tension in their upper body. The practice: during low-intensity activity like walking, keep your mouth closed and breathe only through your nose. It's initially uncomfortable. Stick with it for two weeks and notice whether your resting neck and shoulder tension changes.",
      },
      {
        heading: "5. Getting Enough Protein",
        body: "Soft tissue — muscles, tendons, fascia — is made of protein. Most active adults in Boulder are significantly underconsuming protein relative to their activity level. The current evidence supports 1.6 to 2.2 grams per kilogram of bodyweight per day for active individuals. This isn't about bodybuilding. It's about giving your connective tissue the raw materials it needs to repair, remodel, and stay healthy. Chronically under-fueled tissue is more prone to injury and slower to recover from both training and massage work.",
      },
      {
        heading: "The Point",
        body: "None of these habits are complicated. All of them are free. And consistently doing them will, in my clinical experience, meaningfully reduce how often you need to come see me — which is exactly the point. When you do come in, we can focus on higher-level work rather than resetting the same chronic tightness every time.",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Boulder Pain Relief Blog`,
    description: post.metaDescription,
  };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="border-b border-teal-900/20 bg-gradient-to-b from-teal-950 to-teal-900 px-6 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal-300">
            {post.category}
          </p>
          <h1 className="mb-5 text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-teal-200/70">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>&middot;</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>

      {/* ── Article body ──────────────────────────────────────── */}
      <article className="mx-auto w-full max-w-2xl px-6 py-12">
        <div className="flex flex-col gap-5">
          {post.sections.map((section, i) => (
            <div key={i}>
              {section.heading && (
                <h2 className="mb-3 text-xl font-semibold tracking-tight text-slate-900">
                  {section.heading}
                </h2>
              )}
              {section.subheading && (
                <h3 className="mb-2 text-base font-semibold text-slate-800">
                  {section.subheading}
                </h3>
              )}
              <p className="leading-7 text-slate-600">{section.body}</p>
            </div>
          ))}
        </div>

        {/* ── Author note ─────────────────────────────────── */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-1 text-sm font-semibold text-slate-900">
            Lao Kemper, LMT
          </p>
          <p className="text-sm leading-6 text-slate-600">
            Licensed Massage Therapist at Boulder Pain Relief in Boulder, CO.
            Specializes in chronic pain, sports recovery, and fascial work for
            desk workers and athletes.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-600"
          >
            Book a session
            <svg
              className="h-4 w-4"
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
          </a>
        </div>

        {/* ── Back link ───────────────────────────────────── */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 0 1-.75.75H6.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L6.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                clipRule="evenodd"
              />
            </svg>
            All posts
          </Link>
        </div>
      </article>
    </div>
  );
}

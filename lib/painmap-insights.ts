/**
 * Pattern analysis and clinical insight generation for PainMap.
 * Pure functions — no I/O. Safe to call from API routes.
 */

import type {
  PainMapSession,
  RegionFrequency,
  ClinicalInsight,
  SessionComparison,
  PainMapSpot,
} from "@/types/painmap";

// ── Anatomical chain definitions ──────────────────────────────────────────────

const CHAINS: Record<
  string,
  { terms: string[]; description: string; insight: string }
> = {
  posterior: {
    terms: ["lower back", "upper back", "glute", "hamstring", "sacrum", "lumbar", "thoracic"],
    description: "posterior chain",
    insight:
      "Your {regions} have appeared together in {count} of {total} sessions. " +
      "This pattern suggests a posterior chain tension cascade — prolonged hip flexion (sitting) " +
      "shortens the hip flexors, which increases lumbar lordosis and pulls tension through the " +
      "upper back and glutes. Addressing the hip flexors often unlocks the entire chain.",
  },
  anterior: {
    terms: ["neck", "chest", "pec", "hip flex", "quad", "abdom", "sternal"],
    description: "anterior chain",
    insight:
      "Your {regions} are consistently co-occurring across {count} of {total} sessions. " +
      "This is consistent with anterior chain dominance — the chest and hip flexors are " +
      "chronically shortened while posterior stabilizers are underactive. This pattern is " +
      "common in desk workers and overhead athletes.",
  },
  shoulder_complex: {
    terms: ["neck", "shoulder", "upper back", "trap", "rotator", "upper arm", "deltoid", "scapula"],
    description: "shoulder girdle complex",
    insight:
      "Your {regions} repeatedly appear together across {count} of {total} sessions. " +
      "This is consistent with shoulder girdle dysfunction — the neck and upper back commonly " +
      "compensate when the rotator cuff or scapular stabilizers are not loading efficiently. " +
      "Addressing thoracic mobility and scapular control may reduce the neck tension.",
  },
  desk_worker: {
    terms: ["neck", "upper back", "forearm", "wrist", "elbow", "cervical"],
    description: "desk worker pattern",
    insight:
      "The combination of {regions} across {count} of {total} sessions matches a classic " +
      "desk worker overuse pattern. Sustained cervical flexion and repetitive wrist/forearm " +
      "loading creates a predictable tension chain. Ergonomic adjustments and regular " +
      "thoracic extension breaks are often the most effective intervention.",
  },
  lower_extremity: {
    terms: ["hip", "knee", "calf", "shin", "ankle", "foot", "achilles", "plantar"],
    description: "lower extremity kinetic chain",
    insight:
      "Your {regions} are co-occurring consistently across {count} of {total} sessions, " +
      "suggesting a lower extremity kinetic chain issue. In the kinetic chain, pain at one " +
      "joint typically reflects altered mechanics at adjacent joints — restricted ankle " +
      "mobility, for example, often drives knee and hip compensation.",
  },
};

function termMatch(label: string, terms: string[]): boolean {
  const l = label.toLowerCase();
  return terms.some((t) => l.includes(t));
}

// ── Region frequency ──────────────────────────────────────────────────────────

export function computeRegionFrequencies(
  sessions: PainMapSession[]
): RegionFrequency[] {
  const map = new Map<string, { count: number; intensities: number[] }>();

  for (const session of sessions) {
    const seen = new Set<string>();
    for (const spot of session.spots) {
      if (seen.has(spot.label)) continue;
      seen.add(spot.label);
      const existing = map.get(spot.label) ?? { count: 0, intensities: [] };
      existing.count++;
      existing.intensities.push(spot.intensity);
      map.set(spot.label, existing);
    }
  }

  return Array.from(map.entries())
    .map(([label, { count, intensities }]) => {
      let trend: RegionFrequency["trend"] = "insufficient_data";
      if (intensities.length >= 3) {
        const mid = Math.floor(intensities.length / 2);
        const avgFirst =
          intensities.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
        const avgLast =
          intensities.slice(mid).reduce((a, b) => a + b, 0) /
          (intensities.length - mid);
        if (avgLast < avgFirst - 0.4) trend = "improving";
        else if (avgLast > avgFirst + 0.4) trend = "worsening";
        else trend = "stable";
      }
      return {
        label,
        count,
        total: sessions.length,
        intensityHistory: intensities,
        trend,
      };
    })
    .sort((a, b) => b.count - a.count);
}

// ── Clinical insights ─────────────────────────────────────────────────────────

export function computeInsights(
  sessions: PainMapSession[]
): ClinicalInsight[] {
  if (sessions.length < 3) return [];

  const allLabels = Array.from(
    new Set(sessions.flatMap((s) => s.spots.map((sp) => sp.label)))
  );

  const insights: ClinicalInsight[] = [];
  const usedChains = new Set<string>();

  for (const [chainKey, chain] of Object.entries(CHAINS)) {
    const chainRegions = allLabels.filter((l) =>
      termMatch(l, chain.terms)
    );
    if (chainRegions.length < 2) continue;

    // Sessions where 2+ of the chain's regions co-occur
    const coSessions = sessions.filter((s) => {
      const sl = new Set(s.spots.map((sp) => sp.label));
      return chainRegions.filter((r) => sl.has(r)).length >= 2;
    });

    const ratio = coSessions.length / sessions.length;
    if (ratio < 0.6) continue;
    if (usedChains.has(chainKey)) continue;
    usedChains.add(chainKey);

    const topRegions = chainRegions.slice(0, 3);
    const regionList =
      topRegions.length <= 2
        ? topRegions.join(" and ")
        : `${topRegions[0]}, ${topRegions[1]}, and ${topRegions.length > 3 ? `${topRegions.length - 2} related areas` : topRegions[2]}`;

    const message = chain.insight
      .replace("{regions}", regionList)
      .replace("{count}", String(coSessions.length))
      .replace("{total}", String(sessions.length));

    insights.push({
      type: "co_occurrence",
      regions: chainRegions,
      message,
    });
  }

  return insights;
}

// ── Session comparison ────────────────────────────────────────────────────────

export function buildComparison(
  current: PainMapSession,
  allSessionsForToken: PainMapSession[] // chronological, current is last
): SessionComparison {
  const ordered = allSessionsForToken.slice().sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Previous = the session before the current one
  const currentIdx = ordered.findIndex((s) => s.id === current.id);
  const previous = currentIdx > 0 ? ordered[currentIdx - 1] : null;

  const currentLabels = new Set(current.spots.map((s) => s.label));
  const prevLabels = new Set(previous?.spots.map((s) => s.label) ?? []);

  const newRegions = [...currentLabels].filter((l) => !prevLabels.has(l));
  const resolvedRegions = [...prevLabels].filter(
    (l) => !currentLabels.has(l)
  );

  const persistentRegions = [...currentLabels]
    .filter((l) => prevLabels.has(l))
    .map((label) => {
      const sessionCount = allSessionsForToken.filter((s) =>
        s.spots.some((sp) => sp.label === label)
      ).length;

      const currentSpot = current.spots.find((s) => s.label === label);
      const prevSpot = previous?.spots.find((s) => s.label === label);
      const ci = currentSpot?.intensity ?? 3;
      const pi = prevSpot?.intensity ?? 3;
      const intensityTrend: "up" | "down" | "same" =
        ci > pi ? "up" : ci < pi ? "down" : "same";

      return { label, sessionCount, intensityTrend };
    });

  return { previousSession: previous, newRegions, resolvedRegions, persistentRegions };
}

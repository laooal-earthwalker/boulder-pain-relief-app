// Pain-map longitudinal tracking types

export type SpotSize = "pinpoint" | "regional" | "diffuse";

export interface PainMapSpot {
  regionId: string;
  label: string;
  cx: number;
  cy: number;
  intensity: number; // 1–5
  size: SpotSize;
  view: "front" | "back";
}

export interface PainMapSession {
  id: string;
  clientToken: string;
  timestamp: string; // ISO 8601
  spots: PainMapSpot[];
  duration: string;
  worseWith?: string;
  betterWith?: string;
  figure: "male" | "female";
}

export interface SessionStore {
  sessions: PainMapSession[];
}

export interface RegionFrequency {
  label: string;
  count: number; // sessions it appeared in
  total: number; // total sessions
  intensityHistory: number[];
  trend: "improving" | "worsening" | "stable" | "insufficient_data";
}

export interface PersistentRegion {
  label: string;
  sessionCount: number;
  intensityTrend: "up" | "down" | "same";
}

export interface SessionComparison {
  previousSession: PainMapSession | null;
  newRegions: string[];
  resolvedRegions: string[];
  persistentRegions: PersistentRegion[];
}

export interface ClinicalInsight {
  type: "co_occurrence" | "chain" | "frequency";
  regions: string[];
  message: string;
}

export interface PatternData {
  frequencies: RegionFrequency[];
  insights: ClinicalInsight[];
  totalSessions: number;
}

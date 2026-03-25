"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SpotSize = "pinpoint" | "regional" | "diffuse";

export interface PainSpot {
  regionId: string;   // unique per spot (free-form ID)
  label: string;      // nearest anatomical landmark
  size: SpotSize;
  intensity: number;
  cx: number;
  cy: number;
  view: "front" | "back";
}

interface Landmark {
  id: string;
  label: string;
  x: number;
  y: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function spotColor(intensity: number): string {
  if (intensity <= 3) return "#fcd34d";
  if (intensity <= 5) return "#f97316";
  if (intensity <= 7) return "#ef4444";
  return "#991b1b";
}

export function spotRadius(size: SpotSize): number {
  if (size === "pinpoint") return 5;
  if (size === "regional") return 13;
  return 21;
}

function nearestLandmark(x: number, y: number, landmarks: Landmark[]): Landmark {
  let best = landmarks[0];
  let minD = Infinity;
  for (const lm of landmarks) {
    const d = (x - lm.x) ** 2 + (y - lm.y) ** 2;
    if (d < minD) { minD = d; best = lm; }
  }
  return best;
}

function getLocalPt(e: React.MouseEvent<SVGGElement>): { x: number; y: number } | null {
  const g = e.currentTarget as SVGGraphicsElement;
  const ctm = g.getScreenCTM();
  if (!ctm) return null;
  const svg = g.ownerSVGElement!;
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const local = pt.matrixTransform(ctm.inverse());
  return { x: local.x, y: local.y };
}

// ── Landmark data ─────────────────────────────────────────────────────────────

const FRONT_LANDMARKS: Landmark[] = [
  { id: "head",         label: "Head",                  x: 70,  y: 20  },
  { id: "neck",         label: "Neck",                  x: 70,  y: 60  },
  { id: "r-shoulder",   label: "Right Shoulder",        x: 116, y: 88  },
  { id: "l-shoulder",   label: "Left Shoulder",         x: 24,  y: 88  },
  { id: "sternum",      label: "Sternum",               x: 70,  y: 96  },
  { id: "r-pec",        label: "Right Pec",             x: 92,  y: 112 },
  { id: "l-pec",        label: "Left Pec",              x: 48,  y: 112 },
  { id: "r-upper-arm",  label: "Right Upper Arm",       x: 122, y: 138 },
  { id: "l-upper-arm",  label: "Left Upper Arm",        x: 18,  y: 138 },
  { id: "r-elbow",      label: "Right Elbow",           x: 122, y: 172 },
  { id: "l-elbow",      label: "Left Elbow",            x: 18,  y: 172 },
  { id: "solar-plexus", label: "Solar Plexus",          x: 70,  y: 142 },
  { id: "abdomen",      label: "Abdomen",               x: 70,  y: 168 },
  { id: "r-forearm",    label: "Right Forearm",         x: 118, y: 202 },
  { id: "l-forearm",    label: "Left Forearm",          x: 22,  y: 202 },
  { id: "lower-abd",    label: "Lower Abdomen",         x: 70,  y: 196 },
  { id: "r-wrist",      label: "Right Wrist",           x: 118, y: 228 },
  { id: "l-wrist",      label: "Left Wrist",            x: 22,  y: 228 },
  { id: "r-hand",       label: "Right Hand",            x: 114, y: 250 },
  { id: "l-hand",       label: "Left Hand",             x: 26,  y: 250 },
  { id: "r-hip",        label: "Right Hip",             x: 94,  y: 214 },
  { id: "l-hip",        label: "Left Hip",              x: 46,  y: 214 },
  { id: "r-groin",      label: "Right Groin",           x: 84,  y: 240 },
  { id: "l-groin",      label: "Left Groin",            x: 56,  y: 240 },
  { id: "r-out-thigh",  label: "Right Outer Thigh",     x: 98,  y: 272 },
  { id: "l-out-thigh",  label: "Left Outer Thigh",      x: 42,  y: 272 },
  { id: "r-in-thigh",   label: "Right Inner Thigh",     x: 78,  y: 272 },
  { id: "l-in-thigh",   label: "Left Inner Thigh",      x: 62,  y: 272 },
  { id: "r-quad",       label: "Right Quad",            x: 90,  y: 298 },
  { id: "l-quad",       label: "Left Quad",             x: 50,  y: 298 },
  { id: "r-lat-knee",   label: "Right Lateral Knee",    x: 102, y: 336 },
  { id: "l-lat-knee",   label: "Left Lateral Knee",     x: 38,  y: 336 },
  { id: "r-med-knee",   label: "Right Medial Knee",     x: 82,  y: 336 },
  { id: "l-med-knee",   label: "Left Medial Knee",      x: 58,  y: 336 },
  { id: "r-shin",       label: "Right Shin",            x: 92,  y: 368 },
  { id: "l-shin",       label: "Left Shin",             x: 48,  y: 368 },
  { id: "r-ankle",      label: "Right Ankle",           x: 86,  y: 402 },
  { id: "l-ankle",      label: "Left Ankle",            x: 54,  y: 402 },
  { id: "r-foot",       label: "Right Foot",            x: 90,  y: 413 },
  { id: "l-foot",       label: "Left Foot",             x: 50,  y: 413 },
];

const BACK_LANDMARKS: Landmark[] = [
  { id: "head",         label: "Head",                  x: 70,  y: 20  },
  { id: "cerv-spine",   label: "Cervical Spine",        x: 70,  y: 58  },
  { id: "r-upper-trap", label: "Right Upper Trap",      x: 94,  y: 76  },
  { id: "l-upper-trap", label: "Left Upper Trap",       x: 46,  y: 76  },
  { id: "r-shoulder",   label: "Right Shoulder",        x: 122, y: 92  },
  { id: "l-shoulder",   label: "Left Shoulder",         x: 18,  y: 92  },
  { id: "r-scapula",    label: "Right Scapula",         x: 92,  y: 114 },
  { id: "l-scapula",    label: "Left Scapula",          x: 48,  y: 114 },
  { id: "upper-back",   label: "Upper Back",            x: 70,  y: 108 },
  { id: "r-upper-arm",  label: "Right Upper Arm",       x: 126, y: 140 },
  { id: "l-upper-arm",  label: "Left Upper Arm",        x: 14,  y: 140 },
  { id: "r-elbow",      label: "Right Elbow",           x: 126, y: 174 },
  { id: "l-elbow",      label: "Left Elbow",            x: 14,  y: 174 },
  { id: "mid-back",     label: "Mid Back",              x: 70,  y: 138 },
  { id: "r-lat",        label: "Right Lat",             x: 92,  y: 152 },
  { id: "l-lat",        label: "Left Lat",              x: 48,  y: 152 },
  { id: "lower-back",   label: "Lower Back",            x: 70,  y: 172 },
  { id: "r-low-back",   label: "Right Lower Back",      x: 90,  y: 172 },
  { id: "l-low-back",   label: "Left Lower Back",       x: 50,  y: 172 },
  { id: "r-forearm",    label: "Right Forearm",         x: 122, y: 204 },
  { id: "l-forearm",    label: "Left Forearm",          x: 18,  y: 204 },
  { id: "r-wrist",      label: "Right Wrist",           x: 120, y: 228 },
  { id: "l-wrist",      label: "Left Wrist",            x: 20,  y: 228 },
  { id: "r-hand",       label: "Right Hand",            x: 116, y: 250 },
  { id: "l-hand",       label: "Left Hand",             x: 24,  y: 250 },
  { id: "sacrum",       label: "Sacrum",                x: 70,  y: 218 },
  { id: "r-glute",      label: "Right Glute",           x: 94,  y: 244 },
  { id: "l-glute",      label: "Left Glute",            x: 46,  y: 244 },
  { id: "r-out-thigh",  label: "Right Outer Thigh",     x: 100, y: 280 },
  { id: "l-out-thigh",  label: "Left Outer Thigh",      x: 40,  y: 280 },
  { id: "r-hamstring",  label: "Right Hamstring",       x: 88,  y: 302 },
  { id: "l-hamstring",  label: "Left Hamstring",        x: 52,  y: 302 },
  { id: "r-popliteal",  label: "Right Popliteal Fossa", x: 88,  y: 350 },
  { id: "l-popliteal",  label: "Left Popliteal Fossa",  x: 52,  y: 350 },
  { id: "r-calf",       label: "Right Calf",            x: 88,  y: 374 },
  { id: "l-calf",       label: "Left Calf",             x: 52,  y: 374 },
  { id: "r-achilles",   label: "Right Achilles",        x: 86,  y: 400 },
  { id: "l-achilles",   label: "Left Achilles",         x: 54,  y: 400 },
  { id: "r-heel",       label: "Right Heel",            x: 76,  y: 412 },
  { id: "l-heel",       label: "Left Heel",             x: 64,  y: 412 },
];

// REGION_LABELS kept for backwards compatibility with external consumers
export const REGION_LABELS: Record<string, string> = Object.fromEntries(
  [...FRONT_LANDMARKS, ...BACK_LANDMARKS].map((lm) => [lm.id, lm.label])
);

// ── Body silhouette paths ─────────────────────────────────────────────────────
// Each figure = 3 pieces: torso+arms+head, right leg, left leg.
// This creates a visible gap between legs for realistic anatomy.
// Local space: 0–140 x, 0–420 y, center x=70.

// ── MALE FRONT ────────────────────────────────────────────────────────────────

const MF_TORSO = `
  M 70,4
  C 84,4 92,14 92,28 C 92,44 84,52 78,58 C 76,62 74,66 74,70
  C 74,72 80,72 90,74 C 104,76 114,80 122,86
  C 130,90 134,100 132,114
  C 130,126 130,144 128,162 C 128,170 130,178 128,186
  C 126,198 122,214 120,228 C 120,234 119,240 118,248
  C 116,256 112,260 108,256 C 108,248 108,238 108,228
  C 108,214 108,198 108,184 C 108,172 108,162 108,150
  C 108,138 110,124 112,114 C 112,106 108,98 102,94
  C 98,92 92,96 88,104 C 86,116 84,136 86,156
  C 88,168 90,180 90,192 C 94,202 96,214 96,226
  C 96,232 94,238 88,240 C 82,242 76,244 70,246
  C 64,244 58,242 52,240 C 46,238 44,232 44,226
  C 44,214 46,202 50,192 C 50,180 52,168 54,156
  C 56,136 54,116 52,104 C 48,96 42,92 38,94
  C 32,98 28,106 28,114 C 28,126 30,138 30,150
  C 30,162 30,172 30,184 C 30,198 30,214 30,228
  C 30,238 29,248 28,256 C 24,260 20,256 19,248
  C 18,240 18,234 16,228 C 12,214 8,198 8,186
  C 6,178 6,170 6,162 C 6,144 6,126 8,114
  C 8,100 12,90 18,86
  C 26,80 36,76 50,74 C 60,72 66,72 66,70
  C 66,66 64,62 62,58 C 56,52 48,44 48,28 C 48,14 56,4 70,4 Z
`;

// Right leg — outer hip → down outer side → heel/toes → up inner side → groin
const MF_RLEG = `
  M 96,228
  C 98,240 100,256 100,276 C 100,296 100,316 100,328
  C 100,336 102,344 104,350 C 104,356 102,362 100,368
  C 98,378 94,390 90,400 C 86,406 82,410 76,413
  C 72,414 66,414 60,412 C 54,412 50,410 48,408
  C 48,408 46,406 48,406 C 52,406 58,408 64,410
  C 70,411 76,409 80,407 C 82,405 84,401 82,397
  C 80,391 80,381 80,373 C 80,363 82,351 84,345
  C 84,337 84,329 82,323 C 80,315 78,301 76,283
  C 74,263 72,247 72,235 C 73,227 76,221 82,222
  C 88,224 93,227 96,228 Z
`;

const MF_LLEG = `
  M 44,228
  C 42,240 40,256 40,276 C 40,296 40,316 40,328
  C 40,336 38,344 36,350 C 36,356 38,362 40,368
  C 42,378 46,390 50,400 C 54,406 58,410 64,413
  C 68,414 74,414 80,412 C 86,412 90,410 92,408
  C 92,408 94,406 92,406 C 88,406 82,408 76,410
  C 70,411 64,409 60,407 C 58,405 56,401 58,397
  C 60,391 60,381 60,373 C 60,363 58,351 56,345
  C 56,337 56,329 58,323 C 60,315 62,301 64,283
  C 66,263 68,247 68,235 C 67,227 64,221 58,222
  C 52,224 47,227 44,228 Z
`;

// ── MALE BACK ─────────────────────────────────────────────────────────────────

const MB_TORSO = `
  M 70,4
  C 84,4 92,14 92,28 C 92,44 86,54 80,58 C 78,62 76,66 74,70
  C 74,72 84,70 96,72 C 108,74 118,78 126,84
  C 134,88 138,100 136,114
  C 134,126 134,144 132,162 C 132,170 134,178 132,186
  C 130,198 126,214 124,228 C 124,234 123,240 122,248
  C 120,256 116,260 112,256 C 112,248 112,238 112,228
  C 112,214 112,198 112,184 C 112,172 112,162 112,150
  C 112,138 114,124 116,114 C 116,106 112,98 106,94
  C 102,92 96,96 92,104 C 90,116 88,138 88,158
  C 90,172 92,186 92,198 C 96,208 98,220 100,232
  C 102,242 102,252 100,264 C 94,268 82,272 70,272
  C 58,272 46,268 40,264 C 38,252 38,242 40,232
  C 42,220 44,208 48,198 C 48,186 50,172 52,158
  C 52,138 50,116 48,104 C 44,96 38,92 34,94
  C 28,98 24,106 24,114 C 24,126 26,138 28,150
  C 28,162 28,172 28,184 C 28,198 28,214 28,228
  C 27,238 26,248 25,256 C 21,260 17,256 15,248
  C 14,240 14,234 12,228 C 8,214 4,198 4,186
  C 2,178 2,170 2,162 C 4,144 4,126 4,114
  C 4,100 8,88 16,84
  C 22,80 32,74 46,72 C 58,70 66,70 66,70
  C 64,66 62,60 60,58 C 54,54 48,44 48,28 C 48,14 56,4 70,4 Z
`;

// Back legs — broader calf, visible heel
const MB_RLEG = `
  M 100,264
  C 102,276 104,292 102,310 C 102,324 102,334 104,344
  C 106,354 108,366 106,378 C 104,388 98,398 90,406
  C 84,410 78,413 72,414 C 66,413 60,411 56,409
  C 54,409 52,407 54,407 C 58,406 64,407 70,408
  C 74,408 78,406 80,404 C 80,400 78,396 76,392
  C 74,386 74,376 76,366 C 78,354 80,342 80,334
  C 80,326 78,318 76,310 C 74,296 74,278 74,264
  C 74,254 76,244 80,240 C 86,240 92,250 100,264 Z
`;

const MB_LLEG = `
  M 40,264
  C 38,276 36,292 38,310 C 38,324 38,334 36,344
  C 34,354 32,366 34,378 C 36,388 42,398 50,406
  C 56,410 62,413 68,414 C 74,413 80,411 84,409
  C 86,409 88,407 86,407 C 82,406 76,407 70,408
  C 66,408 62,406 60,404 C 60,400 62,396 64,392
  C 66,386 66,376 64,366 C 62,354 60,342 60,334
  C 60,326 62,318 64,310 C 66,296 66,278 66,264
  C 66,254 64,244 60,240 C 54,240 48,250 40,264 Z
`;

// ── FEMALE FRONT ──────────────────────────────────────────────────────────────
// Narrower shoulders (cap ~124 vs 130), wider hips (outer ~102 vs 96)

const FF_TORSO = `
  M 70,4
  C 84,4 92,14 92,28 C 92,44 84,52 78,58 C 76,62 74,66 74,70
  C 74,72 80,72 88,74 C 100,76 110,80 118,86
  C 124,90 128,100 126,114
  C 124,126 124,144 122,162 C 122,170 124,178 122,186
  C 120,198 116,214 114,228 C 114,234 113,240 112,248
  C 110,256 106,260 102,256 C 102,248 102,238 102,228
  C 102,214 102,198 102,184 C 102,172 102,162 102,150
  C 102,138 104,124 106,114 C 106,106 102,98 96,94
  C 92,92 86,96 82,104 C 80,116 78,136 80,156
  C 82,170 84,184 84,196 C 88,208 94,220 102,232
  C 104,240 102,246 96,250 C 88,252 79,254 70,254
  C 61,254 52,252 44,250 C 38,246 36,240 38,232
  C 46,220 52,208 56,196 C 56,184 58,170 60,156
  C 62,136 60,116 58,104 C 54,96 48,92 44,94
  C 38,98 34,106 34,114 C 34,126 36,138 38,150
  C 38,162 38,172 38,184 C 38,198 38,214 38,228
  C 37,238 36,248 34,256 C 30,260 26,256 25,248
  C 24,240 24,234 22,228 C 18,214 14,198 14,186
  C 12,178 12,170 12,162 C 12,144 12,126 14,114
  C 14,100 18,90 24,86
  C 32,80 42,76 56,74 C 66,72 66,72 66,70
  C 66,66 64,62 62,58 C 56,52 48,44 48,28 C 48,14 56,4 70,4 Z
`;

// Female legs: slightly wider at hip
const FF_RLEG = `
  M 102,234
  C 104,246 106,262 104,280 C 104,300 104,320 102,332
  C 102,340 104,348 106,354 C 106,360 104,366 102,372
  C 100,382 96,394 92,402 C 88,408 84,412 78,414
  C 74,415 68,415 62,413 C 56,412 52,410 50,408
  C 50,408 48,406 50,406 C 54,407 60,409 66,410
  C 72,411 78,409 82,407 C 84,403 84,399 82,395
  C 80,389 80,379 80,371 C 80,361 82,349 84,343
  C 84,335 84,327 82,321 C 80,313 78,299 76,281
  C 74,261 72,245 72,233 C 73,225 76,219 82,220
  C 90,222 97,229 102,234 Z
`;

const FF_LLEG = `
  M 38,234
  C 36,246 34,262 36,280 C 36,300 36,320 38,332
  C 38,340 36,348 34,354 C 34,360 36,366 38,372
  C 40,382 44,394 48,402 C 52,408 56,412 62,414
  C 66,415 72,415 78,413 C 84,412 88,410 90,408
  C 90,408 92,406 90,406 C 86,407 80,409 74,410
  C 68,411 62,409 58,407 C 56,403 56,399 58,395
  C 60,389 60,379 60,371 C 60,361 58,349 56,343
  C 56,335 56,327 58,321 C 60,313 62,299 64,281
  C 66,261 68,245 68,233 C 67,225 64,219 58,220
  C 50,222 43,229 38,234 Z
`;

// ── FEMALE BACK ───────────────────────────────────────────────────────────────

const FB_TORSO = `
  M 70,4
  C 84,4 92,14 92,28 C 92,44 86,54 80,58 C 78,62 76,66 74,70
  C 74,72 82,70 94,72 C 106,74 114,78 122,84
  C 128,88 132,100 130,114
  C 128,126 128,144 126,162 C 126,170 128,178 126,186
  C 124,198 120,214 118,228 C 118,234 117,240 116,248
  C 114,256 110,260 106,256 C 106,248 106,238 106,228
  C 106,214 106,198 106,184 C 106,172 106,162 106,150
  C 106,138 108,124 110,114 C 110,106 106,98 100,94
  C 96,92 90,96 86,104 C 84,116 82,138 82,158
  C 84,172 86,188 86,202 C 90,214 96,226 104,240
  C 106,252 104,262 98,266 C 88,270 79,272 70,272
  C 61,272 52,270 42,266 C 36,262 34,252 36,240
  C 44,226 50,214 54,202 C 54,188 56,172 58,158
  C 58,138 56,116 54,104 C 50,96 44,92 40,94
  C 34,98 30,106 30,114 C 30,126 32,138 32,150
  C 32,162 32,172 32,184 C 32,198 32,214 32,228
  C 31,238 30,248 28,256 C 24,260 20,256 18,248
  C 17,240 16,234 14,228 C 10,214 6,198 6,186
  C 4,178 4,170 4,162 C 4,144 4,126 6,114
  C 6,100 10,88 18,84
  C 26,78 36,74 50,72 C 60,70 66,70 66,70
  C 64,66 62,60 60,58 C 54,54 48,44 48,28 C 48,14 56,4 70,4 Z
`;

const FB_RLEG = `
  M 104,242
  C 106,256 108,272 106,290 C 106,308 104,324 104,336
  C 104,346 106,356 108,366 C 108,376 104,388 98,400
  C 92,408 84,412 76,414 C 70,414 64,412 58,410
  C 56,410 54,408 56,408 C 60,408 66,410 72,411
  C 76,411 80,409 82,405 C 82,401 80,397 78,393
  C 76,385 76,375 78,365 C 80,353 80,341 80,333
  C 80,325 78,317 76,309 C 74,295 74,277 74,263
  C 74,253 76,243 80,241 C 88,240 96,242 104,242 Z
`;

const FB_LLEG = `
  M 36,242
  C 34,256 32,272 34,290 C 34,308 36,324 36,336
  C 36,346 34,356 32,366 C 32,376 36,388 42,400
  C 48,408 56,412 64,414 C 70,414 76,412 82,410
  C 84,410 86,408 84,408 C 80,408 74,410 68,411
  C 64,411 60,409 58,405 C 58,401 60,397 62,393
  C 64,385 64,375 62,365 C 60,353 60,341 60,333
  C 60,325 62,317 64,309 C 66,295 66,277 66,263
  C 66,253 64,243 60,241 C 52,240 44,242 36,242 Z
`;

// ── SVG defs ──────────────────────────────────────────────────────────────────

function SharedDefs() {
  return (
    <defs>
      <radialGradient id="bm-fill-f" cx="38%" cy="24%" r="64%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f5f5f5" />
        <stop offset="100%" stopColor="#e2e2e2" />
      </radialGradient>
      <radialGradient id="bm-fill-b" cx="58%" cy="27%" r="64%">
        <stop offset="0%" stopColor="#fafafa" />
        <stop offset="65%" stopColor="#eeeeee" />
        <stop offset="100%" stopColor="#dedede" />
      </radialGradient>
      <filter id="bm-blur-diffuse" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="bm-fig-shadow" x="-20%" y="-5%" width="140%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#888" floodOpacity="0.13" />
      </filter>
    </defs>
  );
}

// ── Muscle detail lines (B&W) ─────────────────────────────────────────────────

function FrontLines() {
  const p = { stroke: "#1e1e1e", strokeWidth: 0.6, fill: "none", strokeLinecap: "round" as const, opacity: 0.42 };
  const s = { stroke: "#2e2e2e", strokeWidth: 0.42, fill: "none", strokeLinecap: "round" as const, opacity: 0.28 };
  return (
    <g>
      {/* Neck SCM */}
      <path d="M76,28 C76,40 74,54 72,70" {...s} />
      <path d="M64,28 C64,40 66,54 68,70" {...s} />
      {/* Clavicles */}
      <path d="M71,71 C66,70 58,70 52,74" {...p} />
      <path d="M69,71 C74,70 82,70 88,74" {...p} />
      {/* Deltoid */}
      <path d="M88,74 C96,78 106,82 112,92" {...p} />
      <path d="M52,74 C44,78 34,82 28,92" {...p} />
      {/* Pec borders */}
      <path d="M88,74 C84,88 80,108 80,128" {...p} strokeWidth={0.55} />
      <path d="M52,74 C56,88 60,108 60,128" {...p} strokeWidth={0.55} />
      {/* Sternum dashed */}
      <line x1="70" y1="71" x2="70" y2="196" stroke="#1e1e1e" strokeWidth={0.4} strokeDasharray="2,2.5" opacity={0.3} />
      {/* Serratus */}
      <path d="M91,130 C94,136 94,144 92,152" {...s} />
      <path d="M49,130 C46,136 46,144 48,152" {...s} />
      {/* Ab inscriptions */}
      <path d="M62,143 C66,141 70,141 70,141 C70,141 74,141 78,143" {...p} strokeWidth={0.5} />
      <path d="M60,158 C65,156 70,156 70,156 C70,156 75,156 80,158" {...p} strokeWidth={0.5} />
      {/* Obliques */}
      <path d="M88,136 C92,150 92,166 88,180" {...s} />
      <path d="M52,136 C48,150 48,166 52,180" {...s} />
      {/* Inguinal */}
      <path d="M96,180 C100,190 104,200 104,212" {...s} />
      <path d="M44,180 C40,190 36,200 36,212" {...s} />
      {/* Biceps right */}
      <path d="M118,100 C118,116 118,138 120,158" {...p} strokeWidth={0.55} />
      <path d="M120,162 C122,176 122,194 120,210" {...p} strokeWidth={0.5} />
      {/* Biceps left */}
      <path d="M22,100 C22,116 22,138 20,158" {...p} strokeWidth={0.55} />
      <path d="M20,162 C18,176 18,194 20,210" {...p} strokeWidth={0.5} />
      {/* Elbow crease right */}
      <path d="M114,164 C118,166 122,166 126,164" {...s} />
      <path d="M14,164 C18,166 22,166 26,164" {...s} />
      {/* Quad line right */}
      <path d="M94,244 C92,264 92,288 92,308" {...p} strokeWidth={0.55} />
      <path d="M104,242 C106,264 106,290 104,312" {...s} />
      <path d="M84,244 C80,266 78,288 78,308" {...s} />
      {/* Quad left */}
      <path d="M46,244 C48,264 48,288 48,308" {...p} strokeWidth={0.55} />
      <path d="M36,242 C34,264 34,290 36,312" {...s} />
      <path d="M56,244 C60,266 62,288 62,308" {...s} />
      {/* VMO right */}
      <path d="M78,308 C74,316 76,322 82,322" {...s} />
      {/* VMO left */}
      <path d="M62,308 C66,316 64,322 58,322" {...s} />
      {/* Patella right */}
      <path d="M84,322 C90,318 100,318 106,322" {...p} strokeWidth={0.7} />
      <path d="M56,322 C50,318 40,318 34,322" {...p} strokeWidth={0.7} />
      {/* IT band */}
      <path d="M108,244 C110,268 110,294 108,318" {...s} />
      <path d="M32,244 C30,268 30,294 32,318" {...s} />
      {/* Tibialis anterior */}
      <path d="M92,332 C92,350 90,368 90,384" {...p} strokeWidth={0.5} />
      <path d="M48,332 C48,350 50,368 50,384" {...p} strokeWidth={0.5} />
      {/* Calf visible from front */}
      <path d="M100,340 C102,356 100,372 98,384" {...s} />
      <path d="M40,340 C38,356 40,372 42,384" {...s} />
    </g>
  );
}

function BackLines() {
  const p = { stroke: "#1e1e1e", strokeWidth: 0.6, fill: "none", strokeLinecap: "round" as const, opacity: 0.42 };
  const s = { stroke: "#2e2e2e", strokeWidth: 0.42, fill: "none", strokeLinecap: "round" as const, opacity: 0.28 };
  return (
    <g>
      {/* Upper trap */}
      <path d="M74,56 C76,64 82,72 90,80" {...p} />
      <path d="M66,56 C64,64 58,72 50,80" {...p} />
      {/* Spine of scapula */}
      <path d="M70,88 C76,90 82,90 88,88" {...p} strokeWidth={0.55} />
      <path d="M70,88 C64,90 58,90 52,88" {...p} strokeWidth={0.55} />
      {/* Medial scapula border */}
      <path d="M66,86 C65,100 65,116 66,132" {...p} strokeWidth={0.55} />
      <path d="M74,86 C75,100 75,116 74,132" {...p} strokeWidth={0.55} />
      {/* Infraspinatus */}
      <path d="M66,98 C68,108 70,118 70,128" {...s} />
      <path d="M74,98 C72,108 70,118 70,128" {...s} />
      {/* Teres major */}
      <path d="M88,106 C94,118 96,130 92,144" {...s} />
      <path d="M52,106 C46,118 44,130 48,144" {...s} />
      {/* Mid/lower trap */}
      <path d="M66,105 C72,104 78,103 86,102" {...s} />
      <path d="M86,106 C82,120 78,134 72,148" {...s} />
      <path d="M54,106 C58,120 62,134 68,148" {...s} />
      {/* Lats */}
      <path d="M88,104 C92,124 92,146 88,164" {...p} />
      <path d="M52,104 C48,124 48,146 52,164" {...p} />
      {/* Erector dashed */}
      <path d="M74,74 C74,110 74,150 74,200" stroke="#1e1e1e" strokeWidth={0.45} strokeDasharray="2,2.5" opacity={0.35} fill="none" />
      <path d="M66,74 C66,110 66,150 66,200" stroke="#1e1e1e" strokeWidth={0.45} strokeDasharray="2,2.5" opacity={0.35} fill="none" />
      {/* TLF diamond */}
      <path d="M70,140 C78,154 80,170 70,186 C60,170 60,154 70,140" {...s} strokeWidth={0.45} />
      {/* Post deltoid / triceps */}
      <path d="M106,84 C112,92 116,104 114,116" {...p} strokeWidth={0.55} />
      <path d="M34,84 C28,92 24,104 26,116" {...p} strokeWidth={0.55} />
      <path d="M116,108 C118,128 118,150 118,164" {...p} strokeWidth={0.55} />
      <path d="M24,108 C22,128 22,150 22,164" {...p} strokeWidth={0.55} />
      {/* Elbow crease back */}
      <path d="M112,170 C116,172 120,172 124,170" {...s} />
      <path d="M16,170 C20,172 24,172 28,170" {...s} />
      {/* Iliac crest */}
      <path d="M38,192 C48,186 60,184 70,184 C80,184 92,186 102,192" {...p} />
      {/* Glute med */}
      <path d="M102,192 C110,198 114,210 112,224" {...p} />
      <path d="M38,192 C30,198 26,210 28,224" {...p} />
      {/* Glute fold */}
      <path d="M36,264 C44,272 56,276 70,276 C84,276 96,272 104,264" {...p} strokeWidth={0.75} />
      {/* Hamstring split */}
      <path d="M90,282 C90,304 90,328 90,350" {...p} strokeWidth={0.55} />
      <path d="M50,282 C50,304 50,328 50,350" {...p} strokeWidth={0.55} />
      {/* Hamstring borders */}
      <path d="M102,280 C104,302 104,328 102,350" {...s} />
      <path d="M38,280 C36,302 36,328 38,350" {...s} />
      {/* Popliteal fossa */}
      <path d="M78,353 C82,357 90,357 94,353 C90,363 82,365 78,361" {...s} strokeWidth={0.4} />
      <path d="M62,353 C58,357 50,357 46,353 C50,363 58,365 62,361" {...s} strokeWidth={0.4} />
      {/* Gastroc heads */}
      <path d="M88,364 C88,376 86,388 84,398" {...p} strokeWidth={0.6} />
      <path d="M100,364 C100,376 100,388 98,398" {...p} strokeWidth={0.6} />
      <path d="M52,364 C52,376 54,388 56,398" {...p} strokeWidth={0.6} />
      <path d="M40,364 C40,376 40,388 42,398" {...p} strokeWidth={0.6} />
      {/* Achilles */}
      <path d="M92,396 C92,400 94,404 94,408" {...p} strokeWidth={0.7} />
      <path d="M48,396 C48,400 46,404 46,408" {...p} strokeWidth={0.7} />
    </g>
  );
}

function FemaleChestLines() {
  const bc = { stroke: "#1e1e1e", strokeWidth: 0.55, fill: "none", strokeLinecap: "round" as const, opacity: 0.38 };
  return (
    <g>
      <path d="M 70,112 C 76,108 86,110 92,118 C 96,126 94,138 88,142 C 82,146 74,143 70,137" {...bc} />
      <path d="M 70,112 C 64,108 54,110 48,118 C 44,126 46,138 52,142 C 58,146 66,143 70,137" {...bc} />
      <path d="M 70,139 C 76,143 84,143 90,141" {...bc} strokeWidth={0.4} opacity={0.24} />
      <path d="M 70,139 C 64,143 56,143 50,141" {...bc} strokeWidth={0.4} opacity={0.24} />
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  painSpots: PainSpot[];
  onToggle: (regionId: string, label: string, cx: number, cy: number, view: "front" | "back") => void;
  currentSize: SpotSize;
  intensity: number;
}

export default function BodyMap({ painSpots, onToggle, currentSize, intensity }: Props) {
  const [selectedSex, setSelectedSex] = useState<"male" | "female">("male");
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number; view: "front" | "back"; sex: "male" | "female" } | null>(null);

  function handleBodyClick(
    e: React.MouseEvent<SVGGElement>,
    view: "front" | "back",
    sex: "male" | "female"
  ) {
    const local = getLocalPt(e);
    if (!local) return;
    if (sex !== selectedSex) setSelectedSex(sex);
    const lm = nearestLandmark(local.x, local.y, view === "front" ? FRONT_LANDMARKS : BACK_LANDMARKS);
    const id = `ff-${view}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    onToggle(id, lm.label, local.x, local.y, view);
  }

  function handleBodyMove(e: React.MouseEvent<SVGGElement>, view: "front" | "back", sex: "male" | "female") {
    const local = getLocalPt(e);
    if (local) setHoverPos({ ...local, view, sex });
  }

  function handleBodyLeave() {
    setHoverPos(null);
  }

  function renderSpots(view: "front" | "back", sex: "male" | "female") {
    if (sex !== selectedSex) return null;
    return painSpots.filter((s) => s.view === view).map((spot) => {
      const r = spotRadius(spot.size);
      const color = spotColor(spot.intensity);
      const isDiffuse = spot.size === "diffuse";
      return (
        <g
          key={spot.regionId}
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(spot.regionId, spot.label, spot.cx, spot.cy, view);
          }}
        >
          {isDiffuse && (
            <circle cx={spot.cx} cy={spot.cy} r={r + 8} fill={color} opacity={0.18} filter="url(#bm-blur-diffuse)" />
          )}
          <circle cx={spot.cx} cy={spot.cy} r={r} fill={color} opacity={isDiffuse ? 0.72 : 0.92} stroke="white" strokeWidth={1.8} filter={isDiffuse ? "url(#bm-blur-diffuse)" : undefined} />
          {spot.size !== "pinpoint" && (
            <text x={spot.cx} y={spot.cy + 3.5} textAnchor="middle" fontSize={7} fontWeight="700" fill="white" style={{ pointerEvents: "none", userSelect: "none" }}>
              {spot.intensity}
            </text>
          )}
        </g>
      );
    });
  }

  function renderHoverDot(view: "front" | "back", sex: "male" | "female") {
    if (!hoverPos || hoverPos.view !== view || hoverPos.sex !== sex) return null;
    const r = spotRadius(currentSize);
    const color = spotColor(intensity);
    const isDiffuse = currentSize === "diffuse";
    return (
      <g pointerEvents="none" opacity={0.55}>
        {isDiffuse && (
          <circle cx={hoverPos.x} cy={hoverPos.y} r={r + 7} fill={color} opacity={0.2} filter="url(#bm-blur-diffuse)" />
        )}
        <circle cx={hoverPos.x} cy={hoverPos.y} r={r} fill={color} opacity={0.65} stroke="white" strokeWidth={1.5} filter={isDiffuse ? "url(#bm-blur-diffuse)" : undefined} />
      </g>
    );
  }

  // Plain render helper (not a React component — avoids remount on re-render)
  function fig(
    view: "front" | "back",
    sex: "male" | "female",
    torsoPth: string,
    rlegPth: string,
    llegPth: string,
    fillId: string,
    muscleEl: React.ReactNode
  ) {
    const isSelected = sex === selectedSex;
    return (
      <g opacity={isSelected ? 1 : 0.38} style={{ transition: "opacity 0.2s" }}>
        <g
          onClick={(e) => handleBodyClick(e, view, sex)}
          onMouseMove={(e) => handleBodyMove(e, view, sex)}
          onMouseLeave={handleBodyLeave}
          style={{ cursor: "crosshair" }}
          filter="url(#bm-fig-shadow)"
        >
          <path d={torsoPth} fill={fillId} />
          <path d={rlegPth} fill={fillId} />
          <path d={llegPth} fill={fillId} />
        </g>
        <g pointerEvents="none">{muscleEl}</g>
        <g pointerEvents="none">
          <path d={torsoPth} fill="none" stroke="#1a1a1a" strokeWidth={1.25} strokeLinejoin="round" />
          <path d={rlegPth} fill="none" stroke="#1a1a1a" strokeWidth={1.25} strokeLinejoin="round" />
          <path d={llegPth} fill="none" stroke="#1a1a1a" strokeWidth={1.25} strokeLinejoin="round" />
        </g>
        {renderSpots(view, sex)}
        {renderHoverDot(view, sex)}
      </g>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Sex selector */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-slate-500">Select figure:</span>
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          {(["male", "female"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSex(s)}
              className={`px-4 py-1.5 text-xs font-medium transition ${
                selectedSex === s ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-slate-400">
        Click anywhere on a figure to mark pain &mdash; click a dot to remove it
      </p>

      {/* 2×2 body map */}
      <div className="w-full">
        <svg
          viewBox="0 0 300 930"
          className="w-full"
          style={{ touchAction: "manipulation" }}
          role="img"
          aria-label="Body map — click anywhere to mark pain"
        >
          <SharedDefs />

          <text x="150" y="16" textAnchor="middle" fontSize={7.5} fontWeight="600" fill="#9ca3af" letterSpacing="2">MALE</text>
          <text x="150" y="480" textAnchor="middle" fontSize={7.5} fontWeight="600" fill="#9ca3af" letterSpacing="2">FEMALE</text>
          <line x1="4" y1="464" x2="296" y2="464" stroke="#e5e7eb" strokeWidth={1} />
          <line x1="150" y1="6" x2="150" y2="924" stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4,5" />

          {/* Male anterior */}
          <g transform="translate(4, 22)">
            {fig("front", "male", MF_TORSO, MF_RLEG, MF_LLEG, "url(#bm-fill-f)", <FrontLines />)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>ANTERIOR</text>
          </g>

          {/* Male posterior */}
          <g transform="translate(156, 22)">
            {fig("back", "male", MB_TORSO, MB_RLEG, MB_LLEG, "url(#bm-fill-b)", <BackLines />)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>POSTERIOR</text>
          </g>

          {/* Female anterior */}
          <g transform="translate(4, 486)">
            {fig("front", "female", FF_TORSO, FF_RLEG, FF_LLEG, "url(#bm-fill-f)", <><FrontLines /><FemaleChestLines /></>)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>ANTERIOR</text>
          </g>

          {/* Female posterior */}
          <g transform="translate(156, 486)">
            {fig("back", "female", FB_TORSO, FB_RLEG, FB_LLEG, "url(#bm-fill-b)", <BackLines />)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>POSTERIOR</text>
          </g>
        </svg>
      </div>

      {/* Active spot chips */}
      {painSpots.length > 0 && (
        <div className="flex w-full flex-wrap gap-1.5">
          {painSpots.map((spot) => (
            <button
              key={spot.regionId}
              type="button"
              onClick={() => onToggle(spot.regionId, spot.label, spot.cx, spot.cy, spot.view)}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:opacity-80"
              style={{
                borderColor: spotColor(spot.intensity),
                color: spotColor(spot.intensity),
                backgroundColor: `${spotColor(spot.intensity)}14`,
              }}
            >
              <span className="inline-block rounded-full" style={{ width: 7, height: 7, backgroundColor: spotColor(spot.intensity) }} />
              {spot.label}
              <span className="opacity-60">&middot; {spot.size} &middot; {spot.intensity}/10</span>
              <span className="ml-0.5 opacity-50">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

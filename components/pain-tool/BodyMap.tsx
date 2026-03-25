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

// Intensity scale 1–5
export function spotColor(intensity: number): string {
  if (intensity <= 1) return "#fcd34d";
  if (intensity <= 2) return "#f97316";
  if (intensity <= 3) return "#ef4444";
  if (intensity <= 4) return "#dc2626";
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
  { id: "neck",         label: "Front of Neck",         x: 70,  y: 60  },
  { id: "r-shoulder",   label: "Right Shoulder",        x: 116, y: 88  },
  { id: "l-shoulder",   label: "Left Shoulder",         x: 24,  y: 88  },
  { id: "sternum",      label: "Chest (Center)",        x: 70,  y: 96  },
  { id: "r-pec",        label: "Right Chest",           x: 92,  y: 112 },
  { id: "l-pec",        label: "Left Chest",            x: 48,  y: 112 },
  { id: "r-upper-arm",  label: "Right Upper Arm",       x: 122, y: 138 },
  { id: "l-upper-arm",  label: "Left Upper Arm",        x: 18,  y: 138 },
  { id: "r-elbow",      label: "Right Elbow",           x: 122, y: 172 },
  { id: "l-elbow",      label: "Left Elbow",            x: 18,  y: 172 },
  { id: "solar-plexus", label: "Upper Abdomen",         x: 70,  y: 142 },
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
  { id: "r-quad",       label: "Right Front Thigh",     x: 90,  y: 298 },
  { id: "l-quad",       label: "Left Front Thigh",      x: 50,  y: 298 },
  { id: "r-lat-knee",   label: "Right Outer Knee",      x: 102, y: 336 },
  { id: "l-lat-knee",   label: "Left Outer Knee",       x: 38,  y: 336 },
  { id: "r-med-knee",   label: "Right Inner Knee",      x: 82,  y: 336 },
  { id: "l-med-knee",   label: "Left Inner Knee",       x: 58,  y: 336 },
  { id: "r-shin",       label: "Right Shin",            x: 92,  y: 368 },
  { id: "l-shin",       label: "Left Shin",             x: 48,  y: 368 },
  { id: "r-ankle",      label: "Right Ankle",           x: 86,  y: 402 },
  { id: "l-ankle",      label: "Left Ankle",            x: 54,  y: 402 },
  { id: "r-foot",       label: "Right Foot",            x: 90,  y: 413 },
  { id: "l-foot",       label: "Left Foot",             x: 50,  y: 413 },
];

const BACK_LANDMARKS: Landmark[] = [
  { id: "head",         label: "Back of Head",          x: 70,  y: 20  },
  { id: "cerv-spine",   label: "Back of Neck",          x: 70,  y: 58  },
  { id: "r-upper-trap", label: "Right Neck / Trap",     x: 94,  y: 76  },
  { id: "l-upper-trap", label: "Left Neck / Trap",      x: 46,  y: 76  },
  { id: "r-shoulder",   label: "Right Shoulder",        x: 122, y: 92  },
  { id: "l-shoulder",   label: "Left Shoulder",         x: 18,  y: 92  },
  { id: "r-scapula",    label: "Right Shoulder Blade",  x: 92,  y: 114 },
  { id: "l-scapula",    label: "Left Shoulder Blade",   x: 48,  y: 114 },
  { id: "upper-back",   label: "Upper Back",            x: 70,  y: 108 },
  { id: "r-upper-arm",  label: "Right Upper Arm",       x: 126, y: 140 },
  { id: "l-upper-arm",  label: "Left Upper Arm",        x: 14,  y: 140 },
  { id: "r-elbow",      label: "Right Elbow",           x: 126, y: 174 },
  { id: "l-elbow",      label: "Left Elbow",            x: 14,  y: 174 },
  { id: "mid-back",     label: "Mid Back",              x: 70,  y: 138 },
  { id: "r-lat",        label: "Right Side (Ribs)",     x: 92,  y: 152 },
  { id: "l-lat",        label: "Left Side (Ribs)",      x: 48,  y: 152 },
  { id: "lower-back",   label: "Lower Back",            x: 70,  y: 172 },
  { id: "r-low-back",   label: "Right Lower Back",      x: 90,  y: 172 },
  { id: "l-low-back",   label: "Left Lower Back",       x: 50,  y: 172 },
  { id: "r-forearm",    label: "Right Forearm",         x: 122, y: 204 },
  { id: "l-forearm",    label: "Left Forearm",          x: 18,  y: 204 },
  { id: "r-wrist",      label: "Right Wrist",           x: 120, y: 228 },
  { id: "l-wrist",      label: "Left Wrist",            x: 20,  y: 228 },
  { id: "r-hand",       label: "Right Hand",            x: 116, y: 250 },
  { id: "l-hand",       label: "Left Hand",             x: 24,  y: 250 },
  { id: "sacrum",       label: "Tailbone Area",         x: 70,  y: 218 },
  { id: "r-glute",      label: "Right Buttock",         x: 94,  y: 244 },
  { id: "l-glute",      label: "Left Buttock",          x: 46,  y: 244 },
  { id: "r-out-thigh",  label: "Right Outer Thigh",     x: 100, y: 280 },
  { id: "l-out-thigh",  label: "Left Outer Thigh",      x: 40,  y: 280 },
  { id: "r-hamstring",  label: "Right Hamstring",       x: 88,  y: 302 },
  { id: "l-hamstring",  label: "Left Hamstring",        x: 52,  y: 302 },
  { id: "r-popliteal",  label: "Back of Right Knee",    x: 88,  y: 350 },
  { id: "l-popliteal",  label: "Back of Left Knee",     x: 52,  y: 350 },
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
// Space: 140 × 420 units, center x=70.
// Male: 7.5 head-heights, shoulder 2.5hw, waist 1.75hw, hip 2.2hw.
// Female: 7 head-heights, shoulder 2hw, waist 1.5hw, hip 2.4hw.

// ── MALE FRONT ────────────────────────────────────────────────────────────────

const MF_TORSO = `
  M 70,4
  C 83,4 93,14 93,28 C 93,42 88,53 82,57 C 78,60 75,63 74,67
  C 77,67 86,67 97,71 C 110,75 120,79 126,85
  C 130,89 134,97 134,110
  C 133,124 132,140 130,156 C 130,165 129,173 130,177
  C 130,185 128,199 126,214 C 124,228 121,242 119,252
  C 117,260 114,268 111,274 C 109,278 107,280 107,277
  C 107,272 109,266 113,258
  C 116,252 120,250 124,254 C 127,258 126,266 122,271
  C 118,271 115,263 117,252
  C 117,242 118,228 119,212 C 120,196 120,183 120,175
  C 120,169 120,158 118,144 C 117,128 116,112 116,101
  C 115,94 112,90 110,94
  C 114,90 116,98 116,113 C 115,130 114,148 112,164
  C 110,171 107,175 104,177
  C 103,185 106,196 111,206 C 113,214 113,219 99,223
  C 93,225 87,226 84,226
  C 80,226 74,225 66,222
  C 56,219 46,213 39,205 C 32,195 26,184 32,177
  C 29,171 26,162 26,148 C 24,130 24,113 25,99
  C 24,91 22,90 30,94
  C 26,90 24,101 24,114 C 23,130 22,146 22,160
  C 21,170 21,175 22,177
  C 23,185 24,198 24,214 C 24,229 23,243 22,252
  C 21,260 20,268 22,272 C 24,278 26,279 28,276
  C 29,271 27,265 25,258
  C 21,252 17,250 15,254 C 13,258 14,266 18,271
  C 22,271 25,263 23,252
  C 21,242 19,228 17,214 C 15,198 13,184 12,176
  C 11,169 10,160 10,148 C 9,132 9,116 10,102
  C 9,95 8,89 8,86
  C 10,81 16,78 26,74 C 40,70 52,66 60,64
  C 63,62 65,60 66,67
  C 65,63 62,59 57,56 C 52,50 48,40 48,26
  C 48,13 58,4 70,4 Z
`;

const MF_RLEG = `
  M 99,223
  C 102,234 105,248 107,264 C 108,278 108,290 107,304
  C 106,314 105,322 104,330 C 104,336 105,340 106,344
  C 107,349 106,354 104,360 C 103,366 102,372 101,380
  C 100,388 99,396 97,404 C 95,408 93,412 92,416
  C 92,418 94,420 96,421 C 99,422 103,422 107,421
  C 105,422 101,422 96,422 C 91,422 86,421 81,419
  C 77,417 73,415 71,411 C 69,407 69,403 71,401
  C 73,399 76,398 78,395 C 80,390 81,384 82,376
  C 82,368 82,360 81,352 C 81,346 81,340 82,334
  C 83,328 83,322 81,315 C 79,306 78,296 76,282
  C 74,266 73,252 75,238 C 77,229 80,224 84,224 Z
`;

const MF_LLEG = `
  M 41,223
  C 38,234 35,248 33,264 C 32,278 32,290 33,304
  C 34,314 35,322 36,330 C 36,336 35,340 34,344
  C 33,349 34,354 36,360 C 37,366 38,372 39,380
  C 40,388 41,396 43,404 C 45,408 47,412 48,416
  C 48,418 46,420 44,421 C 41,422 37,422 33,421
  C 35,422 39,422 44,422 C 49,422 54,421 59,419
  C 63,417 67,415 69,411 C 71,407 71,403 69,401
  C 67,399 64,398 62,395 C 60,390 59,384 58,376
  C 58,368 58,360 59,352 C 59,346 59,340 58,334
  C 57,328 57,322 59,315 C 61,306 62,296 64,282
  C 66,266 67,252 65,238 C 63,229 60,224 56,224 Z
`;

// ── MALE BACK ─────────────────────────────────────────────────────────────────

const MB_TORSO = `
  M 70,4
  C 83,4 93,14 93,28 C 93,42 88,52 82,57 C 79,60 77,63 76,67
  C 80,67 90,68 102,72 C 114,76 122,80 127,86
  C 131,90 135,98 135,111
  C 134,125 133,141 131,157 C 130,165 130,173 131,177
  C 131,185 129,199 127,215 C 124,229 122,243 120,253
  C 118,261 115,269 112,275 C 110,279 108,281 108,278
  C 107,273 109,267 113,259
  C 117,252 121,250 125,254 C 127,259 126,267 122,272
  C 118,272 115,264 117,253
  C 117,242 118,228 119,212 C 120,196 120,183 120,175
  C 120,169 120,158 118,144 C 117,128 116,112 116,101
  C 115,93 112,89 110,93
  C 114,89 116,97 116,112 C 116,128 114,146 112,162
  C 110,169 107,173 105,177
  C 104,185 107,197 112,208 C 115,218 115,228 108,244
  C 99,254 86,262 70,264
  C 54,262 41,254 32,244 C 25,228 25,218 28,208
  C 33,197 36,185 36,177
  C 33,169 30,162 26,146 C 24,130 24,113 25,101
  C 24,92 22,90 30,93
  C 26,89 24,100 24,114 C 23,130 22,146 22,160
  C 21,170 21,175 22,177
  C 23,185 24,198 24,214 C 24,229 23,243 22,253
  C 21,261 20,269 22,275 C 24,279 26,280 28,277
  C 29,272 27,267 25,259
  C 21,253 17,251 15,254 C 13,259 14,267 18,272
  C 22,272 25,264 23,253
  C 21,242 19,228 17,214 C 15,198 13,184 12,176
  C 11,169 10,160 10,148 C 9,132 9,116 10,102
  C 9,95 8,89 8,86
  C 9,81 14,78 24,74 C 38,70 50,66 58,64
  C 62,62 64,60 64,67
  C 62,61 58,57 53,54 C 48,46 48,30 48,16
  C 50,8 60,4 70,4 Z
`;

const MB_RLEG = `
  M 99,242
  C 102,254 105,266 107,280 C 108,294 107,308 105,322
  C 104,330 104,340 106,347 C 108,353 109,358 107,364
  C 105,371 103,380 102,390 C 100,399 97,406 94,410
  C 92,413 91,417 93,420 C 96,421 100,421 104,421
  C 102,422 97,422 92,422 C 87,422 82,420 78,418
  C 75,416 72,412 71,407 C 70,403 71,399 74,400
  C 76,397 79,392 81,386 C 83,379 84,371 83,363
  C 82,355 82,347 82,341 C 82,335 83,328 81,322
  C 80,312 77,298 76,282 C 74,264 73,250 75,240
  C 77,236 80,235 84,237 Z
`;

const MB_LLEG = `
  M 41,242
  C 38,254 35,266 33,280 C 32,294 33,308 35,322
  C 36,330 36,340 34,347 C 32,353 31,358 33,364
  C 35,371 37,380 38,390 C 40,399 43,406 46,410
  C 48,413 49,417 47,420 C 44,421 40,421 36,421
  C 38,422 43,422 48,422 C 53,422 58,420 62,418
  C 65,416 68,412 69,407 C 70,403 69,399 66,400
  C 64,397 61,392 59,386 C 57,379 56,371 57,363
  C 58,355 58,347 58,341 C 58,335 57,328 59,322
  C 60,312 63,298 64,282 C 66,264 67,250 65,240
  C 63,236 60,235 56,237 Z
`;

// ── FEMALE FRONT ──────────────────────────────────────────────────────────────
// Narrower shoulders, bust contour, narrower waist, wider hips than male

const FF_TORSO = `
  M 70,4
  C 83,4 92,14 92,29 C 92,43 87,53 81,57 C 77,60 74,63 74,68
  C 77,68 84,68 94,72 C 106,76 116,80 121,86
  C 125,90 128,98 128,110
  C 127,124 126,140 124,156 C 124,164 123,172 124,176
  C 124,184 122,196 120,212 C 118,226 115,240 113,250
  C 111,258 108,267 105,273 C 103,278 101,280 101,277
  C 101,272 103,265 107,257
  C 110,251 114,250 118,254 C 121,258 120,266 116,270
  C 112,271 110,263 111,252
  C 111,242 112,228 113,212 C 114,196 114,183 114,175
  C 114,169 114,158 112,143 C 111,127 110,111 110,100
  C 109,92 107,88 104,92
  C 107,87 109,96 108,112 C 106,130 104,152 104,166
  C 102,176 100,182 98,186
  C 96,194 100,208 106,218 C 109,226 112,232 102,236
  C 96,238 89,240 84,240
  C 80,240 74,239 66,236
  C 56,232 46,226 38,218 C 30,208 28,194 32,186
  C 30,180 28,170 26,160 C 24,143 24,126 24,113
  C 24,93 22,89 29,92
  C 26,89 24,100 23,114 C 22,130 21,146 21,160
  C 20,171 20,176 22,177
  C 22,185 23,196 23,212 C 22,228 21,242 20,252
  C 20,260 19,268 20,272 C 22,278 24,280 26,277
  C 27,272 25,265 23,257
  C 20,251 16,250 14,254 C 12,258 13,266 17,271
  C 21,271 23,263 21,252
  C 20,241 18,227 16,213 C 14,197 12,184 11,175
  C 10,169 9,160 9,148 C 9,130 9,114 10,100
  C 9,93 8,89 8,86
  C 10,81 14,78 22,74 C 36,70 49,66 57,65
  C 61,63 63,61 64,68
  C 63,63 60,59 55,56 C 50,50 48,40 48,27
  C 48,13 58,4 70,4 Z
`;

const FF_RLEG = `
  M 102,236
  C 105,248 108,262 110,278 C 111,292 110,306 108,320
  C 107,328 106,336 108,342 C 109,348 108,354 106,360
  C 104,368 102,380 101,390 C 99,398 97,404 95,409
  C 93,413 92,417 93,420 C 96,421 100,421 105,421
  C 103,422 98,422 92,422 C 87,422 82,420 78,418
  C 75,416 72,412 71,407 C 70,403 72,400 74,400
  C 76,398 79,393 81,386 C 82,378 82,368 81,360
  C 80,352 80,345 81,338 C 82,332 83,326 81,319
  C 79,310 77,297 76,281 C 74,263 73,249 75,235
  C 77,229 80,228 84,230 Z
`;

const FF_LLEG = `
  M 38,236
  C 35,248 32,262 30,278 C 29,292 30,306 32,320
  C 33,328 34,336 32,342 C 31,348 32,354 34,360
  C 36,368 38,380 39,390 C 41,398 43,404 45,409
  C 47,413 48,417 47,420 C 44,421 40,421 35,421
  C 37,422 42,422 48,422 C 53,422 58,420 62,418
  C 65,416 68,412 69,407 C 70,403 68,400 66,400
  C 64,398 61,393 59,386 C 58,378 58,368 59,360
  C 60,352 60,345 59,338 C 58,332 57,326 59,319
  C 61,310 63,297 64,281 C 66,263 67,249 65,235
  C 63,229 60,228 56,230 Z
`;

// ── FEMALE BACK ───────────────────────────────────────────────────────────────

const FB_TORSO = `
  M 70,4
  C 83,4 92,14 92,29 C 92,43 87,52 81,57 C 78,60 76,63 76,68
  C 80,68 88,69 98,73 C 110,77 118,81 122,87
  C 126,91 129,99 129,111
  C 128,125 127,141 125,157 C 124,165 124,173 125,177
  C 125,185 123,197 121,213 C 118,227 116,241 114,251
  C 112,259 109,268 106,274 C 104,279 102,281 102,278
  C 101,273 103,266 107,258
  C 110,251 114,251 118,255 C 121,259 120,267 116,271
  C 112,271 110,263 111,252
  C 111,242 112,228 113,212 C 114,196 114,183 114,175
  C 114,169 114,158 112,143 C 111,127 110,111 110,100
  C 109,92 107,88 104,92
  C 107,87 109,96 108,112 C 107,130 104,148 102,162
  C 100,172 98,179 99,188 C 100,200 106,218 114,234
  C 118,244 118,256 110,268 C 102,276 86,280 70,280
  C 54,280 38,276 30,268 C 22,256 22,244 26,234
  C 34,218 40,200 41,188 C 42,179 40,172 38,162
  C 36,148 33,130 32,114
  C 30,98 30,89 30,96
  C 24,89 22,90 29,92
  C 25,88 23,99 23,113 C 22,129 21,145 21,159
  C 20,170 20,175 21,177
  C 22,185 23,197 23,213 C 22,228 21,242 20,251
  C 20,259 19,268 20,274 C 22,280 24,281 26,278
  C 27,273 25,267 23,258
  C 20,251 16,251 14,255 C 12,259 13,267 17,271
  C 21,271 23,263 21,252
  C 20,241 18,227 16,213 C 14,197 12,184 11,177
  C 10,169 9,160 9,148 C 9,129 9,113 10,100
  C 9,93 8,89 8,87
  C 9,82 14,79 22,75 C 36,71 49,67 57,65
  C 61,63 63,61 64,68
  C 62,62 58,57 53,54 C 48,46 48,30 48,16
  C 50,8 60,4 70,4 Z
`;

const FB_RLEG = `
  M 100,246
  C 103,258 106,272 108,286 C 109,300 108,314 106,328
  C 105,336 105,344 107,351 C 109,357 109,362 107,368
  C 105,375 103,383 101,393 C 99,401 97,407 95,411
  C 93,415 91,419 93,421 C 96,422 100,422 105,421
  C 103,422 98,422 92,422 C 87,422 82,420 78,418
  C 75,416 72,412 71,407 C 70,403 71,399 74,400
  C 76,397 79,392 81,386 C 83,379 84,371 83,363
  C 82,355 82,347 82,341 C 82,334 83,328 81,321
  C 80,311 77,297 76,281 C 74,263 73,250 75,244
  C 77,240 80,239 84,241 Z
`;

const FB_LLEG = `
  M 40,246
  C 37,258 34,272 32,286 C 31,300 32,314 34,328
  C 35,336 35,344 33,351 C 31,357 31,362 33,368
  C 35,375 37,383 39,393 C 41,401 43,407 45,411
  C 47,415 49,419 47,421 C 44,422 40,422 35,421
  C 37,422 42,422 48,422 C 53,422 58,420 62,418
  C 65,416 68,412 69,407 C 70,403 69,399 66,400
  C 64,397 61,392 59,386 C 57,379 56,371 57,363
  C 58,355 58,347 58,341 C 58,334 57,328 59,321
  C 60,311 63,297 64,281 C 66,263 67,250 65,244
  C 63,240 60,239 56,241 Z
`;

// ── SVG defs ──────────────────────────────────────────────────────────────────

function SharedDefs() {
  return (
    <defs>
      <filter id="bm-blur-diffuse" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="bm-fig-shadow" x="-20%" y="-5%" width="140%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#64748b" floodOpacity="0.10" />
      </filter>
    </defs>
  );
}

// ── Muscle detail lines (B&W) ─────────────────────────────────────────────────

function FrontLines() {
  const p = { stroke: "#1e1e1e", strokeWidth: 0.6, fill: "none", strokeLinecap: "round" as const, opacity: 0.42 };
  const s = { stroke: "#2e2e2e", strokeWidth: 0.42, fill: "none", strokeLinecap: "round" as const, opacity: 0.28 };
  const f = { stroke: "#1a1a1a", strokeWidth: 0.5, fill: "none", strokeLinecap: "round" as const, opacity: 0.35 };
  return (
    <g>
      {/* ── Face features ── */}
      {/* Brow ridge */}
      <path d="M60,19 C63,17 67,16 70,17 C73,16 77,17 80,19" {...f} />
      {/* Eyes */}
      <ellipse cx="62" cy="24" rx="5" ry="3" {...f} opacity={0.3} />
      <ellipse cx="78" cy="24" rx="5" ry="3" {...f} opacity={0.3} />
      {/* Nose bridge + tip */}
      <path d="M70,26 C70,32 70,36 70,39" {...f} strokeWidth={0.4} />
      <path d="M66,39 C67,41 70,42 74,39" {...f} strokeWidth={0.4} />
      {/* Philtrum + lips */}
      <path d="M63,46 C66,49 74,49 77,46" {...f} />
      <path d="M65,46 C67,44 73,44 75,46" {...f} strokeWidth={0.3} opacity={0.2} />
      {/* Chin definition */}
      <path d="M63,53 C66,56 74,56 77,53" {...f} strokeWidth={0.35} opacity={0.25} />
      {/* ── Neck SCM ── */}
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
  const f = { stroke: "#1a1a1a", strokeWidth: 0.5, fill: "none", strokeLinecap: "round" as const, opacity: 0.3 };
  return (
    <g>
      {/* ── Back of head ── */}
      {/* Occipital ridge */}
      <path d="M56,22 C61,19 70,18 79,22" {...f} />
      {/* Ear hints */}
      <path d="M49,30 C47,33 47,38 49,41" {...f} strokeWidth={0.4} />
      <path d="M91,30 C93,33 93,38 91,41" {...f} strokeWidth={0.4} />
      {/* Hair line curve */}
      <path d="M52,10 C58,6 70,4 82,10" {...f} strokeWidth={0.3} opacity={0.2} />
      {/* ── Upper trap ── */}
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
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number; screenX: number; screenY: number; view: "front" | "back"; sex: "male" | "female" } | null>(null);

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
    if (local) setHoverPos({ ...local, screenX: e.clientX, screenY: e.clientY, view, sex });
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
    muscleEl: React.ReactNode
  ) {
    const isSelected = sex === selectedSex;
    return (
      <g opacity={isSelected ? 1 : 0.35} style={{ transition: "opacity 0.2s" }}>
        <g
          onClick={(e) => handleBodyClick(e, view, sex)}
          onMouseMove={(e) => handleBodyMove(e, view, sex)}
          onMouseLeave={handleBodyLeave}
          style={{ cursor: "crosshair" }}
          filter="url(#bm-fig-shadow)"
        >
          <path d={torsoPth} fill="white" />
          <path d={rlegPth} fill="white" />
          <path d={llegPth} fill="white" />
        </g>
        <g pointerEvents="none">{muscleEl}</g>
        <g pointerEvents="none">
          <path d={torsoPth} fill="none" stroke="#1e293b" strokeWidth={1.4} strokeLinejoin="round" />
          <path d={rlegPth} fill="none" stroke="#1e293b" strokeWidth={1.4} strokeLinejoin="round" />
          <path d={llegPth} fill="none" stroke="#1e293b" strokeWidth={1.4} strokeLinejoin="round" />
        </g>
        {renderSpots(view, sex)}
        {renderHoverDot(view, sex)}
      </g>
    );
  }

  const tooltipLabel = hoverPos
    ? nearestLandmark(hoverPos.x, hoverPos.y, hoverPos.view === "front" ? FRONT_LANDMARKS : BACK_LANDMARKS).label
    : null;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Floating anatomy label tooltip */}
      {hoverPos && tooltipLabel && (
        <div
          className="pointer-events-none fixed z-50 rounded-md bg-slate-800/90 px-2.5 py-1 text-[11px] font-medium text-white shadow-md backdrop-blur-sm"
          style={{ left: hoverPos.screenX + 16, top: hoverPos.screenY - 32 }}
        >
          {tooltipLabel}
        </div>
      )}
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
            {fig("front", "male", MF_TORSO, MF_RLEG, MF_LLEG, <FrontLines />)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>ANTERIOR</text>
          </g>

          {/* Male posterior */}
          <g transform="translate(156, 22)">
            {fig("back", "male", MB_TORSO, MB_RLEG, MB_LLEG, <BackLines />)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>POSTERIOR</text>
          </g>

          {/* Female anterior */}
          <g transform="translate(4, 486)">
            {fig("front", "female", FF_TORSO, FF_RLEG, FF_LLEG, <><FrontLines /><FemaleChestLines /></>)}
            <text x="70" y="432" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5" style={{ pointerEvents: "none" }}>ANTERIOR</text>
          </g>

          {/* Female posterior */}
          <g transform="translate(156, 486)">
            {fig("back", "female", FB_TORSO, FB_RLEG, FB_LLEG, <BackLines />)}
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
              <span className="opacity-60">&middot; {spot.size} &middot; {spot.intensity}/5</span>
              <span className="ml-0.5 opacity-50">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

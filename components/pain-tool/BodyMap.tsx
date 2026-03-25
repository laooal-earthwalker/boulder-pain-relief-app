"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SpotSize = "pinpoint" | "regional" | "diffuse";

export interface PainSpot {
  regionId: string;
  label: string;
  size: SpotSize;
  intensity: number;
  cx: number;
  cy: number;
  view: "front" | "back";
}

interface Region {
  id: string;
  label: string;
  clipPath: string;
  dotCenter: { x: number; y: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function rr(x: number, y: number, w: number, h: number, r: number): string {
  return [
    `M${x + r},${y}`,
    `L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r}`,
    `L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h}`,
    `L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r}`,
    `L${x},${y + r} Q${x},${y} ${x + r},${y} Z`,
  ].join(" ");
}

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

// ── Region data (local 0–140 x, 0–410 y, center x=70) ────────────────────────

const FRONT_REGIONS: Region[] = [
  { id: "head-neck", label: "Head / Neck", clipPath: rr(50, 2, 40, 72, 20), dotCenter: { x: 70, y: 30 } },
  { id: "left-shoulder", label: "Left Shoulder", clipPath: "M22,64 C8,64 2,76 4,94 C6,108 16,114 30,112 C42,110 48,98 46,84 C44,72 34,62 22,64 Z", dotCenter: { x: 22, y: 90 } },
  { id: "right-shoulder", label: "Right Shoulder", clipPath: "M118,64 C132,64 138,76 136,94 C134,108 124,114 110,112 C98,110 92,98 94,84 C96,72 106,62 118,64 Z", dotCenter: { x: 118, y: 90 } },
  { id: "chest", label: "Chest", clipPath: rr(44, 72, 52, 80, 10), dotCenter: { x: 70, y: 112 } },
  { id: "left-upper-arm", label: "Left Upper Arm", clipPath: "M18,96 C8,96 2,116 4,138 C6,156 16,168 28,166 C38,162 42,148 40,128 C38,108 28,94 18,96 Z", dotCenter: { x: 18, y: 133 } },
  { id: "right-upper-arm", label: "Right Upper Arm", clipPath: "M122,96 C132,96 138,116 136,138 C134,156 124,168 112,166 C102,162 98,148 100,128 C102,108 112,94 122,96 Z", dotCenter: { x: 122, y: 133 } },
  { id: "left-forearm", label: "Left Forearm", clipPath: rr(4, 166, 28, 52, 12), dotCenter: { x: 18, y: 193 } },
  { id: "right-forearm", label: "Right Forearm", clipPath: rr(108, 166, 28, 52, 12), dotCenter: { x: 122, y: 193 } },
  { id: "left-hand", label: "Left Hand", clipPath: "M6,220 C2,228 4,242 12,248 C20,252 32,248 36,240 C38,232 34,220 26,216 C18,212 8,214 6,220 Z", dotCenter: { x: 18, y: 234 } },
  { id: "right-hand", label: "Right Hand", clipPath: "M134,220 C138,228 136,242 128,248 C120,252 108,248 104,240 C102,232 106,220 114,216 C122,212 132,214 134,220 Z", dotCenter: { x: 122, y: 234 } },
  { id: "left-hip", label: "Left Hip", clipPath: "M38,172 C26,174 20,194 24,212 C28,226 40,234 54,230 C66,226 70,214 68,200 C66,184 58,170 48,168 C44,166 40,170 38,172 Z", dotCenter: { x: 42, y: 202 } },
  { id: "right-hip", label: "Right Hip", clipPath: "M102,172 C114,174 120,194 116,212 C112,226 100,234 86,230 C74,226 70,214 72,200 C74,184 82,170 92,168 C96,166 100,170 102,172 Z", dotCenter: { x: 98, y: 202 } },
  { id: "left-quad", label: "Left Quad", clipPath: "M36,234 C26,240 24,266 26,292 C28,312 38,322 52,320 C64,318 70,306 68,288 C66,264 62,240 52,232 C46,228 40,230 36,234 Z", dotCenter: { x: 46, y: 276 } },
  { id: "right-quad", label: "Right Quad", clipPath: "M104,234 C114,240 116,266 114,292 C112,312 102,322 88,320 C76,318 70,306 72,288 C74,264 78,240 88,232 C94,228 100,230 104,234 Z", dotCenter: { x: 94, y: 276 } },
  { id: "left-shin", label: "Left Shin / Calf", clipPath: rr(28, 322, 32, 70, 14), dotCenter: { x: 44, y: 358 } },
  { id: "right-shin", label: "Right Shin / Calf", clipPath: rr(80, 322, 32, 70, 14), dotCenter: { x: 96, y: 358 } },
  { id: "left-foot", label: "Left Foot", clipPath: "M18,394 C14,400 18,412 28,416 C38,418 54,416 64,410 C72,406 72,398 66,394 C60,390 46,388 34,390 C26,390 20,392 18,394 Z", dotCenter: { x: 40, y: 403 } },
  { id: "right-foot", label: "Right Foot", clipPath: "M122,394 C126,400 122,412 112,416 C102,418 86,416 76,410 C68,406 68,398 74,394 C80,390 94,388 106,390 C114,390 120,392 122,394 Z", dotCenter: { x: 100, y: 403 } },
];

const BACK_REGIONS: Region[] = [
  { id: "head-neck", label: "Head / Neck", clipPath: rr(50, 2, 40, 72, 20), dotCenter: { x: 70, y: 30 } },
  { id: "left-shoulder", label: "Left Shoulder", clipPath: "M22,64 C8,64 2,76 4,94 C6,108 16,114 30,112 C42,110 48,98 46,84 C44,72 34,62 22,64 Z", dotCenter: { x: 22, y: 90 } },
  { id: "right-shoulder", label: "Right Shoulder", clipPath: "M118,64 C132,64 138,76 136,94 C134,108 124,114 110,112 C98,110 92,98 94,84 C96,72 106,62 118,64 Z", dotCenter: { x: 118, y: 90 } },
  { id: "upper-back", label: "Upper Back", clipPath: rr(44, 72, 52, 62, 10), dotCenter: { x: 70, y: 103 } },
  { id: "lower-back", label: "Lower Back", clipPath: rr(38, 136, 64, 64, 10), dotCenter: { x: 70, y: 168 } },
  { id: "left-upper-arm", label: "Left Upper Arm", clipPath: "M18,96 C8,96 2,116 4,138 C6,156 16,168 28,166 C38,162 42,148 40,128 C38,108 28,94 18,96 Z", dotCenter: { x: 18, y: 133 } },
  { id: "right-upper-arm", label: "Right Upper Arm", clipPath: "M122,96 C132,96 138,116 136,138 C134,156 124,168 112,166 C102,162 98,148 100,128 C102,108 112,94 122,96 Z", dotCenter: { x: 122, y: 133 } },
  { id: "left-forearm", label: "Left Forearm", clipPath: rr(4, 166, 28, 52, 12), dotCenter: { x: 18, y: 193 } },
  { id: "right-forearm", label: "Right Forearm", clipPath: rr(108, 166, 28, 52, 12), dotCenter: { x: 122, y: 193 } },
  { id: "left-hand", label: "Left Hand", clipPath: "M6,220 C2,228 4,242 12,248 C20,252 32,248 36,240 C38,232 34,220 26,216 C18,212 8,214 6,220 Z", dotCenter: { x: 18, y: 234 } },
  { id: "right-hand", label: "Right Hand", clipPath: "M134,220 C138,228 136,242 128,248 C120,252 108,248 104,240 C102,232 106,220 114,216 C122,212 132,214 134,220 Z", dotCenter: { x: 122, y: 234 } },
  { id: "left-glute", label: "Left Glute", clipPath: "M38,202 C26,206 20,226 24,248 C28,264 42,274 56,270 C68,266 72,252 70,236 C68,220 58,202 48,200 C44,198 40,200 38,202 Z", dotCenter: { x: 44, y: 238 } },
  { id: "right-glute", label: "Right Glute", clipPath: "M102,202 C114,206 120,226 116,248 C112,264 98,274 84,270 C72,266 68,252 70,236 C72,220 82,202 92,200 C96,198 100,200 102,202 Z", dotCenter: { x: 96, y: 238 } },
  { id: "left-hamstring", label: "Left Hamstring", clipPath: "M36,272 C26,278 24,304 26,328 C28,348 38,360 52,358 C64,356 70,342 68,322 C66,298 60,274 50,268 C44,264 40,268 36,272 Z", dotCenter: { x: 46, y: 314 } },
  { id: "right-hamstring", label: "Right Hamstring", clipPath: "M104,272 C114,278 116,304 114,328 C112,348 102,360 88,358 C76,356 70,342 72,322 C74,298 80,274 90,268 C96,264 100,268 104,272 Z", dotCenter: { x: 94, y: 314 } },
  { id: "left-calf", label: "Left Calf", clipPath: rr(28, 360, 30, 44, 13), dotCenter: { x: 43, y: 382 } },
  { id: "right-calf", label: "Right Calf", clipPath: rr(82, 360, 30, 44, 13), dotCenter: { x: 97, y: 382 } },
  { id: "left-foot", label: "Left Foot", clipPath: "M18,394 C14,400 18,412 28,416 C38,418 54,416 64,410 C72,406 72,398 66,394 C60,390 46,388 34,390 C26,390 20,392 18,394 Z", dotCenter: { x: 40, y: 403 } },
  { id: "right-foot", label: "Right Foot", clipPath: "M122,394 C126,400 122,412 112,416 C102,418 86,416 76,410 C68,406 68,398 74,394 C80,390 94,388 106,390 C114,390 120,392 122,394 Z", dotCenter: { x: 100, y: 403 } },
];

export const REGION_LABELS: Record<string, string> = Object.fromEntries(
  [...FRONT_REGIONS, ...BACK_REGIONS].map((r) => [r.id, r.label])
);

// ── Body paths ────────────────────────────────────────────────────────────────

const MALE_FRONT_PATH = `
  M 70,2
  C 93,2 95,28 87,50
  C 83,58 79,66 79,68
  C 87,66 105,66 123,76
  C 135,82 133,100 127,114
  C 123,128 119,146 117,162
  C 115,176 113,192 111,208
  C 109,218 109,228 111,234
  C 113,240 117,238 119,232
  C 121,224 121,210 121,198
  C 123,182 125,166 125,146
  C 127,128 127,110 121,96
  C 119,88 111,80 99,80
  C 102,88 104,108 106,130
  C 106,150 100,168 96,182
  C 96,192 100,206 106,218
  C 108,228 108,240 106,256
  C 105,274 105,296 103,320
  C 103,336 101,350 101,374
  C 101,386 105,396 101,402
  C 91,406 81,406 70,406
  C 59,406 49,406 39,402
  C 35,396 39,386 39,374
  C 39,350 37,336 37,320
  C 35,296 35,274 34,256
  C 32,240 32,228 34,218
  C 40,206 44,192 44,182
  C 40,168 38,150 36,130
  C 36,110 38,88 40,80
  C 29,80 21,88 19,96
  C 13,110 13,128 13,146
  C 13,166 15,182 17,198
  C 17,210 17,224 19,232
  C 21,238 25,240 27,234
  C 29,228 29,218 27,208
  C 25,192 23,176 21,162
  C 19,146 15,128 11,114
  C 5,100 7,82 19,76
  C 37,66 55,66 61,68
  C 61,66 57,58 53,50
  C 45,28 47,2 70,2 Z
`;

const MALE_BACK_PATH = `
  M 70,2
  C 93,2 95,28 87,50
  C 83,58 79,66 79,68
  C 87,66 107,64 125,74
  C 137,80 137,98 131,114
  C 127,128 121,146 119,162
  C 117,176 115,192 113,208
  C 111,218 111,228 113,234
  C 115,240 119,238 121,232
  C 123,224 123,210 123,198
  C 125,182 127,166 127,146
  C 129,128 129,110 123,96
  C 121,88 113,80 101,80
  C 104,88 106,108 108,130
  C 108,150 102,168 98,182
  C 100,192 108,210 112,224
  C 114,234 112,246 108,258
  C 106,276 105,296 103,320
  C 103,336 101,350 101,374
  C 101,386 105,396 101,402
  C 91,406 81,406 70,406
  C 59,406 49,406 39,402
  C 35,396 39,386 39,374
  C 39,350 37,336 37,320
  C 35,296 34,276 32,258
  C 28,246 26,234 28,224
  C 32,210 40,192 42,182
  C 38,168 34,150 34,130
  C 36,110 36,88 38,80
  C 27,80 19,88 17,96
  C 11,110 11,128 11,146
  C 11,166 13,182 15,198
  C 15,210 15,224 17,232
  C 19,238 23,240 25,234
  C 27,228 27,218 25,208
  C 23,192 21,176 19,162
  C 17,146 13,128 9,114
  C 3,100 3,80 17,74
  C 33,64 53,64 61,68
  C 61,66 57,58 53,50
  C 45,28 47,2 70,2 Z
`;

// Female: narrower shoulders (~118 vs 123), wider hips (~112/28 vs ~106/34)
const FEMALE_FRONT_PATH = `
  M 70,2
  C 93,2 95,28 87,50
  C 83,58 79,66 79,68
  C 85,66 102,66 118,74
  C 129,80 127,98 121,112
  C 118,126 114,144 112,160
  C 110,174 108,190 106,206
  C 104,216 104,226 106,232
  C 108,238 112,236 114,230
  C 116,222 116,208 116,196
  C 118,180 120,164 120,144
  C 122,126 122,108 116,94
  C 114,86 107,78 96,78
  C 100,86 102,106 104,128
  C 104,148 98,166 94,180
  C 94,190 100,208 112,222
  C 114,232 114,244 112,260
  C 110,278 109,300 107,322
  C 107,338 105,352 105,376
  C 105,388 109,398 105,404
  C 95,408 83,408 70,408
  C 57,408 45,408 35,404
  C 31,398 35,388 35,376
  C 35,352 33,338 33,322
  C 31,300 30,278 28,260
  C 26,244 26,232 28,222
  C 40,208 46,190 46,180
  C 42,166 38,148 36,128
  C 38,106 40,86 44,78
  C 33,78 26,86 24,94
  C 18,108 18,126 18,144
  C 18,164 20,180 22,196
  C 22,208 22,222 24,230
  C 26,236 30,238 32,232
  C 34,226 34,216 34,206
  C 32,190 30,174 28,160
  C 22,144 18,126 16,112
  C 11,98 13,80 22,74
  C 37,66 55,66 61,68
  C 61,66 57,58 53,50
  C 45,28 47,2 70,2 Z
`;

const FEMALE_BACK_PATH = `
  M 70,2
  C 93,2 95,28 87,50
  C 83,58 79,66 79,68
  C 85,66 104,64 120,72
  C 131,78 131,96 125,112
  C 122,126 116,144 114,160
  C 112,174 110,190 108,206
  C 106,216 106,226 108,232
  C 110,238 114,236 116,230
  C 118,222 118,208 118,196
  C 120,180 122,164 122,144
  C 124,126 124,108 118,94
  C 116,86 109,78 98,78
  C 102,86 104,106 106,128
  C 106,148 100,166 96,180
  C 98,192 108,212 116,226
  C 118,238 116,250 112,262
  C 110,280 108,300 106,322
  C 106,338 104,352 104,376
  C 104,388 108,398 104,404
  C 94,408 82,408 70,408
  C 58,408 46,408 36,404
  C 32,398 36,388 36,376
  C 36,352 34,338 34,322
  C 32,300 30,280 28,262
  C 24,250 22,238 24,226
  C 32,212 42,192 44,180
  C 40,166 34,148 34,128
  C 36,106 38,86 42,78
  C 31,78 24,86 22,94
  C 16,108 16,126 16,144
  C 16,164 18,180 20,196
  C 20,208 20,222 22,230
  C 24,236 28,238 30,232
  C 32,226 32,216 30,206
  C 28,190 26,174 24,160
  C 20,144 16,126 15,112
  C 9,96 9,78 20,72
  C 33,64 53,64 61,68
  C 61,66 57,58 53,50
  C 45,28 47,2 70,2 Z
`;

// ── SVG defs ──────────────────────────────────────────────────────────────────

function SharedDefs() {
  return (
    <defs>
      <radialGradient id="bm-fill-front" cx="38%" cy="25%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#f5f5f5" />
        <stop offset="100%" stopColor="#e4e4e4" />
      </radialGradient>
      <radialGradient id="bm-fill-back" cx="58%" cy="28%" r="65%">
        <stop offset="0%" stopColor="#fafafa" />
        <stop offset="65%" stopColor="#efefef" />
        <stop offset="100%" stopColor="#e0e0e0" />
      </radialGradient>
      <filter id="bm-blur-diffuse" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="bm-shadow" x="-20%" y="-8%" width="140%" height="124%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#888" floodOpacity="0.14" />
      </filter>
    </defs>
  );
}

// ── Muscle lines (B&W) ────────────────────────────────────────────────────────

function FrontMuscleLines() {
  const p = { stroke: "#2a2a2a", strokeWidth: 0.65, fill: "none", strokeLinecap: "round" as const, opacity: 0.45 };
  const s = { stroke: "#333", strokeWidth: 0.45, fill: "none", strokeLinecap: "round" as const, opacity: 0.3 };
  return (
    <g>
      <path d="M76,28 C76,40 74,54 72,70" {...s} />
      <path d="M64,28 C64,40 66,54 68,70" {...s} />
      <path d="M71,71 C66,70 58,70 52,74" {...p} />
      <path d="M69,71 C74,70 82,70 88,74" {...p} />
      <path d="M88,74 C96,78 106,82 112,92" {...p} />
      <path d="M52,74 C44,78 34,82 28,92" {...p} />
      <path d="M112,92 C114,100 114,110 112,118" {...s} />
      <path d="M28,92 C26,100 26,110 28,118" {...s} />
      <path d="M88,74 C84,88 80,108 80,128" {...p} strokeWidth={0.6} />
      <path d="M52,74 C56,88 60,108 60,128" {...p} strokeWidth={0.6} />
      <path d="M80,128 C84,134 88,136 92,134" {...s} />
      <path d="M60,128 C56,134 52,136 48,134" {...s} />
      <line x1="70" y1="71" x2="70" y2="196" stroke="#2a2a2a" strokeWidth={0.45} strokeDasharray="2.5,2.5" opacity={0.32} />
      <path d="M91,130 C94,136 94,144 92,152" {...s} />
      <path d="M49,130 C46,136 46,144 48,152" {...s} />
      <path d="M62,143 C66,141 70,141 70,141 C70,141 74,141 78,143" {...p} strokeWidth={0.55} />
      <path d="M60,158 C65,156 70,156 70,156 C70,156 75,156 80,158" {...p} strokeWidth={0.55} />
      <path d="M88,136 C92,150 92,166 88,180" {...s} />
      <path d="M52,136 C48,150 48,166 52,180" {...s} />
      <path d="M96,180 C100,190 104,200 104,212" {...s} />
      <path d="M44,180 C40,190 36,200 36,212" {...s} />
      <path d="M118,100 C118,116 118,138 120,158" {...p} strokeWidth={0.6} />
      <path d="M112,102 C112,120 114,142 116,162" {...s} />
      <path d="M120,162 C122,176 122,194 120,210" {...p} strokeWidth={0.55} />
      <path d="M124,164 C126,180 126,198 124,212" {...s} />
      <path d="M118,212 C118,220 118,226 120,232" {...s} />
      <path d="M22,100 C22,116 22,138 20,158" {...p} strokeWidth={0.6} />
      <path d="M28,102 C28,120 26,142 24,162" {...s} />
      <path d="M20,162 C18,176 18,194 20,210" {...p} strokeWidth={0.55} />
      <path d="M16,164 C14,180 14,198 16,212" {...s} />
      <path d="M22,212 C22,220 22,226 20,232" {...s} />
      <path d="M104,204 C106,214 106,224 104,232" {...s} />
      <path d="M36,204 C34,214 34,224 36,232" {...s} />
      <path d="M94,244 C92,264 92,288 92,308" {...p} strokeWidth={0.6} />
      <path d="M104,242 C106,264 106,290 104,312" {...s} />
      <path d="M84,244 C80,266 78,288 78,308" {...s} />
      <path d="M78,308 C74,316 76,322 82,322" {...s} strokeWidth={0.55} />
      <path d="M84,320 C90,316 100,316 106,320" {...p} strokeWidth={0.75} />
      <path d="M108,244 C110,268 110,294 108,318" {...s} />
      <path d="M46,244 C48,264 48,288 48,308" {...p} strokeWidth={0.6} />
      <path d="M36,242 C34,264 34,290 36,312" {...s} />
      <path d="M56,244 C60,266 62,288 62,308" {...s} />
      <path d="M62,308 C66,316 64,322 58,322" {...s} strokeWidth={0.55} />
      <path d="M56,320 C50,316 40,316 34,320" {...p} strokeWidth={0.75} />
      <path d="M32,244 C30,268 30,294 32,318" {...s} />
      <path d="M92,330 C92,350 90,368 90,384" {...p} strokeWidth={0.55} />
      <path d="M104,330 C104,350 102,370 100,386" {...s} />
      <path d="M108,340 C110,356 108,372 106,384" {...s} />
      <path d="M48,330 C48,350 50,368 50,384" {...p} strokeWidth={0.55} />
      <path d="M36,330 C36,350 38,370 40,386" {...s} />
      <path d="M32,340 C30,356 32,372 34,384" {...s} />
      <path d="M92,388 C94,396 96,402 100,404" {...s} />
      <path d="M48,388 C46,396 44,402 40,404" {...s} />
    </g>
  );
}

function BackMuscleLines() {
  const p = { stroke: "#2a2a2a", strokeWidth: 0.65, fill: "none", strokeLinecap: "round" as const, opacity: 0.45 };
  const s = { stroke: "#333", strokeWidth: 0.45, fill: "none", strokeLinecap: "round" as const, opacity: 0.3 };
  return (
    <g>
      <path d="M74,56 C76,64 82,72 90,80" {...p} />
      <path d="M66,56 C64,64 58,72 50,80" {...p} />
      <path d="M73,56 C73,62 73,66 73,70" {...s} />
      <path d="M67,56 C67,62 67,66 67,70" {...s} />
      <path d="M70,88 C76,90 82,90 88,88" {...p} strokeWidth={0.6} />
      <path d="M70,88 C64,90 58,90 52,88" {...p} strokeWidth={0.6} />
      <path d="M66,86 C65,100 65,116 66,132" {...p} strokeWidth={0.6} />
      <path d="M74,86 C75,100 75,116 74,132" {...p} strokeWidth={0.6} />
      <path d="M66,132 C70,136 76,136 78,132" {...s} />
      <path d="M66,98 C68,108 70,118 70,128" {...s} />
      <path d="M70,98 C72,108 74,118 74,128" {...s} />
      <path d="M88,106 C94,118 96,130 92,144" {...s} />
      <path d="M52,106 C46,118 44,130 48,144" {...s} />
      <path d="M66,105 C72,104 78,103 86,102" {...s} />
      <path d="M66,114 C72,113 78,112 86,110" {...s} />
      <path d="M86,106 C82,120 78,134 72,148" {...s} />
      <path d="M54,106 C58,120 62,134 68,148" {...s} />
      <path d="M88,104 C92,124 92,146 88,164" {...p} />
      <path d="M52,104 C48,124 48,146 52,164" {...p} />
      <path d="M74,74 C74,110 74,150 74,200" stroke="#2a2a2a" strokeWidth={0.5} strokeDasharray="2,2.5" opacity={0.38} fill="none" />
      <path d="M66,74 C66,110 66,150 66,200" stroke="#2a2a2a" strokeWidth={0.5} strokeDasharray="2,2.5" opacity={0.38} fill="none" />
      <path d="M70,140 C78,154 80,170 70,186 C60,170 60,154 70,140" {...s} strokeWidth={0.5} />
      <path d="M106,84 C112,92 116,104 114,116" {...p} strokeWidth={0.55} />
      <path d="M34,84 C28,92 24,104 26,116" {...p} strokeWidth={0.55} />
      <path d="M116,108 C118,128 118,150 118,164" {...p} strokeWidth={0.6} />
      <path d="M24,108 C22,128 22,150 22,164" {...p} strokeWidth={0.6} />
      <path d="M122,110 C124,130 124,152 122,166" {...s} />
      <path d="M18,110 C16,130 16,152 18,166" {...s} />
      <path d="M118,168 C120,184 120,202 118,216" {...s} />
      <path d="M22,168 C20,184 20,202 22,216" {...s} />
      <path d="M38,192 C48,186 60,184 70,184 C80,184 92,186 102,192" {...p} />
      <path d="M102,192 C110,198 114,210 112,224" {...p} />
      <path d="M38,192 C30,198 26,210 28,224" {...p} />
      <path d="M36,264 C44,272 56,276 70,276 C84,276 96,272 104,264" {...p} strokeWidth={0.8} />
      <path d="M104,222 C108,238 106,252 104,262" {...s} />
      <path d="M36,222 C32,238 34,252 36,262" {...s} />
      <path d="M90,282 C90,304 90,328 90,350" {...p} strokeWidth={0.6} />
      <path d="M50,282 C50,304 50,328 50,350" {...p} strokeWidth={0.6} />
      <path d="M102,280 C104,302 104,328 102,350" {...s} />
      <path d="M38,280 C36,302 36,328 38,350" {...s} />
      <path d="M76,352 C82,356 90,356 94,352 C90,362 82,364 76,360 C72,356 72,354 76,352" {...s} strokeWidth={0.45} />
      <path d="M64,352 C58,356 50,356 46,352 C50,362 58,364 64,360 C68,356 68,354 64,352" {...s} strokeWidth={0.45} />
      <path d="M88,362 C88,374 86,386 84,396" {...p} strokeWidth={0.6} />
      <path d="M100,362 C100,374 100,386 98,396" {...p} strokeWidth={0.6} />
      <path d="M94,358 C94,370 94,382 92,396" {...s} />
      <path d="M52,362 C52,374 54,386 56,396" {...p} strokeWidth={0.6} />
      <path d="M40,362 C40,374 40,386 42,396" {...p} strokeWidth={0.6} />
      <path d="M46,358 C46,370 46,382 48,396" {...s} />
      <path d="M92,394 C92,398 94,402 94,406" {...p} strokeWidth={0.7} />
      <path d="M48,394 C48,398 46,402 46,406" {...p} strokeWidth={0.7} />
    </g>
  );
}

function FemaleBreastContour() {
  const bc = { stroke: "#2a2a2a", strokeWidth: 0.6, fill: "none", strokeLinecap: "round" as const, opacity: 0.42 };
  return (
    <g>
      <path d="M 70,114 C 76,110 86,112 92,120 C 96,128 94,140 88,144 C 82,148 74,144 70,138" {...bc} />
      <path d="M 70,114 C 64,110 54,112 48,120 C 44,128 46,140 52,144 C 58,148 66,144 70,138" {...bc} />
      <path d="M 70,140 C 76,144 84,144 90,142" {...bc} strokeWidth={0.45} opacity={0.28} />
      <path d="M 70,140 C 64,144 56,144 50,142" {...bc} strokeWidth={0.45} opacity={0.28} />
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
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredView, setHoveredView] = useState<"front" | "back" | null>(null);
  const [hoveredSex, setHoveredSex] = useState<"male" | "female" | null>(null);

  function handleEnter(id: string, view: "front" | "back", sex: "male" | "female") {
    setHovered(id);
    setHoveredView(view);
    setHoveredSex(sex);
  }
  function handleLeave() {
    setHovered(null);
    setHoveredView(null);
    setHoveredSex(null);
  }

  function renderRegions(regions: Region[], view: "front" | "back", sex: "male" | "female") {
    return regions.map((region) => {
      const existingSpot = painSpots.find((s) => s.regionId === region.id && s.view === view);
      const isActive = !!existingSpot;
      const isHovered = hovered === region.id && hoveredView === view && hoveredSex === sex;
      return (
        <path
          key={region.id}
          d={region.clipPath}
          fill={isActive ? `${spotColor(existingSpot!.intensity)}28` : isHovered ? `${spotColor(intensity)}14` : "transparent"}
          stroke={isActive ? spotColor(existingSpot!.intensity) : isHovered ? spotColor(intensity) : "transparent"}
          strokeWidth={isActive ? 1.2 : isHovered ? 0.8 : 0}
          strokeOpacity={isActive ? 1 : 0.5}
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (sex !== selectedSex) setSelectedSex(sex);
            onToggle(region.id, region.label, region.dotCenter.x, region.dotCenter.y, view);
          }}
          onMouseEnter={() => handleEnter(region.id, view, sex)}
          onMouseLeave={handleLeave}
          role="button"
          aria-pressed={isActive}
          aria-label={region.label}
        />
      );
    });
  }

  function renderHoverPreview(regions: Region[], view: "front" | "back", sex: "male" | "female") {
    if (!hovered || hoveredView !== view || hoveredSex !== sex) return null;
    const reg = regions.find((r) => r.id === hovered);
    if (!reg) return null;
    if (painSpots.some((s) => s.regionId === reg.id && s.view === view)) return null;
    const r = spotRadius(currentSize);
    const color = spotColor(intensity);
    const isDiffuse = currentSize === "diffuse";
    return (
      <g pointerEvents="none" opacity={0.5}>
        {isDiffuse && (
          <circle cx={reg.dotCenter.x} cy={reg.dotCenter.y} r={r + 7} fill={color} opacity={0.18} filter="url(#bm-blur-diffuse)" />
        )}
        <circle cx={reg.dotCenter.x} cy={reg.dotCenter.y} r={r} fill={color} opacity={isDiffuse ? 0.55 : 0.7} stroke="white" strokeWidth={1.5} filter={isDiffuse ? "url(#bm-blur-diffuse)" : undefined} />
      </g>
    );
  }

  function renderSpots(view: "front" | "back") {
    return painSpots.filter((s) => s.view === view).map((spot) => {
      const r = spotRadius(spot.size);
      const color = spotColor(spot.intensity);
      const isDiffuse = spot.size === "diffuse";
      return (
        <g key={`${spot.regionId}-${view}`} style={{ cursor: "pointer" }} onClick={() => onToggle(spot.regionId, spot.label, spot.cx, spot.cy, view)}>
          {isDiffuse && <circle cx={spot.cx} cy={spot.cy} r={r + 8} fill={color} opacity={0.18} filter="url(#bm-blur-diffuse)" />}
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

  function renderTooltip(regions: Region[], view: "front" | "back", sex: "male" | "female") {
    if (!hovered || hoveredView !== view || hoveredSex !== sex) return null;
    const reg = regions.find((r) => r.id === hovered);
    if (!reg) return null;
    const w = reg.label.length * 5.2 + 14;
    const tx = Math.max(w / 2 + 2, Math.min(138 - w / 2, reg.dotCenter.x));
    const ty = reg.dotCenter.y > 210 ? reg.dotCenter.y - 22 : reg.dotCenter.y + 26;
    return (
      <g pointerEvents="none">
        <rect x={tx - w / 2} y={ty - 11} width={w} height={18} rx={5} fill="#1a1a1a" opacity={0.88} />
        <text x={tx} y={ty + 3} textAnchor="middle" fontSize={8} fill="white" fontFamily="system-ui, sans-serif">
          {reg.label}
        </text>
      </g>
    );
  }

  const maleOpacity = selectedSex === "male" ? 1 : 0.38;
  const femaleOpacity = selectedSex === "female" ? 1 : 0.38;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Sex selector */}
      <div className="flex items-center gap-2.5">
        <span className="text-xs text-slate-500">Select figure:</span>
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          {(["male", "female"] as const).map((sex) => (
            <button
              key={sex}
              type="button"
              onClick={() => setSelectedSex(sex)}
              className={`px-4 py-1.5 text-xs font-medium transition ${
                selectedSex === sex ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {sex === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-xs text-slate-400">
        Tap any region on your selected figures to mark pain
      </p>

      {/* Body map SVG — 2×2 grid */}
      <div className="w-full">
        <svg
          viewBox="0 0 300 930"
          className="w-full"
          style={{ touchAction: "manipulation" }}
          role="group"
          aria-label="Body map — four views. Tap a region to mark pain."
        >
          <SharedDefs />

          {/* Row labels */}
          <text x="150" y="16" textAnchor="middle" fontSize={7.5} fontWeight="600" fill="#9ca3af" letterSpacing="2">MALE</text>
          <text x="150" y="480" textAnchor="middle" fontSize={7.5} fontWeight="600" fill="#9ca3af" letterSpacing="2">FEMALE</text>

          {/* ── MALE ANTERIOR ───────────────────────────────────────── */}
          <g transform="translate(4, 22)" opacity={maleOpacity} style={{ transition: "opacity 0.2s" }}>
            <path d={MALE_FRONT_PATH} fill="url(#bm-fill-front)" filter="url(#bm-shadow)" />
            <FrontMuscleLines />
            <path d={MALE_FRONT_PATH} fill="none" stroke="#1a1a1a" strokeWidth={1.3} strokeLinejoin="round" />
            {renderRegions(FRONT_REGIONS, "front", "male")}
            {renderHoverPreview(FRONT_REGIONS, "front", "male")}
            {selectedSex === "male" && renderSpots("front")}
            {renderTooltip(FRONT_REGIONS, "front", "male")}
            <text x="70" y="430" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5">ANTERIOR</text>
          </g>

          {/* ── MALE POSTERIOR ──────────────────────────────────────── */}
          <g transform="translate(156, 22)" opacity={maleOpacity} style={{ transition: "opacity 0.2s" }}>
            <path d={MALE_BACK_PATH} fill="url(#bm-fill-back)" filter="url(#bm-shadow)" />
            <BackMuscleLines />
            <path d={MALE_BACK_PATH} fill="none" stroke="#1a1a1a" strokeWidth={1.3} strokeLinejoin="round" />
            {renderRegions(BACK_REGIONS, "back", "male")}
            {renderHoverPreview(BACK_REGIONS, "back", "male")}
            {selectedSex === "male" && renderSpots("back")}
            {renderTooltip(BACK_REGIONS, "back", "male")}
            <text x="70" y="430" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5">POSTERIOR</text>
          </g>

          {/* Horizontal separator */}
          <line x1="4" y1="464" x2="296" y2="464" stroke="#e5e7eb" strokeWidth={1} />

          {/* ── FEMALE ANTERIOR ─────────────────────────────────────── */}
          <g transform="translate(4, 486)" opacity={femaleOpacity} style={{ transition: "opacity 0.2s" }}>
            <path d={FEMALE_FRONT_PATH} fill="url(#bm-fill-front)" filter="url(#bm-shadow)" />
            <FrontMuscleLines />
            <FemaleBreastContour />
            <path d={FEMALE_FRONT_PATH} fill="none" stroke="#1a1a1a" strokeWidth={1.3} strokeLinejoin="round" />
            {renderRegions(FRONT_REGIONS, "front", "female")}
            {renderHoverPreview(FRONT_REGIONS, "front", "female")}
            {selectedSex === "female" && renderSpots("front")}
            {renderTooltip(FRONT_REGIONS, "front", "female")}
            <text x="70" y="430" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5">ANTERIOR</text>
          </g>

          {/* ── FEMALE POSTERIOR ────────────────────────────────────── */}
          <g transform="translate(156, 486)" opacity={femaleOpacity} style={{ transition: "opacity 0.2s" }}>
            <path d={FEMALE_BACK_PATH} fill="url(#bm-fill-back)" filter="url(#bm-shadow)" />
            <BackMuscleLines />
            <path d={FEMALE_BACK_PATH} fill="none" stroke="#1a1a1a" strokeWidth={1.3} strokeLinejoin="round" />
            {renderRegions(BACK_REGIONS, "back", "female")}
            {renderHoverPreview(BACK_REGIONS, "back", "female")}
            {selectedSex === "female" && renderSpots("back")}
            {renderTooltip(BACK_REGIONS, "back", "female")}
            <text x="70" y="430" textAnchor="middle" fontSize={6.5} fontWeight="600" fill="#9ca3af" letterSpacing="1.5">POSTERIOR</text>
          </g>

          {/* Vertical center divider */}
          <line x1="150" y1="6" x2="150" y2="924" stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4,5" />
        </svg>
      </div>

      {/* Active spot chips */}
      {painSpots.length > 0 && (
        <div className="flex w-full flex-wrap gap-1.5">
          {painSpots.map((spot) => (
            <button
              key={`${spot.regionId}-${spot.view}`}
              type="button"
              onClick={() => onToggle(spot.regionId, spot.label, spot.cx, spot.cy, spot.view)}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:opacity-80"
              style={{
                borderColor: spotColor(spot.intensity),
                color: spotColor(spot.intensity),
                backgroundColor: `${spotColor(spot.intensity)}14`,
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{ width: 7, height: 7, backgroundColor: spotColor(spot.intensity) }}
              />
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

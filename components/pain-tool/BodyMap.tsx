"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type SpotSize = "pinpoint" | "regional" | "diffuse";

export interface PainSpot {
  regionId: string;
  label: string;
  size: SpotSize;
  intensity: number;
  cx: number; // figure-local coordinates (0–140)
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

/** Rounded-rect SVG path */
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
  if (intensity <= 3) return "#fcd34d"; // amber-300
  if (intensity <= 5) return "#f97316"; // orange-500
  if (intensity <= 7) return "#ef4444"; // red-500
  return "#991b1b"; // red-800
}

export function spotRadius(size: SpotSize): number {
  if (size === "pinpoint") return 5;
  if (size === "regional") return 12;
  return 19;
}

// ── Region data (local 0–140 x, 0–410 y, center x=70) ────────────────────────

const FRONT_REGIONS: Region[] = [
  {
    id: "head-neck",
    label: "Head / Neck",
    clipPath: rr(50, 2, 40, 72, 20),
    dotCenter: { x: 70, y: 30 },
  },
  {
    id: "left-shoulder",
    label: "Left Shoulder",
    clipPath:
      "M22,64 C8,64 2,76 4,94 C6,108 16,114 30,112 C42,110 48,98 46,84 C44,72 34,62 22,64 Z",
    dotCenter: { x: 22, y: 90 },
  },
  {
    id: "right-shoulder",
    label: "Right Shoulder",
    clipPath:
      "M118,64 C132,64 138,76 136,94 C134,108 124,114 110,112 C98,110 92,98 94,84 C96,72 106,62 118,64 Z",
    dotCenter: { x: 118, y: 90 },
  },
  {
    id: "chest",
    label: "Chest",
    clipPath: rr(44, 72, 52, 80, 10),
    dotCenter: { x: 70, y: 112 },
  },
  {
    id: "left-upper-arm",
    label: "Left Upper Arm",
    clipPath:
      "M18,96 C8,96 2,116 4,138 C6,156 16,168 28,166 C38,162 42,148 40,128 C38,108 28,94 18,96 Z",
    dotCenter: { x: 18, y: 133 },
  },
  {
    id: "right-upper-arm",
    label: "Right Upper Arm",
    clipPath:
      "M122,96 C132,96 138,116 136,138 C134,156 124,168 112,166 C102,162 98,148 100,128 C102,108 112,94 122,96 Z",
    dotCenter: { x: 122, y: 133 },
  },
  {
    id: "left-forearm",
    label: "Left Forearm",
    clipPath: rr(4, 166, 28, 52, 12),
    dotCenter: { x: 18, y: 193 },
  },
  {
    id: "right-forearm",
    label: "Right Forearm",
    clipPath: rr(108, 166, 28, 52, 12),
    dotCenter: { x: 122, y: 193 },
  },
  {
    id: "left-hand",
    label: "Left Hand",
    clipPath:
      "M6,220 C2,228 4,242 12,248 C20,252 32,248 36,240 C38,232 34,220 26,216 C18,212 8,214 6,220 Z",
    dotCenter: { x: 18, y: 234 },
  },
  {
    id: "right-hand",
    label: "Right Hand",
    clipPath:
      "M134,220 C138,228 136,242 128,248 C120,252 108,248 104,240 C102,232 106,220 114,216 C122,212 132,214 134,220 Z",
    dotCenter: { x: 122, y: 234 },
  },
  {
    id: "left-hip",
    label: "Left Hip",
    clipPath:
      "M38,172 C26,174 20,194 24,212 C28,226 40,234 54,230 C66,226 70,214 68,200 C66,184 58,170 48,168 C44,166 40,170 38,172 Z",
    dotCenter: { x: 42, y: 202 },
  },
  {
    id: "right-hip",
    label: "Right Hip",
    clipPath:
      "M102,172 C114,174 120,194 116,212 C112,226 100,234 86,230 C74,226 70,214 72,200 C74,184 82,170 92,168 C96,166 100,170 102,172 Z",
    dotCenter: { x: 98, y: 202 },
  },
  {
    id: "left-quad",
    label: "Left Quad",
    clipPath:
      "M36,234 C26,240 24,266 26,292 C28,312 38,322 52,320 C64,318 70,306 68,288 C66,264 62,240 52,232 C46,228 40,230 36,234 Z",
    dotCenter: { x: 46, y: 276 },
  },
  {
    id: "right-quad",
    label: "Right Quad",
    clipPath:
      "M104,234 C114,240 116,266 114,292 C112,312 102,322 88,320 C76,318 70,306 72,288 C74,264 78,240 88,232 C94,228 100,230 104,234 Z",
    dotCenter: { x: 94, y: 276 },
  },
  {
    id: "left-shin",
    label: "Left Shin / Calf",
    clipPath: rr(28, 322, 32, 70, 14),
    dotCenter: { x: 44, y: 358 },
  },
  {
    id: "right-shin",
    label: "Right Shin / Calf",
    clipPath: rr(80, 322, 32, 70, 14),
    dotCenter: { x: 96, y: 358 },
  },
  {
    id: "left-foot",
    label: "Left Foot",
    clipPath:
      "M18,394 C14,400 18,412 28,416 C38,418 54,416 64,410 C72,406 72,398 66,394 C60,390 46,388 34,390 C26,390 20,392 18,394 Z",
    dotCenter: { x: 40, y: 403 },
  },
  {
    id: "right-foot",
    label: "Right Foot",
    clipPath:
      "M122,394 C126,400 122,412 112,416 C102,418 86,416 76,410 C68,406 68,398 74,394 C80,390 94,388 106,390 C114,390 120,392 122,394 Z",
    dotCenter: { x: 100, y: 403 },
  },
];

const BACK_REGIONS: Region[] = [
  {
    id: "head-neck",
    label: "Head / Neck",
    clipPath: rr(50, 2, 40, 72, 20),
    dotCenter: { x: 70, y: 30 },
  },
  {
    id: "left-shoulder",
    label: "Left Shoulder",
    clipPath:
      "M22,64 C8,64 2,76 4,94 C6,108 16,114 30,112 C42,110 48,98 46,84 C44,72 34,62 22,64 Z",
    dotCenter: { x: 22, y: 90 },
  },
  {
    id: "right-shoulder",
    label: "Right Shoulder",
    clipPath:
      "M118,64 C132,64 138,76 136,94 C134,108 124,114 110,112 C98,110 92,98 94,84 C96,72 106,62 118,64 Z",
    dotCenter: { x: 118, y: 90 },
  },
  {
    id: "upper-back",
    label: "Upper Back",
    clipPath: rr(44, 72, 52, 62, 10),
    dotCenter: { x: 70, y: 103 },
  },
  {
    id: "lower-back",
    label: "Lower Back",
    clipPath: rr(38, 136, 64, 64, 10),
    dotCenter: { x: 70, y: 168 },
  },
  {
    id: "left-upper-arm",
    label: "Left Upper Arm",
    clipPath:
      "M18,96 C8,96 2,116 4,138 C6,156 16,168 28,166 C38,162 42,148 40,128 C38,108 28,94 18,96 Z",
    dotCenter: { x: 18, y: 133 },
  },
  {
    id: "right-upper-arm",
    label: "Right Upper Arm",
    clipPath:
      "M122,96 C132,96 138,116 136,138 C134,156 124,168 112,166 C102,162 98,148 100,128 C102,108 112,94 122,96 Z",
    dotCenter: { x: 122, y: 133 },
  },
  {
    id: "left-forearm",
    label: "Left Forearm",
    clipPath: rr(4, 166, 28, 52, 12),
    dotCenter: { x: 18, y: 193 },
  },
  {
    id: "right-forearm",
    label: "Right Forearm",
    clipPath: rr(108, 166, 28, 52, 12),
    dotCenter: { x: 122, y: 193 },
  },
  {
    id: "left-hand",
    label: "Left Hand",
    clipPath:
      "M6,220 C2,228 4,242 12,248 C20,252 32,248 36,240 C38,232 34,220 26,216 C18,212 8,214 6,220 Z",
    dotCenter: { x: 18, y: 234 },
  },
  {
    id: "right-hand",
    label: "Right Hand",
    clipPath:
      "M134,220 C138,228 136,242 128,248 C120,252 108,248 104,240 C102,232 106,220 114,216 C122,212 132,214 134,220 Z",
    dotCenter: { x: 122, y: 234 },
  },
  {
    id: "left-glute",
    label: "Left Glute",
    clipPath:
      "M38,202 C26,206 20,226 24,248 C28,264 42,274 56,270 C68,266 72,252 70,236 C68,220 58,202 48,200 C44,198 40,200 38,202 Z",
    dotCenter: { x: 44, y: 238 },
  },
  {
    id: "right-glute",
    label: "Right Glute",
    clipPath:
      "M102,202 C114,206 120,226 116,248 C112,264 98,274 84,270 C72,266 68,252 70,236 C72,220 82,202 92,200 C96,198 100,200 102,202 Z",
    dotCenter: { x: 96, y: 238 },
  },
  {
    id: "left-hamstring",
    label: "Left Hamstring",
    clipPath:
      "M36,272 C26,278 24,304 26,328 C28,348 38,360 52,358 C64,356 70,342 68,322 C66,298 60,274 50,268 C44,264 40,268 36,272 Z",
    dotCenter: { x: 46, y: 314 },
  },
  {
    id: "right-hamstring",
    label: "Right Hamstring",
    clipPath:
      "M104,272 C114,278 116,304 114,328 C112,348 102,360 88,358 C76,356 70,342 72,322 C74,298 80,274 90,268 C96,264 100,268 104,272 Z",
    dotCenter: { x: 94, y: 314 },
  },
  {
    id: "left-calf",
    label: "Left Calf",
    clipPath: rr(28, 360, 30, 44, 13),
    dotCenter: { x: 43, y: 382 },
  },
  {
    id: "right-calf",
    label: "Right Calf",
    clipPath: rr(82, 360, 30, 44, 13),
    dotCenter: { x: 97, y: 382 },
  },
  {
    id: "left-foot",
    label: "Left Foot",
    clipPath:
      "M18,394 C14,400 18,412 28,416 C38,418 54,416 64,410 C72,406 72,398 66,394 C60,390 46,388 34,390 C26,390 20,392 18,394 Z",
    dotCenter: { x: 40, y: 403 },
  },
  {
    id: "right-foot",
    label: "Right Foot",
    clipPath:
      "M122,394 C126,400 122,412 112,416 C102,418 86,416 76,410 C68,406 68,398 74,394 C80,390 94,388 106,390 C114,390 120,392 122,394 Z",
    dotCenter: { x: 100, y: 403 },
  },
];

export const REGION_LABELS: Record<string, string> = Object.fromEntries(
  [...FRONT_REGIONS, ...BACK_REGIONS].map((r) => [r.id, r.label])
);

// ── Body silhouette path (local 0–140, center x=70) ──────────────────────────
// Single continuous clockwise path: top of head → right side → feet → left side → close

const BODY_PATH = `
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
  C 103,88 105,108 107,130
  C 109,150 107,168 103,182
  C 101,192 101,204 105,216
  C 107,228 107,240 103,252
  C 103,274 103,296 101,320
  C 101,336 99,350 99,374
  C 99,386 103,396 99,402
  C 89,406 79,406 70,406
  C 61,406 51,406 41,402
  C 37,396 41,386 41,374
  C 41,350 39,336 39,320
  C 37,296 37,274 37,252
  C 33,240 33,228 35,216
  C 39,204 39,192 37,182
  C 33,168 31,150 33,130
  C 35,108 37,88 41,80
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

// ── SVG sub-components ────────────────────────────────────────────────────────

function SharedDefs() {
  return (
    <defs>
      <radialGradient id="bm-grad-body" cx="48%" cy="36%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#f4f4f2" />
        <stop offset="100%" stopColor="#c8c8c4" />
      </radialGradient>
      <radialGradient id="bm-grad-body-back" cx="52%" cy="38%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#f2f2f0" />
        <stop offset="100%" stopColor="#c4c4c0" />
      </radialGradient>
      <filter id="bm-blur-diffuse" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3.5" />
      </filter>
      <filter id="bm-shadow" x="-20%" y="-10%" width="140%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00000020" />
      </filter>
    </defs>
  );
}

function FrontMuscleLines() {
  const s = { stroke: "#60605c", strokeWidth: 0.65, fill: "none", strokeLinecap: "round" as const };
  return (
    <g opacity={0.75}>
      {/* Clavicles */}
      <path d="M71,72 C64,70 56,70 52,74" {...s} />
      <path d="M69,72 C76,70 84,70 88,74" {...s} />
      {/* Pec borders */}
      <path d="M53,80 C56,94 62,110 70,122" {...s} strokeWidth={0.6} />
      <path d="M87,80 C84,94 78,110 70,122" {...s} strokeWidth={0.6} />
      {/* Pec lower border */}
      <path d="M62,128 C66,132 70,133 70,133 C70,133 74,132 78,128" {...s} strokeWidth={0.6} />
      {/* Sternum midline */}
      <line x1="70" y1="74" x2="70" y2="182" stroke="#60605c" strokeWidth={0.5} strokeDasharray="2,2.5" />
      {/* Abs — 2 transverse lines */}
      <path d="M59,142 C64,140 70,140 70,140 C70,140 76,140 81,142" {...s} strokeWidth={0.6} />
      <path d="M57,158 C63,156 70,156 70,156 C70,156 77,156 83,158" {...s} strokeWidth={0.6} />
      {/* Obliques */}
      <path d="M51,136 C48,148 48,160 51,174" {...s} strokeWidth={0.5} />
      <path d="M89,136 C92,148 92,160 89,174" {...s} strokeWidth={0.5} />
      {/* Bicep line — left */}
      <path d="M20,110 C18,126 18,144 20,158" {...s} strokeWidth={0.6} />
      {/* Bicep line — right */}
      <path d="M120,110 C122,126 122,144 120,158" {...s} strokeWidth={0.6} />
      {/* Forearm tendon — left */}
      <path d="M16,176 C16,192 18,208 20,220" {...s} strokeWidth={0.5} />
      {/* Forearm tendon — right */}
      <path d="M124,176 C124,192 122,208 120,220" {...s} strokeWidth={0.5} />
      {/* Quad definition left */}
      <path d="M52,242 C50,264 50,288 52,308" {...s} strokeWidth={0.6} />
      {/* Quad definition right */}
      <path d="M88,242 C90,264 90,288 88,308" {...s} strokeWidth={0.6} />
      {/* Kneecap left */}
      <path d="M30,322 C36,318 48,318 54,322" {...s} strokeWidth={0.75} />
      {/* Kneecap right */}
      <path d="M86,322 C92,318 104,318 110,322" {...s} strokeWidth={0.75} />
      {/* Tibial line left */}
      <line x1="48" y1="326" x2="46" y2="380" stroke="#60605c" strokeWidth={0.5} />
      {/* Tibial line right */}
      <line x1="92" y1="326" x2="94" y2="380" stroke="#60605c" strokeWidth={0.5} />
      {/* Calf belly left */}
      <path d="M34,338 C32,354 34,370 38,380" {...s} strokeWidth={0.6} />
      {/* Calf belly right */}
      <path d="M106,338 C108,354 106,370 102,380" {...s} strokeWidth={0.6} />
    </g>
  );
}

function BackMuscleLines() {
  const s = { stroke: "#60605c", strokeWidth: 0.65, fill: "none", strokeLinecap: "round" as const };
  return (
    <g opacity={0.75}>
      {/* Trapezius upper — left */}
      <path d="M71,74 C66,80 58,86 52,90" {...s} />
      {/* Trapezius upper — right */}
      <path d="M69,74 C74,80 82,86 88,90" {...s} />
      {/* Scapula spine left */}
      <path d="M52,90 C55,98 58,112 58,128" {...s} strokeWidth={0.6} />
      {/* Scapula spine right */}
      <path d="M88,90 C85,98 82,112 82,128" {...s} strokeWidth={0.6} />
      {/* Rhomboid / medial border left */}
      <path d="M71,80 C68,96 66,116 66,132" {...s} strokeWidth={0.5} />
      {/* Rhomboid / medial border right */}
      <path d="M69,80 C72,96 74,116 74,132" {...s} strokeWidth={0.5} />
      {/* Spine / erector */}
      <line x1="70" y1="74" x2="70" y2="204" stroke="#60605c" strokeWidth={0.55} strokeDasharray="2,2.5" />
      {/* Lat border left */}
      <path d="M51,88 C47,108 47,134 51,158" {...s} strokeWidth={0.6} />
      {/* Lat border right */}
      <path d="M89,88 C93,108 93,134 89,158" {...s} strokeWidth={0.6} />
      {/* Glute crease */}
      <path d="M55,268 C62,274 70,276 70,276 C70,276 78,274 85,268" {...s} strokeWidth={0.8} />
      {/* Glute med left */}
      <path d="M44,210 C40,222 40,238 44,252" {...s} strokeWidth={0.6} />
      {/* Glute med right */}
      <path d="M96,210 C100,222 100,238 96,252" {...s} strokeWidth={0.6} />
      {/* Bicep femoris left */}
      <path d="M52,280 C50,306 50,330 52,350" {...s} strokeWidth={0.6} />
      {/* Bicep femoris right */}
      <path d="M88,280 C90,306 90,330 88,350" {...s} strokeWidth={0.6} />
      {/* Tricep line left */}
      <path d="M20,108 C22,128 22,148 20,164" {...s} strokeWidth={0.6} />
      {/* Tricep line right */}
      <path d="M120,108 C118,128 118,148 120,164" {...s} strokeWidth={0.6} />
      {/* Calf heads left */}
      <path d="M36,370 C38,382 42,390 46,396" {...s} strokeWidth={0.6} />
      {/* Calf heads right */}
      <path d="M104,370 C102,382 98,390 94,396" {...s} strokeWidth={0.6} />
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  painSpots: PainSpot[];
  onToggle: (
    regionId: string,
    label: string,
    cx: number,
    cy: number,
    view: "front" | "back"
  ) => void;
  currentSize: SpotSize;
  intensity: number;
}

export default function BodyMap({
  painSpots,
  onToggle,
  currentSize,
  intensity,
}: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoveredView, setHoveredView] = useState<"front" | "back" | null>(null);

  function handleEnter(id: string, view: "front" | "back") {
    setHovered(id);
    setHoveredView(view);
  }
  function handleLeave() {
    setHovered(null);
    setHoveredView(null);
  }

  function renderRegions(regions: Region[], view: "front" | "back") {
    return regions.map((region) => {
      const existingSpot = painSpots.find(
        (s) => s.regionId === region.id && s.view === view
      );
      const isActive = !!existingSpot;
      const isHovered = hovered === region.id && hoveredView === view;

      return (
        <path
          key={region.id}
          d={region.clipPath}
          fill={
            isActive
              ? `${spotColor(existingSpot!.intensity)}30`
              : isHovered
              ? `${spotColor(intensity)}18`
              : "transparent"
          }
          stroke={isActive ? spotColor(existingSpot!.intensity) : "transparent"}
          strokeWidth={isActive ? 1.2 : 0}
          style={{ cursor: "pointer" }}
          onClick={() =>
            onToggle(
              region.id,
              region.label,
              region.dotCenter.x,
              region.dotCenter.y,
              view
            )
          }
          onMouseEnter={() => handleEnter(region.id, view)}
          onMouseLeave={handleLeave}
          role="button"
          aria-pressed={isActive}
          aria-label={region.label}
        />
      );
    });
  }

  function renderSpots(view: "front" | "back") {
    return painSpots
      .filter((s) => s.view === view)
      .map((spot) => {
        const r = spotRadius(spot.size);
        const color = spotColor(spot.intensity);
        const isDiffuse = spot.size === "diffuse";
        return (
          <g
            key={`${spot.regionId}-${view}`}
            style={{ cursor: "pointer" }}
            onClick={() =>
              onToggle(spot.regionId, spot.label, spot.cx, spot.cy, view)
            }
          >
            {/* Outer glow for diffuse */}
            {isDiffuse && (
              <circle
                cx={spot.cx}
                cy={spot.cy}
                r={r + 6}
                fill={color}
                opacity={0.2}
                filter="url(#bm-blur-diffuse)"
              />
            )}
            {/* Main dot */}
            <circle
              cx={spot.cx}
              cy={spot.cy}
              r={r}
              fill={color}
              opacity={isDiffuse ? 0.75 : 0.92}
              stroke="white"
              strokeWidth={1.5}
              filter={isDiffuse ? "url(#bm-blur-diffuse)" : undefined}
            />
            {/* Intensity label (regional + diffuse only) */}
            {spot.size !== "pinpoint" && (
              <text
                x={spot.cx}
                y={spot.cy + 3.5}
                textAnchor="middle"
                fontSize={7}
                fontWeight="700"
                fill="white"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {spot.intensity}
              </text>
            )}
          </g>
        );
      });
  }

  // Tooltip for hovered region
  let tooltip: { label: string; tx: number; ty: number } | null = null;
  if (hovered && hoveredView) {
    const regions = hoveredView === "front" ? FRONT_REGIONS : BACK_REGIONS;
    const reg = regions.find((r) => r.id === hovered);
    if (reg) {
      // tx/ty in absolute SVG coords (accounting for figure group offsets)
      const offsetX = hoveredView === "front" ? 10 : 160;
      const labelW = reg.label.length * 5.5 + 14;
      const tx = Math.max(
        labelW / 2,
        Math.min(290 - labelW / 2, offsetX + reg.dotCenter.x)
      );
      const ty =
        reg.dotCenter.y > 200
          ? reg.dotCenter.y - 22
          : reg.dotCenter.y + 24;
      tooltip = { label: reg.label, tx, ty };
    }
  }

  const gradFront = "url(#bm-grad-body)";
  const gradBack = "url(#bm-grad-body-back)";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hint */}
      <p className="text-center text-xs text-slate-400">
        Tap any region to mark pain &mdash; front and back views shown
      </p>

      {/* Body map SVG */}
      <div className="w-full max-w-[340px]">
        <svg
          viewBox="0 0 300 432"
          className="w-full"
          role="group"
          aria-label="Body map — anterior and posterior views. Tap a region to mark pain."
        >
          <SharedDefs />

          {/* ── ANTERIOR (front) figure ─────────────────────── */}
          <g transform="translate(10, 0)" filter="url(#bm-shadow)">
            {/* Silhouette fill */}
            <path d={BODY_PATH} fill={gradFront} />
            {/* Muscle lines */}
            <FrontMuscleLines />
            {/* Silhouette stroke on top */}
            <path
              d={BODY_PATH}
              fill="none"
              stroke="#222220"
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
            {/* Region overlays */}
            {renderRegions(FRONT_REGIONS, "front")}
            {/* Pain dots */}
            {renderSpots("front")}
            {/* Label */}
            <text
              x="70"
              y="424"
              textAnchor="middle"
              fontSize={8}
              fontWeight="600"
              fill="#94a3b8"
              letterSpacing="1.5"
              style={{ textTransform: "uppercase" } as React.CSSProperties}
            >
              ANTERIOR
            </text>
          </g>

          {/* ── POSTERIOR (back) figure ─────────────────────── */}
          <g transform="translate(160, 0)" filter="url(#bm-shadow)">
            <path d={BODY_PATH} fill={gradBack} />
            <BackMuscleLines />
            <path
              d={BODY_PATH}
              fill="none"
              stroke="#222220"
              strokeWidth={1.4}
              strokeLinejoin="round"
            />
            {renderRegions(BACK_REGIONS, "back")}
            {renderSpots("back")}
            <text
              x="70"
              y="424"
              textAnchor="middle"
              fontSize={8}
              fontWeight="600"
              fill="#94a3b8"
              letterSpacing="1.5"
            >
              POSTERIOR
            </text>
          </g>

          {/* Divider */}
          <line
            x1="150"
            y1="10"
            x2="150"
            y2="410"
            stroke="#e2e8f0"
            strokeWidth={1}
            strokeDasharray="4,4"
          />

          {/* Tooltip */}
          {tooltip && (() => {
            const w = tooltip.label.length * 5.5 + 16;
            return (
              <g pointerEvents="none">
                <rect
                  x={tooltip.tx - w / 2}
                  y={tooltip.ty - 11}
                  width={w}
                  height={18}
                  rx={5}
                  fill="#0f172a"
                  opacity={0.88}
                />
                <text
                  x={tooltip.tx}
                  y={tooltip.ty + 3}
                  textAnchor="middle"
                  fontSize={8}
                  fill="white"
                  fontFamily="system-ui, sans-serif"
                >
                  {tooltip.label}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Active spots chips */}
      {painSpots.length > 0 && (
        <div className="flex w-full flex-wrap gap-1.5">
          {painSpots.map((spot) => (
            <button
              key={`${spot.regionId}-${spot.view}`}
              type="button"
              onClick={() =>
                onToggle(spot.regionId, spot.label, spot.cx, spot.cy, spot.view)
              }
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:opacity-80"
              style={{
                borderColor: spotColor(spot.intensity),
                color: spotColor(spot.intensity),
                backgroundColor: `${spotColor(spot.intensity)}14`,
              }}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 7,
                  height: 7,
                  backgroundColor: spotColor(spot.intensity),
                }}
              />
              {spot.label}
              <span className="opacity-60">
                &middot; {spot.size} &middot; {spot.intensity}/10
              </span>
              <span className="ml-0.5 opacity-50">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

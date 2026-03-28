"use client";

import { useState, memo } from "react";
import {
  SharedDefs,
  MaleFrontFigure,
  MaleBackFigure,
  FemaleFrontFigure,
  FemaleBackFigure,
  FIGURE_LOCAL_W,
  FIGURE_LOCAL_H,
} from "./BodyFigures";

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

// Landmark x-coords use ANATOMICAL left/right:
//   figure's RIGHT arm = screen LEFT (small x) — e.g. r-shoulder x=24
//   figure's LEFT arm  = screen RIGHT (large x) — e.g. l-shoulder x=116
// y-coords scaled from 430→290 coordinate space (× 0.6744)
const FRONT_LANDMARKS: Landmark[] = [
  { id: "head",         label: "Head",                  x: 70,  y: 13  },
  { id: "neck",         label: "Front of Neck",         x: 70,  y: 40  },
  { id: "r-shoulder",   label: "Right Shoulder",        x: 24,  y: 59  },
  { id: "l-shoulder",   label: "Left Shoulder",         x: 116, y: 59  },
  { id: "sternum",      label: "Chest (Center)",        x: 70,  y: 65  },
  { id: "r-pec",        label: "Right Chest",           x: 48,  y: 76  },
  { id: "l-pec",        label: "Left Chest",            x: 92,  y: 76  },
  { id: "r-upper-arm",  label: "Right Upper Arm",       x: 18,  y: 93  },
  { id: "l-upper-arm",  label: "Left Upper Arm",        x: 122, y: 93  },
  { id: "r-elbow",      label: "Right Elbow",           x: 18,  y: 116 },
  { id: "l-elbow",      label: "Left Elbow",            x: 122, y: 116 },
  { id: "solar-plexus", label: "Upper Abdomen",         x: 70,  y: 96  },
  { id: "abdomen",      label: "Abdomen",               x: 70,  y: 113 },
  { id: "r-forearm",    label: "Right Forearm",         x: 22,  y: 136 },
  { id: "l-forearm",    label: "Left Forearm",          x: 118, y: 136 },
  { id: "lower-abd",    label: "Lower Abdomen",         x: 70,  y: 132 },
  { id: "r-wrist",      label: "Right Wrist",           x: 22,  y: 154 },
  { id: "l-wrist",      label: "Left Wrist",            x: 118, y: 154 },
  { id: "r-hand",       label: "Right Hand",            x: 26,  y: 169 },
  { id: "l-hand",       label: "Left Hand",             x: 114, y: 169 },
  { id: "r-hip",        label: "Right Hip",             x: 46,  y: 144 },
  { id: "l-hip",        label: "Left Hip",              x: 94,  y: 144 },
  { id: "r-groin",      label: "Right Groin",           x: 56,  y: 162 },
  { id: "l-groin",      label: "Left Groin",            x: 84,  y: 162 },
  { id: "r-out-thigh",  label: "Right Outer Thigh",     x: 42,  y: 183 },
  { id: "l-out-thigh",  label: "Left Outer Thigh",      x: 98,  y: 183 },
  { id: "r-in-thigh",   label: "Right Inner Thigh",     x: 62,  y: 183 },
  { id: "l-in-thigh",   label: "Left Inner Thigh",      x: 78,  y: 183 },
  { id: "r-quad",       label: "Right Front Thigh",     x: 50,  y: 201 },
  { id: "l-quad",       label: "Left Front Thigh",      x: 90,  y: 201 },
  { id: "r-lat-knee",   label: "Right Outer Knee",      x: 38,  y: 227 },
  { id: "l-lat-knee",   label: "Left Outer Knee",       x: 102, y: 227 },
  { id: "r-med-knee",   label: "Right Inner Knee",      x: 58,  y: 227 },
  { id: "l-med-knee",   label: "Left Inner Knee",       x: 82,  y: 227 },
  { id: "r-shin",       label: "Right Shin",            x: 48,  y: 248 },
  { id: "l-shin",       label: "Left Shin",             x: 92,  y: 248 },
  { id: "r-ankle",      label: "Right Ankle",           x: 54,  y: 271 },
  { id: "l-ankle",      label: "Left Ankle",            x: 86,  y: 271 },
  { id: "r-foot",       label: "Right Foot",            x: 50,  y: 278 },
  { id: "l-foot",       label: "Left Foot",             x: 90,  y: 278 },
];

const BACK_LANDMARKS: Landmark[] = [
  { id: "head",         label: "Back of Head",          x: 70,  y: 13  },
  { id: "cerv-spine",   label: "Back of Neck",          x: 70,  y: 39  },
  { id: "r-upper-trap", label: "Right Neck / Trap",     x: 46,  y: 51  },
  { id: "l-upper-trap", label: "Left Neck / Trap",      x: 94,  y: 51  },
  { id: "r-shoulder",   label: "Right Shoulder",        x: 18,  y: 62  },
  { id: "l-shoulder",   label: "Left Shoulder",         x: 122, y: 62  },
  { id: "r-scapula",    label: "Right Shoulder Blade",  x: 48,  y: 77  },
  { id: "l-scapula",    label: "Left Shoulder Blade",   x: 92,  y: 77  },
  { id: "upper-back",   label: "Upper Back",            x: 70,  y: 73  },
  { id: "r-upper-arm",  label: "Right Upper Arm",       x: 14,  y: 94  },
  { id: "l-upper-arm",  label: "Left Upper Arm",        x: 126, y: 94  },
  { id: "r-elbow",      label: "Right Elbow",           x: 14,  y: 117 },
  { id: "l-elbow",      label: "Left Elbow",            x: 126, y: 117 },
  { id: "mid-back",     label: "Mid Back",              x: 70,  y: 93  },
  { id: "r-lat",        label: "Right Side (Ribs)",     x: 48,  y: 102 },
  { id: "l-lat",        label: "Left Side (Ribs)",      x: 92,  y: 102 },
  { id: "lower-back",   label: "Lower Back",            x: 70,  y: 116 },
  { id: "r-low-back",   label: "Right Lower Back",      x: 50,  y: 116 },
  { id: "l-low-back",   label: "Left Lower Back",       x: 90,  y: 116 },
  { id: "r-forearm",    label: "Right Forearm",         x: 18,  y: 137 },
  { id: "l-forearm",    label: "Left Forearm",          x: 122, y: 137 },
  { id: "r-wrist",      label: "Right Wrist",           x: 20,  y: 154 },
  { id: "l-wrist",      label: "Left Wrist",            x: 120, y: 154 },
  { id: "r-hand",       label: "Right Hand",            x: 24,  y: 169 },
  { id: "l-hand",       label: "Left Hand",             x: 116, y: 169 },
  { id: "sacrum",       label: "Tailbone Area",         x: 70,  y: 147 },
  { id: "r-glute",      label: "Right Buttock",         x: 46,  y: 164 },
  { id: "l-glute",      label: "Left Buttock",          x: 94,  y: 164 },
  { id: "r-out-thigh",  label: "Right Outer Thigh",     x: 40,  y: 189 },
  { id: "l-out-thigh",  label: "Left Outer Thigh",      x: 100, y: 189 },
  { id: "r-hamstring",  label: "Right Hamstring",       x: 52,  y: 204 },
  { id: "l-hamstring",  label: "Left Hamstring",        x: 88,  y: 204 },
  { id: "r-popliteal",  label: "Back of Right Knee",    x: 52,  y: 236 },
  { id: "l-popliteal",  label: "Back of Left Knee",     x: 88,  y: 236 },
  { id: "r-calf",       label: "Right Calf",            x: 52,  y: 252 },
  { id: "l-calf",       label: "Left Calf",             x: 88,  y: 252 },
  { id: "r-achilles",   label: "Right Achilles",        x: 54,  y: 270 },
  { id: "l-achilles",   label: "Left Achilles",         x: 86,  y: 270 },
  { id: "r-heel",       label: "Right Heel",            x: 64,  y: 278 },
  { id: "l-heel",       label: "Left Heel",             x: 76,  y: 278 },
];

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  painSpots: PainSpot[];
  onToggle: (regionId: string, label: string, cx: number, cy: number, view: "front" | "back") => void;
  currentSize: SpotSize;
  intensity: number;
}

const BodyMap = memo(function BodyMap({ painSpots, onToggle, currentSize, intensity }: Props) {
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
    figureEl: React.ReactNode
  ) {
    const isSelected = sex === selectedSex;
    return (
      <g opacity={isSelected ? 1 : 0.35} style={{ transition: "opacity 0.2s" }}>
        {/* Real figure image (cropped from sprite sheet) */}
        <g filter="url(#bm-fig-shadow)" pointerEvents="none">
          {figureEl}
        </g>
        {/* Transparent click + hover overlay — sits over the image */}
        <g
          onClick={(e) => handleBodyClick(e, view, sex)}
          onMouseMove={(e) => handleBodyMove(e, view, sex)}
          onMouseLeave={handleBodyLeave}
          style={{ cursor: "crosshair" }}
        >
          <rect
            x={0} y={0}
            width={FIGURE_LOCAL_W}
            height={FIGURE_LOCAL_H}
            fill="transparent"
          />
        </g>
        {/* Pain dots + hover preview */}
        {renderSpots(view, sex)}
        {renderHoverDot(view, sex)}
      </g>
    );
  }

  const tooltipLabel = hoverPos
    ? nearestLandmark(hoverPos.x, hoverPos.y, hoverPos.view === "front" ? FRONT_LANDMARKS : BACK_LANDMARKS).label
    : null;

  return (
    <div className="flex flex-col items-center gap-2">
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
      <div className="flex items-center gap-2">
        <div className="flex overflow-hidden rounded-lg border border-slate-200">
          {(["male", "female"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSelectedSex(s)}
              className={`px-4 py-1 text-xs font-medium transition ${
                selectedSex === s ? "bg-slate-800 text-white" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {s === "male" ? "Male" : "Female"}
            </button>
          ))}
        </div>
      </div>

      {/* 2×2 body map */}
      <div className="w-full">
        <svg
          viewBox="0 0 300 600"
          className="w-full"
          style={{ touchAction: "manipulation" }}
          role="img"
          aria-label="Body map — click anywhere to mark pain"
        >
          <SharedDefs />

          {/* Vertical centre divider only — no row labels */}
          <line x1="150" y1="4" x2="150" y2="596" stroke="#e5e7eb" strokeWidth={1} strokeDasharray="4,5" />

          {/* Male anterior */}
          <g transform="translate(4, 4)">
            {fig("front", "male", <MaleFrontFigure />)}
          </g>

          {/* Male posterior */}
          <g transform="translate(156, 4)">
            {fig("back", "male", <MaleBackFigure />)}
          </g>

          {/* Female anterior — 12px below male row bottom (4+290+12=306) */}
          <g transform="translate(4, 306)">
            {fig("front", "female", <FemaleFrontFigure />)}
          </g>

          {/* Female posterior */}
          <g transform="translate(156, 306)">
            {fig("back", "female", <FemaleBackFigure />)}
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
});

export default BodyMap;

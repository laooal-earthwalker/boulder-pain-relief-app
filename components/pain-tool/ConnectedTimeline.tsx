"use client";

import { useState, memo } from "react";
import type { PainMapSession } from "@/types/painmap";

const SPRITE   = "/images/painmap-figures.png";
const IMG_W    = 2816;
const IMG_H    = 1536;
const SLICE_W  = 704;   // one column (IMG_W / 4)
const CROP_Y   = 40;    // matches BodyFigures CROP_Y_START
const CROP_H   = 1460;  // matches BodyFigures CROP_H

// ── Layout constants ──────────────────────────────────────────────────────────
// Body paths are drawn in a 140 × 290 space (matches BodyMap FIGURE_LOCAL_*).
const VB_W = 140;
const VB_H = 290;
// Each session column is rendered at this size
const COL_W = 72;
const COL_H = Math.round(COL_W * (VB_H / VB_W)); // ≈ 221, preserves aspect ratio
const SESS_GAP = 56; // horizontal gap between session columns
const DATE_H = 20;   // space below body for date label

// Scale factors from original viewbox → display size
const SX = COL_W / VB_W;
const SY = COL_H / VB_H;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Final SVG x for a cx in body-space for the given session column */
function fx(cx: number, colIdx: number): number {
  return colIdx * (COL_W + SESS_GAP) + cx * SX;
}

/** Final SVG y for a cy in body-space */
function fy(cy: number): number {
  return cy * SY;
}

/** Cubic bezier S-curve path between two points (horizontal control handles) */
function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2;
  return `M ${x1.toFixed(2)},${y1.toFixed(2)} C ${mx.toFixed(2)},${y1.toFixed(2)} ${mx.toFixed(2)},${y2.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`;
}

/** Trend color: teal=improving, amber=stable, rose=worsening */
function trendColor(firstIntensity: number, lastIntensity: number): string {
  if (lastIntensity < firstIntensity) return "#2DD4BF"; // teal — improving
  if (lastIntensity > firstIntensity) return "#FB7185"; // rose — worsening
  return "#F59E0B";                                      // amber — stable
}

function trendLabel(firstIntensity: number, lastIntensity: number): string {
  if (lastIntensity < firstIntensity) return "trending better";
  if (lastIntensity > firstIntensity) return "trending worse";
  return "holding steady";
}

function dotColor(intensity: number): string {
  if (intensity <= 1) return "#5eead4";
  if (intensity <= 2) return "#fbbf24";
  if (intensity <= 3) return "#f97316";
  if (intensity <= 4) return "#ef4444";
  return "#7c3aed";
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Occurrence {
  colIdx: number;
  cx: number;
  cy: number;
  intensity: number;
}

interface TooltipState {
  text: string;
  screenX: number;
  screenY: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  /** Sessions in chronological order (oldest first = leftmost column) */
  sessions: PainMapSession[];
}

const ConnectedTimeline = memo(function ConnectedTimeline({ sessions }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  if (sessions.length < 2) return null;

  const totalW = sessions.length * COL_W + (sessions.length - 1) * SESS_GAP;
  const totalH = COL_H + DATE_H;

  // ── Build region → occurrence list (one entry per session it appears in) ──
  const regionMap = new Map<string, Occurrence[]>();

  sessions.forEach((session, colIdx) => {
    const seenInSession = new Set<string>();
    session.spots.forEach((spot) => {
      if (seenInSession.has(spot.label)) return;
      seenInSession.add(spot.label);
      const list = regionMap.get(spot.label) ?? [];
      list.push({ colIdx, cx: spot.cx, cy: spot.cy, intensity: spot.intensity });
      regionMap.set(spot.label, list);
    });
  });

  // Only draw connecting lines for regions appearing in 2+ sessions
  const connectedRegions = Array.from(regionMap.entries()).filter(
    ([, occs]) => occs.length >= 2
  );

  return (
    <div className="relative">
      {/* Horizontal scroll wrapper */}
      <div className="overflow-x-auto pb-1">
        <svg
          width={totalW}
          height={totalH}
          viewBox={`0 0 ${totalW} ${totalH}`}
          style={{ display: "block", minWidth: totalW }}
          aria-label="Connected pain timeline"
        >
          {/* ── Body silhouettes (real image sprite, Male Front) ── */}
          {sessions.map((_, colIdx) => {
            const tx = colIdx * (COL_W + SESS_GAP);
            return (
              <svg
                key={`sil-${colIdx}`}
                x={tx}
                y={0}
                width={COL_W}
                height={COL_H}
                viewBox={`0 ${CROP_Y} ${SLICE_W} ${CROP_H}`}
                preserveAspectRatio="xMidYMid meet"
                overflow="hidden"
              >
                <image
                  href={SPRITE}
                  x={0}
                  y={0}
                  width={IMG_W}
                  height={IMG_H}
                  preserveAspectRatio="none"
                />
              </svg>
            );
          })}

          {/* ── Connecting bezier lines ── */}
          {connectedRegions.map(([label, occs]) => {
            const firstI = occs[0].intensity;
            const lastI = occs[occs.length - 1].intensity;
            const color = trendColor(firstI, lastI);
            const tipText = `${label} — ${occs.length} session${occs.length !== 1 ? "s" : ""} — ${trendLabel(firstI, lastI)}`;
            const isHovered = hoveredRegion === label;

            return occs.slice(0, -1).map((occ, segIdx) => {
              const next = occs[segIdx + 1];
              const x1 = fx(occ.cx, occ.colIdx);
              const y1 = fy(occ.cy);
              const x2 = fx(next.cx, next.colIdx);
              const y2 = fy(next.cy);
              const d = bezierPath(x1, y1, x2, y2);

              return (
                <g key={`line-${label}-${segIdx}`}>
                  {/* Visible line */}
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 0.75 : 0.3}
                    strokeLinecap="round"
                    style={{ transition: "opacity 0.15s, stroke-width 0.15s" }}
                  />
                  {/* Wide transparent hit target */}
                  <path
                    d={d}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={16}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      setHoveredRegion(label);
                      setTooltip({ text: tipText, screenX: e.clientX, screenY: e.clientY });
                    }}
                    onMouseMove={(e) => {
                      setTooltip({ text: tipText, screenX: e.clientX, screenY: e.clientY });
                    }}
                    onMouseLeave={() => {
                      setHoveredRegion(null);
                      setTooltip(null);
                    }}
                  />
                </g>
              );
            });
          })}

          {/* ── Pain dots (rendered after lines so they sit on top) ── */}
          {sessions.map((session, colIdx) =>
            session.spots.map((spot, dotIdx) => {
              const x = fx(spot.cx, colIdx);
              const y = fy(spot.cy);
              const r = spot.size === "pinpoint" ? 2.5 : spot.size === "regional" ? 4.5 : 6.5;
              const color = dotColor(spot.intensity);
              const isOnHoveredLine = hoveredRegion === spot.label;
              return (
                <circle
                  key={`dot-${colIdx}-${dotIdx}`}
                  cx={x}
                  cy={y}
                  r={isOnHoveredLine ? r + 1 : r}
                  fill={color}
                  opacity={isOnHoveredLine ? 1 : 0.85}
                  style={{ transition: "r 0.15s, opacity 0.15s" }}
                />
              );
            })
          )}

          {/* ── Session date labels ── */}
          {sessions.map((session, colIdx) => {
            const labelX = colIdx * (COL_W + SESS_GAP) + COL_W / 2;
            return (
              <text
                key={`date-${colIdx}`}
                x={labelX}
                y={COL_H + 14}
                textAnchor="middle"
                fontSize={8}
                fontFamily="system-ui, -apple-system, sans-serif"
                fill="#94a3b8"
              >
                {shortDate(session.timestamp)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Floating tooltip (fixed so it escapes any overflow:hidden parent) */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 max-w-xs rounded-md bg-slate-800/92 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
          style={{ left: tooltip.screenX + 14, top: tooltip.screenY - 36 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
});

export default ConnectedTimeline;

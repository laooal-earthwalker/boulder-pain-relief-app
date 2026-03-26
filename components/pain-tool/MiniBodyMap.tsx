"use client";

import { MF_TORSO, MF_RLEG, MF_LLEG } from "./BodyFigures";
import type { PainMapSpot } from "@/types/painmap";

// Viewport the body paths were drawn in
const VB_W = 140;
const VB_H = 430;

function spotColor(intensity: number): string {
  if (intensity <= 1) return "#5eead4";
  if (intensity <= 2) return "#fbbf24";
  if (intensity <= 3) return "#f97316";
  if (intensity <= 4) return "#ef4444";
  return "#7c3aed";
}

interface Props {
  spots: PainMapSpot[];
  width?: number;
}

export default function MiniBodyMap({ spots, width = 56 }: Props) {
  const height = Math.round(width * (VB_H / VB_W));

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={width}
      height={height}
      aria-hidden
      className="shrink-0"
    >
      {/* Body silhouette */}
      <path d={MF_TORSO} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.8} />
      <path d={MF_RLEG}  fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.8} />
      <path d={MF_LLEG}  fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.8} />

      {/* Pain spots */}
      {spots.map((s, i) => {
        const r = s.size === "pinpoint" ? 4 : s.size === "regional" ? 7 : 10;
        const color = spotColor(s.intensity);
        return (
          <g key={i}>
            {s.size === "diffuse" && (
              <circle cx={s.cx} cy={s.cy} r={r + 4} fill={color} opacity={0.18} />
            )}
            <circle
              cx={s.cx}
              cy={s.cy}
              r={r}
              fill={color}
              opacity={0.85}
            />
          </g>
        );
      })}
    </svg>
  );
}

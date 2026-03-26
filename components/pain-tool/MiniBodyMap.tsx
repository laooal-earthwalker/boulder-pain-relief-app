"use client";

// MiniBodyMap — thumbnail body figure with plotted pain dots.
// Uses the real figure image sprite; dots are placed in the 140×430
// coordinate space that matches the stored cx/cy values.

import type { PainMapSpot } from "@/types/painmap";

const SPRITE   = "/images/painmap-figures.png";
const IMG_W    = 2000;
const IMG_H    = 1090;
const SLICE_W  = 500;

// Local coordinate space (matches BodyMap landmark grid)
const VB_W = 140;
const VB_H = 430;

function spotColor(intensity: number): string {
  if (intensity <= 1) return "#fcd34d";
  if (intensity <= 2) return "#f97316";
  if (intensity <= 3) return "#ef4444";
  if (intensity <= 4) return "#dc2626";
  return "#991b1b";
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
      {/* Figure image — Male Front by default for thumbnails.
          preserveAspectRatio="none" stretches to fill exactly VB_W×VB_H,
          so stored cx/cy values (0-140, 0-430) align proportionally. */}
      <svg x={0} y={0} width={VB_W} height={VB_H} viewBox={`0 0 ${SLICE_W} ${IMG_H}`} overflow="hidden">
        <image
          href={SPRITE}
          x={0}
          y={0}
          width={IMG_W}
          height={IMG_H}
          preserveAspectRatio="none"
        />
      </svg>

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
              opacity={0.88}
              stroke="white"
              strokeWidth={1}
            />
          </g>
        );
      })}
    </svg>
  );
}

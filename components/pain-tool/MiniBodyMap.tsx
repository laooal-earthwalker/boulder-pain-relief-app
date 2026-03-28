"use client";

// MiniBodyMap — thumbnail body figure with plotted pain dots.
// Uses the real figure image sprite; dots are placed in the 140×290
// coordinate space that matches stored cx/cy values from BodyMap.

import { memo } from "react";
import type { PainMapSpot } from "@/types/painmap";
import { spotColor } from "./BodyMap";

const SPRITE      = "/images/painmap-figures.png";
const IMG_W       = 2816;
const IMG_H       = 1536;
const SLICE_W     = 704;   // one column (IMG_W / 4)
const CROP_Y      = 40;    // matches BodyFigures CROP_Y_START
const CROP_H      = 1460;  // matches BodyFigures CROP_H (1500 - 40)

// Local coordinate space — must match BodyMap's FIGURE_LOCAL_W / FIGURE_LOCAL_H
const VB_W = 140;
const VB_H = 290;

interface Props {
  spots: PainMapSpot[];
  width?: number;
}

const MiniBodyMap = memo(function MiniBodyMap({ spots, width = 56 }: Props) {
  const height = Math.round(width * (VB_H / VB_W));

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      width={width}
      height={height}
      aria-hidden
      className="shrink-0"
    >
      {/* Figure image — Male Front. The inner svg clips to the viewBox slice
          and the image fills it with none AR so cx/cy coords align exactly. */}
      <svg
        x={0}
        y={0}
        width={VB_W}
        height={VB_H}
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
});

export default MiniBodyMap;

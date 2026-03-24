/**
 * BodyThumbnail — compact body map showing pain region dots.
 * Used in the practitioner client list to give a quick visual summary.
 * No PHI rendered — dots show position and intensity color only.
 */

import type { PainSpotRecord } from "@/types/database";
import { spotColor } from "@/components/pain-tool/BodyMap";

// Simplified single-path silhouette (same as BodyMap BODY_PATH)
const BODY_PATH = `
  M 70,2 C 93,2 95,28 87,50 C 83,58 79,66 79,68
  C 87,66 105,66 123,76 C 135,82 133,100 127,114
  C 123,128 119,146 117,162 C 115,176 113,192 111,208
  C 109,218 109,228 111,234 C 113,240 117,238 119,232
  C 121,224 121,210 121,198 C 123,182 125,166 125,146
  C 127,128 127,110 121,96 C 119,88 111,80 99,80
  C 103,88 105,108 107,130 C 109,150 107,168 103,182
  C 101,192 101,204 105,216 C 107,228 107,240 103,252
  C 103,274 103,296 101,320 C 101,336 99,350 99,374
  C 99,386 103,396 99,402 C 89,406 79,406 70,406
  C 61,406 51,406 41,402 C 37,396 41,386 41,374
  C 41,350 39,336 39,320 C 37,296 37,274 37,252
  C 33,240 33,228 35,216 C 39,204 39,192 37,182
  C 33,168 31,150 33,130 C 35,108 37,88 41,80
  C 29,80 21,88 19,96 C 13,110 13,128 13,146
  C 13,166 15,182 17,198 C 17,210 17,224 19,232
  C 21,238 25,240 27,234 C 29,228 29,218 27,208
  C 25,192 23,176 21,162 C 19,146 15,128 11,114
  C 5,100 7,82 19,76 C 37,66 55,66 61,68
  C 61,66 57,58 53,50 C 45,28 47,2 70,2 Z
`;

interface Props {
  spots: PainSpotRecord[];
  width?: number;
}

export default function BodyThumbnail({ spots, width = 52 }: Props) {
  const height = Math.round((410 / 140) * width);

  return (
    <svg
      viewBox="5 0 130 410"
      width={width}
      height={height}
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Silhouette */}
      <path d={BODY_PATH} fill="#e2e8f0" stroke="#94a3b8" strokeWidth={2} />
      {/* Pain dots — front view spots only for thumbnail clarity */}
      {spots
        .filter((s) => s.view === "front")
        .map((spot, i) => (
          <circle
            key={i}
            cx={spot.cx}
            cy={spot.cy}
            r={spot.size === "pinpoint" ? 4 : spot.size === "diffuse" ? 9 : 6}
            fill={spotColor(spot.intensity)}
            opacity={0.88}
          />
        ))}
      {/* Back spots shown slightly offset so they're distinguishable */}
      {spots
        .filter((s) => s.view === "back")
        .map((spot, i) => (
          <circle
            key={`b-${i}`}
            cx={spot.cx}
            cy={spot.cy}
            r={spot.size === "pinpoint" ? 4 : spot.size === "diffuse" ? 9 : 6}
            fill={spotColor(spot.intensity)}
            opacity={0.5}
            strokeDasharray="2 2"
            stroke="white"
            strokeWidth={1}
          />
        ))}
    </svg>
  );
}

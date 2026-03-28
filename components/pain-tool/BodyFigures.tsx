"use client";

import React from "react";

// ── Body figure image crop components ─────────────────────────────────────────
// Source: /images/painmap-figures.png — 2816 × 1536 px (measured)
// Layout (left → right): Male Front | Male Back | Female Front | Female Back
// Each figure occupies a 704 px wide column (2816 / 4).
// Figures span y≈50–1490 in the sprite; we crop to y=40–1500 (±10px margin).
// FIGURE_LOCAL_H is sized so the 704×1460 viewBox fills the display container
// exactly when using preserveAspectRatio="xMidYMid meet" (no clipping ever).

const SPRITE       = "/images/painmap-figures.png";
const IMG_W        = 2816;
const IMG_H        = 1536;
const SLICE_W      = 704;  // one figure column (IMG_W / 4)
const CROP_Y_START = 40;   // 10 px above first head pixel (y≈50)
const CROP_Y_END   = 1500; // 10 px below last foot pixel (y≈1490)
const CROP_H       = CROP_Y_END - CROP_Y_START; // 1460

// Local coordinate space BodyMap draws everything in.
// H is chosen so display aspect (140/290 ≈ 0.483) ≈ viewBox aspect (704/1460 ≈ 0.482),
// making "meet" fill the container with zero dead space.
export const FIGURE_LOCAL_W = 140;
export const FIGURE_LOCAL_H = 290;

function FigureImage({ xOffset }: { xOffset: number }) {
  return (
    <svg
      x={0}
      y={0}
      width={FIGURE_LOCAL_W}
      height={FIGURE_LOCAL_H}
      viewBox={`${xOffset} ${CROP_Y_START} ${SLICE_W} ${CROP_H}`}
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
}

export function MaleFrontFigure()   { return <FigureImage xOffset={0}    />; }
export function MaleBackFigure()    { return <FigureImage xOffset={704}  />; }
export function FemaleFrontFigure() { return <FigureImage xOffset={1408} />; }
export function FemaleBackFigure()  { return <FigureImage xOffset={2112} />; }

// ── SVG filter defs ───────────────────────────────────────────────────────────

export function SharedDefs() {
  return (
    <defs>
      <filter id="bm-blur-diffuse" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="bm-fig-shadow" x="-20%" y="-5%" width="140%" height="120%">
        <feDropShadow
          dx="0" dy="2" stdDeviation="2"
          floodColor="#64748b" floodOpacity="0.12"
        />
      </filter>
    </defs>
  );
}

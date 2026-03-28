"use client";

import React from "react";

// ── Body figure image crop components ─────────────────────────────────────────
// Source: /images/painmap-figures.png — 2000 × 1090 px
// Layout (left → right): Male Front | Male Back | Female Front | Female Back
// Each figure occupies a 500 × 1090 px slice.
// These components render into the 140 × 430 local coordinate space used by
// BodyMap. A nested <svg> with viewBox cropping isolates each figure slice.

const SPRITE = "/images/painmap-figures.png";
const IMG_W   = 2000;
const IMG_H   = 1090;
const SLICE_W = 500; // one figure slice
// Pixel row where figure heads begin in the sprite — crops empty sky above
const FIGURE_Y_CROP = 140;

// Local coordinate space BodyMap draws everything in
export const FIGURE_LOCAL_W = 140;
export const FIGURE_LOCAL_H = 430;

function FigureImage({ xOffset }: { xOffset: number }) {
  return (
    <svg
      x={0}
      y={0}
      width={FIGURE_LOCAL_W}
      height={FIGURE_LOCAL_H}
      viewBox={`${xOffset} ${FIGURE_Y_CROP} ${SLICE_W} ${IMG_H - FIGURE_Y_CROP}`}
      preserveAspectRatio="xMidYMin meet"
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
export function MaleBackFigure()    { return <FigureImage xOffset={500}  />; }
export function FemaleFrontFigure() { return <FigureImage xOffset={1000} />; }
export function FemaleBackFigure()  { return <FigureImage xOffset={1500} />; }

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

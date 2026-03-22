"use client";

import type { BodyPart, Condition } from "@/types";

export default function FilterBar(_props: {
  bodyParts: BodyPart[];
  conditions: Condition[];
  onFilter: (bodyPart: BodyPart | null, condition: Condition | null) => void;
}) {
  return <div />;
}

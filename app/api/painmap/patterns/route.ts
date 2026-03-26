import { NextRequest, NextResponse } from "next/server";
import { getSessionsByToken } from "@/lib/painmap-store";
import {
  computeRegionFrequencies,
  computeInsights,
} from "@/lib/painmap-insights";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }

  const sessions = getSessionsByToken(token);
  const frequencies = computeRegionFrequencies(sessions);
  const insights = sessions.length >= 3 ? computeInsights(sessions) : [];

  return NextResponse.json({
    frequencies,
    insights,
    totalSessions: sessions.length,
  });
}

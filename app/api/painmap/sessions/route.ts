import { NextRequest, NextResponse } from "next/server";
import { addSession, getSessionsByToken } from "@/lib/painmap-store";
import {
  buildComparison,
  computeInsights,
} from "@/lib/painmap-insights";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }
  const sessions = getSessionsByToken(token);
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clientToken, spots, duration, worseWith, betterWith, figure } =
    body as {
      clientToken?: string;
      spots?: unknown[];
      duration?: string;
      worseWith?: string;
      betterWith?: string;
      figure?: "male" | "female";
    };

  if (!clientToken || !Array.isArray(spots)) {
    return NextResponse.json(
      { error: "clientToken and spots are required" },
      { status: 400 }
    );
  }

  const session = addSession({
    clientToken,
    timestamp: new Date().toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    spots: spots as any,
    duration: duration ?? "",
    worseWith: worseWith || undefined,
    betterWith: betterWith || undefined,
    figure: figure ?? "male",
  });

  const allSessions = getSessionsByToken(clientToken);
  const comparison = buildComparison(session, allSessions);
  const insights = allSessions.length >= 3 ? computeInsights(allSessions) : [];

  return NextResponse.json({ session, comparison, insights });
}

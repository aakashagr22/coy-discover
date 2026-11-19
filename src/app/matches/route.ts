import { NextResponse } from "next/server";
import { getMutualMatches } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getMutualMatches();
    return NextResponse.json({
      matches,
      count: matches.length,
    });
  } catch (error) {
    console.error("GET /matches error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve matches" },
      { status: 500 }
    );
  }
}

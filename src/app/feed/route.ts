import { NextResponse } from "next/server";
import { getFeedProfiles } from "@/lib/services";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profiles = await getFeedProfiles();
    return NextResponse.json({
      profiles,
      remainingCount: profiles.length,
    });
  } catch (error) {
    console.error("GET /feed error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feed profiles" },
      { status: 500 }
    );
  }
}

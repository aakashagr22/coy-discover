import { NextRequest, NextResponse } from "next/server";
import { recordSwipe } from "@/lib/services";
import { swipeSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = swipeSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await recordSwipe(parseResult.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("POST /swipe error:", error);
    const status = error.message === "Target user profile not found" ? 404 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to record swipe" },
      { status }
    );
  }
}

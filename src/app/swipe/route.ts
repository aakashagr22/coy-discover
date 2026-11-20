import { NextRequest, NextResponse } from "next/server";
import { recordSwipe } from "@/lib/services";
import { swipeSchema } from "@/lib/validations";
import {
  SwipeConflictError,
  ProfileNotFoundError,
  SelfSwipeError,
} from "@/lib/errors";

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
  } catch (error: unknown) {
    console.error("POST /swipe error:", error);

    if (error instanceof SwipeConflictError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    if (error instanceof ProfileNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    if (error instanceof SelfSwipeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

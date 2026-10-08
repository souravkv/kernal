import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { priceCourse } from "@/lib/checkout";
import { COUPON_MESSAGES } from "@/lib/coupons";

export async function POST(req: Request) {
  let body: { code?: string; courseId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { code, courseId } = body;
  if (!code || typeof code !== "string" || !courseId || typeof courseId !== "string") {
    return NextResponse.json(
      { error: "code and courseId are required" },
      { status: 400 }
    );
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const result = await priceCourse(courseId, code, userId);
  if (!result.ok) {
    return NextResponse.json(
      {
        valid: false,
        error: result.error,
        message:
          result.error === "COURSE_NOT_FOUND"
            ? "Course not found."
            : COUPON_MESSAGES[result.error],
      },
      { status: result.error === "COURSE_NOT_FOUND" ? 404 : 200 }
    );
  }

  return NextResponse.json({
    valid: true,
    code: result.coupon!.code,
    originalPrice: result.originalPrice,
    finalPrice: result.finalPrice,
    discount: result.originalPrice - result.finalPrice,
  });
}

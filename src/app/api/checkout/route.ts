import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { priceCourse } from "@/lib/checkout";
import { COUPON_MESSAGES } from "@/lib/coupons";

interface CheckoutItem {
  courseId: string;
  couponCode?: string | null;
}

/**
 * Single money path. Today: creates COMPLETED purchases instantly (no gateway).
 * Future gateway: same payload → create PENDING purchases, flip to COMPLETED in
 * the webhook. Prices are ALWAYS recomputed here — nothing from the client.
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: { items?: CheckoutItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 10) {
    return NextResponse.json(
      { error: "items must be a non-empty array (max 10)" },
      { status: 400 }
    );
  }

  // dedupe by courseId, keep first occurrence
  const items: CheckoutItem[] = [];
  const seen = new Set<string>();
  for (const it of rawItems) {
    if (!it || typeof it.courseId !== "string" || !it.courseId) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }
    if (seen.has(it.courseId)) continue;
    seen.add(it.courseId);
    items.push({
      courseId: it.courseId,
      couponCode:
        typeof it.couponCode === "string" && it.couponCode.trim()
          ? it.couponCode
          : null,
    });
  }

  // already-owned courses are skipped (idempotent, no coupon consumed)
  const owned = await db.purchase.findMany({
    where: { userId, courseId: { in: items.map((i) => i.courseId) } },
    select: { courseId: true },
  });
  const ownedSet = new Set(owned.map((p) => p.courseId));
  const toBuy = items.filter((i) => !ownedSet.has(i.courseId));

  if (toBuy.length === 0) {
    return NextResponse.json({ ok: true, purchased: 0, alreadyOwned: ownedSet.size, totalPaid: 0 });
  }

  // price every item server-side BEFORE charging anything (all-or-nothing)
  const priced = [];
  for (const item of toBuy) {
    const result = await priceCourse(item.courseId, item.couponCode, userId);
    if (!result.ok) {
      const message =
        result.error === "COURSE_NOT_FOUND"
          ? "Course not found."
          : COUPON_MESSAGES[result.error];
      return NextResponse.json(
        { error: message, courseId: item.courseId, code: result.error },
        { status: result.error === "COURSE_NOT_FOUND" ? 404 : 400 }
      );
    }
    priced.push(result);
  }

  const totalPaid = priced.reduce((s, p) => s + p.finalPrice, 0);

  try {
    await db.$transaction(
      priced.map((p) => [
        db.purchase.create({
          data: {
            userId,
            courseId: p.course.id,
            pricePaid: p.finalPrice,
            couponId: p.coupon?.id ?? null,
            status: "COMPLETED",
          },
        }),
        ...(p.coupon
          ? [
              db.couponRedemption.create({
                data: {
                  couponId: p.coupon.id,
                  userId,
                  pricePaid: p.finalPrice,
                },
              }),
            ]
          : []),
      ]).flat()
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Already purchased or coupon already used." },
        { status: 409 }
      );
    }
    throw e;
  }

  return NextResponse.json({
    ok: true,
    purchased: priced.length,
    alreadyOwned: ownedSet.size,
    totalPaid,
  });
}

import { db } from "@/lib/db";
import {
  computeFinalPrice,
  couponValidationError,
  normalizeCouponCode,
  type CouponError,
} from "@/lib/coupons";

export type PriceResult =
  | {
      ok: true;
      course: { id: string; slug: string; title: string; price: number };
      coupon: { id: string; code: string } | null;
      originalPrice: number;
      finalPrice: number;
    }
  | { ok: false; error: CouponError | "COURSE_NOT_FOUND" };

/**
 * Authoritative pricing for one course. Called by BOTH /api/coupon/validate
 * (preview) and /api/checkout (charge) so the numbers can never diverge.
 */
export async function priceCourse(
  courseId: string,
  couponCode: string | null | undefined,
  userId: string | null
): Promise<PriceResult> {
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { id: true, slug: true, title: true, price: true },
  });
  if (!course) return { ok: false, error: "COURSE_NOT_FOUND" };

  const base = course.price;
  if (!couponCode || !couponCode.trim()) {
    return {
      ok: true,
      course,
      coupon: null,
      originalPrice: base,
      finalPrice: base,
    };
  }

  const code = normalizeCouponCode(couponCode);
  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon) return { ok: false, error: "NOT_FOUND" };

  const [redemptionCount, userRedemption] = await Promise.all([
    db.couponRedemption.count({ where: { couponId: coupon.id } }),
    userId
      ? db.couponRedemption.findUnique({
          where: { couponId_userId: { couponId: coupon.id, userId } },
        })
      : Promise.resolve(null),
  ]);

  const err = couponValidationError(
    coupon,
    userId,
    !!userRedemption,
    redemptionCount
  );
  if (err) return { ok: false, error: err };

  return {
    ok: true,
    course,
    coupon: { id: coupon.id, code: coupon.code },
    originalPrice: base,
    finalPrice: computeFinalPrice(base, coupon),
  };
}

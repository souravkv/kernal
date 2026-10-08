export interface CouponLike {
  id: string;
  code: string;
  type: string; // SET_PRICE | PERCENT_OFF | AMOUNT_OFF
  value: number;
  active: boolean;
  expiresAt: Date | null;
  maxRedemptions: number | null;
}

export type CouponError =
  | "NOT_FOUND"
  | "INACTIVE"
  | "EXPIRED"
  | "ALREADY_USED"
  | "EXHAUSTED";

export function normalizeCouponCode(raw: string): string {
  return raw.trim().toUpperCase();
}

/**
 * All pricing happens server-side from this function — the client only ever
 * displays what the API returns, and checkout recomputes it authoritatively.
 */
export function computeFinalPrice(
  basePrice: number,
  coupon: Pick<CouponLike, "type" | "value">
): number {
  let final: number;
  switch (coupon.type) {
    case "SET_PRICE":
      final = coupon.value;
      break;
    case "PERCENT_OFF":
      final = basePrice - Math.floor((basePrice * coupon.value) / 100);
      break;
    case "AMOUNT_OFF":
      final = basePrice - coupon.value;
      break;
    default:
      final = basePrice;
  }
  return Math.max(0, Math.min(basePrice, final));
}

export function couponValidationError(
  coupon: CouponLike,
  userId: string | null,
  alreadyRedeemed: boolean,
  redemptionCount: number
): CouponError | null {
  if (!coupon.active) return "INACTIVE";
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now())
    return "EXPIRED";
  if (userId && alreadyRedeemed) return "ALREADY_USED";
  if (coupon.maxRedemptions !== null && redemptionCount >= coupon.maxRedemptions)
    return "EXHAUSTED";
  return null;
}

export const COUPON_MESSAGES: Record<CouponError, string> = {
  NOT_FOUND: "That coupon code doesn't exist.",
  INACTIVE: "That coupon code is no longer active.",
  EXPIRED: "That coupon code has expired.",
  ALREADY_USED: "You've already used that coupon code.",
  EXHAUSTED: "That coupon code has been fully redeemed.",
};

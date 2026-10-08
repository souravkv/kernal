import { db } from "@/lib/db";

/**
 * Single source of truth for course entitlement.
 * Free courses (price <= 0) are open to every signed-in user;
 * paid courses require a COMPLETED Purchase row.
 * (When a payment gateway lands, only the PENDING → COMPLETED flip changes.)
 */
export async function hasCourseAccess(
  userId: string | null | undefined,
  courseId: string
): Promise<boolean> {
  if (!userId) return false;
  const course = await db.course.findUnique({
    where: { id: courseId },
    select: { price: true },
  });
  if (!course) return false;
  if (course.price <= 0) return true;
  const purchase = await db.purchase.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true },
  });
  return purchase?.status === "COMPLETED";
}

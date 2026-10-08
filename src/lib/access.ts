import { db } from "@/lib/db";

/**
 * Single source of truth for course entitlement.
 * Free courses (price <= 0) are open to every signed-in user;
 * paid courses require a COMPLETED Purchase row.
 * Pass `knownPrice` when the caller already fetched the course to skip a query.
 */
export async function hasCourseAccess(
  userId: string | null | undefined,
  courseId: string,
  knownPrice?: number
): Promise<boolean> {
  if (!userId) return false;

  if (knownPrice !== undefined) {
    if (knownPrice <= 0) return true;
    const purchase = await db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { status: true },
    });
    return purchase?.status === "COMPLETED";
  }

  const [course, purchase] = await Promise.all([
    db.course.findUnique({
      where: { id: courseId },
      select: { price: true },
    }),
    db.purchase.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: { status: true },
    }),
  ]);
  if (!course) return false;
  if (course.price <= 0) return true;
  return purchase?.status === "COMPLETED";
}

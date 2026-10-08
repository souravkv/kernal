"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShoppingCart, Tag } from "lucide-react";
import { useSession } from "next-auth/react";
import { addToCart, formatPrice } from "@/lib/cart";

export interface PaywallCourse {
  id: string;
  slug: string;
  code: string;
  title: string;
  price: number;
}

export default function Paywall({ course }: { course: PaywallCourse }) {
  const { data: session } = useSession();
  const router = useRouter();

  const buy = () => {
    addToCart({
      courseId: course.id,
      slug: course.slug,
      title: course.title,
      code: course.code,
      price: course.price,
    });
    router.push("/cart");
  };

  return (
    <div className="mx-auto max-w-[720px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12">
        <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[var(--border)]">
          <Lock className="h-5 w-5 text-[var(--muted)]" />
        </div>
        <span className="body-xs mb-4 block uppercase tracking-[0.3em] text-[var(--muted)]">
          {course.code} · locked
        </span>
        <h1 className="heading-lg mb-3">This course is purchase-only</h1>
        <p className="body-md mb-8 text-[var(--muted)]">
          Own <span className="text-[var(--fg)]">{course.title}</span> to unlock
          every module, topic and quiz — once purchased it&apos;s yours forever.
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-4 border-t border-[var(--border)] pt-6">
          <span className="heading-md">{formatPrice(course.price)}</span>
          <button
            onClick={buy}
            className="flex items-center gap-2 border border-[var(--fg)] px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy course
          </button>
          {!session && (
            <Link
              href="/login"
              className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
            >
              Sign in first
            </Link>
          )}
        </div>

        <div className="flex items-start gap-3 border border-[var(--border)] p-4">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-[var(--muted)]" />
          <p className="body-sm text-[var(--muted)]">
            Launch offer — use code{" "}
            <span className="font-mono text-[var(--fg)]">KERNAL999</span> for{" "}
            {formatPrice(999)}, or{" "}
            <span className="font-mono text-[var(--fg)]">KERNALFREE</span> to get
            it completely free. Codes are applied at checkout.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-6">
        <Link
          href={`/courses/${course.slug}`}
          className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
        >
          ← Back to course overview
        </Link>
        <Link
          href="/courses"
          className="text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] underline underline-offset-4 transition-colors hover:text-[var(--fg)]"
        >
          All courses
        </Link>
      </div>
    </div>
  );
}

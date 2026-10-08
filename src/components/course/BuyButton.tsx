"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingCart } from "lucide-react";
import { addToCart, formatPrice } from "@/lib/cart";

export default function BuyButton({
  course,
  owned,
}: {
  course: { id: string; slug: string; code: string; title: string; price: number };
  owned: boolean;
}) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  if (owned) {
    return (
      <span className="flex items-center gap-2 border border-[var(--fg)] px-4 py-2 text-[11px] uppercase tracking-[0.2em]">
        <Check className="h-3.5 w-3.5" />
        Purchased
      </span>
    );
  }

  const buy = () => {
    addToCart({
      courseId: course.id,
      slug: course.slug,
      title: course.title,
      code: course.code,
      price: course.price,
    });
    setAdded(true);
    router.push("/cart");
  };

  return (
    <button
      onClick={buy}
      className="flex items-center gap-2 border border-[var(--fg)] bg-[var(--fg)] px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)]"
    >
      <ShoppingCart className="h-4 w-4" />
      {added ? "Added — redirecting…" : `Buy — ${formatPrice(course.price)}`}
    </button>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, Loader2, ShoppingCart, Tag, Trash2, X } from "lucide-react";
import {
  clearCart,
  formatPrice,
  removeFromCart,
  useCart,
  type CartItem,
} from "@/lib/cart";

type CouponState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "applied"; code: string; finalPrice: number }
  | { status: "error"; message: string };

interface ItemRowProps {
  item: CartItem;
  coupon: CouponState;
  couponInput: string;
  onCouponInput: (v: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

function ItemRow({
  item,
  coupon,
  couponInput,
  onCouponInput,
  onApply,
  onRemove,
}: ItemRowProps) {
  const finalPrice =
    coupon.status === "applied" ? coupon.finalPrice : item.price;
  const discount = item.price - finalPrice;

  return (
    <div className="border border-[var(--border)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="body-xs block uppercase tracking-[0.2em] text-[var(--muted)]">
            {item.code}
          </span>
          <Link
            href={`/courses/${item.slug}`}
            className="heading-sm transition-colors hover:text-[var(--muted)]"
          >
            {item.title}
          </Link>
        </div>
        <div className="text-right">
          <div className="heading-sm">
            {discount > 0 && (
              <span className="mr-2 font-normal text-[var(--muted)] line-through">
                {formatPrice(item.price)}
              </span>
            )}
            {formatPrice(finalPrice)}
          </div>
          {discount > 0 && (
            <span className="body-xs text-[var(--muted)]">
              you save {formatPrice(discount)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-4">
        <Tag className="h-4 w-4 text-[var(--muted)]" />
        <input
          value={couponInput}
          onChange={(e) => onCouponInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onApply()}
          placeholder="Coupon code"
          className="w-44 border border-[var(--border)] bg-transparent px-3 py-2 font-mono text-[13px] uppercase tracking-wider text-[var(--fg)] placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--muted)] focus:border-[var(--fg)] focus:outline-none"
        />
        <button
          onClick={onApply}
          disabled={coupon.status === "checking" || !couponInput.trim()}
          className="border border-[var(--border)] px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-[var(--fg)] disabled:opacity-40"
        >
          {coupon.status === "checking" ? "Checking…" : "Apply"}
        </button>
        {coupon.status === "applied" && (
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[var(--fg)]">
            <Check className="h-3.5 w-3.5" />
            {coupon.code} applied
          </span>
        )}
        {coupon.status === "error" && (
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--fg)]">
            <X className="h-3.5 w-3.5" />
            {coupon.message}
          </span>
        )}
        <button
          onClick={onRemove}
          className="ml-auto flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const items = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [coupons, setCoupons] = useState<Record<string, CouponState>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ count: number; paid: number } | null>(null);

  const applyCoupon = async (item: CartItem) => {
    const code = inputs[item.courseId] ?? "";
    if (!code.trim()) return;
    setCoupons((c) => ({ ...c, [item.courseId]: { status: "checking" } }));
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), courseId: item.courseId }),
      });
      const data = await res.json();
      if (data.valid) {
        setCoupons((c) => ({
          ...c,
          [item.courseId]: {
            status: "applied",
            code: data.code,
            finalPrice: data.finalPrice,
          },
        }));
      } else {
        setCoupons((c) => ({
          ...c,
          [item.courseId]: { status: "error", message: data.message ?? "Invalid code" },
        }));
      }
    } catch {
      setCoupons((c) => ({
        ...c,
        [item.courseId]: { status: "error", message: "Network error — try again" },
      }));
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const total = items.reduce((s, i) => {
    const c = coupons[i.courseId];
    return s + (c?.status === "applied" ? c.finalPrice : i.price);
  }, 0);
  const discount = subtotal - total;

  const checkout = async () => {
    if (items.length === 0 || placing) return;
    setError(null);
    setPlacing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => {
            const c = coupons[i.courseId];
            return {
              courseId: i.courseId,
              couponCode: c?.status === "applied" ? c.code : null,
            };
          }),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed — try again");
        setPlacing(false);
        return;
      }
      const firstSlug = items[0].slug;
      clearCart();
      setDone({ count: data.purchased + data.alreadyOwned, paid: data.totalPaid });
      setPlacing(false);
      router.push(`/courses/${firstSlug}`);
    } catch {
      setError("Network error — try again");
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24 sm:px-10 sm:py-32">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12">
          <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[var(--fg)]">
            <Check className="h-6 w-6" />
          </div>
          <h1 className="heading-lg mb-3">You&apos;re in.</h1>
          <p className="body-md text-[var(--muted)]">
            {done.count} course{done.count === 1 ? "" : "s"} unlocked · paid{" "}
            {formatPrice(done.paid)}. It&apos;s yours forever — start whenever you
            want.
          </p>
          <Link
            href="/courses"
            className="mt-8 inline-block border border-[var(--fg)] bg-[var(--fg)] px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)]"
          >
            Start learning →
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24 text-center sm:px-10 sm:py-32">
        <ShoppingCart className="mx-auto mb-6 h-8 w-8 text-[var(--muted)]" />
        <h1 className="heading-lg mb-3">Your cart is empty</h1>
        <p className="body-md mb-8 text-[var(--muted)]">
          Browse the catalogue and hit Buy on a course to get started.
        </p>
        <Link
          href="/courses"
          className="inline-block border border-[var(--fg)] px-6 py-3 text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[860px] px-6 py-20 sm:px-10 sm:py-24">
      <div className="mb-8">
        <Link
          href="/courses"
          className="body-sm inline-block text-[var(--muted)] transition-colors hover:text-[var(--fg)]"
        >
          ← Continue browsing
        </Link>
      </div>

      <h1 className="heading-xl mb-10">Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <ItemRow
            key={item.courseId}
            item={item}
            coupon={coupons[item.courseId] ?? { status: "idle" }}
            couponInput={inputs[item.courseId] ?? ""}
            onCouponInput={(v) => setInputs((s) => ({ ...s, [item.courseId]: v }))}
            onApply={() => applyCoupon(item)}
            onRemove={() => {
              setCoupons((c) => {
                const n = { ...c };
                delete n[item.courseId];
                return n;
              });
              removeFromCart(item.courseId);
            }}
          />
        ))}
      </div>

      <div className="mt-8 border border-[var(--border)] p-6">
        <div className="mb-2 flex justify-between body-sm text-[var(--muted)]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="mb-2 flex justify-between body-sm text-[var(--fg)]">
            <span>Coupon discount</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-[var(--border)] pt-3 heading-sm">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 flex items-center gap-2 text-[13px] text-[var(--fg)]">
          <X className="h-4 w-4" />
          {error}
        </p>
      )}

      <div className="mt-8">
        {status === "loading" ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 border border-[var(--border)] py-4 text-[11px] uppercase tracking-[0.2em] opacity-60"
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Checking session…
          </button>
        ) : !session ? (
          <div className="flex flex-wrap items-center justify-between gap-4 border border-[var(--fg)] p-5">
            <span className="body-sm text-[var(--muted)]">
              Sign in to complete your purchase — {formatPrice(total)} with
              coupons applied.
            </span>
            <Link
              href="/login?callbackUrl=%2Fcart"
              className="border border-[var(--fg)] bg-[var(--fg)] px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)]"
            >
              Sign in to buy
            </Link>
          </div>
        ) : (
          <button
            onClick={checkout}
            disabled={placing}
            className="flex w-full items-center justify-center gap-2 border border-[var(--fg)] bg-[var(--fg)] py-4 text-[11px] uppercase tracking-[0.2em] text-[var(--bg)] transition-colors hover:bg-transparent hover:text-[var(--fg)] disabled:opacity-60"
          >
            {placing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Complete purchase — {formatPrice(total)}
              </>
            )}
          </button>
        )}
        <p className="body-xs mt-4 text-[var(--muted)]">
          Coupons are verified on our servers at checkout — the price you see is
          the price you pay.
        </p>
      </div>
    </div>
  );
}

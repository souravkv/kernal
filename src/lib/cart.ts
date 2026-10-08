"use client";

import { useSyncExternalStore } from "react";

export interface CartItem {
  courseId: string;
  slug: string;
  title: string;
  code: string;
  price: number; // base price at time of adding (display only — server reprices)
}

const CART_KEY = "kernal.cart.v1";
const CHANGE_EVENT = "kernal:cart-changed";

const EMPTY: CartItem[] = [];

function read(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (x): x is CartItem =>
        !!x &&
        typeof x.courseId === "string" &&
        typeof x.slug === "string" &&
        typeof x.title === "string"
    );
  } catch {
    return EMPTY;
  }
}

let cache: CartItem[] | null = null;
const listeners = new Set<() => void>();

function emit() {
  cache = null;
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === CART_KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, emit);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, emit);
  };
}

function getSnapshot(): CartItem[] {
  if (cache === null) cache = read();
  return cache;
}

function write(items: CartItem[]) {
  try {
    if (items.length === 0) window.localStorage.removeItem(CART_KEY);
    else window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable (private mode) — cart just won't persist */
  }
  emit();
}

export function addToCart(item: CartItem): boolean {
  const items = read();
  if (items.some((i) => i.courseId === item.courseId)) return false;
  write([...items, item]);
  return true;
}

export function removeFromCart(courseId: string) {
  write(read().filter((i) => i.courseId !== courseId));
}

export function clearCart() {
  write([]);
}

export function useCart(): CartItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

export function formatPrice(n: number): string {
  return n > 0 ? `₹${n.toLocaleString("en-IN")}` : "Free";
}

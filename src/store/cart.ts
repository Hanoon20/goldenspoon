"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/** "base" is the regular (Normal/Half) portion or the only price; "full" is the Full portion. */
export type Portion = "base" | "full";

export type CartItem = {
  /** Unique per dish + portion, so Normal and Full of the same dish are separate lines. */
  key: string;
  id: string;
  portion: Portion;
  name: string;
  /** Portion name shown next to the dish, e.g. "Full". Empty for single-price dishes. */
  portionLabel: string;
  price: number;
  isVeg: boolean;
  image: string;
  qty: number;
};

export type NewCartItem = Omit<CartItem, "key" | "qty">;

export const cartKey = (id: string, portion: Portion) => `${id}:${portion}`;

type CartState = {
  items: CartItem[];
  add: (item: NewCartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const key = cartKey(item.id, item.portion);
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return { items: s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + 1, 50) } : i)) };
          }
          return { items: [...s.items, { ...item, key, qty: 1 }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((i) => i.key !== key)
              : s.items.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 50) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "goldenspoon-cart",
      // v1 added portions; carts saved by the old version hold sample dishes, so start fresh.
      version: 1,
      migrate: () => ({ items: [] }),
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);

"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart, type CartItem } from "@/store/cart";

export function AddToCartButton({ item, disabled }: { item: Omit<CartItem, "qty">; disabled?: boolean }) {
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const qty = useCart((s) => s.items.find((i) => i.id === item.id)?.qty ?? 0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (disabled) {
    return <span className="rounded-lg bg-ink-100 px-3 py-2 text-xs font-semibold text-ink-700">Sold out</span>;
  }

  if (!mounted || qty === 0) {
    return (
      <button onClick={() => add(item)} className="btn-primary px-5">
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-gold-500 bg-gold-50">
      <button onClick={() => setQty(item.id, qty - 1)} className="p-2 text-gold-700 hover:bg-gold-100" aria-label="Decrease">
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-gold-800">{qty}</span>
      <button onClick={() => add(item)} className="p-2 text-gold-700 hover:bg-gold-100" aria-label="Increase">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

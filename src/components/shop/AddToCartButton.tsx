"use client";

import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cartKey, useCart, type NewCartItem } from "@/store/cart";

type Props = { item: NewCartItem; disabled?: boolean; compact?: boolean };

export function AddToCartButton({ item, disabled, compact }: Props) {
  const key = cartKey(item.id, item.portion);
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const qty = useCart((s) => s.items.find((i) => i.key === key)?.qty ?? 0);
  const what = item.portionLabel ? `${item.name} (${item.portionLabel})` : item.name;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (disabled) {
    return <span className="rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-white/50">Sold out</span>;
  }

  if (!mounted || qty === 0) {
    return (
      <button onClick={() => add(item)} className={compact ? "btn-primary px-4 py-1.5" : "btn-primary px-5"} aria-label={`Add ${what}`}>
        Add
      </button>
    );
  }

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-gold-400/60 bg-gold-400/10">
      <button onClick={() => setQty(key, qty - 1)} className={compact ? "p-1.5 text-gold-200 hover:bg-gold-400/20" : "p-2 text-gold-200 hover:bg-gold-400/20"} aria-label={`Remove one ${what}`}>
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center text-sm font-bold text-gold-100">{qty}</span>
      <button onClick={() => add(item)} className={compact ? "p-1.5 text-gold-200 hover:bg-gold-400/20" : "p-2 text-gold-200 hover:bg-gold-400/20"} aria-label={`Add one more ${what}`}>
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

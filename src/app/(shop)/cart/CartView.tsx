"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { DishImage } from "@/components/shop/DishImage";
import { VegBadge } from "@/components/shop/VegBadge";
import { cartSubtotal, useCart } from "@/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { placeOrder } from "./actions";

type Props = { deliveryFee: number; minOrder: number; isOpen: boolean };

export function CartView({ deliveryFee, minOrder, isOpen }: Props) {
  const { items, setQty, remove, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [type, setType] = useState<"DELIVERY" | "TAKEAWAY">("DELIVERY");
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", note: "" });
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ orderNo: number; whatsappUrl: string } | null>(null);
  const [pending, startTransition] = useTransition();

  if (!mounted) return <div className="min-h-[60vh]" />;

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
        <h1 className="mt-4 font-display text-3xl font-bold">Order #{done.orderNo} created!</h1>
        <p className="mt-3 text-ink-700/80">
          Please send the message in WhatsApp to confirm your order. We&apos;ll reply there with the confirmation.
        </p>
        <a href={done.whatsappUrl} target="_blank" rel="noreferrer" className="btn mt-8 bg-[#25D366] px-6 py-3 text-base text-white hover:bg-[#1ebe5b]">
          <MessageCircle className="h-5 w-5" /> Open WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/menu" className="text-sm font-semibold text-gold-700">Back to menu</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-ink-200" />
        <h1 className="mt-4 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink-700/80">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/menu" className="btn-primary mt-8 px-6 py-3">Browse the menu</Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);
  const fee = type === "DELIVERY" ? deliveryFee : 0;
  const total = subtotal + fee;
  const belowMin = subtotal < minOrder;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const res = await placeOrder({
        ...form,
        type,
        items: items.map((i) => ({ id: i.id, portion: i.portion, qty: i.qty })),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      clear();
      setDone({ orderNo: res.orderNo, whatsappUrl: res.whatsappUrl });
      window.location.href = res.whatsappUrl;
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Items */}
        <div className="card divide-y divide-ink-100">
          {items.map((i) => (
            <div key={i.key} className="flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <DishImage src={i.image} alt={i.name} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <VegBadge isVeg={i.isVeg} />
                  <p className="truncate font-semibold">
                    {i.name}
                    {i.portionLabel && <span className="ml-1.5 rounded bg-gold-100 px-1.5 py-0.5 text-xs font-semibold text-gold-800">{i.portionLabel}</span>}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-ink-700/70">{formatPrice(i.price)} each</p>
              </div>
              <div className="flex items-center rounded-lg border border-ink-200">
                <button onClick={() => setQty(i.key, i.qty - 1)} className="p-2 hover:bg-ink-50" aria-label="Decrease">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-6 text-center text-sm font-bold">{i.qty}</span>
                <button onClick={() => setQty(i.key, i.qty + 1)} className="p-2 hover:bg-ink-50" aria-label="Increase">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="hidden w-20 text-right font-semibold sm:block">{formatPrice(i.price * i.qty)}</p>
              <button onClick={() => remove(i.key)} className="p-2 text-ink-700/50 hover:text-red-600" aria-label="Remove">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Checkout */}
        <form onSubmit={submit} className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-ink-50 p-1">
            {(["DELIVERY", "TAKEAWAY"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={cn("rounded-lg py-2 text-sm font-semibold transition", type === t ? "bg-white shadow" : "text-ink-700/70")}
              >
                {t === "DELIVERY" ? "Delivery" : "Takeaway"}
              </button>
            ))}
          </div>

          <div>
            <label className="label" htmlFor="name">Name</label>
            <input id="name" required className="input" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone (WhatsApp)</label>
            <input id="phone" required type="tel" inputMode="tel" placeholder="077 123 4567" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          {type === "DELIVERY" && (
            <div>
              <label className="label" htmlFor="address">Delivery address</label>
              <textarea id="address" required rows={3} className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          )}
          <div>
            <label className="label" htmlFor="note">Note (optional)</label>
            <input id="note" placeholder="Less spicy, no onion…" className="input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>

          <dl className="space-y-1.5 border-t border-ink-100 pt-4 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {type === "DELIVERY" && <div className="flex justify-between"><dt>Delivery</dt><dd>{fee ? formatPrice(fee) : "Free"}</dd></div>}
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>

          {belowMin && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Minimum order value is {formatPrice(minOrder)}.</p>}
          {!isOpen && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">We&apos;re closed right now and not taking orders.</p>}
          {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button disabled={pending || belowMin || !isOpen} className="btn w-full bg-[#25D366] py-3 text-base text-white hover:bg-[#1ebe5b]">
            <MessageCircle className="h-5 w-5" />
            {pending ? "Placing order…" : "Order on WhatsApp"}
          </button>
          <p className="text-center text-xs text-ink-700/60">Pay on delivery or at pickup. We&apos;ll confirm your order on WhatsApp.</p>
        </form>
      </div>
    </div>
  );
}

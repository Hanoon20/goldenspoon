"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatPrice, normalizePhone, waDigits } from "@/lib/utils";

const orderSchema = z
  .object({
    customerName: z.string().trim().min(2, "Please enter your name").max(80),
    phone: z
      .string()
      .trim()
      .refine((p) => /^\d{11,15}$/.test(normalizePhone(p)), "Enter a valid phone number, e.g. 077 123 4567"),
    type: z.enum(["DELIVERY", "TAKEAWAY"]),
    address: z.string().trim().max(400).default(""),
    note: z.string().trim().max(300).default(""),
    items: z
      .array(
        z.object({
          id: z.string().min(1).max(40),
          portion: z.enum(["base", "full"]).default("base"),
          qty: z.number().int().min(1).max(50),
        }),
      )
      .min(1, "Your cart is empty")
      .max(50),
  })
  .refine((o) => o.type === "TAKEAWAY" || o.address.length >= 8, {
    message: "Please enter your full delivery address",
    path: ["address"],
  });

export type PlaceOrderInput = z.input<typeof orderSchema>;
export type PlaceOrderResult =
  | { ok: true; orderNo: number; whatsappUrl: string }
  | { ok: false; error: string };

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order" };
  const data = parsed.data;

  const settings = await getSettings();
  if (!settings.isOpen) return { ok: false, error: "Sorry, we are closed right now and not taking orders." };

  // Merge duplicate lines (same dish + portion), then load real prices from the database. Never trust client prices.
  const qtyByLine = new Map<string, { id: string; portion: "base" | "full"; qty: number }>();
  for (const i of data.items) {
    const key = `${i.id}:${i.portion}`;
    const prev = qtyByLine.get(key);
    qtyByLine.set(key, { id: i.id, portion: i.portion, qty: Math.min((prev?.qty ?? 0) + i.qty, 50) });
  }
  const ids = [...new Set([...qtyByLine.values()].map((l) => l.id))];

  const dishes = await db.menuItem.findMany({ where: { id: { in: ids } } });
  const dishById = new Map(dishes.map((d) => [d.id, d]));
  const stale = [...qtyByLine.values()].some((l) => {
    const d = dishById.get(l.id);
    return !d || (l.portion === "full" && d.fullPrice == null);
  });
  if (stale) {
    return { ok: false, error: "Some items in your cart are no longer on the menu. Please refresh your cart." };
  }
  const unavailable = dishes.filter((d) => !d.isAvailable);
  if (unavailable.length) {
    return { ok: false, error: `Sold out right now: ${unavailable.map((d) => d.name).join(", ")}. Please remove them.` };
  }

  const lines = [...qtyByLine.values()].map((l) => {
    const d = dishById.get(l.id)!;
    const full = l.portion === "full";
    // Name the portion only for dishes that have two, e.g. "Chicken Kottu (Full)".
    const name = d.fullPrice == null ? d.name : `${d.name} (${full ? "Full" : d.baseLabel})`;
    return { menuItemId: d.id, name, price: full ? d.fullPrice! : d.price, qty: l.qty };
  });
  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  if (subtotal < settings.minOrder) {
    return { ok: false, error: `Minimum order value is ${formatPrice(settings.minOrder)}.` };
  }
  const deliveryFee = data.type === "DELIVERY" ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const order = await db.order.create({
    data: {
      customerName: data.customerName,
      phone: normalizePhone(data.phone),
      type: data.type,
      address: data.type === "DELIVERY" ? data.address : "",
      note: data.note,
      subtotal,
      deliveryFee,
      total,
      items: { create: lines },
    },
  });

  const message = [
    `*New Order #${order.orderNo}* | ${settings.restaurantName}`,
    "",
    `*Name:* ${order.customerName}`,
    `*Phone:* ${data.phone}`,
    `*Type:* ${order.type === "DELIVERY" ? "Delivery" : "Takeaway"}`,
    ...(order.type === "DELIVERY" ? [`*Address:* ${order.address}`] : []),
    "",
    "*Items*",
    ...lines.map((l) => `${l.qty} x ${l.name} = ${formatPrice(l.price * l.qty)}`),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    ...(deliveryFee ? [`Delivery: ${formatPrice(deliveryFee)}`] : []),
    `*Total: ${formatPrice(total)}*`,
    ...(order.note ? ["", `*Note:* ${order.note}`] : []),
  ].join("\n");

  return {
    ok: true,
    orderNo: order.orderNo,
    whatsappUrl: `https://wa.me/${waDigits(settings.whatsappNumber)}?text=${encodeURIComponent(message)}`,
  };
}

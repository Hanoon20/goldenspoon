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
      .array(z.object({ id: z.string().min(1).max(40), qty: z.number().int().min(1).max(50) }))
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

  // Merge duplicate lines, then load real prices from the database. Never trust client prices.
  const qtyById = new Map<string, number>();
  for (const i of data.items) qtyById.set(i.id, Math.min((qtyById.get(i.id) ?? 0) + i.qty, 50));

  const dishes = await db.menuItem.findMany({ where: { id: { in: [...qtyById.keys()] } } });
  if (dishes.length !== qtyById.size) {
    return { ok: false, error: "Some items in your cart are no longer on the menu. Please refresh your cart." };
  }
  const unavailable = dishes.filter((d) => !d.isAvailable);
  if (unavailable.length) {
    return { ok: false, error: `Sold out right now: ${unavailable.map((d) => d.name).join(", ")}. Please remove them.` };
  }

  const lines = dishes.map((d) => ({ menuItemId: d.id, name: d.name, price: d.price, qty: qtyById.get(d.id)! }));
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

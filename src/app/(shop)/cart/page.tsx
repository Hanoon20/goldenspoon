import type { Metadata } from "next";
import { CartView } from "./CartView";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Your cart" };

export default async function CartPage() {
  const s = await getSettings();
  return <CartView deliveryFee={s.deliveryFee} minOrder={s.minOrder} isOpen={s.openNow} />;
}

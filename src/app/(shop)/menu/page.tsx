import type { Metadata } from "next";
import { MenuBrowser } from "@/components/shop/MenuBrowser";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Menu" };

export default async function MenuPage() {
  const [categories, dishes] = await Promise.all([
    db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
    db.menuItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true, name: true, description: true, price: true, image: true,
        isVeg: true, isAvailable: true, isFeatured: true, categoryId: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="py-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Our menu</p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Made fresh, every day</h1>
        <p className="mt-3 text-ink-700/80">Add dishes to your cart and send the order to us on WhatsApp.</p>
      </div>
      <MenuBrowser categories={categories} dishes={dishes} />
    </div>
  );
}

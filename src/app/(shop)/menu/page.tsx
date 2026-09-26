import type { Metadata } from "next";
import { MenuBrowser } from "@/components/shop/MenuBrowser";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Menu" };

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const [categories, dishes] = await Promise.all([
    db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, slug: true } }),
    db.menuItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true, name: true, description: true, price: true, fullPrice: true, baseLabel: true, image: true,
        isVeg: true, isAvailable: true, isFeatured: true, categoryId: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      <div className="relative py-10 md:py-14">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-10 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
        <h1 className="relative font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Our menu</h1>
        <p className="relative mt-3 max-w-[55ch] text-white/65">
          {dishes.length} dishes, cooked fresh every day. Add what you like and send your order on WhatsApp.
        </p>
      </div>
      <MenuBrowser categories={categories} dishes={dishes} initialCategory={categories.find((c) => c.slug === category)?.id} />
    </div>
  );
}

import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { DishImage } from "@/components/shop/DishImage";
import { VegBadge } from "@/components/shop/VegBadge";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { cn, formatPrice } from "@/lib/utils";
import { deleteMenuItem, toggleAvailability } from "../actions";

export default async function AdminMenu() {
  await requireAdmin();
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { items: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }] } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Menu</h1>
        <Link href="/admin/menu/new" className="btn-primary"><Plus className="h-4 w-4" /> Add dish</Link>
      </div>

      {categories.length === 0 && (
        <p className="card p-6 text-sm">Create a <Link href="/admin/categories" className="font-semibold text-gold-700">category</Link> first, then add dishes.</p>
      )}

      {categories.map((c) => (
        <section key={c.id} className="card overflow-hidden">
          <h2 className="border-b border-ink-100 bg-ink-50 px-5 py-3 font-semibold">
            {c.name} <span className="text-sm font-normal text-ink-700/60">({c.items.length})</span>
          </h2>
          <ul className="divide-y divide-ink-100">
            {c.items.map((d) => (
              <li key={d.id} className={cn("flex items-center gap-4 px-5 py-3", !d.isAvailable && "opacity-60")}>
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg"><DishImage src={d.image} alt={d.name} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <VegBadge isVeg={d.isVeg} />
                    <p className="truncate font-medium">{d.name}</p>
                    {d.isFeatured && <span className="rounded bg-gold-100 px-1.5 text-xs font-semibold text-gold-800">★</span>}
                  </div>
                  <p className="text-sm text-ink-700/70">
                    {d.fullPrice == null
                      ? formatPrice(d.price)
                      : `${d.baseLabel} ${formatPrice(d.price)} · Full ${formatPrice(d.fullPrice)}`}
                  </p>
                </div>
                <form action={toggleAvailability}>
                  <input type="hidden" name="id" value={d.id} />
                  <button
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      d.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                    )}
                    title="Click to toggle"
                  >
                    {d.isAvailable ? "Available" : "Sold out"}
                  </button>
                </form>
                <Link href={`/admin/menu/${d.id}`} className="rounded-lg p-2 hover:bg-ink-100" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                <form action={deleteMenuItem}>
                  <input type="hidden" name="id" value={d.id} />
                  <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </form>
              </li>
            ))}
            {c.items.length === 0 && <li className="px-5 py-4 text-sm text-ink-700/60">No dishes yet.</li>}
          </ul>
        </section>
      ))}
    </div>
  );
}

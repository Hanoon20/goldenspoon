"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { DishCard, type Dish } from "./DishCard";
import { VegBadge } from "./VegBadge";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

type Props = { categories: Category[]; dishes: Dish[]; initialCategory?: string };

export function MenuBrowser({ categories, dishes, initialCategory }: Props) {
  const [active, setActive] = useState<string>(initialCategory ?? "all");
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dishes.filter(
      (d) =>
        (active === "all" || d.categoryId === active) &&
        (!vegOnly || d.isVeg) &&
        (!q || d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)),
    );
  }, [dishes, active, query, vegOnly]);

  // Group by category (keeping admin sort order) when showing everything.
  const sections = categories
    .filter((c) => active === "all" || c.id === active)
    .map((c) => ({ ...c, dishes: filtered.filter((d) => d.categoryId === c.id) }))
    .filter((s) => s.dishes.length > 0);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-white/10 bg-ink-900/90 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              aria-label="Search dishes"
              className="field pl-9"
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-white/80">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} className="h-4 w-4 accent-green-600" />
            <VegBadge isVeg /> Veg only
          </label>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {[{ id: "all", name: "All" }, ...categories].map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                active === c.id ? "border-gold-400 bg-gold-400 text-ink-900" : "border-white/15 text-white/80 hover:border-gold-300/60 hover:text-white",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="py-20 text-center">
          <SearchX className="mx-auto h-10 w-10 text-white/30" aria-hidden />
          <p className="mt-3 text-white/70">No dishes match your search.</p>
          <button
            onClick={() => {
              setQuery("");
              setVegOnly(false);
              setActive("all");
            }}
            className="btn-ghost mt-5"
          >
            Clear filters
          </button>
        </div>
      ) : (
        sections.map((s) => (
          <section key={s.id} className="mt-12 scroll-mt-40">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{s.name}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {s.dishes.map((d) => (
                <DishCard key={d.id} dish={d} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

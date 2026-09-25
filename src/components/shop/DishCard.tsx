import { AddToCartButton } from "./AddToCartButton";
import { DishImage } from "./DishImage";
import { VegBadge } from "./VegBadge";
import { formatPrice } from "@/lib/utils";

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  fullPrice: number | null;
  baseLabel: string;
  image: string;
  isVeg: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
};

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <DishImage src={dish.image} alt={dish.name} className="transition duration-500 group-hover:scale-105" />
        {dish.isFeatured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-gold-700 shadow">
            ★ Bestseller
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start gap-2">
          <VegBadge isVeg={dish.isVeg} className="mt-1" />
          <h3 className="font-semibold leading-snug">{dish.name}</h3>
        </div>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-ink-700/80">{dish.description}</p>
        {dish.fullPrice ? (
          <div className="mt-4 space-y-2">
            {(
              [
                ["base", dish.baseLabel, dish.price],
                ["full", "Full", dish.fullPrice],
              ] as const
            ).map(([portion, label, price]) => (
              <div key={portion} className="flex items-center justify-between rounded-lg bg-ink-100/60 py-1.5 pl-3 pr-1.5">
                <span className="text-sm">
                  <span className="text-ink-700/80">{label}</span>{" "}
                  <span className="font-bold">{formatPrice(price)}</span>
                </span>
                <AddToCartButton
                  compact
                  disabled={!dish.isAvailable}
                  item={{ id: dish.id, portion, portionLabel: label, name: dish.name, price, image: dish.image, isVeg: dish.isVeg }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-bold">{formatPrice(dish.price)}</span>
            <AddToCartButton
              disabled={!dish.isAvailable}
              item={{ id: dish.id, portion: "base", portionLabel: "", name: dish.name, price: dish.price, image: dish.image, isVeg: dish.isVeg }}
            />
          </div>
        )}
      </div>
    </article>
  );
}

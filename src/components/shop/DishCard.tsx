import { Star } from "lucide-react";
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
    <article className="surface group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold-300/40 hover:shadow-[0_24px_50px_-20px_rgba(201,154,52,0.35)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <DishImage src={dish.image} alt={dish.name} className="transition duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {dish.isFeatured && (
          <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gold-300">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden /> Bestseller
          </p>
        )}
        <div className="flex items-start gap-2">
          <VegBadge isVeg={dish.isVeg} className="mt-1" />
          <h3 className="font-semibold leading-snug">{dish.name}</h3>
        </div>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm text-white/60">{dish.description}</p>
        {dish.fullPrice ? (
          <div className="mt-4 space-y-2">
            {(
              [
                ["base", dish.baseLabel, dish.price],
                ["full", "Full", dish.fullPrice],
              ] as const
            ).map(([portion, label, price]) => (
              <div key={portion} className="flex items-center justify-between rounded-lg bg-white/[0.05] py-1.5 pl-3 pr-1.5">
                <span className="text-sm">
                  <span className="text-white/60">{label}</span>{" "}
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
            <span className="text-lg font-bold text-white">{formatPrice(dish.price)}</span>
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

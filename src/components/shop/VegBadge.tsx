import { cn } from "@/lib/utils";

/** Green / red veg and non-veg square mark. */
export function VegBadge({ isVeg, className }: { isVeg: boolean; className?: string }) {
  return (
    <span
      title={isVeg ? "Vegetarian" : "Non-vegetarian"}
      className={cn(
        "inline-grid h-4 w-4 shrink-0 place-items-center rounded-sm border-2 bg-white",
        isVeg ? "border-green-600" : "border-red-700",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", isVeg ? "bg-green-600" : "bg-red-700")} />
    </span>
  );
}

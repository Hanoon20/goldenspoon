import { cn } from "@/lib/utils";

/** Shows the dish photo, or a warm placeholder when the admin hasn't added one yet. */
export function DishImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (/^https?:\/\//.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element -- admin can paste any image URL
    return <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-gold-100 via-gold-200 to-gold-300",
        className,
      )}
    >
      <span className="font-display text-5xl font-bold text-gold-700/60">{alt.charAt(0)}</span>
    </div>
  );
}

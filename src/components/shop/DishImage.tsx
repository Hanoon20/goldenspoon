import { cn } from "@/lib/utils";

/** Shows the dish photo, or a warm placeholder when the admin hasn't added one yet. */
export function DishImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (/^(https?:\/\/|\/)/.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element -- admin can paste any image URL, or a photo in /public
    return <img src={src} alt={alt} loading="lazy" className={cn("h-full w-full object-cover", className)} />;
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 to-ink-900",
        className,
      )}
      role="img"
      aria-label={alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-mark.png" alt="" className="h-1/2 max-h-28 w-auto opacity-70" />
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import { cartCount, useCart } from "@/store/cart";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar({ restaurantName }: { restaurantName: string }) {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/95 text-ink-100 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="h-8 w-auto min-[400px]:h-9" />
          <span className="whitespace-nowrap font-display text-base font-bold uppercase tracking-wider text-gold-300 min-[400px]:text-lg">{restaurantName}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm font-medium transition hover:text-gold-300",
                pathname === l.href ? "text-gold-300" : "text-ink-100",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-white/10" aria-label="Cart">
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-xs font-bold text-ink-900">
                {count}
              </span>
            )}
          </Link>
          <button className="rounded-full p-2 hover:bg-white/10 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-900 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-2 font-medium hover:bg-white/10" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

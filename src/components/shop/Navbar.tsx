"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarDays, Clock, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/store/cart";
import { cn, waDigits } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

type Props = {
  restaurantName: string;
  whatsappNumber: string;
  phone: string;
  openingHours: string;
  isOpen: boolean;
};

const EASE = [0.16, 1, 0.3, 1] as const;
// The menu grows out of the hamburger button (top-right corner of the header).
const ORIGIN = "calc(100% - 2.25rem) 2rem";

export function Navbar({ restaurantName, whatsappNumber, phone, openingHours, isOpen }: Props) {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const reduce = useReducedMotionSafe();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  // While the menu is open: lock page scroll, close on Escape, and close if the screen grows to desktop.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  const count = mounted ? cartCount(items) : 0;
  const isActive = (href: string) => (href.includes("#") ? false : pathname === href);

  return (
    <>
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
                className={cn("text-sm font-medium transition hover:text-gold-300", isActive(l.href) ? "text-gold-300" : "text-ink-100")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/book"
              className={cn(
                "hidden rounded-lg border px-3.5 py-1.5 text-sm font-semibold transition md:inline-flex",
                pathname === "/book" ? "border-gold-400 bg-gold-400 text-ink-900" : "border-gold-300/50 text-gold-200 hover:bg-gold-400 hover:text-ink-900",
              )}
            >
              Book a table
            </Link>
            <Link href="/cart" className="relative rounded-full p-2 hover:bg-white/10" aria-label="Cart">
              <ShoppingBag className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-xs font-bold text-ink-900">
                  {count}
                </span>
              )}
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full border transition md:hidden",
                open ? "border-gold-400/60 bg-gold-400/10" : "border-white/15 hover:bg-white/10",
              )}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className="relative block h-3.5 w-5" aria-hidden>
                <motion.span
                  className="absolute left-0 top-0 h-0.5 w-5 origin-center rounded-full bg-current"
                  animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                />
                <motion.span
                  className="absolute right-0 top-1.5 h-0.5 w-3.5 origin-right rounded-full bg-gold-300"
                  animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: reduce ? 0 : 0.2 }}
                />
                <motion.span
                  className="absolute left-0 top-3 h-0.5 w-5 origin-center rounded-full bg-current"
                  animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            role="dialog"
            aria-label="Menu"
            className="fixed inset-x-0 bottom-0 top-16 z-[35] overflow-y-auto bg-ink-900 md:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }}
            animate={reduce ? { opacity: 1 } : { clipPath: `circle(150% at ${ORIGIN})` }}
            exit={reduce ? { opacity: 0 } : { clipPath: `circle(0% at ${ORIGIN})` }}
            transition={{ duration: reduce ? 0.15 : 0.6, ease: EASE }}
          >
            {/* Warm glow and a faint logo watermark give the panel depth. Clipped so they never add scroll. */}
            <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 top-16 overflow-hidden">
              <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-mark.png" alt="" className="absolute -bottom-10 -right-16 w-72 opacity-[0.06]" />
            </div>

            <div className="relative flex min-h-full flex-col px-6 pb-8 pt-8">
              <ul className="space-y-1">
                {links.map((l, i) => {
                  const active = isActive(l.href);
                  return (
                    <motion.li
                      key={l.href}
                      initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.55, delay: reduce ? 0 : 0.15 + i * 0.06, ease: EASE }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-center justify-between border-b border-white/[0.07] py-4 font-display text-[2.5rem] font-bold leading-none tracking-tight transition-colors",
                          active ? "text-gold-300" : "text-white active:text-gold-300",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {active && <span aria-hidden className="h-8 w-1 rounded-full bg-gold-400" />}
                          {l.label}
                        </span>
                        <ArrowUpRight
                          aria-hidden
                          className={cn(
                            "h-7 w-7 transition-transform duration-300 group-active:-translate-y-1 group-active:translate-x-1",
                            active ? "text-gold-300" : "text-white/30",
                          )}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                className="mt-auto pt-10"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: reduce ? 0 : 0.45, ease: EASE }}
              >
                <div className="flex gap-3">
                  <Link
                    href="/book"
                    onClick={() => setOpen(false)}
                    className="btn flex-1 whitespace-nowrap bg-gold-400 py-3.5 text-base text-ink-900 hover:bg-gold-300 active:scale-[0.98]"
                  >
                    <CalendarDays className="h-5 w-5 max-[359px]:hidden" aria-hidden /> Book a table
                  </Link>
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      aria-label={`Call ${phone}`}
                      className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-lg border border-white/15 text-white transition active:scale-95 hover:border-gold-300/60"
                    >
                      <Phone className="h-5 w-5" aria-hidden />
                    </a>
                  )}
                  <a
                    href={`https://wa.me/${waDigits(whatsappNumber)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-lg bg-[#25D366] text-ink-900 transition active:scale-95 hover:bg-[#3ee07c]"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden />
                  </a>
                </div>

                <p className="mt-6 flex items-start gap-2.5 text-sm text-white/60">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" aria-hidden />
                  <span>
                    <span className={cn("font-semibold", isOpen ? "text-green-400" : "text-red-400")}>{isOpen ? "Open now" : "Closed now"}</span>
                    <span className="mx-1.5 text-white/30">|</span>
                    {openingHours}
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

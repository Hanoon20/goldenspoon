import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bike, Clock, MapPin, MessageCircle, Phone, Sparkle, UtensilsCrossed } from "lucide-react";
import { DishCard } from "@/components/shop/DishCard";
import { HeroStage } from "@/components/motion/HeroStage";
import { Reveal } from "@/components/motion/Reveal";
import { SignatureScroll } from "@/components/motion/SignatureScroll";
import { TiltCard } from "@/components/motion/TiltCard";
import { ZoomStory } from "@/components/motion/ZoomStory";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { cn, formatPrice, normalizePhone, waDigits } from "@/lib/utils";

export default async function HomePage() {
  const [settings, featured, categories, dishCount] = await Promise.all([
    getSettings(),
    db.menuItem.findMany({
      where: { isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 8,
    }),
    db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { items: true } }, items: { select: { price: true }, orderBy: { price: "asc" }, take: 1 } },
    }),
    db.menuItem.count(),
  ]);
  const wa = `https://wa.me/${waDigits(settings.whatsappNumber)}`;
  const withDishes = categories.filter((c) => c._count.items > 0);
  const bento = withDishes.slice(0, 4);

  return (
    <>
      <HeroStage>
        <p className="inline-flex items-center gap-2 rounded-full border border-gold-300/30 bg-white/[0.03] px-3 py-1 text-xs font-medium text-gold-200">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {settings.openingHours}
        </p>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
          <span className="sr-only">{settings.restaurantName}: </span>
          Kottu, biriyani and grills, <span className="text-gold-300">cooked to order.</span>
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-white/65 md:text-lg">
          From sizzling cheese kottu to slow-cooked mutton biriyani. Browse {dishCount} dishes and order on WhatsApp in a few taps.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/menu" className="btn-primary group px-6 py-3 text-base">
            View menu
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <a href={wa} target="_blank" rel="noreferrer" className="btn-ghost px-6 py-3 text-base">
            <MessageCircle className="h-5 w-5" aria-hidden /> Order on WhatsApp
          </a>
        </div>
      </HeroStage>

      {/* Category ribbon: the one marquee on the page, a quick sense of the menu's breadth. */}
      {withDishes.length > 0 && (
        <div className="overflow-hidden border-y border-white/10 bg-black/30 py-5" aria-hidden>
          <div className="flex w-max animate-marquee items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center">
                {withDishes.map((c) => (
                  <span key={c.id} className="flex items-center">
                    <span className="px-6 font-display text-2xl font-semibold uppercase tracking-wide text-white/80 md:text-4xl">{c.name}</span>
                    <Sparkle className="h-4 w-4 fill-gold-400 text-gold-400" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {featured.length > 0 && (
        <SignatureScroll
          heading={
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">Chef&apos;s picks</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">Our bestsellers</h2>
              </div>
              <Link href="/menu" className="group inline-flex items-center gap-1 text-sm font-semibold text-gold-300 hover:text-gold-200">
                View menu <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
          }
          items={featured.map((d) => (
            <DishCard key={d.id} dish={d} />
          ))}
        />
      )}

      {/* How ordering works: heading pinned on the left while the steps scroll past. */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-28">
        <div className="md:sticky md:top-28 md:self-start">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">Order in three taps</h2>
          <p className="mt-4 max-w-[40ch] text-white/65">No app, no sign-up. Your order goes straight to our kitchen on WhatsApp.</p>
        </div>
        <ol className="relative ml-5 space-y-12 border-l border-gold-400/25 pl-8 md:space-y-20">
          {[
            { icon: UtensilsCrossed, title: "Pick your dishes", text: "Browse the menu, choose Normal or Full portions and add them to your cart." },
            { icon: MessageCircle, title: "Send it on WhatsApp", text: "One tap opens WhatsApp with your order written out. Just press send." },
            { icon: Bike, title: "Delivery or pickup", text: "We confirm on WhatsApp, cook it fresh and deliver it or keep it ready for you." },
          ].map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 0.05}>
                <span className="absolute -left-[3.05rem] grid h-9 w-9 place-items-center rounded-full border border-gold-400/50 bg-ink-900 text-gold-300">
                  <s.icon className="h-4 w-4" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{s.title}</h3>
                <p className="mt-2 max-w-[48ch] text-white/60">{s.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories: one large tile and three small ones, plus a tile for the full menu. */}
      {bento.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-20 md:pb-28">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">Explore the menu</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 md:auto-rows-[190px] md:grid-cols-4">
            {bento.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.06} className={cn(i === 0 && "col-span-2 md:row-span-2")}>
                <TiltCard className="rounded-2xl">
                  <Link
                    href={`/menu?category=${c.slug}`}
                    className={cn(
                      "relative flex h-full min-h-[150px] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 p-5 transition hover:border-gold-300/50",
                      i === 0
                        ? "min-h-[260px] bg-[radial-gradient(circle_at_75%_25%,rgba(224,180,74,0.35),transparent_55%),linear-gradient(160deg,#1c1710,#0b0b0b)] md:p-8"
                        : i === 1
                          ? "bg-[linear-gradient(140deg,#17140f,#0d0d0d)]"
                          : i === 2
                            ? "bg-[radial-gradient(circle_at_20%_10%,rgba(224,180,74,0.18),transparent_60%),#0e0e0e]"
                            : "bg-[linear-gradient(200deg,#1a1611,#0c0c0c_70%)]",
                    )}
                  >
                    {i === 0 && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/logo-mark.png" alt="" className="pointer-events-none absolute -right-6 -top-4 w-56 opacity-25 md:w-80" />
                    )}
                    <span className="relative font-display text-xl font-semibold text-white md:text-2xl">{c.name}</span>
                    <span className="relative mt-1 text-sm text-white/60">
                      {c._count.items} dishes
                      {c.items[0] && <> · from {formatPrice(c.items[0].price)}</>}
                    </span>
                    <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-gold-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <Link
                href="/menu"
                className="group flex h-full min-h-[150px] flex-col justify-between rounded-2xl bg-gold-400 p-5 text-ink-900 transition hover:bg-gold-300 active:scale-[0.99]"
              >
                <span className="font-display text-xl font-semibold">View menu</span>
                <span className="flex items-end justify-between">
                  <span className="text-sm font-medium">All {withDishes.length} categories</span>
                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <div id="about" className="scroll-mt-16">
        <ZoomStory>
          <div className="mx-auto max-w-3xl px-4 text-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">Our story</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                Cooked with tradition, served with love
              </h2>
              <p className="mx-auto mt-5 max-w-[60ch] text-white/65 md:text-lg">
                At {settings.restaurantName}, every dish starts with fresh ingredients and spices roasted in-house. From kottu on the
                hot plate to biriyani sharing platters, we cook the flavours of home, whether you dine with us or order in.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mx-auto mt-12 grid max-w-xl grid-cols-2 gap-8">
                <div>
                  <dt className="text-sm text-white/55">Dishes on the menu</dt>
                  <dd className="mt-1 font-display text-4xl font-bold text-gold-300 md:text-5xl">{dishCount}</dd>
                </div>
                <div>
                  <dt className="text-sm text-white/55">Categories</dt>
                  <dd className="mt-1 font-display text-4xl font-bold text-gold-300 md:text-5xl">{withDishes.length}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </ZoomStory>
      </div>

      {/* Visit and order */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-8">
        <div className="grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6 p-6 md:p-10">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">Visit or order</h2>
            <ul className="space-y-5">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" aria-hidden />
                <div>
                  <p className="font-medium text-white">Address</p>
                  <p className="mt-0.5 whitespace-pre-line text-white/60">{settings.address || "Address coming soon"}</p>
                  {settings.mapUrl && (
                    <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gold-300 hover:text-gold-200">
                      Open in Maps <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </a>
                  )}
                </div>
              </li>
              <li className="flex gap-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" aria-hidden />
                <div>
                  <p className="font-medium text-white">Opening hours</p>
                  <p className="mt-0.5 text-white/60">{settings.openingHours}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" aria-hidden />
                <div>
                  <p className="font-medium text-white">Call us</p>
                  <a href={`tel:+${normalizePhone(settings.phone || settings.whatsappNumber)}`} className="mt-0.5 block text-white/60 hover:text-white">
                    {settings.phone || `+${waDigits(settings.whatsappNumber)}`}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative flex flex-col justify-end overflow-hidden bg-[radial-gradient(circle_at_80%_10%,rgba(224,180,74,0.3),transparent_60%),linear-gradient(160deg,#1b160e,#0b0b0b)] p-6 md:p-10">
            <p className="font-display text-2xl font-semibold text-white md:text-3xl">Order in or book a table</p>
            <p className="mt-2 text-white/65">Send your order or booking and we will confirm it on WhatsApp.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noreferrer" className="btn bg-[#25D366] px-5 py-3 text-ink-900 hover:bg-[#3ee07c] active:scale-[0.98]">
                <MessageCircle className="h-5 w-5" aria-hidden /> Order on WhatsApp
              </a>
              <Link href="/book" className="btn-ghost px-5 py-3">
                Book a table
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

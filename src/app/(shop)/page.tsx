import Link from "next/link";
import { ChefHat, Clock, MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import { DishCard } from "@/components/shop/DishCard";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { waDigits } from "@/lib/utils";

export default async function HomePage() {
  const [settings, featured, categories] = await Promise.all([
    getSettings(),
    db.menuItem.findMany({
      where: { isFeatured: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      take: 6,
    }),
    db.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { _count: { select: { items: true } } },
    }),
  ]);
  const wa = `https://wa.me/${waDigits(settings.whatsappNumber)}`;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,var(--color-gold-600),transparent_55%)] opacity-50" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="inline-block rounded-full border border-gold-300/40 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-200">
              {settings.openingHours}
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-tight md:text-6xl">
              {settings.restaurantName}
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-200">{settings.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/menu" className="btn-primary px-6 py-3 text-base">Order now</Link>
              <a href={wa} target="_blank" rel="noreferrer" className="btn border border-white/30 px-6 py-3 text-base text-white hover:bg-white/10">
                <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <div className="grid h-80 w-80 place-items-center rounded-full bg-gradient-to-br from-gold-300 to-gold-600 text-[9rem] shadow-2xl shadow-gold-900/50">
              🍛
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: ChefHat, title: "Pick your dishes", text: "Browse the menu and add what you love to your cart." },
            { icon: MessageCircle, title: "Send on WhatsApp", text: "Your order is sent to us on WhatsApp in one tap." },
            { icon: Truck, title: "Enjoy your meal", text: "We confirm, cook fresh and deliver or keep it ready for pickup." },
          ].map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold-100 text-gold-700">
                  <s.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-gold-600">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-ink-700/80">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Chef&apos;s picks</p>
              <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Our bestsellers</h2>
            </div>
            <Link href="/menu" className="hidden text-sm font-semibold text-gold-700 hover:text-gold-800 sm:block">
              View full menu →
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl font-bold">Explore the menu</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
              <Link key={c.id} href="/menu" className="card p-5 text-center transition hover:border-gold-300 hover:shadow-md">
                <p className="font-semibold">{c.name}</p>
                <p className="mt-1 text-xs text-ink-700/70">{c._count.items} dishes</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section id="about" className="scroll-mt-20 bg-gold-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Our story</p>
            <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Cooked with tradition, served with love</h2>
            <p className="mt-4 text-ink-700">
              At {settings.restaurantName}, every dish starts with fresh ingredients and spices roasted in-house. From sizzling
              kottu to a comforting plate of rice &amp; curry, we bring you the flavours of home, whether you dine with us or order in.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              ["Fresh", "Cooked to order"],
              ["Hygienic", "Clean kitchen"],
              ["Fast", "Quick delivery"],
            ].map(([t, s]) => (
              <div key={t} className="card p-5">
                <p className="font-display text-xl font-bold text-gold-700">{t}</p>
                <p className="mt-1 text-xs text-ink-700/80">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16">
        <h2 className="font-display text-3xl font-bold">Find us</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <div className="card flex gap-3 p-5">
            <MapPin className="h-5 w-5 shrink-0 text-gold-600" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="mt-1 whitespace-pre-line text-sm text-ink-700/80">{settings.address || "Add your address in Admin → Settings"}</p>
              {settings.mapUrl && (
                <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-gold-700">
                  Open in Maps →
                </a>
              )}
            </div>
          </div>
          <div className="card flex gap-3 p-5">
            <Clock className="h-5 w-5 shrink-0 text-gold-600" />
            <div>
              <p className="font-semibold">Opening hours</p>
              <p className="mt-1 text-sm text-ink-700/80">{settings.openingHours}</p>
            </div>
          </div>
          <div className="card flex gap-3 p-5">
            <Phone className="h-5 w-5 shrink-0 text-gold-600" />
            <div>
              <p className="font-semibold">Contact</p>
              <a href={wa} target="_blank" rel="noreferrer" className="mt-1 block text-sm text-ink-700/80 hover:text-gold-700">
                WhatsApp +{waDigits(settings.whatsappNumber)}
              </a>
              {settings.phone && (
                <a href={`tel:${settings.phone}`} className="block text-sm text-ink-700/80 hover:text-gold-700">{settings.phone}</a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import type { Setting } from "@prisma/client";
import { waDigits } from "@/lib/utils";

export function Footer({ settings }: { settings: Setting }) {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt={settings.restaurantName} className="h-24 w-auto" />
          <p className="mt-3 text-sm">{settings.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Visit us</p>
          {settings.address && <p className="whitespace-pre-line">{settings.address}</p>}
          <p className="mt-2">{settings.openingHours}</p>
        </div>
        <div className="text-sm">
          <p className="mb-2 font-semibold text-white">Order & enquiries</p>
          <a className="block hover:text-gold-300" href={`https://wa.me/${waDigits(settings.whatsappNumber)}`} target="_blank" rel="noreferrer">
            WhatsApp: +{waDigits(settings.whatsappNumber)}
          </a>
          {settings.phone && <a className="block hover:text-gold-300" href={`tel:${settings.phone}`}>Call: {settings.phone}</a>}
          {settings.email && <a className="block hover:text-gold-300" href={`mailto:${settings.email}`}>{settings.email}</a>}
          <Link href="/menu" className="mt-3 block text-gold-300 hover:text-gold-200">View menu</Link>
          <Link href="/book" className="mt-1 block text-gold-300 hover:text-gold-200">Book a table</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-ink-200/70">
        © {new Date().getFullYear()} {settings.restaurantName}. All rights reserved.
      </div>
    </footer>
  );
}

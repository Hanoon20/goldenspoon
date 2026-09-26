import type { Metadata } from "next";
import { CalendarCheck, Clock, Users } from "lucide-react";
import { addDays, BOOKING_WINDOW_DAYS, MAX_GUESTS, timeSlots, todayInColombo } from "@/lib/booking";
import { getSettings } from "@/lib/settings";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = { title: "Book a table" };

export default async function BookPage() {
  const settings = await getSettings();
  const today = todayInColombo();

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:py-14 lg:grid-cols-[1fr_1.5fr] lg:gap-14">
      <div className="relative lg:sticky lg:top-24 lg:self-start">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-10 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl" />
        <h1 className="relative font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Book a table</h1>
        <p className="relative mt-4 max-w-[42ch] text-white/65">
          Planning a meal, a meeting or a celebration? Tell us when and how many, and we will get your table ready.
        </p>
        <ul className="relative mt-8 space-y-4 text-sm">
          <li className="flex gap-3">
            <Clock className="h-5 w-5 shrink-0 text-gold-300" aria-hidden />
            <span className="text-white/70">{settings.openingHours}</span>
          </li>
          <li className="flex gap-3">
            <Users className="h-5 w-5 shrink-0 text-gold-300" aria-hidden />
            <span className="text-white/70">Groups of up to {MAX_GUESTS}. For bigger events, call us.</span>
          </li>
          <li className="flex gap-3">
            <CalendarCheck className="h-5 w-5 shrink-0 text-gold-300" aria-hidden />
            <span className="text-white/70">Book up to {BOOKING_WINDOW_DAYS} days ahead. We confirm on WhatsApp.</span>
          </li>
        </ul>
      </div>
      <BookingForm
        slots={timeSlots(settings.bookingStart, settings.bookingEnd)}
        minDate={today}
        maxDate={addDays(today, BOOKING_WINDOW_DAYS)}
        accepting={settings.acceptBookings}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { CheckCircle2, MessageCircle, Minus, Plus } from "lucide-react";
import type { EventType, SeatingType } from "@prisma/client";
import { EVENT_OPTIONS, formatTime, MAX_GUESTS, SEATING_OPTIONS } from "@/lib/booking";
import { cn } from "@/lib/utils";
import { createBooking } from "./actions";

type Props = { slots: string[]; minDate: string; maxDate: string; accepting: boolean };

export function BookingForm({ slots, minDate, maxDate, accepting }: Props) {
  const [form, setForm] = useState({ customerName: "", phone: "", date: minDate, time: "", note: "" });
  const [guests, setGuests] = useState(2);
  const [seating, setSeating] = useState<SeatingType>("NORMAL");
  const [eventType, setEventType] = useState<EventType>("CASUAL");
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ bookingNo: number; whatsappUrl: string } | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-400" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-bold text-white">Booking #{done.bookingNo} sent</h2>
        <p className="mx-auto mt-2 max-w-[40ch] text-white/65">
          Send the WhatsApp message to confirm your table. We will reply there once it is confirmed.
        </p>
        <a href={done.whatsappUrl} target="_blank" rel="noreferrer" className="btn mt-6 bg-[#25D366] px-6 py-3 text-base text-ink-900 hover:bg-[#3ee07c]">
          <MessageCircle className="h-5 w-5" aria-hidden /> Open WhatsApp
        </a>
        <div className="mt-4">
          <Link href="/menu" className="text-sm font-semibold text-gold-300 hover:text-gold-200">
            View menu
          </Link>
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.time) {
      setError("Please choose a time.");
      return;
    }
    startTransition(async () => {
      const res = await createBooking({ ...form, guests, seating, eventType });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone({ bookingNo: res.bookingNo, whatsappUrl: res.whatsappUrl });
      window.location.href = res.whatsappUrl;
    });
  }

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-sm font-medium transition",
      active ? "border-gold-400 bg-gold-400 text-ink-900" : "border-white/15 text-white/80 hover:border-gold-300/60 hover:text-white",
    );

  return (
    <form onSubmit={submit} className="surface space-y-6 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="b-name">Name</label>
          <input id="b-name" required autoComplete="name" className="field" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-phone">Phone (WhatsApp)</label>
          <input id="b-phone" required type="tel" inputMode="tel" autoComplete="tel" placeholder="077 123 4567" className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-date">Date</label>
          <input id="b-date" required type="date" min={minDate} max={maxDate} className="field [color-scheme:dark]" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-time">Time</label>
          <select id="b-time" required className="field [color-scheme:dark]" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}>
            <option value="" disabled>Choose a time</option>
            {slots.map((s) => (
              <option key={s} value={s}>{formatTime(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="field-label" id="b-guests-label">Number of guests</p>
        <div className="flex items-center gap-4" role="group" aria-labelledby="b-guests-label">
          <div className="flex items-center rounded-lg border border-white/15">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="p-3 text-white hover:bg-white/5" aria-label="One guest fewer">
              <Minus className="h-4 w-4" />
            </button>
            <input
              aria-label="Guests"
              type="number"
              min={1}
              max={MAX_GUESTS}
              value={guests}
              onChange={(e) => setGuests(Math.min(MAX_GUESTS, Math.max(1, Number(e.target.value) || 1)))}
              className="w-14 bg-transparent text-center text-lg font-bold text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button type="button" onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))} className="p-3 text-white hover:bg-white/5" aria-label="One more guest">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-white/55">{guests === 1 ? "1 person" : `${guests} people`}</span>
        </div>
      </div>

      <fieldset>
        <legend className="field-label">Seating</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {SEATING_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={cn(
                "cursor-pointer rounded-xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400/50",
                seating === o.value ? "border-gold-400 bg-gold-400/10" : "border-white/15 hover:border-gold-300/50",
              )}
            >
              <input type="radio" name="seating" value={o.value} checked={seating === o.value} onChange={() => setSeating(o.value)} className="sr-only" />
              <span className={cn("block font-semibold", seating === o.value ? "text-gold-200" : "text-white")}>{o.label}</span>
              <span className="mt-1 block text-sm text-white/55">{o.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="field-label">Occasion</legend>
        <div className="flex flex-wrap gap-2">
          {EVENT_OPTIONS.map((o) => (
            <label key={o.value} className={cn(chip(eventType === o.value), "cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-400/50")}>
              <input type="radio" name="eventType" value={o.value} checked={eventType === o.value} onChange={() => setEventType(o.value)} className="sr-only" />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="field-label" htmlFor="b-note">Note (optional)</label>
        <textarea
          id="b-note"
          rows={3}
          maxLength={300}
          placeholder="Birthday cake, high chair, decorations..."
          className="field"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </div>

      {!accepting && (
        <p className="rounded-lg bg-amber-400/10 p-3 text-sm text-amber-200">Online booking is paused right now. Please call or WhatsApp us to book.</p>
      )}
      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <button disabled={pending || !accepting} className="btn w-full bg-[#25D366] py-3 text-base text-ink-900 hover:bg-[#3ee07c] active:scale-[0.98]">
        <MessageCircle className="h-5 w-5" aria-hidden />
        {pending ? "Sending booking..." : "Book on WhatsApp"}
      </button>
      <p className="text-center text-xs text-white/50">Your table is confirmed once we reply on WhatsApp.</p>
    </form>
  );
}

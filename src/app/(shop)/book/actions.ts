"use server";

import { z } from "zod";
import { EventType, SeatingType } from "@prisma/client";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import {
  addDays,
  BOOKING_WINDOW_DAYS,
  EVENT_LABEL,
  formatDate,
  formatTime,
  MAX_GUESTS,
  nowTimeInColombo,
  SEATING_LABEL,
  timeSlots,
  todayInColombo,
} from "@/lib/booking";
import { normalizePhone, waDigits } from "@/lib/utils";

const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .trim()
    .refine((p) => /^\d{11,15}$/.test(normalizePhone(p)), "Enter a valid phone number, e.g. 077 123 4567"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  guests: z.number().int().min(1, "At least 1 guest").max(MAX_GUESTS, `For more than ${MAX_GUESTS} guests, please call us`),
  seating: z.enum(SeatingType),
  eventType: z.enum(EventType),
  note: z.string().trim().max(300).default(""),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingResult = { ok: true; bookingNo: number; whatsappUrl: string } | { ok: false; error: string };

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form" };
  const data = parsed.data;

  const settings = await getSettings();
  if (!settings.acceptBookings) {
    return { ok: false, error: "Online table booking is paused right now. Please call or WhatsApp us to book." };
  }

  // Dates are plain "YYYY-MM-DD" strings, so string comparison is date comparison.
  const today = todayInColombo();
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);
  if (data.date < today) return { ok: false, error: "Please choose today or a later date." };
  if (data.date > lastDay) return { ok: false, error: `You can book up to ${BOOKING_WINDOW_DAYS} days ahead.` };
  if (!timeSlots(settings.bookingStart, settings.bookingEnd).includes(data.time)) {
    return { ok: false, error: "Please choose one of the available times." };
  }
  if (data.date === today && data.time <= nowTimeInColombo()) {
    return { ok: false, error: "That time has already passed today. Please choose a later time." };
  }

  const booking = await db.reservation.create({
    data: { ...data, phone: normalizePhone(data.phone) },
  });

  const message = [
    `*Table Booking #${booking.bookingNo}* | ${settings.restaurantName}`,
    "",
    `*Name:* ${booking.customerName}`,
    `*Phone:* ${data.phone}`,
    `*Date:* ${formatDate(booking.date)}`,
    `*Time:* ${formatTime(booking.time)}`,
    `*Guests:* ${booking.guests}`,
    `*Seating:* ${SEATING_LABEL[booking.seating]}`,
    `*Occasion:* ${EVENT_LABEL[booking.eventType]}`,
    ...(booking.note ? ["", `*Note:* ${booking.note}`] : []),
  ].join("\n");

  return {
    ok: true,
    bookingNo: booking.bookingNo,
    whatsappUrl: `https://wa.me/${waDigits(settings.whatsappNumber)}?text=${encodeURIComponent(message)}`,
  };
}

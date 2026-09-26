import type { EventType, ReservationStatus, SeatingType } from "@prisma/client";

export const SEATING_OPTIONS: { value: SeatingType; label: string; hint: string }[] = [
  { value: "NORMAL", label: "Normal", hint: "Regular dining tables" },
  { value: "FAMILY_ROOM", label: "Family Room", hint: "A private space for families" },
  { value: "MAJLIS", label: "Majlis", hint: "Traditional floor seating for groups" },
];

export const EVENT_OPTIONS: { value: EventType; label: string }[] = [
  { value: "CASUAL", label: "Casual dining" },
  { value: "MEETING", label: "Meeting" },
  { value: "PARTY", label: "Party" },
  { value: "BIRTHDAY", label: "Birthday" },
  { value: "ANNIVERSARY", label: "Anniversary" },
  { value: "FAMILY_GATHERING", label: "Family gathering" },
  { value: "OTHER", label: "Other" },
];

export const SEATING_LABEL = Object.fromEntries(SEATING_OPTIONS.map((o) => [o.value, o.label])) as Record<SeatingType, string>;
export const EVENT_LABEL = Object.fromEntries(EVENT_OPTIONS.map((o) => [o.value, o.label])) as Record<EventType, string>;

export const RESERVATION_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED", "SEATED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SEATED: "Seated",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};

export const RESERVATION_STATUS_COLOR: Record<ReservationStatus, string> = {
  PENDING: "bg-blue-100 text-blue-800",
  CONFIRMED: "bg-green-100 text-green-800",
  SEATED: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-ink-100 text-ink-700",
  CANCELLED: "bg-red-100 text-red-800",
  NO_SHOW: "bg-purple-100 text-purple-800",
};

export const MAX_GUESTS = 50;
/** How far ahead customers can book. */
export const BOOKING_WINDOW_DAYS = 60;

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidTime(t: string) {
  return TIME_RE.test(t);
}

/** 30-minute slots from `start` to `end` inclusive, as "HH:MM". Falls back to 11:00-21:30 if the settings are invalid. */
export function timeSlots(start: string, end: string) {
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  let a = isValidTime(start) ? toMin(start) : 11 * 60;
  let b = isValidTime(end) ? toMin(end) : 21 * 60 + 30;
  if (b < a) [a, b] = [11 * 60, 21 * 60 + 30];
  const out: string[] = [];
  for (let m = a; m <= b; m += 30) out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  return out;
}

/** "19:30" -> "7:30 PM" */
export function formatTime(t: string) {
  if (!isValidTime(t)) return t;
  const h = Number(t.slice(0, 2));
  const m = t.slice(3, 5);
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

/** Today's date in Sri Lanka as "YYYY-MM-DD". */
export function todayInColombo(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** "YYYY-MM-DD" shifted by `days`. */
export function addDays(date: string, days: number) {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-27" -> "Sun, 27 Sep 2026". Built by hand so it reads the same on every server and browser. */
export function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return `${WEEKDAYS[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Current time in Sri Lanka as "HH:MM", for rejecting same-day slots that have already passed. */
export function nowTimeInColombo(now = new Date()) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Colombo", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
}

import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { ReservationBadge } from "@/components/admin/ReservationBadge";
import { requireAdmin } from "@/lib/auth";
import { EVENT_LABEL, formatDate, formatTime, SEATING_LABEL, todayInColombo } from "@/lib/booking";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

const VIEWS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "today", label: "Today" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
] as const;
type View = (typeof VIEWS)[number]["key"];

export default async function ReservationsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requireAdmin();
  const { view: raw } = await searchParams;
  const view: View = VIEWS.some((v) => v.key === raw) ? (raw as View) : "upcoming";
  const today = todayInColombo();

  const where: Prisma.ReservationWhereInput =
    view === "upcoming" ? { date: { gte: today } } : view === "today" ? { date: today } : view === "past" ? { date: { lt: today } } : {};
  const newestFirst = view === "past" || view === "all";
  const reservations = await db.reservation.findMany({
    where,
    orderBy: newestFirst ? [{ date: "desc" }, { time: "desc" }] : [{ date: "asc" }, { time: "asc" }],
    take: 200,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Table bookings</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {VIEWS.map((v) => (
          <Link
            key={v.key}
            href={`/admin/reservations?view=${v.key}`}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-sm font-medium",
              view === v.key ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white hover:border-ink-700",
            )}
          >
            {v.label}
          </Link>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-700/70">
            <tr>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-center">Guests</th>
              <th className="px-4 py-3">Seating</th>
              <th className="px-4 py-3">Occasion</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {reservations.map((r) => (
              <tr key={r.id} className={cn("hover:bg-ink-50", r.date === today && "bg-gold-50/60")}>
                <td className="px-4 py-3">
                  <Link href={`/admin/reservations/${r.id}`} className="font-mono font-semibold text-gold-700 hover:underline">#{r.bookingNo}</Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{formatDate(r.date)}</p>
                  <p className="text-xs text-ink-700/70">{formatTime(r.time)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{r.customerName}</p>
                  <p className="text-xs text-ink-700/70">+{r.phone}</p>
                </td>
                <td className="px-4 py-3 text-center font-semibold">{r.guests}</td>
                <td className="px-4 py-3">{SEATING_LABEL[r.seating]}</td>
                <td className="px-4 py-3">{EVENT_LABEL[r.eventType]}</td>
                <td className="px-4 py-3"><ReservationBadge status={r.status} /></td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-700/70">No bookings here yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

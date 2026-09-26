import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { ReservationBadge } from "@/components/admin/ReservationBadge";
import { requireAdmin } from "@/lib/auth";
import { EVENT_LABEL, formatDate, formatTime, RESERVATION_STATUSES, RESERVATION_STATUS_LABEL, SEATING_LABEL } from "@/lib/booking";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { formatDateTime } from "@/lib/utils";
import { updateReservationStatus } from "../../actions";

export default async function ReservationDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [r, settings] = await Promise.all([db.reservation.findUnique({ where: { id } }), getSettings()]);
  if (!r) notFound();

  const reply = encodeURIComponent(
    `Hi ${r.customerName}, your table for ${r.guests} (${SEATING_LABEL[r.seating]}) at ${settings.restaurantName} on ${formatDate(r.date)} at ${formatTime(r.time)} is confirmed. Booking #${r.bookingNo}. See you soon!`,
  );

  const rows: [string, string][] = [
    ["Date", formatDate(r.date)],
    ["Time", formatTime(r.time)],
    ["Guests", String(r.guests)],
    ["Seating", SEATING_LABEL[r.seating]],
    ["Occasion", EVENT_LABEL[r.eventType]],
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/reservations" className="inline-flex items-center gap-1 text-sm text-ink-700/70 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> All bookings
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold">Booking #{r.bookingNo}</h1>
        <ReservationBadge status={r.status} />
        <span className="text-sm text-ink-700/70">Received {formatDateTime(r.createdAt)}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-4 p-5 text-sm">
          <div>
            <p className="text-base font-semibold">{r.customerName}</p>
            <p className="text-ink-700/80">+{r.phone}</p>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {rows.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-ink-700/70">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          {r.note && <p className="rounded-lg bg-amber-50 p-2 text-amber-900">Note: {r.note}</p>}
          <div className="flex flex-wrap gap-2 pt-1">
            <a href={`https://wa.me/${r.phone}?text=${reply}`} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-ink-900 hover:bg-[#3ee07c]">
              <MessageCircle className="h-4 w-4" /> Send confirmation
            </a>
            <a href={`tel:+${r.phone}`} className="btn-outline"><Phone className="h-4 w-4" /> Call</a>
          </div>
        </div>

        <form action={updateReservationStatus} className="card h-fit space-y-3 p-5">
          <h2 className="font-semibold">Update status</h2>
          <input type="hidden" name="id" value={r.id} />
          <select name="status" defaultValue={r.status} className="input">
            {RESERVATION_STATUSES.map((s) => (
              <option key={s} value={s}>{RESERVATION_STATUS_LABEL[s]}</option>
            ))}
          </select>
          <button className="btn-dark w-full">Save status</button>
        </form>
      </div>
    </div>
  );
}

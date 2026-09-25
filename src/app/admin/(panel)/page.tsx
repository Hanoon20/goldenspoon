import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatDateTime, formatPrice } from "@/lib/utils";

function startOfTodaySL() {
  // Midnight in Sri Lanka (UTC+5:30), expressed as a UTC Date.
  const now = new Date();
  const ist = new Date(now.getTime() + 330 * 60_000);
  ist.setUTCHours(0, 0, 0, 0);
  return new Date(ist.getTime() - 330 * 60_000);
}

export default async function Dashboard() {
  await requireAdmin();
  const since = startOfTodaySL();

  const [todayOrders, todayRevenue, pending, dishes, recent, topItems] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: since }, status: { not: "CANCELLED" } } }),
    db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: since }, status: { not: "CANCELLED" } } }),
    db.order.count({ where: { status: { in: ["NEW", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY"] } } }),
    db.menuItem.count(),
    db.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.orderItem.groupBy({
      by: ["name"],
      where: { order: { status: { not: "CANCELLED" } } },
      _sum: { qty: true },
      orderBy: { _sum: { qty: "desc" } },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Orders today", value: todayOrders },
    { label: "Revenue today", value: formatPrice(todayRevenue._sum.total ?? 0) },
    { label: "Active orders", value: pending },
    { label: "Dishes on menu", value: dishes },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-sm text-ink-700/70">{s.label}</p>
            <p className="mt-2 text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-gold-700">View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-5 text-sm text-ink-700/70">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/orders/${o.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-ink-50">
                    <span className="w-14 font-mono text-sm font-semibold">#{o.orderNo}</span>
                    <span className="flex-1 truncate text-sm">{o.customerName}</span>
                    <span className="hidden text-xs text-ink-700/70 sm:block">{formatDateTime(o.createdAt)}</span>
                    <span className="w-20 text-right text-sm font-semibold">{formatPrice(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-semibold">Top dishes (all time)</h2>
          {topItems.length === 0 ? (
            <p className="mt-3 text-sm text-ink-700/70">No data yet.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {topItems.map((t, i) => (
                <li key={t.name} className="flex items-center gap-3 text-sm">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-100 text-xs font-bold text-gold-800">{i + 1}</span>
                  <span className="flex-1 truncate">{t.name}</span>
                  <span className="font-semibold">{t._sum.qty} sold</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}

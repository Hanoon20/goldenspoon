import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ORDER_STATUSES, STATUS_LABEL } from "@/lib/order-status";
import { cn, formatDateTime, formatPrice } from "@/lib/utils";

const PAGE_SIZE = 30;

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const status = ORDER_STATUSES.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { items: true } } },
    }),
    db.order.count({ where }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const href = (p: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (p.status) q.set("status", p.status);
    if (p.page && p.page > 1) q.set("page", String(p.page));
    const s = q.toString();
    return `/admin/orders${s ? `?${s}` : ""}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Orders</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[undefined, ...ORDER_STATUSES].map((s) => (
          <Link
            key={s ?? "all"}
            href={href({ status: s })}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-sm font-medium",
              status === s ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white hover:border-ink-700",
            )}
          >
            {s ? STATUS_LABEL[s] : "All"}
          </Link>
        ))}
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-700/70">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-ink-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}`} className="font-mono font-semibold text-gold-700 hover:underline">#{o.orderNo}</Link>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.customerName}</p>
                  <p className="text-xs text-ink-700/70">+{o.phone}</p>
                </td>
                <td className="px-4 py-3">{o.type === "DELIVERY" ? "Delivery" : "Takeaway"}</td>
                <td className="px-4 py-3 text-ink-700/80">{formatDateTime(o.createdAt)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.total)}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-700/70">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-700/70">Page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link className="btn-outline" href={href({ status, page: page - 1 })}>Previous</Link>}
            {page < pages && <Link className="btn-outline" href={href({ status, page: page + 1 })}>Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}

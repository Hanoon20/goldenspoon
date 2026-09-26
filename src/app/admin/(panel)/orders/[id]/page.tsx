import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ORDER_STATUSES, STATUS_LABEL } from "@/lib/order-status";
import { getSettings } from "@/lib/settings";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { updateOrderStatus } from "../../actions";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [order, settings] = await Promise.all([
    db.order.findUnique({ where: { id }, include: { items: true } }),
    getSettings(),
  ]);
  if (!order) notFound();

  const reply = encodeURIComponent(
    `Hi ${order.customerName}, your order #${order.orderNo} from ${settings.restaurantName} is confirmed. Total: ${formatPrice(order.total)}. Thank you!`,
  );

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-ink-700/70 hover:text-ink-900">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-bold">Order #{order.orderNo}</h1>
        <StatusBadge status={order.status} />
        <span className="text-sm text-ink-700/70">{formatDateTime(order.createdAt)}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card space-y-2 p-5 text-sm">
          <h2 className="font-semibold">Customer</h2>
          <p className="text-base font-medium">{order.customerName}</p>
          <p>+{order.phone}</p>
          <p>{order.type === "DELIVERY" ? "Delivery" : "Takeaway"}</p>
          {order.address && <p className="whitespace-pre-line text-ink-700/80">{order.address}</p>}
          {order.note && <p className="rounded-lg bg-amber-50 p-2 text-amber-900">Note: {order.note}</p>}
          <div className="flex flex-wrap gap-2 pt-2">
            <a href={`https://wa.me/${order.phone}?text=${reply}`} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-ink-900 hover:bg-[#3ee07c]">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a href={`tel:+${order.phone}`} className="btn-outline"><Phone className="h-4 w-4" /> Call</a>
          </div>
        </div>

        <form action={updateOrderStatus} className="card space-y-3 p-5">
          <h2 className="font-semibold">Update status</h2>
          <input type="hidden" name="id" value={order.id} />
          <select name="status" defaultValue={order.status} className="input">
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
          <button className="btn-dark w-full">Save status</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-700/70">
            <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3 text-center">Qty</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Amount</th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {order.items.map((i) => (
              <tr key={i.id}>
                <td className="px-4 py-3">{i.name}</td>
                <td className="px-4 py-3 text-center">{i.qty}</td>
                <td className="px-4 py-3 text-right">{formatPrice(i.price)}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-ink-100 text-sm">
            <tr><td colSpan={3} className="px-4 py-2 text-right">Subtotal</td><td className="px-4 py-2 text-right">{formatPrice(order.subtotal)}</td></tr>
            {order.deliveryFee > 0 && (
              <tr><td colSpan={3} className="px-4 py-2 text-right">Delivery</td><td className="px-4 py-2 text-right">{formatPrice(order.deliveryFee)}</td></tr>
            )}
            <tr className="text-base font-bold"><td colSpan={3} className="px-4 py-3 text-right">Total</td><td className="px-4 py-3 text-right">{formatPrice(order.total)}</td></tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

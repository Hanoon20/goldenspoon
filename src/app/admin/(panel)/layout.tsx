import { Sidebar } from "@/components/admin/Sidebar";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const newOrders = await db.order.count({ where: { status: "NEW" } });

  return (
    <div className="flex min-h-screen flex-col bg-ink-50 text-ink-900 md:flex-row">
      <Sidebar adminName={admin.name || admin.email} newOrders={newOrders} />
      <div className="flex-1 overflow-x-hidden p-4 md:p-8">{children}</div>
    </div>
  );
}

import { notFound } from "next/navigation";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function EditDish({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [item, categories] = await Promise.all([
    db.menuItem.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } }),
  ]);
  if (!item) notFound();
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Edit dish</h1>
      <MenuItemForm item={item} categories={categories} />
    </div>
  );
}

import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function NewDish() {
  await requireAdmin();
  const categories = await db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } });
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Add dish</h1>
      <MenuItemForm categories={categories} />
    </div>
  );
}

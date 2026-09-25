import { Trash2 } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteCategory } from "../actions";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const { error } = await searchParams;
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { items: true } } },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Categories</h1>
      <p className="text-sm text-ink-700/70">Lower sort order shows first on the menu.</p>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="card p-5">
        <h2 className="mb-3 font-semibold">New category</h2>
        <CategoryForm />
      </div>

      <ul className="card divide-y divide-ink-100">
        {categories.map((c) => (
          <li key={c.id} className="flex items-start gap-3 p-4">
            <CategoryForm category={c} />
            <span className="mt-2 w-16 shrink-0 text-center text-xs text-ink-700/60">{c._count.items} dishes</span>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-30" disabled={c._count.items > 0} title={c._count.items > 0 ? "Remove its dishes first" : "Delete"}>
                <Trash2 className="h-4 w-4" />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useFormAction } from "@/lib/use-form-action";
import { saveCategory } from "@/app/admin/(panel)/actions";
import { FormMessage } from "./FormMessage";

export function CategoryForm({ category }: { category?: { id: string; name: string; sortOrder: number } }) {
  const [state, onSubmit, pending] = useFormAction(saveCategory, null);
  const formRef = useRef<HTMLFormElement>(null);
  // Clear the "new category" form after a successful add.
  useEffect(() => {
    if (!category && state?.success) formRef.current?.reset();
  }, [state, category]);
  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-1 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {category && <input type="hidden" name="id" value={category.id} />}
        <input name="name" required placeholder="Category name" defaultValue={category?.name} className="input min-w-40 flex-1" />
        <input name="sortOrder" type="number" min={0} title="Sort order" defaultValue={category?.sortOrder ?? 0} className="input w-20" />
        <button disabled={pending} className={category ? "btn-outline" : "btn-primary"}>{category ? "Save" : "Add"}</button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}

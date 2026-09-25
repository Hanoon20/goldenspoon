"use client";

import { useState } from "react";
import { useFormAction } from "@/lib/use-form-action";
import type { MenuItem } from "@prisma/client";
import { saveMenuItem } from "@/app/admin/(panel)/actions";
import { DishImage } from "@/components/shop/DishImage";
import { FormMessage } from "./FormMessage";

type Props = { item?: MenuItem; categories: { id: string; name: string }[] };

export function MenuItemForm({ item, categories }: Props) {
  const [state, onSubmit, pending] = useFormAction(saveMenuItem, null);
  const [image, setImage] = useState(item?.image ?? "");
  const [name, setName] = useState(item?.name ?? "");

  return (
    <form onSubmit={onSubmit} className="card grid gap-5 p-6 md:grid-cols-[1fr_220px]">
      <div className="space-y-4">
        {item && <input type="hidden" name="id" value={item.id} />}
        <div>
          <label className="label" htmlFor="name">Dish name</label>
          <input id="name" name="name" required className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" name="description" rows={3} className="input" defaultValue={item?.description} />
        </div>
        <div className="grid gap-4 rounded-xl border border-ink-100 bg-ink-100/40 p-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="price">Price (Rs.)</label>
            <input id="price" name="price" type="number" min={1} step={1} required className="input" defaultValue={item?.price} />
          </div>
          <div>
            <label className="label" htmlFor="fullPrice">Full portion price (Rs.)</label>
            <input id="fullPrice" name="fullPrice" type="number" min={1} step={1} placeholder="Leave empty if one size" className="input" defaultValue={item?.fullPrice ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="baseLabel">Regular portion is called</label>
            <select id="baseLabel" name="baseLabel" className="input" defaultValue={item?.baseLabel ?? "Normal"}>
              <option value="Normal">Normal</option>
              <option value="Half">Half</option>
            </select>
          </div>
          <p className="text-xs text-ink-700/70 sm:col-span-3">
            If you fill in a full portion price, customers choose between the regular portion (Price) and Full.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="categoryId">Category</label>
            <select id="categoryId" name="categoryId" required className="input" defaultValue={item?.categoryId ?? ""}>
              <option value="" disabled>Choose…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="sortOrder">Sort order</label>
            <input id="sortOrder" name="sortOrder" type="number" min={0} className="input" defaultValue={item?.sortOrder ?? 0} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="image">Image URL</label>
          <input id="image" name="image" type="url" placeholder="https://…" className="input" value={image} onChange={(e) => setImage(e.target.value)} />
          <p className="mt-1 text-xs text-ink-700/60">Paste a link to the dish photo (e.g. from Cloudinary, Imgur or your Facebook page).</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="isVeg" defaultChecked={item?.isVeg ?? false} className="h-4 w-4 accent-green-600" /> Vegetarian</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isAvailable" defaultChecked={item?.isAvailable ?? true} className="h-4 w-4 accent-gold-500" /> Available</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={item?.isFeatured ?? false} className="h-4 w-4 accent-gold-500" /> Bestseller (show on home page)</label>
        </div>
        <FormMessage state={state} />
        <button disabled={pending} className="btn-primary">{pending ? "Saving…" : item ? "Save changes" : "Add dish"}</button>
      </div>
      <div>
        <p className="label">Preview</p>
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-ink-100">
          <DishImage src={image} alt={name || "?"} />
        </div>
      </div>
    </form>
  );
}

"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { OrderStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { destroySession, requireAdmin } from "@/lib/auth";
import { normalizePhone, slugify } from "@/lib/utils";

export type FormState = { error?: string; success?: string } | null;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const bool = (fd: FormData, key: string) => fd.get(key) === "on";

function isUniqueError(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";
}

function refreshShop() {
  revalidatePath("/", "layout");
}

// ---------- Auth ----------

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  if (next.length < 8) return { error: "New password must be at least 8 characters." };
  const row = await db.admin.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await bcrypt.compare(current, row.passwordHash))) return { error: "Current password is wrong." };
  await db.admin.update({ where: { id: admin.id }, data: { passwordHash: await bcrypt.hash(next, 10) } });
  return { success: "Password updated." };
}

// ---------- Orders ----------

export async function updateOrderStatus(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const status = z.enum(OrderStatus).parse(str(fd, "status"));
  await db.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

// ---------- Categories ----------

const categorySchema = z.object({
  name: z.string().min(2, "Name is too short").max(60),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export async function saveCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse({ name: str(fd, "name"), sortOrder: str(fd, "sortOrder") || 0 });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const id = str(fd, "id");
  const data = { ...parsed.data, slug: slugify(parsed.data.name) };
  try {
    if (id) await db.category.update({ where: { id }, data });
    else await db.category.create({ data });
  } catch (e) {
    if (isUniqueError(e)) return { error: "A category with this name already exists." };
    throw e;
  }
  revalidatePath("/admin/categories");
  refreshShop();
  return { success: id ? "Category updated." : "Category added." };
}

export async function deleteCategory(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const count = await db.menuItem.count({ where: { categoryId: id } });
  if (count > 0) redirect(`/admin/categories?error=${encodeURIComponent("Move or delete its dishes first.")}`);
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  refreshShop();
}

// ---------- Menu items ----------

const menuItemSchema = z.object({
  name: z.string().min(2, "Name is too short").max(80),
  description: z.string().max(500),
  price: z.coerce.number().int("Price must be a whole number").min(1, "Enter a price").max(100000),
  image: z.union([z.literal(""), z.url("Image must be a valid URL (https://…)")]),
  categoryId: z.string().min(1, "Choose a category"),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isVeg: z.boolean(),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

export async function saveMenuItem(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = menuItemSchema.safeParse({
    name: str(fd, "name"),
    description: str(fd, "description"),
    price: str(fd, "price"),
    image: str(fd, "image"),
    categoryId: str(fd, "categoryId"),
    sortOrder: str(fd, "sortOrder") || 0,
    isVeg: bool(fd, "isVeg"),
    isAvailable: bool(fd, "isAvailable"),
    isFeatured: bool(fd, "isFeatured"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const id = str(fd, "id");
  const data = { ...parsed.data, slug: slugify(parsed.data.name) };
  try {
    if (id) await db.menuItem.update({ where: { id }, data });
    else await db.menuItem.create({ data });
  } catch (e) {
    if (isUniqueError(e)) return { error: "A dish with this name already exists." };
    throw e;
  }
  revalidatePath("/admin/menu");
  refreshShop();
  redirect("/admin/menu");
}

export async function toggleAvailability(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const item = await db.menuItem.findUniqueOrThrow({ where: { id }, select: { isAvailable: true } });
  await db.menuItem.update({ where: { id }, data: { isAvailable: !item.isAvailable } });
  revalidatePath("/admin/menu");
  refreshShop();
}

export async function deleteMenuItem(fd: FormData) {
  await requireAdmin();
  // Past orders keep their copied name and price; the link to this dish becomes null.
  await db.menuItem.delete({ where: { id: str(fd, "id") } });
  revalidatePath("/admin/menu");
  refreshShop();
}

// ---------- Settings ----------

const settingsSchema = z.object({
  restaurantName: z.string().min(2).max(60),
  tagline: z.string().max(120),
  whatsappNumber: z
    .string()
    .transform(normalizePhone)
    .refine((s) => /^\d{11,15}$/.test(s), "Enter the WhatsApp number with country code, e.g. 94771234567"),
  phone: z.string().max(30),
  email: z.union([z.literal(""), z.email("Invalid email")]),
  address: z.string().max(300),
  mapUrl: z.union([z.literal(""), z.url("Map link must be a valid URL")]),
  openingHours: z.string().max(100),
  deliveryFee: z.coerce.number().int().min(0).max(10000),
  minOrder: z.coerce.number().int().min(0).max(100000),
  isOpen: z.boolean(),
});

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse({
    restaurantName: str(fd, "restaurantName"),
    tagline: str(fd, "tagline"),
    whatsappNumber: str(fd, "whatsappNumber"),
    phone: str(fd, "phone"),
    email: str(fd, "email"),
    address: str(fd, "address"),
    mapUrl: str(fd, "mapUrl"),
    openingHours: str(fd, "openingHours"),
    deliveryFee: str(fd, "deliveryFee") || 0,
    minOrder: str(fd, "minOrder") || 0,
    isOpen: bool(fd, "isOpen"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.setting.upsert({ where: { id: 1 }, update: parsed.data, create: { id: 1, ...parsed.data } });
  revalidatePath("/admin/settings");
  refreshShop();
  return { success: "Settings saved." };
}

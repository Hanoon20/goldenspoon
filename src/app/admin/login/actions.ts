"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.jn8t6Z4rGtqPDLJeJKnIhnyJ5Ahu";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return "Enter your email and password.";

  const admin = (await db.admin.findUnique({ where: { email } })) ?? (await bootstrapFirstAdmin(email, password));
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid) return "Invalid email or password.";

  await createSession(admin.id, admin.email);
  redirect("/admin");
}

/**
 * On a fresh deployment there are no admins yet. The first login that matches the
 * ADMIN_EMAIL / ADMIN_PASSWORD environment variables creates the account, so no seed
 * script has to be run by hand. Does nothing once any admin exists.
 */
async function bootstrapFirstAdmin(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword || email !== envEmail || password !== envPassword) return null;
  if ((await db.admin.count()) > 0) return null;
  try {
    return await db.admin.create({
      data: { name: "Admin", email, passwordHash: await bcrypt.hash(password, 10) },
    });
  } catch {
    // Two first logins at once: the other request created it.
    return db.admin.findUnique({ where: { email } });
  }
}

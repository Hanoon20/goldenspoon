"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import type { Admin } from "@prisma/client";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const DUMMY_HASH = "$2b$10$CwTycUXWue0Thq9StjUM0uJ8.jn8t6Z4rGtqPDLJeJKnIhnyJ5Ahu";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return "Enter your email and password.";

  if (process.env.ADMIN_RESET?.trim().toLowerCase() === "true") {
    const reset = await resetAdminFromEnv(email, password);
    if (reset) {
      await createSession(reset.id, reset.email);
      redirect("/admin");
    }
  }

  let admin = await db.admin.findUnique({ where: { email } });
  if (!admin && (await db.admin.count()) === 0) {
    // Fresh deployment: no admin yet. Explain exactly what's wrong so setup is easy.
    const result = await bootstrapFirstAdmin(email, password);
    if ("error" in result) return result.error;
    admin = result.admin;
  }
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);
  if (!admin || !valid) return "Invalid email or password.";

  await createSession(admin.id, admin.email);
  redirect("/admin");
}

/**
 * Recovery for a lost or wrong admin login. While ADMIN_RESET=true is set, logging in with the
 * ADMIN_EMAIL / ADMIN_PASSWORD environment variables replaces all admin accounts with that one.
 * Anyone who can set environment variables already controls the site, so this adds no new access.
 * Returns null (normal login continues) when the typed values don't match the env values.
 */
async function resetAdminFromEnv(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!envEmail || !envPassword || email !== envEmail || password.trim() !== envPassword) return null;
  const passwordHash = await bcrypt.hash(envPassword, 10);
  const [, admin] = await db.$transaction([
    db.admin.deleteMany({}),
    db.admin.create({ data: { name: "Admin", email: envEmail, passwordHash } }),
  ]);
  return admin;
}

/**
 * On a fresh deployment there are no admins yet. The first login that matches the
 * ADMIN_EMAIL / ADMIN_PASSWORD environment variables creates the account, so no seed
 * script has to be run by hand. Only called while no admin exists.
 */
async function bootstrapFirstAdmin(email: string, password: string): Promise<{ admin: Admin } | { error: string }> {
  // Trim so a stray space or newline pasted into the hosting dashboard doesn't break setup.
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();
  if (!envEmail || !envPassword) {
    return {
      error:
        "Setup not finished: ADMIN_EMAIL and ADMIN_PASSWORD are not set for this deployment. Add them to the environment variables (Production) and redeploy.",
    };
  }
  if (email !== envEmail) return { error: "This email doesn't match ADMIN_EMAIL in your environment variables." };
  if (password.trim() !== envPassword) {
    return { error: "This password doesn't match ADMIN_PASSWORD in your environment variables." };
  }
  const passwordHash = await bcrypt.hash(envPassword, 10);
  try {
    return { admin: await db.admin.create({ data: { name: "Admin", email, passwordHash } }) };
  } catch {
    // Two first logins at once: the other request created it.
    const existing = await db.admin.findUnique({ where: { email } });
    return existing ? { admin: existing } : { error: "Could not create the admin account. Please try again." };
  }
}

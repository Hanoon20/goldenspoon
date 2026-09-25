import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session";

export async function createSession(adminId: string, email: string) {
  const token = await signSession({ adminId, email });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Returns the logged-in admin, or redirects to the login page. Call at the top of every admin page and action. */
export async function requireAdmin() {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) redirect("/admin/login");
  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, name: true, email: true },
  });
  if (!admin) redirect("/admin/login");
  return admin;
}

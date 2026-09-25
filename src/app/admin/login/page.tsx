"use client";

import { useFormAction } from "@/lib/use-form-action";
import { login } from "./actions";

export default function LoginPage() {
  const [error, onSubmit, pending] = useFormAction(login, null);

  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-sm space-y-4 p-8">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold-500 text-2xl">🥄</span>
          <h1 className="mt-3 font-display text-2xl font-bold">Admin login</h1>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="username" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={pending} className="btn-dark w-full py-2.5">{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}

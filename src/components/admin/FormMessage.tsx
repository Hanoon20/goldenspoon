import type { FormState } from "@/app/admin/(panel)/actions";

export function FormMessage({ state }: { state: FormState }) {
  if (state?.error) return <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>;
  if (state?.success) return <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{state.success}</p>;
  return null;
}

"use client";

import { startTransition, useActionState } from "react";

/**
 * Like useActionState, but submits via onSubmit so React doesn't reset the form afterwards.
 * Keeps what the admin typed when the server returns a validation error.
 */
export function useFormAction<S>(action: (prev: Awaited<S>, fd: FormData) => Promise<S>, initial: Awaited<S>) {
  const [state, dispatch, pending] = useActionState(action, initial);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
  return [state, onSubmit, pending] as const;
}

"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/**
 * Like Motion's useReducedMotion, but hydration-safe: it reports `false` while hydrating (matching the
 * server render) and switches to the real value right after. Motion's hook returns the real value during
 * hydration, so server and client markup differ for reduced-motion users and React re-renders the whole
 * page on the client.
 */
export function useReducedMotionSafe() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

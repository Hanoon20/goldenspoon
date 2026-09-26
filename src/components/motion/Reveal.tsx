"use client";

import { motion } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/** Fades and lifts its content in once, when it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      // Reduced motion: show immediately instead of waiting for the element to scroll into view.
      animate={reduce ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

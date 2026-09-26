"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

/**
 * Story section where the emblem behind the copy grows and turns as the section passes through
 * the screen (zoom parallax), so the brand mark frames the story. Static for reduced motion.
 */
export function ZoomStory({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1.35]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0, 0.18, 0.18, 0]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden py-24 md:py-36">
      {/* Centring lives on the wrapper so Motion's transform on the inner element doesn't override it. */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[520px] max-w-[110vw] -translate-x-1/2 -translate-y-1/2 md:w-[760px]">
        <motion.div style={reduce ? { opacity: 0.12 } : { scale, rotate, opacity }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="" className="w-full" />
        </motion.div>
      </div>
      {children}
    </section>
  );
}

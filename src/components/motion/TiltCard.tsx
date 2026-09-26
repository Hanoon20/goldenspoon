"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Card that tilts in 3D toward the mouse, with a soft gold spotlight following the cursor.
 * Mouse only: touch and reduced-motion users get a still card.
 */
export function TiltCard({ children, className, max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotionSafe();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 150, damping: 18 };
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), spring);
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), spring);
  const spotX = useTransform(mx, (v) => `${v * 100}%`);
  const spotY = useTransform(my, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${spotX} ${spotY}, rgba(235,201,106,0.16), transparent 60%)`;

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <div className="h-full [perspective:1000px]">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("group relative h-full", className)}
      >
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}

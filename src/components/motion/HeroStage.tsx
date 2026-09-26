"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";
import { GoldDust } from "./GoldDust";

/**
 * Full-height hero with depth: a gold-dust layer and glow drift slower than the page (parallax),
 * the copy lifts away on scroll, and the logo emblem sits on a 3D stage that tilts toward the pointer
 * and turns as the hero scrolls out. Everything is static for reduced-motion users.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Pointer position over the hero, -0.5..0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden bg-ink-900"
    >
      <motion.div style={reduce ? undefined : { y: bgY }} className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_45%,rgba(201,154,52,0.28),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(201,154,52,0.10),transparent_50%)]" />
        <GoldDust className="absolute inset-0 h-full w-full" />
      </motion.div>

      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-6xl items-center gap-6 px-4 py-12 md:grid-cols-[1.35fr_1fr] md:gap-10 md:py-16">
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyOpacity }} className="order-2 md:order-1">
          {children}
        </motion.div>
        <div className="order-1 md:order-2">
          <Emblem3D px={px} py={py} scroll={scrollYProgress} reduce={!!reduce} />
        </div>
      </div>
    </section>
  );
}

function Emblem3D({
  px,
  py,
  scroll,
  reduce,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  scroll: MotionValue<number>;
  reduce: boolean;
}) {
  const spring = { stiffness: 120, damping: 18, mass: 0.6 };
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-18, 18]), spring);
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [14, -14]), spring);
  const scrollTurn = useTransform(scroll, [0, 1], [0, 55]);
  const rotateY = useTransform([tiltY, scrollTurn], ([a, b]: number[]) => a + b);
  const scale = useTransform(scroll, [0, 1], [1, 0.8]);
  const lift = useTransform(scroll, [0, 1], [0, -60]);

  const stage = reduce ? undefined : { rotateX: tiltX, rotateY, scale, y: lift };

  return (
    <div className="mx-auto aspect-square w-full max-w-[260px] [perspective:1100px] sm:max-w-[340px] md:max-w-[440px]">
      <motion.div
        style={{ ...stage, transformStyle: "preserve-3d" }}
        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-full w-full"
      >
        {/* Back glow */}
        <div
          className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(224,180,74,0.45),rgba(224,180,74,0)_65%)] blur-2xl"
          style={{ transform: "translateZ(-140px)" }}
        />
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-gold-300/25" style={{ transform: "translateZ(-70px)" }} />
        {/* Plate */}
        <div
          className="absolute inset-[9%] rounded-full border border-gold-300/40 bg-[radial-gradient(circle_at_35%_30%,#262015,#0c0b09_70%)] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(235,201,106,0.25)]"
          style={{ transform: "translateZ(0px)" }}
        />
        {/* Inner ring */}
        <div className="absolute inset-[16%] rounded-full border border-gold-300/20" style={{ transform: "translateZ(30px)" }} />
        {/* Emblem floats above the plate */}
        <div className="absolute inset-[22%] grid place-items-center" style={{ transform: "translateZ(90px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt=""
            className="w-full drop-shadow-[0_18px_30px_rgba(0,0,0,0.7)] motion-safe:animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion";

const DESKTOP = "(min-width: 768px)";

function useMedia(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * Desktop: the section pins while vertical scroll pans the cards sideways, and each card turns in 3D
 * depending on how far it is from the centre of the screen (a scroll-driven coverflow).
 * Phones and reduced-motion users get a plain swipeable row.
 */
export function SignatureScroll({ heading, items }: { heading: React.ReactNode; items: React.ReactNode[] }) {
  const desktop = useMedia(DESKTOP);
  const reduce = useReducedMotionSafe();

  if (!desktop || reduce) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">{heading}</div>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-auto md:max-w-6xl">
          {items.map((item, i) => (
            <div key={i} className="w-[78%] max-w-[320px] shrink-0 snap-center sm:w-[300px]">
              {item}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return <PinnedCoverflow heading={heading} items={items} />;
}

function PinnedCoverflow({ heading, items }: { heading: React.ReactNode; items: React.ReactNode[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [viewport, setViewport] = useState(0);
  const cardCentres = useRef<number[]>([]);

  // Measure on resize only (never on scroll).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const vw = window.innerWidth;
      setViewport(vw);
      setDistance(Math.max(0, el.scrollWidth - vw));
      cardCentres.current = Array.from(el.children).map((c) => {
        const card = c as HTMLElement;
        return card.offsetLeft + card.offsetWidth / 2;
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const distanceMv = useMotionValue(0);
  useEffect(() => distanceMv.set(distance), [distance, distanceMv]);
  const x = useTransform(() => -scrollYProgress.get() * distanceMv.get());

  return (
    // The section is as tall as the sideways travel, so one screen of scroll = one screen of pan.
    <section ref={section} style={{ height: `calc(100dvh + ${distance}px)` }} className="relative">
      <div className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4">{heading}</div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex gap-8 px-[max(1rem,calc((100vw-72rem)/2+1rem))] [perspective:1400px]">
          {items.map((item, i) => (
            <CoverCard key={i} x={x} centre={() => cardCentres.current[i] ?? 0} viewport={viewport}>
              {item}
            </CoverCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CoverCard({
  children,
  x,
  centre,
  viewport,
}: {
  children: React.ReactNode;
  x: MotionValue<number>;
  centre: () => number;
  viewport: number;
}) {
  // -1 (left edge) .. 0 (centre of screen) .. 1 (right edge)
  const offset = useTransform(x, (v) => (viewport ? (centre() + v - viewport / 2) / (viewport / 2) : 0));
  const rotateY = useTransform(offset, [-1.2, 0, 1.2], [38, 0, -38]);
  const scale = useTransform(offset, [-1.2, 0, 1.2], [0.86, 1, 0.86]);
  const opacity = useTransform(offset, [-1.6, -0.9, 0, 0.9, 1.6], [0.35, 0.8, 1, 0.8, 0.35]);

  return (
    <motion.div style={{ rotateY, scale, opacity, transformStyle: "preserve-3d" }} className="w-[320px] shrink-0">
      {children}
    </motion.div>
  );
}

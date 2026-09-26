"use client";

import { useEffect, useRef } from "react";

type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number; z: number };

/**
 * Slowly drifting gold particles, echoing the logo intro video. Drawn on a canvas outside React state.
 * Pauses when off screen or when the tab is hidden; draws a single still frame for reduced-motion users.
 */
export function GoldDust({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let raf = 0;
    let visible = true;

    const seed = () => {
      const count = w < 640 ? 45 : 90;
      motes = Array.from({ length: count }, () => {
        const z = Math.random(); // depth: far motes are smaller, dimmer and slower
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + z * 1.8,
          vx: (Math.random() - 0.5) * 0.15 * (0.3 + z),
          vy: -(0.05 + Math.random() * 0.25) * (0.3 + z),
          a: 0.15 + z * 0.6,
          tw: Math.random() * Math.PI * 2,
          z,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        const alpha = m.a * (0.65 + 0.35 * Math.sin(m.tw));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 201, 106, ${alpha})`;
        ctx.shadowColor = "rgba(235, 201, 106, 0.8)";
        ctx.shadowBlur = m.z > 0.7 ? 8 : 0;
        ctx.fill();
      }
    };

    const tick = () => {
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.tw += 0.02;
        if (m.y < -4) {
          m.y = h + 4;
          m.x = Math.random() * w;
        }
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!reduce && visible && !document.hidden && !raf) raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { INTRO_SEEN_KEY as SEEN_KEY } from "@/lib/intro";
import { cn } from "@/lib/utils";

/**
 * Plays the logo intro video full screen when a visitor first opens the site, then fades into the page.
 * Shown once per browser tab. Skipped when already seen, when the visitor prefers reduced motion, or when
 * autoplay is blocked; INTRO_GUARD_SCRIPT hides it before first paint in the first two cases.
 */
export function IntroSplash() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"playing" | "leaving" | "done">("playing");
  const [muted, setMuted] = useState(true);
  // Sources are added only after mount, so the video isn't downloaded when the intro won't play.
  const [ready, setReady] = useState(false);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setPhase((p) => (p === "playing" ? "leaving" : p));
  }, []);

  useEffect(() => {
    if (document.documentElement.classList.contains("intro-seen")) {
      setPhase("done");
      return;
    }
    setReady(true);
    document.body.style.overflow = "hidden";
    const safety = window.setTimeout(finish, 15000);
    return () => {
      window.clearTimeout(safety);
      document.body.style.overflow = "";
    };
  }, [finish]);

  useEffect(() => {
    const video = videoRef.current;
    if (!ready || !video) return;
    // Browsers only autoplay muted video. If autoplay is refused (e.g. power saving), go straight to the site.
    // AbortError only means a play request was superseded (e.g. falling back to the next source), so ignore it.
    video.muted = true;
    video.play().catch((err: unknown) => {
      if (!(err instanceof DOMException && err.name === "AbortError")) finish();
    });
  }, [ready, finish]);

  useEffect(() => {
    if (phase !== "leaving") return;
    document.body.style.overflow = "";
    const t = window.setTimeout(() => setPhase("done"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <div
      id="intro"
      role="dialog"
      aria-label="Golden Spoon intro"
      className={cn(
        "fixed inset-0 z-[100] bg-black bg-[radial-gradient(ellipse_at_center,#3a2410_0%,#0a0a0a_60%)] transition-opacity duration-700",
        phase === "leaving" && "pointer-events-none opacity-0",
      )}
    >
      <video
        ref={videoRef}
        poster="/intro-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        // React also delivers <source> errors here; a failed first source just means the browser tries the next.
        onError={(e) => e.target === e.currentTarget && finish()}
        className="h-full w-full object-contain"
      >
        {ready && <source src="/intro.mp4" type="video/mp4" />}
        {/* If the last source fails too, nothing can play: go to the site. */}
        {ready && <source src="/intro.webm" type="video/webm" onError={finish} />}
      </video>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 sm:p-8">
        <button
          onClick={toggleSound}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
        <button
          onClick={finish}
          className="rounded-full border border-gold-300/60 bg-black/40 px-5 py-2.5 text-sm font-semibold tracking-wide text-gold-200 backdrop-blur transition hover:bg-black/60"
        >
          Skip intro →
        </button>
      </div>
    </div>
  );
}

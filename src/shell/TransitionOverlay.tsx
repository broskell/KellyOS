import { useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { prefersReducedMotion } from "../motion/duration";
import { NEXT_EDITION_PATH, TRANSITION_SRC, useTransition } from "./transitionStore";

/**
 * The 2026-edition transition — a full-screen black-hole video that plays once,
 * then lands on the next-edition site. Skippable at any time; reduced motion
 * skips the video entirely and goes straight through. Rendered above everything,
 * inside the router so it can navigate. Not part of the WM core.
 */
export function TransitionOverlay() {
  const active = useTransition((s) => s.active);
  const stop = useTransition((s) => s.stop);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    stop();
    navigate(NEXT_EDITION_PATH);
  }, [stop, navigate]);

  // Only real end-of-playback should advance — guard against spurious "ended"
  // events fired before metadata loads (currentTime 0 ≥ duration 0).
  const onEnded = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration || v.currentTime >= v.duration - 0.5) finish();
  }, [finish]);

  useEffect(() => {
    if (!active) return;
    done.current = false;
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    const v = videoRef.current;
    if (v) {
      // Play with sound (cinematic). The Install click is a user gesture, so
      // audio autoplay is normally allowed within the activation window; fall
      // back to muted only if a browser still blocks it. No manual seek — the
      // file is already trimmed to the right start, and seeking before metadata
      // loads can fire a spurious "ended".
      const tryPlay = () => {
        v.muted = false;
        v.volume = 1;
        v.play().catch(() => {
          v.muted = true;
          void v.play().catch(() => {
            /* fully blocked — Skip is still available */
          });
        });
      };
      if (v.readyState >= 2) tryPlay();
      else v.addEventListener("canplay", tryPlay, { once: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, finish]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[13000] flex items-center justify-center"
      style={{ background: "#000" }}
      data-os-transition=""
      role="dialog"
      aria-label="Updating to Kelly.OS 2026"
    >
      <video
        ref={videoRef}
        src={TRANSITION_SRC}
        playsInline
        preload="auto"
        onEnded={onEnded}
        onError={finish}
        className="h-full w-full"
        style={{ objectFit: "cover" }}
      />
      <button
        type="button"
        className="os-btn os-raised absolute bottom-6 right-6 z-[13010]"
        onClick={finish}
      >
        Skip →
      </button>
    </div>
  );
}

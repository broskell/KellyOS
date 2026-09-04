import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../motion/duration";
import { playBootOut } from "../motion/play";
import { CrtBackground } from "./crt/CrtBackground";
import type { CrtVariant } from "./crt/crtScreens";

/**
 * Kelly.OS '96 boot loader — a real WebGL CRT. It opens on the cinematic film
 * leader (countdown), switches to the terminal boot log while the OS "loads its
 * components", then hands off to the desktop. Skippable on the first frame
 * (Skip / Esc / Enter); reduced motion goes straight through. Not the WM core.
 */
const BOOT_SPEED = 2;
const COUNTDOWN_MS = 2100;
const TERMINAL_MS = 2300;

export function BootOverlay({ onSkip }: { onSkip: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);
  const [variant, setVariant] = useState<CrtVariant>("cinematic");

  const leave = () => {
    if (leaving.current) return;
    leaving.current = true;
    playBootOut(rootRef.current, onSkip);
  };

  useEffect(() => {
    skipRef.current?.focus();
    if (prefersReducedMotion()) {
      const t = window.setTimeout(leave, 500);
      return () => window.clearTimeout(t);
    }
    const toTerminal = window.setTimeout(() => setVariant("terminal"), COUNTDOWN_MS);
    const toDesktop = window.setTimeout(leave, COUNTDOWN_MS + TERMINAL_MS);
    return () => {
      window.clearTimeout(toTerminal);
      window.clearTimeout(toDesktop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") leave();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] overflow-hidden"
      style={{ background: "#000" }}
      role="dialog"
      aria-modal="true"
      aria-label="Starting Kelly.OS"
      data-os-boot=""
    >
      <CrtBackground variant={variant} speed={BOOT_SPEED} typeSpeed={BOOT_SPEED} className="absolute inset-0" />
      <button
        ref={skipRef}
        type="button"
        onClick={leave}
        className="absolute bottom-6 right-6 z-[10010] px-3 py-1 text-[12px]"
        style={{
          color: "rgba(255,255,255,0.85)",
          fontFamily: "var(--kellos-font-mono, monospace)",
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.5)",
          backdropFilter: "blur(2px)",
          cursor: "pointer",
        }}
      >
        Skip &rsaquo;
      </button>
    </div>
  );
}

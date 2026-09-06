import { useEffect, useRef, useState } from "react";
import { playMenuIn } from "../motion/play";
import { useTransition } from "./transitionStore";

/**
 * The 2026-edition update prompt — a desktop notification toast.
 * Slides in smoothly from the right side of the screen like a real OS toast.
 * "Upgrade OS Now" triggers the black-hole transition to the 2026 edition.
 */
const DISMISS_KEY = "kellos-edition-toast-dismissed";

export function EditionUpdateToast({ enabled }: { enabled: boolean }) {
  const [dismissed, setDismissed] = useState(true);
  const [slideIn, setSlideIn] = useState(false);
  const start = useTransition((s) => s.start);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const shown = enabled && !dismissed;

  useEffect(() => {
    if (shown) {
      const timer = setTimeout(() => {
        setSlideIn(true);
        if (ref.current) playMenuIn(ref.current);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shown]);

  if (!shown) return null;

  const dismiss = () => {
    setSlideIn(false);
    setTimeout(() => {
      try {
        sessionStorage.setItem(DISMISS_KEY, "1");
      } catch {
        /* ignore */
      }
      setDismissed(true);
    }, 400);
  };

  return (
    <div
      ref={ref}
      className={`os-raised bg-face fixed bottom-14 right-3 z-[9000] w-80 max-w-[85vw] shadow-2xl transition-all duration-500 ease-out ${
        slideIn
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0 pointer-events-none"
      }`}
      data-os-edition-toast=""
      role="status"
      aria-live="polite"
    >
      <div className="os-titlebar flex items-center justify-between px-2">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
          </span>
          <span className="os-titlebar-label font-bold text-xs">
            ✦ Kelly.OS Upgrade Available
          </span>
        </div>
        <button
          type="button"
          className="os-ctrl os-raised shrink-0 font-mono hover:bg-red-500 hover:text-white transition-colors"
          aria-label="Dismiss update"
          onClick={dismiss}
        >
          ×
        </button>
      </div>

      <div className="p-3 bg-[#c0c0c0] text-black font-chrome text-xs space-y-2 border-t border-white">
        <div className="font-bold text-gray-900">
          New Edition Ready! (Kelly.OS → 2026)
        </div>
        <div className="text-gray-700 text-[11px]">
          Experience the next generation 2026 Liquid Metal & CRT interface.
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            className="os-btn os-raised font-bold text-xs bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 border-2 border-black animate-pulse shadow-md transition-transform active:scale-95"
            onClick={start}
          >
            Upgrade OS Now ↻
          </button>
        </div>
      </div>
    </div>
  );
}

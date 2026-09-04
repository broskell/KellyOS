import { useEffect, useRef, useState } from "react";
import { playMenuIn } from "../motion/play";
import { useTransition } from "./transitionStore";

/**
 * The 2026-edition update prompt — a small desktop toast (not a full screen).
 * "Install update" runs the black-hole transition to the next edition. Dismiss
 * hides it for the session. Styled like a classic OS update balloon.
 */
const DISMISS_KEY = "kellos-edition-toast-dismissed";

export function EditionUpdateToast({ enabled }: { enabled: boolean }) {
  const [dismissed, setDismissed] = useState(true);
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
    if (shown) playMenuIn(ref.current);
  }, [shown]);

  if (!shown) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  };

  return (
    <div
      ref={ref}
      className="os-raised bg-face fixed bottom-14 right-3 z-[9000] w-72 max-w-[80vw]"
      data-os-edition-toast=""
      role="status"
      aria-live="polite"
    >
      <div className="os-titlebar">
        <span className="os-titlebar-label">✦ Kelly.OS Update</span>
        <button type="button" className="os-ctrl os-raised" aria-label="Dismiss update" onClick={dismiss}>
          ×
        </button>
      </div>
      <p className="font-chrome mb-0 mt-0 px-3 pt-3 leading-snug">
        A newer version of this portfolio is available.
        <br />
        <strong>Kelly.OS → 2026 Edition.</strong>
      </p>
      <div className="px-3 pb-3 pt-2">
        <button type="button" className="os-btn os-raised" onClick={start}>
          Install update ↻
        </button>
      </div>
    </div>
  );
}

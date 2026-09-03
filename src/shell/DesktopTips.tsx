import { useEffect, useRef, useState } from "react";
import { playMenuIn } from "../motion/play";

const DISMISS_KEY = "kellos-tips-dismissed";
const ROTATE_MS = 11_000;

/**
 * "Did you know?" desktop tips — light atmosphere that also does real work:
 * every line is a true statement about the OS or a pointer to a real surface.
 * No invented facts. Dismissable (and then it stays gone for the session),
 * reduced-motion friendly (no fade). Shown on the desktop home only.
 */
const TIPS: string[] = [
  "The Recycle Bin holds genuinely abandoned projects — not a joke folder.",
  "Skills are graded by evidence type. No percentages, no progress bars, ever.",
  "Press Ctrl+K to search every app in the OS.",
  "Alt+R opens Reader Mode — the whole site as one plain document.",
  "Versions 1.0 → 3.0 map to real eras. Open OS Update to time-travel.",
  "I develop AI-assisted, and I say so on every document. That is the point.",
  "The LangChain PR is the one externally verified piece — start there.",
];

export function DesktopTips({ enabled }: { enabled: boolean }) {
  const [dismissed, setDismissed] = useState(true);
  const [i, setI] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
    setI(Math.floor(Math.random() * TIPS.length));
  }, []);

  const shown = enabled && !dismissed;

  useEffect(() => {
    if (!shown) return;
    playMenuIn(cardRef.current);
    const id = window.setInterval(() => setI((n) => (n + 1) % TIPS.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [shown, i]);

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
      ref={cardRef}
      className="os-raised bg-face absolute right-3 top-3 z-[500] w-64 max-w-[70vw] p-2"
      data-os-tips=""
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span className="font-chrome text-[11px] font-bold">✦ Did you know?</span>
        <button
          type="button"
          className="os-btn os-raised px-1 py-0 text-[11px] leading-none"
          aria-label="Dismiss tips"
          onClick={dismiss}
        >
          ×
        </button>
      </div>
      <p className="font-chrome mt-1 mb-0 leading-snug">{TIPS[i]}</p>
    </div>
  );
}

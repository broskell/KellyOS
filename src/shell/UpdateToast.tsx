import { useEffect, useRef, useState } from "react";
import { osVersion } from "../content/versions";
import { playMenuIn } from "../motion/play";
import { useVersion } from "./VersionContext";

/**
 * Update toast — shown only to a returning visitor whose site grew since their
 * last visit. Slides smoothly in from the right screen edge.
 */
export function UpdateToast() {
  const { pendingUpdate, installUpdate, acknowledgeUpdate } = useVersion();
  const [slideIn, setSlideIn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingUpdate) {
      const timer = setTimeout(() => {
        setSlideIn(true);
        if (ref.current) playMenuIn(ref.current);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [pendingUpdate]);

  if (!pendingUpdate) return null;
  const to = osVersion(pendingUpdate.to);

  return (
    <div
      ref={ref}
      className={`os-raised bg-face fixed bottom-14 right-3 z-[9000] w-80 max-w-[85vw] shadow-2xl transition-all duration-500 ease-out ${
        slideIn
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0 pointer-events-none"
      }`}
      data-os-update-toast=""
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
            ✦ Kelly.OS Update
          </span>
        </div>
        <button
          type="button"
          className="os-ctrl os-raised shrink-0 font-mono hover:bg-red-500 hover:text-white transition-colors"
          aria-label="Dismiss update"
          onClick={acknowledgeUpdate}
        >
          ×
        </button>
      </div>
      <p className="font-chrome mb-0 mt-0 px-3 pt-3 leading-snug text-xs text-black">
        A newer version of this portfolio is available.
        <br />
        <strong>
          Kelly.OS {osVersion(pendingUpdate.from).number} → {to.number}.
        </strong>
      </p>
      <div className="px-3 pb-3 pt-2 flex justify-end">
        <button
          type="button"
          className="os-btn os-raised font-bold text-xs bg-yellow-300 hover:bg-yellow-400 text-black border-2 border-black animate-pulse shadow-md transition-transform active:scale-95"
          onClick={installUpdate}
        >
          Install update ↻
        </button>
      </div>
    </div>
  );
}

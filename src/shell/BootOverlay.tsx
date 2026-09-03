import { useEffect, useRef } from "react";
import { BootMark, Wordmark } from "../brand/marks";
import { LATEST_VERSION } from "../content/versions";
import { playBootOut } from "../motion/play";

export function BootOverlay({ onSkip }: { onSkip: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  useEffect(() => {
    skipRef.current?.focus();
  }, []);

  const skip = () => {
    if (leaving.current) return;
    leaving.current = true;
    playBootOut(rootRef.current, onSkip);
  };

  return (
    <div
      ref={rootRef}
      className="os-desktop absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-6"
      role="dialog"
      aria-modal="true"
      aria-label="Starting KELL.OS"
      data-os-boot=""
    >
      <div className="os-raised bg-face p-6 text-center">
        <BootMark size={64} decorative />
        <div className="mt-4 flex justify-center">
          <Wordmark size={18} decorative />
        </div>
        <p className="font-chrome mt-3">Starting KELL.OS {LATEST_VERSION.number}…</p>
        <p className="font-chrome text-muted mt-1">New visitors boot latest. Always.</p>
      </div>
      <button ref={skipRef} type="button" className="os-btn os-raised z-[10010]" onClick={skip}>
        Skip
      </button>
    </div>
  );
}

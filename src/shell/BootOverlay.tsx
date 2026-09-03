import { useEffect, useRef } from "react";
import { BootMark, Wordmark } from "../brand/marks";
import { LATEST_VERSION } from "../content/versions";
import { playBootOut, playBootProgress } from "../motion/play";

export function BootOverlay({ onSkip }: { onSkip: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  const leave = () => {
    if (leaving.current) return;
    leaving.current = true;
    playBootOut(rootRef.current, onSkip);
  };

  useEffect(() => {
    skipRef.current?.focus();
    // Auto-advance once the progress fill completes; Skip short-circuits it.
    playBootProgress(fillRef.current, leave);
    return () => {
      leaving.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="os-desktop absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-6"
      role="dialog"
      aria-modal="true"
      aria-label="Starting Kelly.OS"
      data-os-boot=""
    >
      <div className="os-raised bg-face w-[320px] max-w-[86%] p-6 text-center">
        <BootMark size={64} decorative />
        <div className="mt-4 flex justify-center">
          <Wordmark size={22} decorative />
        </div>
        <p className="font-chrome text-muted mt-2 m-0">A developer portfolio, built as an operating system.</p>
        <p className="font-chrome mt-4 m-0">Starting Kelly.OS {LATEST_VERSION.number}…</p>
        <div
          className="os-sunken mt-2 h-4 w-full overflow-hidden p-[2px]"
          role="progressbar"
          aria-label="Starting"
        >
          <div
            ref={fillRef}
            className="h-full"
            style={{
              width: "0%",
              background:
                "repeating-linear-gradient(90deg, var(--kellos-title-active-from) 0 8px, var(--kellos-face) 8px 10px)",
            }}
          />
        </div>
        <p className="font-chrome text-muted mt-2 m-0">New visitors boot latest. Always.</p>
      </div>
      <button ref={skipRef} type="button" className="os-btn os-raised z-[10010]" onClick={leave}>
        Skip
      </button>
    </div>
  );
}

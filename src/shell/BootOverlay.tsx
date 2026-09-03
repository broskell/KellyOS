import { useEffect, useRef } from "react";
import { LATEST_VERSION } from "../content/versions";
import { playBootOut, playBootProgress } from "../motion/play";

/**
 * Full-screen boot — a dramatic, authentic OS start splash on black. Skippable
 * on the first frame, auto-advances when the progress bar fills, and reduced
 * motion resolves it immediately. Not part of the WM core.
 */
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
    playBootProgress(fillRef.current, leave);
    return () => {
      leaving.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-10"
      style={{ background: "#000" }}
      role="dialog"
      aria-modal="true"
      aria-label="Starting Kelly.OS"
      data-os-boot=""
    >
      <div className="flex flex-col items-center text-center">
        <div
          style={{
            fontFamily: "var(--kellos-font-wordmark)",
            fontWeight: 700,
            fontSize: "clamp(44px, 9vw, 88px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            userSelect: "none",
          }}
        >
          <span style={{ color: "#ffffff" }}>Kelly</span>
          <span style={{ color: "var(--kellos-title-active-to)" }}>.OS</span>
        </div>
        <p
          className="font-mono mt-5 mb-0"
          style={{ color: "var(--kellos-title-active-to)", fontSize: "clamp(11px, 2.4vw, 15px)" }}
        >
          A developer portfolio, rebuilt as an operating system · v{LATEST_VERSION.number}
        </p>
      </div>

      <div className="w-[min(420px,80vw)]">
        <div
          className="h-5 w-full overflow-hidden p-[3px]"
          role="progressbar"
          aria-label="Starting"
          style={{ border: "2px solid #d4d0c8", background: "#000" }}
        >
          <div
            ref={fillRef}
            className="h-full"
            style={{
              width: "0%",
              background:
                "repeating-linear-gradient(90deg, var(--kellos-title-active-to) 0 12px, #000 12px 15px)",
            }}
          />
        </div>
        <p
          className="font-mono mt-3 mb-0 text-center"
          style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}
        >
          Starting Kelly.OS {LATEST_VERSION.number}…  New visitors boot latest. Always.
        </p>
      </div>

      <button
        ref={skipRef}
        type="button"
        className="os-btn os-raised z-[10010]"
        onClick={leave}
      >
        Skip
      </button>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { playMenuIn } from "../motion/play";

/**
 * First-run guide — a friendly mascot made of two mouse-following googly eyes
 * (owner-directed; replaces the earlier no-mascot stance). Shows a short tour in
 * a speech bubble, then gets out of the way. Dismissable, session-gated, and it
 * never blocks content: About Me is already open behind it. Pointer-driven, so
 * reduced motion is unaffected. Not part of the WM core.
 */

const TIPS: { title?: string; body: string }[] = [
  {
    title: "Hi, I'm Clip",
    body: "Welcome to Kelly.OS — a developer portfolio built as a real operating system. On purpose. Here's the quick tour.",
  },
  { body: "About Me is already open behind me. Read the disclosure there: Saathvik develops AI-assisted, and says so up front." },
  { body: "Then open Projects → the LangChain case study. It's the one externally verified engineering piece." },
  { body: "Start and the desktop only list apps that actually open. Reader Mode lives on the taskbar and in Start." },
  { body: "Shortcuts: Alt+R Reader Mode · Ctrl+K Search · Alt+Shift+C close · Alt+Shift+F switch windows." },
  { body: "In a hurry? Reader Mode strips the OS to a plain document — you never have to learn the window manager." },
];

export function GuideMascot({ onDismiss }: { onDismiss: () => void }) {
  const [i, setI] = useState(0);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const last = i >= TIPS.length - 1;

  useEffect(() => {
    playMenuIn(bubbleRef.current);
  }, [i]);

  const tip = TIPS[i];

  return (
    <div className="fixed right-4 top-4 z-[8000] flex items-start gap-2" data-os-guide="">
      <div
        ref={bubbleRef}
        className="os-raised bg-face relative w-72 max-w-[70vw] p-3"
        role="dialog"
        aria-label="Getting around Kelly.OS"
      >
        <div className="os-titlebar">
          <span className="os-titlebar-label">✦ Clip · Kelly.OS Help</span>
          <button type="button" className="os-ctrl os-raised" aria-label="Dismiss guide" onClick={onDismiss}>
            ×
          </button>
        </div>
        <div className="p-2">
          {tip.title ? <p className="font-chrome m-0 mb-1 text-[12px] font-bold">{tip.title}</p> : null}
          <p className="font-chrome m-0 leading-snug">{tip.body}</p>
          <div className="mt-3 flex items-center justify-between">
            {last ? (
              <button type="button" className="os-btn os-raised" onClick={onDismiss}>
                Got it
              </button>
            ) : (
              <button
                type="button"
                className="os-btn os-raised"
                onClick={() => setI((n) => Math.min(n + 1, TIPS.length - 1))}
              >
                Next tip →
              </button>
            )}
            <span className="font-chrome text-muted text-[11px]">
              {i + 1} / {TIPS.length}
            </span>
          </div>
        </div>
        {/* little tail pointing at the mascot */}
        <div
          className="absolute -bottom-2 right-6 h-3 w-3 rotate-45"
          style={{ background: "var(--kellos-face)", borderRight: "2px solid var(--kellos-bevel-shadow)", borderBottom: "2px solid var(--kellos-bevel-shadow)" }}
          aria-hidden="true"
        />
      </div>
      <GooglyEyes size={68} onClick={() => setI((n) => (n + 1) % TIPS.length)} />
    </div>
  );
}

function GooglyEyes({ size, onClick }: { size: number; onClick: () => void }) {
  const eyeA = useRef<HTMLDivElement>(null);
  const eyeB = useRef<HTMLDivElement>(null);
  const pupA = useRef<HTMLDivElement>(null);
  const pupB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pairs: [React.RefObject<HTMLDivElement | null>, React.RefObject<HTMLDivElement | null>][] = [
      [eyeA, pupA],
      [eyeB, pupB],
    ];
    const onMove = (e: PointerEvent) => {
      for (const [eye, pupil] of pairs) {
        const el = eye.current;
        const pu = pupil.current;
        if (!el || !pu) continue;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
        const reach = r.width * 0.2;
        pu.style.transform = `translate(${Math.cos(angle) * reach}px, ${Math.sin(angle) * reach}px)`;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const eye = {
    width: size,
    height: size,
    background: "#ffffff",
    border: "3px solid #1a1a1a",
    borderRadius: "9999px",
    position: "relative" as const,
    display: "grid",
    placeItems: "center",
  };
  const pupil = {
    width: size * 0.42,
    height: size * 0.42,
    background: "#1a1a1a",
    borderRadius: "9999px",
    position: "relative" as const,
    transition: "transform 40ms linear",
  };

  return (
    <button
      type="button"
      className="flex items-end gap-1 border-0 bg-transparent p-1"
      style={{ cursor: "pointer" }}
      aria-label="Clip the guide — next tip"
      onClick={onClick}
    >
      <div ref={eyeA} style={eye}>
        <div ref={pupA} style={pupil}>
          <div style={{ position: "absolute", top: 2, right: 2, width: size * 0.12, height: size * 0.12, background: "#fff", borderRadius: "9999px" }} />
        </div>
      </div>
      <div ref={eyeB} style={eye}>
        <div ref={pupB} style={pupil}>
          <div style={{ position: "absolute", top: 2, right: 2, width: size * 0.12, height: size * 0.12, background: "#fff", borderRadius: "9999px" }} />
        </div>
      </div>
    </button>
  );
}

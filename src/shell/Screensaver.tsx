import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../motion/duration";
import { ElementsBackground, type ElementVariant } from "../shaders/elements/ElementsBackground";

const IDLE_MS = 60_000;

/** The screensaver picks one of these at random each time it activates. */
type Mode = "mystify" | ElementVariant;
const MODES: Mode[] = ["mystify", "water", "lightning", "fire"];

/**
 * Idle screensaver — pure Tier-3 atmosphere. Each activation randomly plays
 * either the classic "Mystify" neon-polyline bounce or one of the WebGL
 * elemental marks (water / lightning / fire), all branded Kelly.OS. Cursor
 * movement never wakes it — only a key press does — so a passing mouse can't
 * dismiss the sleep. Never interrupts a working visitor (60s idle). Reduced
 * motion always shows the still Mystify frame. Not part of the WM core.
 */
export function Screensaver({
  enabled,
  forceActive = false,
  onDeactivate,
}: {
  enabled: boolean;
  /** Sleep: activate immediately regardless of idle time. */
  forceActive?: boolean;
  /** Called when the screensaver turns off (used to clear a forced sleep). */
  onDeactivate?: () => void;
}) {
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState<Mode>("mystify");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(false);
  const onDeactivateRef = useRef(onDeactivate);
  onDeactivateRef.current = onDeactivate;
  activeRef.current = active;

  // Sleep now: forced activation from the Start menu.
  useEffect(() => {
    if (forceActive) setActive(true);
  }, [forceActive]);

  // Choose a fresh visual each time it wakes into sleep. Reduced motion sticks
  // to Mystify, which renders a single static frame.
  useEffect(() => {
    if (!active) return;
    setMode(prefersReducedMotion() ? "mystify" : MODES[Math.floor(Math.random() * MODES.length)]);
  }, [active]);

  // Idle timer + wake handling. Pointer/wheel activity only *resets* the idle
  // timer while awake; once asleep it is ignored. A key press is the only thing
  // that wakes it.
  useEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }
    let timer = window.setTimeout(() => setActive(true), IDLE_MS);
    const rearm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setActive(true), IDLE_MS);
    };
    const onActivity = () => {
      if (activeRef.current) return; // asleep: mouse/wheel must not wake it
      rearm();
    };
    const onKey = () => {
      if (activeRef.current) {
        setActive(false);
        onDeactivateRef.current?.();
      }
      rearm();
    };
    const opts = { passive: true } as const;
    window.addEventListener("pointermove", onActivity, opts);
    window.addEventListener("pointerdown", onActivity, opts);
    window.addEventListener("wheel", onActivity, opts);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("wheel", onActivity);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled]);

  // Mystify animation while active (only when that mode is chosen).
  useEffect(() => {
    if (!active || mode !== "mystify") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const W = () => canvas.width;
    const H = () => canvas.height;
    const NEON = ["#ff3ea5", "#3a6bff", "#c6ff2e"];
    const VERTS = 4;
    const TRAILS = 12;

    type Pt = { x: number; y: number; vx: number; vy: number };
    const makeShape = () =>
      Array.from({ length: VERTS }, () => ({
        x: Math.random() * W(),
        y: Math.random() * H(),
        vx: (Math.random() * 2 - 1) * 2.4 * dpr,
        vy: (Math.random() * 2 - 1) * 2.4 * dpr,
      }));
    const shapes: Pt[][] = NEON.map(makeShape);
    const history: Pt[][][] = shapes.map(() => []);

    const step = (pts: Pt[]) => {
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W()) p.vx *= -1;
        if (p.y < 0 || p.y > H()) p.vy *= -1;
        p.x = Math.max(0, Math.min(W(), p.x));
        p.y = Math.max(0, Math.min(H(), p.y));
      }
    };

    const draw = (pts: Pt[], color: string, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2 * dpr;
      ctx.shadowBlur = 12 * dpr;
      ctx.shadowColor = color;
      ctx.stroke();
    };

    const reduced = prefersReducedMotion();
    let raf = 0;
    const frame = () => {
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W(), H());
      shapes.forEach((pts, i) => {
        step(pts);
        const snap = pts.map((p) => ({ ...p }));
        history[i].push(snap);
        if (history[i].length > TRAILS) history[i].shift();
        history[i].forEach((h, t) => draw(h, NEON[i], (t + 1) / history[i].length));
      });
      if (!reduced) raf = window.requestAnimationFrame(frame);
    };
    // One frame for reduced motion (a still trail), otherwise animate.
    if (reduced) {
      for (let i = 0; i < TRAILS; i++) {
        shapes.forEach((pts) => step(pts));
      }
      shapes.forEach((pts, i) => {
        for (let t = 0; t < TRAILS; t++) history[i].push(pts.map((p) => ({ ...p })));
      });
      frame();
    } else {
      raf = window.requestAnimationFrame(frame);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, mode]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[11000] overflow-hidden"
      style={{ background: "#000" }}
      data-os-screensaver=""
      aria-hidden="true"
    >
      {mode === "mystify" ? (
        <canvas ref={canvasRef} className="block h-full w-full" />
      ) : (
        // pointerEvents:none keeps the sandboxed iframe from taking focus, so
        // the parent window still receives the wake keypress.
        <ElementsBackground variant={mode} className="absolute inset-0" style={{ pointerEvents: "none" }} />
      )}
      <p
        className="font-mono absolute inset-x-0 bottom-8 text-center text-[13px]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Press any key to wake…
      </p>
    </div>
  );
}

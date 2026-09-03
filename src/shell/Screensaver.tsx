import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../motion/duration";

const IDLE_MS = 60_000;

/**
 * Idle screensaver — pure Tier-3 atmosphere. A classic "Mystify" neon polyline
 * bounce on black, woken by any pointer/key. Never interrupts a working visitor
 * (60s idle) and never blocks content behind it beyond a keypress. Reduced
 * motion shows a still frame instead of animating. Not part of the WM core.
 */
export function Screensaver({ enabled }: { enabled: boolean }) {
  const [active, setActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Idle timer: reset on any input; fire when quiet for IDLE_MS.
  useEffect(() => {
    if (!enabled) {
      setActive(false);
      return;
    }
    let timer = window.setTimeout(() => setActive(true), IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      setActive((a) => (a ? false : a));
      timer = window.setTimeout(() => setActive(true), IDLE_MS);
    };
    const opts = { passive: true } as const;
    window.addEventListener("pointermove", reset, opts);
    window.addEventListener("pointerdown", reset, opts);
    window.addEventListener("keydown", reset);
    window.addEventListener("wheel", reset, opts);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", reset);
      window.removeEventListener("pointerdown", reset);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("wheel", reset);
    };
  }, [enabled]);

  // Mystify animation while active.
  useEffect(() => {
    if (!active) return;
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
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[11000] bg-black"
      data-os-screensaver=""
      aria-hidden="true"
      onPointerDown={() => setActive(false)}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      <p
        className="font-mono absolute inset-x-0 bottom-8 text-center text-[13px]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Move the mouse or press a key to wake…
      </p>
    </div>
  );
}

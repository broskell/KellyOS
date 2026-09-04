import { useEffect, useRef, useState } from "react";
import { WindowFrame } from "../chrome/WindowFrame";
import { useWallpaper } from "../shell/wallpaperStore";

/**
 * Paint — a tiny retro drawing app. Classic VGA palette, a few brush sizes, an
 * eraser, clear, and "Set as wallpaper" (hands the canvas to the wallpaper store
 * as an image). Pure client-side; nothing leaves the device.
 */
const PALETTE = [
  "#000000", "#808080", "#800000", "#ff0000", "#808000", "#ffff00", "#008000", "#00ff00",
  "#008080", "#00ffff", "#000080", "#0000ff", "#800080", "#ff00ff", "#c0c0c0", "#ffffff",
];
const SIZES = [2, 4, 8, 16];

export default function PaintWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState("#000080");
  const [size, setSize] = useState(4);
  const [erase, setErase] = useState(false);
  const setWallpaper = useWallpaper((s) => s.setWallpaper);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    // Refit the canvas to its container (e.g. on maximize / mobile), preserving
    // the existing drawing at its top-left origin so nothing is lost.
    const refit = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w < 1 || h < 1) return;
      const nextW = Math.max(1, Math.floor(w * dpr));
      const nextH = Math.max(1, Math.floor(h * dpr));
      if (canvas.width === nextW && canvas.height === nextH) return;

      const snap = document.createElement("canvas");
      snap.width = canvas.width;
      snap.height = canvas.height;
      snap.getContext("2d")?.drawImage(canvas, 0, 0);

      canvas.width = nextW;
      canvas.height = nextH;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, nextW, nextH);
      ctx.drawImage(snap, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };

    refit();
    const ro = new ResizeObserver(() => refit());
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const ctx = () => canvasRef.current?.getContext("2d") ?? null;

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ctx();
    if (!c) return;
    drawing.current = true;
    c.strokeStyle = erase ? "#ffffff" : color;
    c.lineWidth = erase ? size * 2 : size;
    c.beginPath();
    c.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvasRef.current?.setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const c = ctx();
    if (!c) return;
    c.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    c.stroke();
  };
  const end = () => {
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const c = ctx();
    if (!canvas || !c) return;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#ffffff";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();
  };

  const asWallpaper = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (url) setWallpaper({ kind: "image", value: url });
  };

  const download = () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "kelly-os-paint.png";
    a.click();
  };

  return (
    <WindowFrame title="Paint" status="Untitled — Paint" className="h-full min-h-0 w-full">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--kellos-bevel-shadow)] p-1">
          <div className="os-sunken grid grid-cols-8 gap-[2px] p-1" role="group" aria-label="Colours">
            {PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Colour ${c}`}
                onClick={() => {
                  setColor(c);
                  setErase(false);
                }}
                style={{
                  width: 16,
                  height: 16,
                  background: c,
                  outline: color === c && !erase ? "2px solid var(--kellos-focus)" : "1px solid #0004",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-1" role="group" aria-label="Brush size">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className="os-btn os-raised"
                data-pressed={size === s}
                aria-pressed={size === s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" className="os-btn os-raised" data-pressed={erase} aria-pressed={erase} onClick={() => setErase((v) => !v)}>
            Eraser
          </button>
          <button type="button" className="os-btn os-raised" onClick={clear}>
            Clear
          </button>
          <button type="button" className="os-btn os-raised" onClick={asWallpaper}>
            Set as wallpaper
          </button>
          <button type="button" className="os-btn os-raised" onClick={download}>
            Save PNG
          </button>
        </div>
        <div className="os-sunken relative min-h-0 flex-1 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="block touch-none"
            style={{ cursor: "crosshair" }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        </div>
      </div>
    </WindowFrame>
  );
}

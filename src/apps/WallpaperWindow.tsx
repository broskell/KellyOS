import { WindowFrame } from "../chrome/WindowFrame";
import { useWallpaper, wallpaperBackground, type Wallpaper } from "../shell/wallpaperStore";

/**
 * Display Properties — a retro wallpaper picker. Solid classic colours and a few
 * CSS patterns, plus whatever the visitor painted in Paint (saved as an image
 * wallpaper). Preference is per-visitor (localStorage). "Default" defers to the
 * era tint.
 */
const COLORS: { label: string; value: string }[] = [
  { label: "Teal", value: "#008080" },
  { label: "Navy", value: "#000080" },
  { label: "Maroon", value: "#800000" },
  { label: "Olive", value: "#5a5a2a" },
  { label: "Purple", value: "#400080" },
  { label: "Silver", value: "#9a9a9a" },
  { label: "Black", value: "#101010" },
  { label: "Hot Dog Stand", value: "#ff0000" },
];

const PATTERNS: { label: string; value: string }[] = [
  {
    label: "Dots",
    value: "radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px) 0 0 / 10px 10px, #2f5d5d",
  },
  {
    label: "Diagonal",
    value: "repeating-linear-gradient(45deg, #2f4a6a 0 8px, #38567a 8px 16px)",
  },
  {
    label: "Checker",
    value:
      "repeating-conic-gradient(#5a4a6a 0% 25%, #4a3a5a 0% 50%) 0 0 / 20px 20px",
  },
  {
    label: "Weave",
    value:
      "repeating-linear-gradient(90deg, #3a5a4a 0 6px, #33513f 6px 12px), repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0 6px, transparent 6px 12px)",
  },
];

function Swatch({
  label,
  bg,
  active,
  onClick,
}: {
  label: string;
  bg: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="os-btn os-raised flex flex-col items-center gap-1 p-1"
      data-pressed={active}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className="os-sunken block h-12 w-full" style={{ background: bg }} aria-hidden="true" />
      <span className="font-chrome text-[11px]">{label}</span>
    </button>
  );
}

export default function WallpaperWindow() {
  const wallpaper = useWallpaper((s) => s.wallpaper);
  const setWallpaper = useWallpaper((s) => s.setWallpaper);
  const matches = (w: Wallpaper) =>
    wallpaper.kind === w.kind && (w.kind === "default" || wallpaperBackground(wallpaper) === wallpaperBackground(w));

  return (
    <WindowFrame title="Display Properties" status="Wallpaper — per visitor" className="h-full min-h-0 w-full">
      <div className="space-y-4 overflow-auto p-3">
        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">Background</h2>
          <p className="font-chrome text-muted mt-1 m-0">
            Pick a wallpaper. It’s saved on this device only. “Default” follows the version era.
          </p>
        </section>

        <div className="grid grid-cols-4 gap-2">
          <Swatch
            label="Default"
            bg="repeating-conic-gradient(#008080 0% 25%, #007373 0% 50%) 0 0 / 6px 6px"
            active={matches({ kind: "default" })}
            onClick={() => setWallpaper({ kind: "default" })}
          />
          {COLORS.map((c) => (
            <Swatch
              key={c.value}
              label={c.label}
              bg={c.value}
              active={matches({ kind: "color", value: c.value })}
              onClick={() => setWallpaper({ kind: "color", value: c.value })}
            />
          ))}
        </div>

        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">Patterns</h2>
        </section>
        <div className="grid grid-cols-4 gap-2">
          {PATTERNS.map((p) => (
            <Swatch
              key={p.label}
              label={p.label}
              bg={p.value}
              active={matches({ kind: "pattern", value: p.value })}
              onClick={() => setWallpaper({ kind: "pattern", value: p.value })}
            />
          ))}
        </div>

        {wallpaper.kind === "image" ? (
          <p className="font-chrome m-0">
            Current wallpaper is your Paint drawing.{" "}
            <button type="button" className="os-btn os-raised" onClick={() => setWallpaper({ kind: "default" })}>
              Reset to default
            </button>
          </p>
        ) : (
          <p className="font-chrome text-muted m-0">
            Tip: open <strong>Paint</strong> and choose “Set as wallpaper” to use your own drawing.
          </p>
        )}
      </div>
    </WindowFrame>
  );
}

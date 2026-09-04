import { create } from "zustand";

/**
 * Desktop wallpaper — a per-visitor preference (localStorage), applied to the
 * desktop root. "default" defers to the Phase 17 era tint; anything else
 * overrides it. Paint can hand a drawing straight in as an image wallpaper.
 */
export type Wallpaper =
  | { kind: "default" }
  | { kind: "color"; value: string }
  | { kind: "pattern"; value: string } // value = full CSS background
  | { kind: "image"; value: string }; // value = data URL

const KEY = "kellos-wallpaper";

function load(): Wallpaper {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { kind: "default" };
    const w = JSON.parse(raw) as Wallpaper;
    if (w && typeof (w as { kind?: unknown }).kind === "string") return w;
  } catch {
    /* private mode / blocked storage → default */
  }
  return { kind: "default" };
}

interface WallpaperState {
  wallpaper: Wallpaper;
  setWallpaper: (w: Wallpaper) => void;
}

export const useWallpaper = create<WallpaperState>((set) => ({
  wallpaper: typeof window !== "undefined" ? load() : { kind: "default" },
  setWallpaper: (w) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(w));
    } catch {
      /* ignore */
    }
    set({ wallpaper: w });
  },
}));

/** CSS `background` shorthand for a wallpaper, or undefined to defer to the era tint. */
export function wallpaperBackground(w: Wallpaper): string | undefined {
  switch (w.kind) {
    case "color":
      return w.value;
    case "pattern":
      return w.value;
    case "image":
      return `center / cover no-repeat url("${w.value}")`;
    default:
      return undefined;
  }
}

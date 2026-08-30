/**
 * Headless window manager. Pure: no React, no DOM, no GSAP.
 * Numbers match frozen tokens in tokens.css — do not import CSS here.
 */

export const WINDOW_Z_BASE = 100; // --kellos-z-window-base
export const WINDOW_MIN_W = 280; // --kellos-window-min-w
export const WINDOW_MIN_H = 160; // --kellos-window-min-h
export const ICON_COLUMN = 96;
export const WORKSPACE_PAD = 8;
export const WINDOW_GAP = 16;
/** Discrete keyboard nudge — not a per-frame drag. */
export const KEYBOARD_NUDGE = 16;

export type WindowId = string;
export type WindowMode = "normal" | "minimized" | "maximized";
export type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export type Rect = { x: number; y: number; w: number; h: number };
export type Size = { w: number; h: number };

export type WindowKind = "app" | "document" | "tip";

export type WmWindow = {
  id: WindowId;
  appId: string;
  title: string;
  route: string;
  kind: WindowKind;
  rect: Rect;
  restoreRect: Rect;
  mode: WindowMode;
};

export type WmState = {
  windows: WmWindow[];
  /** back → front */
  order: WindowId[];
  focusedId: WindowId | null;
};

export type WindowSpec = {
  id: WindowId;
  appId: string;
  title: string;
  route: string;
  kind: WindowKind;
  preferred?: Size;
};

export function emptyState(): WmState {
  return { windows: [], order: [], focusedId: null };
}

export function zIndexFor(state: WmState, id: WindowId): number {
  const i = state.order.indexOf(id);
  if (i < 0) return WINDOW_Z_BASE;
  return WINDOW_Z_BASE + i;
}

export function getWindow(state: WmState, id: WindowId): WmWindow | undefined {
  return state.windows.find((w) => w.id === id);
}

export function visibleWindows(state: WmState): WmWindow[] {
  return state.windows.filter((w) => w.mode !== "minimized");
}

export function taskWindows(state: WmState): WmWindow[] {
  return state.windows.filter((w) => w.kind !== "tip");
}

export function clampRect(rect: Rect, workspace: Size, minW = WINDOW_MIN_W, minH = WINDOW_MIN_H): Rect {
  const w = Math.min(Math.max(minW, rect.w), Math.max(minW, workspace.w));
  const h = Math.min(Math.max(minH, rect.h), Math.max(minH, workspace.h));
  const maxX = Math.max(0, workspace.w - w);
  const maxY = Math.max(0, workspace.h - h);
  return {
    x: Math.min(Math.max(0, rect.x), maxX),
    y: Math.min(Math.max(0, rect.y), maxY),
    w,
    h,
  };
}

export function maximizedRect(workspace: Size): Rect {
  return {
    x: 0,
    y: 0,
    w: Math.max(WINDOW_MIN_W, workspace.w),
    h: Math.max(WINDOW_MIN_H, workspace.h),
  };
}

export function defaultSizeFor(kind: WindowKind, workspace: Size): Size {
  if (kind === "tip") return { w: 320, h: 260 };
  if (kind === "document") {
    return {
      w: Math.min(920, Math.max(WINDOW_MIN_W, workspace.w - ICON_COLUMN - WORKSPACE_PAD)),
      h: Math.max(WINDOW_MIN_H, workspace.h - WORKSPACE_PAD * 2),
    };
  }
  return {
    w: Math.min(640, Math.max(WINDOW_MIN_W, workspace.w - ICON_COLUMN - 32)),
    h: Math.min(520, Math.max(WINDOW_MIN_H, workspace.h - 32)),
  };
}

export function defaultRectFor(spec: WindowSpec, workspace: Size, existing: readonly WmWindow[]): Rect {
  const size = spec.preferred ?? defaultSizeFor(spec.kind, workspace);
  if (spec.kind === "tip") {
    const about = existing.find((w) => w.appId === "about" && w.mode !== "minimized");
    if (about) {
      const live = about.mode === "maximized" ? maximizedRect(workspace) : about.rect;
      return clampRect(
        { x: live.x + live.w + WINDOW_GAP, y: live.y, w: size.w, h: size.h },
        workspace,
      );
    }
  }
  if (spec.appId === "about") {
    const tipReserve = 320 + WINDOW_GAP + WORKSPACE_PAD;
    const w = Math.min(size.w, Math.max(WINDOW_MIN_W, workspace.w - ICON_COLUMN - tipReserve));
    const cascade = existing.filter((w) => w.kind !== "tip").length;
    const x = ICON_COLUMN + cascade * 24;
    const y = WORKSPACE_PAD + cascade * 24;
    return clampRect({ x, y, w, h: size.h }, workspace);
  }
  const cascade = existing.filter((w) => w.kind !== "tip").length;
  const x = ICON_COLUMN + cascade * 24;
  const y = WORKSPACE_PAD + cascade * 24;
  return clampRect({ x, y, w: size.w, h: size.h }, workspace);
}

export function dragRect(start: Rect, dx: number, dy: number, workspace: Size): Rect {
  return clampRect({ ...start, x: start.x + dx, y: start.y + dy }, workspace);
}

export function resizeRect(
  start: Rect,
  edge: ResizeEdge,
  dx: number,
  dy: number,
  workspace: Size,
): Rect {
  let { x, y, w, h } = start;
  if (edge.includes("e")) w = start.w + dx;
  if (edge.includes("s")) h = start.h + dy;
  if (edge.includes("w")) {
    w = start.w - dx;
    x = start.x + dx;
  }
  if (edge.includes("n")) {
    h = start.h - dy;
    y = start.y + dy;
  }
  if (w < WINDOW_MIN_W) {
    if (edge.includes("w")) x = start.x + start.w - WINDOW_MIN_W;
    w = WINDOW_MIN_W;
  }
  if (h < WINDOW_MIN_H) {
    if (edge.includes("n")) y = start.y + start.h - WINDOW_MIN_H;
    h = WINDOW_MIN_H;
  }
  return clampRect({ x, y, w, h }, workspace);
}

function replaceWindow(state: WmState, next: WmWindow): WmState {
  return {
    ...state,
    windows: state.windows.map((w) => (w.id === next.id ? next : w)),
  };
}

function bringToFront(state: WmState, id: WindowId): WmState {
  if (!state.windows.some((w) => w.id === id)) return state;
  return {
    ...state,
    order: [...state.order.filter((x) => x !== id), id],
    focusedId: id,
  };
}

export function focusWindow(state: WmState, id: WindowId): WmState {
  const win = getWindow(state, id);
  if (!win) return state;
  if (win.mode === "minimized") {
    return bringToFront(replaceWindow(state, { ...win, mode: "normal" }), id);
  }
  return bringToFront(state, id);
}

export function openWindow(
  state: WmState,
  spec: WindowSpec,
  workspace: Size,
  opts?: { focus?: boolean },
): WmState {
  const shouldFocus = opts?.focus !== false;
  const existing = getWindow(state, spec.id);
  if (existing) return shouldFocus ? focusWindow(state, spec.id) : state;
  const rect = defaultRectFor(spec, workspace, state.windows);
  const win: WmWindow = {
    id: spec.id,
    appId: spec.appId,
    title: spec.title,
    route: spec.route,
    kind: spec.kind,
    rect,
    restoreRect: rect,
    mode: "normal",
  };
  const next: WmState = {
    ...state,
    windows: [...state.windows, win],
    order: [...state.order, spec.id],
  };
  if (!shouldFocus) {
    return { ...next, focusedId: state.focusedId ?? spec.id };
  }
  return bringToFront(next, spec.id);
}

export function closeWindow(state: WmState, id: WindowId): WmState {
  const windows = state.windows.filter((w) => w.id !== id);
  const order = state.order.filter((x) => x !== id);
  const focusedId =
    state.focusedId === id ? (order.length ? order[order.length - 1]! : null) : state.focusedId;
  return { windows, order, focusedId };
}

export function minimizeWindow(state: WmState, id: WindowId): WmState {
  const win = getWindow(state, id);
  if (!win || win.kind === "tip") return state;
  const next = replaceWindow(state, { ...win, mode: "minimized" });
  const remaining = next.order.filter((x) => x !== id && getWindow(next, x)?.mode !== "minimized");
  const focusedId = remaining.length ? remaining[remaining.length - 1]! : null;
  return { ...next, focusedId };
}

export function toggleMaximize(state: WmState, id: WindowId, workspace: Size): WmState {
  const win = getWindow(state, id);
  if (!win || win.kind === "tip") return state;
  if (win.mode === "minimized") return focusWindow(state, id);
  if (win.mode === "maximized") {
    return bringToFront(
      replaceWindow(state, {
        ...win,
        mode: "normal",
        rect: clampRect(win.restoreRect, workspace),
      }),
      id,
    );
  }
  return bringToFront(
    replaceWindow(state, {
      ...win,
      mode: "maximized",
      restoreRect: win.rect,
      rect: maximizedRect(workspace),
    }),
    id,
  );
}

export function commitRect(state: WmState, id: WindowId, rect: Rect, workspace: Size): WmState {
  const win = getWindow(state, id);
  if (!win) return state;
  const next = clampRect(rect, workspace);
  return replaceWindow(state, {
    ...win,
    mode: "normal",
    rect: next,
    restoreRect: next,
  });
}

export function beginDragFromMaximized(state: WmState, id: WindowId, workspace: Size): WmState {
  const win = getWindow(state, id);
  if (!win || win.mode !== "maximized") return focusWindow(state, id);
  return bringToFront(
    replaceWindow(state, {
      ...win,
      mode: "normal",
      rect: clampRect(win.restoreRect, workspace),
    }),
    id,
  );
}

export function reclampAll(state: WmState, workspace: Size): WmState {
  return {
    ...state,
    windows: state.windows.map((w) => {
      const rect = w.mode === "maximized" ? maximizedRect(workspace) : clampRect(w.rect, workspace);
      return { ...w, rect, restoreRect: clampRect(w.restoreRect, workspace) };
    }),
  };
}

export function focusedRoute(state: WmState): string | null {
  if (!state.focusedId) return null;
  const win = getWindow(state, state.focusedId);
  if (!win || win.kind === "tip") return null;
  return win.route;
}

export function nudgeWindow(
  state: WmState,
  id: WindowId,
  dx: number,
  dy: number,
  workspace: Size,
): WmState {
  const win = getWindow(state, id);
  if (!win || win.kind === "tip" || win.mode !== "normal") return state;
  return commitRect(state, id, dragRect(win.rect, dx, dy, workspace), workspace);
}

export function cycleTaskFocus(state: WmState, dir: 1 | -1): WmState {
  const tasks = taskWindows(state);
  if (tasks.length === 0) return state;
  const ids = state.order.filter((id) => tasks.some((t) => t.id === id));
  if (ids.length === 0) return state;
  const current =
    state.focusedId && ids.includes(state.focusedId) ? state.focusedId : ids[ids.length - 1]!;
  const i = ids.indexOf(current);
  const next = ids[(i + dir + ids.length) % ids.length]!;
  return focusWindow(state, next);
}

import { create } from "zustand";
import {
  beginDragFromMaximized,
  closeWindow,
  commitRect,
  cycleTaskFocus,
  emptyState,
  focusWindow,
  focusedRoute,
  getWindow,
  minimizeWindow,
  nudgeWindow,
  openWindow,
  reclampAll,
  toggleMaximize,
  type Rect,
  type Size,
  type WindowSpec,
  type WmState,
} from "./core";
import { specForPath } from "./specs";

type WmStore = {
  wm: WmState;
  workspace: Size;
  setWorkspace: (size: Size) => void;
  ensureRoute: (pathname: string) => void;
  open: (spec: WindowSpec, opts?: { focus?: boolean }) => void;
  close: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focus: (id: string) => void;
  commitRect: (id: string, rect: Rect) => void;
  prepareDrag: (id: string) => Rect | null;
  nudge: (id: string, dx: number, dy: number) => void;
  cycleTask: (dir: 1 | -1) => void;
};

export const useWmStore = create<WmStore>((set, get) => ({
  wm: emptyState(),
  workspace: { w: 0, h: 0 },

  setWorkspace: (size) => {
    const prev = get().workspace;
    if (prev.w === size.w && prev.h === size.h) return;
    set((s) => ({
      workspace: size,
      wm: reclampAll(s.wm, size),
    }));
  },

  ensureRoute: (pathname) => {
    const spec = specForPath(pathname);
    const workspace = get().workspace;
    if (!spec) return;
    set((s) => ({ wm: openWindow(s.wm, spec, workspace) }));
  },

  open: (spec, opts) => {
    set((s) => ({ wm: openWindow(s.wm, spec, s.workspace, opts) }));
  },

  close: (id) => {
    set((s) => ({ wm: closeWindow(s.wm, id) }));
  },

  minimize: (id) => {
    set((s) => ({ wm: minimizeWindow(s.wm, id) }));
  },

  toggleMaximize: (id) => {
    set((s) => ({ wm: toggleMaximize(s.wm, id, s.workspace) }));
  },

  focus: (id) => {
    set((s) => ({ wm: focusWindow(s.wm, id) }));
  },

  commitRect: (id, rect) => {
    set((s) => ({ wm: commitRect(s.wm, id, rect, s.workspace) }));
  },

  prepareDrag: (id) => {
    const { wm, workspace } = get();
    const before = getWindow(wm, id);
    if (!before) return null;
    const next = beginDragFromMaximized(wm, id, workspace);
    set({ wm: next });
    return getWindow(next, id)?.rect ?? null;
  },

  nudge: (id, dx, dy) => {
    set((s) => ({ wm: nudgeWindow(s.wm, id, dx, dy, s.workspace) }));
  },

  cycleTask: (dir) => {
    set((s) => ({ wm: cycleTaskFocus(s.wm, dir) }));
  },
}));

export { focusedRoute, getWindow };

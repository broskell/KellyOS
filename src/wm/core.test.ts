import { describe, expect, it } from "vitest";
import {
  WINDOW_MIN_H,
  WINDOW_MIN_W,
  WINDOW_Z_BASE,
  beginDragFromMaximized,
  closeWindow,
  commitRect,
  cycleTaskFocus,
  defaultRectFor,
  dragRect,
  emptyState,
  focusWindow,
  focusedRoute,
  minimizeWindow,
  nudgeWindow,
  openWindow,
  resizeRect,
  toggleMaximize,
  zIndexFor,
  type WindowSpec,
} from "./core";

const desk: { w: number; h: number } = { w: 1280, h: 720 };

const about: WindowSpec = {
  id: "about",
  appId: "about",
  title: "About Me",
  route: "/about",
  kind: "app",
};

const projects: WindowSpec = {
  id: "projects",
  appId: "projects",
  title: "Projects",
  route: "/projects",
  kind: "app",
};

const tip: WindowSpec = {
  id: "tip",
  appId: "help",
  title: "Getting around",
  route: "/",
  kind: "tip",
};

const caseStudy: WindowSpec = {
  id: "case:langchain-openrouter-provider",
  appId: "caseStudy",
  title: "Case Study",
  route: "/project/langchain-openrouter-provider",
  kind: "document",
};

describe("headless WM", () => {
  it("opens, focuses, and stacks z-index from the token base", () => {
    let s = openWindow(emptyState(), about, desk);
    s = openWindow(s, projects, desk);
    expect(s.focusedId).toBe("projects");
    expect(zIndexFor(s, "about")).toBe(WINDOW_Z_BASE);
    expect(zIndexFor(s, "projects")).toBe(WINDOW_Z_BASE + 1);
    s = focusWindow(s, "about");
    expect(zIndexFor(s, "about")).toBe(WINDOW_Z_BASE + 1);
    expect(zIndexFor(s, "projects")).toBe(WINDOW_Z_BASE);
  });

  it("does not reset rect when reopening an existing id", () => {
    let s = openWindow(emptyState(), about, desk);
    const moved = { ...s.windows[0]!.rect, x: 200, y: 40 };
    s = commitRect(s, "about", moved, desk);
    s = openWindow(s, about, desk);
    expect(s.windows).toHaveLength(1);
    expect(s.windows[0]!.rect.x).toBe(200);
  });

  it("closes and focuses the next front window", () => {
    let s = openWindow(emptyState(), about, desk);
    s = openWindow(s, projects, desk);
    s = closeWindow(s, "projects");
    expect(s.focusedId).toBe("about");
    expect(focusedRoute(s)).toBe("/about");
  });

  it("minimizes without destroying, then restore via focus", () => {
    let s = openWindow(emptyState(), about, desk);
    s = openWindow(s, projects, desk);
    s = minimizeWindow(s, "projects");
    expect(s.windows.find((w) => w.id === "projects")?.mode).toBe("minimized");
    expect(s.focusedId).toBe("about");
    s = focusWindow(s, "projects");
    expect(s.windows.find((w) => w.id === "projects")?.mode).toBe("normal");
  });

  it("maximize fills the workspace and restore returns the previous rect", () => {
    let s = openWindow(emptyState(), about, desk);
    const before = s.windows[0]!.rect;
    s = toggleMaximize(s, "about", desk);
    expect(s.windows[0]!.mode).toBe("maximized");
    expect(s.windows[0]!.rect).toEqual({ x: 0, y: 0, w: desk.w, h: desk.h });
    s = toggleMaximize(s, "about", desk);
    expect(s.windows[0]!.mode).toBe("normal");
    expect(s.windows[0]!.rect).toEqual(before);
  });

  it("can open the tip without stealing focus from About", () => {
    let s = openWindow(emptyState(), about, desk);
    s = openWindow(s, tip, desk, { focus: false });
    expect(s.focusedId).toBe("about");
    expect(s.windows).toHaveLength(2);
  });

  it("places the tip to the right of About, not over it", () => {
    const s0 = openWindow(emptyState(), about, desk);
    const aboutRect = s0.windows[0]!.rect;
    const tipRect = defaultRectFor(tip, desk, s0.windows);
    expect(tipRect.x).toBeGreaterThanOrEqual(aboutRect.x + aboutRect.w);
  });

  it("document default uses most of the workspace so a CV deep link is readable", () => {
    const r = defaultRectFor(caseStudy, desk, []);
    expect(r.w).toBeGreaterThan(700);
    expect(r.h).toBeGreaterThan(600);
  });

  it("drag and resize are pure and respect min size", () => {
    const start = { x: 100, y: 40, w: 400, h: 300 };
    const moved = dragRect(start, 50, -10, desk);
    expect(moved.x).toBe(150);
    expect(moved.y).toBe(30);
    const tiny = resizeRect(start, "se", -400, -400, desk);
    expect(tiny.w).toBe(WINDOW_MIN_W);
    expect(tiny.h).toBe(WINDOW_MIN_H);
    const west = resizeRect(start, "w", 50, 0, desk);
    expect(west.w).toBe(350);
    expect(west.x).toBe(150);
  });

  it("dragging a maximized window restores then can move", () => {
    let s = openWindow(emptyState(), about, desk);
    s = toggleMaximize(s, "about", desk);
    s = beginDragFromMaximized(s, "about", desk);
    expect(s.windows[0]!.mode).toBe("normal");
  });

  it("tip cannot minimize or maximize", () => {
    let s = openWindow(emptyState(), about, desk);
    s = openWindow(s, tip, desk);
    s = minimizeWindow(s, "tip");
    expect(s.windows.find((w) => w.id === "tip")?.mode).toBe("normal");
    s = toggleMaximize(s, "tip", desk);
    expect(s.windows.find((w) => w.id === "tip")?.mode).toBe("normal");
  });

  it("nudges a normal window and ignores tip and maximized", () => {
    let s = openWindow(emptyState(), about, desk);
    const x = s.windows[0]!.rect.x;
    s = nudgeWindow(s, "about", 16, 0, desk);
    expect(s.windows[0]!.rect.x).toBe(x + 16);
    s = openWindow(s, tip, desk, { focus: false });
    const tipX = s.windows.find((w) => w.id === "tip")!.rect.x;
    s = nudgeWindow(s, "tip", 16, 0, desk);
    expect(s.windows.find((w) => w.id === "tip")!.rect.x).toBe(tipX);
    s = toggleMaximize(s, "about", desk);
    const maxX = s.windows.find((w) => w.id === "about")!.rect.x;
    s = nudgeWindow(s, "about", 16, 0, desk);
    expect(s.windows.find((w) => w.id === "about")!.rect.x).toBe(maxX);
  });

  it("cycles task focus and skips the tip", () => {
    let s = openWindow(emptyState(), about, desk);
    s = openWindow(s, projects, desk);
    s = openWindow(s, tip, desk, { focus: false });
    expect(s.focusedId).toBe("projects");
    s = cycleTaskFocus(s, 1);
    expect(s.focusedId).toBe("about");
    s = cycleTaskFocus(s, 1);
    expect(s.focusedId).toBe("projects");
  });
});

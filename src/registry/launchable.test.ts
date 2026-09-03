import { describe, expect, it } from "vitest";
import {
  APP_REGISTRY,
  appsLaunchableOn,
  isVisitorLaunchable,
} from "./manifest";

const searchOverlay = "search";
// Command windows now appear on Start (owner directive), but stay off desktop/mobile.
const commandWindows = ["terminal", "settings", "osUpdate", "kellai"] as const;

describe("honest visitor chrome", () => {
  it("keeps the Search overlay (empty route) off every launcher surface", () => {
    const app = APP_REGISTRY.find((a) => a.id === searchOverlay)!;
    expect(app.route).toBe("");
    expect(isVisitorLaunchable(app)).toBe(false);
    expect(app.surfaces.startMenu).toBe(false);
    expect(app.surfaces.desktopIcon).toBe(false);
    expect(app.surfaces.mobileGrid).toBe(false);
  });

  it("lists command windows on Start now, but keeps them off desktop and mobile", () => {
    for (const id of commandWindows) {
      const app = APP_REGISTRY.find((a) => a.id === id)!;
      expect(app.route, id).not.toBe("");
      expect(isVisitorLaunchable(app), id).toBe(true);
      expect(app.surfaces.startMenu, id).toBe(true);
      expect(app.surfaces.desktopIcon, id).toBe(false);
      expect(app.surfaces.mobileGrid, id).toBe(false);
    }
  });

  it("lists only apps that actually open on every launcher surface", () => {
    for (const surface of ["startMenu", "desktopIcon", "mobileGrid"] as const) {
      const listed = appsLaunchableOn(surface);
      expect(listed.length).toBeGreaterThan(0);
      for (const app of listed) {
        expect(isVisitorLaunchable(app), app.id).toBe(true);
        expect(app.id).not.toBe(searchOverlay);
      }
    }
    const startTitles = appsLaunchableOn("startMenu").map((a) => a.title);
    expect(startTitles).toContain("Reader Mode");
    expect(startTitles).toContain("Projects");
    expect(startTitles).toContain("Terminal");
    expect(startTitles).toContain("Kelly.AI");
    expect(startTitles).toContain("Settings");
    expect(startTitles).toContain("OS Update");
    expect(startTitles).not.toContain("Search");

    const deskTitles = appsLaunchableOn("desktopIcon").map((a) => a.title);
    expect(deskTitles).not.toContain("Terminal");
    expect(deskTitles).not.toContain("OS Update");
  });
});

describe("registry window loaders", () => {
  it("lazy-loads bodies for launchable apps including Terminal, Settings, and OS Update", async () => {
    const { APP_WINDOW_LOADERS, CASE_STUDY_LOADER, appWindowLoader } = await import("./loadWindow");
    expect(CASE_STUDY_LOADER).toBeTruthy();
    expect(appWindowLoader("about")).toBeTruthy();
    expect(appWindowLoader("terminal")).toBeTruthy();
    expect(appWindowLoader("settings")).toBeTruthy();
    expect(appWindowLoader("osUpdate")).toBeTruthy();
    expect(appWindowLoader("kellai")).toBeTruthy();
    expect(Object.keys(APP_WINDOW_LOADERS)).not.toContain("search");
    expect(appWindowLoader("reader")).toBeUndefined();
  });
});

import { describe, expect, it } from "vitest";
import {
  APP_REGISTRY,
  appsLaunchableOn,
  isVisitorLaunchable,
} from "./manifest";

const stillEmpty = ["search"] as const;
const commandWindows = ["terminal", "settings", "osUpdate", "kellai"] as const;

describe("honest visitor chrome", () => {
  it("keeps the Search overlay off Start/desktop/mobile", () => {
    for (const id of stillEmpty) {
      const app = APP_REGISTRY.find((a) => a.id === id);
      expect(app, id).toBeTruthy();
      expect(app!.route).toBe("");
      expect(isVisitorLaunchable(app!)).toBe(false);
      expect(app!.surfaces.startMenu).toBe(false);
      expect(app!.surfaces.desktopIcon).toBe(false);
      expect(app!.surfaces.mobileGrid).toBe(false);
    }
  });

  it("gives Terminal, Settings, OS Update, and Kelly.AI routes without listing them on Start/desktop/mobile", () => {
    for (const id of commandWindows) {
      const app = APP_REGISTRY.find((a) => a.id === id);
      expect(app, id).toBeTruthy();
      expect(app!.route).not.toBe("");
      expect(isVisitorLaunchable(app!)).toBe(true);
      expect(app!.surfaces.startMenu).toBe(false);
      expect(app!.surfaces.desktopIcon).toBe(false);
      expect(app!.surfaces.mobileGrid).toBe(false);
    }
  });

  it("lists only apps that actually open on Start, desktop, and mobile grid", () => {
    for (const surface of ["startMenu", "desktopIcon", "mobileGrid"] as const) {
      const listed = appsLaunchableOn(surface);
      expect(listed.length).toBeGreaterThan(0);
      for (const app of listed) {
        expect(isVisitorLaunchable(app), app.id).toBe(true);
        expect(stillEmpty).not.toContain(app.id);
        expect(commandWindows).not.toContain(app.id);
      }
    }
    const startTitles = appsLaunchableOn("startMenu").map((a) => a.title);
    expect(startTitles).toContain("Reader Mode");
    expect(startTitles).toContain("Projects");
    expect(startTitles).not.toContain("Terminal");
    expect(startTitles).not.toContain("Kelly.AI");
    expect(startTitles).not.toContain("Search");
    expect(startTitles).not.toContain("Settings");
    expect(startTitles).not.toContain("OS Update");
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

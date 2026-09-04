import { useEffect } from "react";
import { CrtBackground } from "./crt/CrtBackground";

/**
 * Power screen — Restart replays the boot sequence; Shut Down shows the CRT
 * blue-screen (a Kelly.OS "session ended" fault screen) with a way back on
 * (it's a website). Full-screen overlay, not part of the WM core.
 */
const BOOT_KEY = "kellos-boot-skipped";

function replayBoot() {
  try {
    sessionStorage.removeItem(BOOT_KEY);
    sessionStorage.removeItem("kellos-first-run-dismissed");
  } catch {
    /* ignore */
  }
  window.location.assign("/");
}

export function PowerScreen({ mode }: { mode: "restarting" | "shutdown" }) {
  useEffect(() => {
    if (mode === "restarting") {
      const t = window.setTimeout(replayBoot, 1700);
      return () => window.clearTimeout(t);
    }
    // Shut down: "press any key to power back on".
    const onKey = () => replayBoot();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  if (mode === "restarting") {
    return (
      <div
        className="fixed inset-0 z-[12000] flex flex-col items-center justify-center gap-4"
        style={{ background: "#000" }}
        role="alertdialog"
        aria-label="Restarting Kelly.OS"
      >
        <p className="font-chrome" style={{ color: "#fff", fontSize: 18 }}>
          Please wait while Kelly.OS restarts…
        </p>
        <div className="os-sunken h-4 w-64 overflow-hidden p-[2px]" style={{ borderColor: "#444" }}>
          <div
            className="h-full"
            style={{
              width: "100%",
              background: "repeating-linear-gradient(90deg, #1084d0 0 10px, #000 10px 13px)",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[12000] overflow-hidden"
      style={{ background: "#050a24" }}
      role="alertdialog"
      aria-label="Kelly.OS has shut down"
      data-os-shutdown=""
    >
      <CrtBackground variant="blue-screen" className="pointer-events-none absolute inset-0" />
      <button
        type="button"
        className="os-btn os-raised absolute bottom-10 left-1/2 z-[12010] -translate-x-1/2"
        onClick={replayBoot}
        style={{ fontSize: 13 }}
      >
        ⏻ Turn it back on
      </button>
    </div>
  );
}

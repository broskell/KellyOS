import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { BootOverlay } from "./BootOverlay";
import { DesktopIcons } from "./DesktopIcons";
import { DesktopTips } from "./DesktopTips";
import { EditionUpdateToast } from "./EditionUpdateToast";
import { GuideMascot } from "./GuideMascot";
import { PowerScreen } from "./PowerScreen";
import { Screensaver } from "./Screensaver";
import { SearchPalette } from "./SearchPalette";
import { Taskbar, type PowerAction } from "./Taskbar";
import { UpdateCeremony } from "./UpdateCeremony";
import { UpdateToast } from "./UpdateToast";
import { VersionProvider, useVersion } from "./VersionContext";
import { useWallpaper, wallpaperBackground } from "./wallpaperStore";
import { useCompact } from "./useCompact";
import { useOsKeyboard } from "./useOsKeyboard";
import { Workspace } from "../wm/Workspace";
import { TIP_ID, knownDesktopPath } from "../wm/specs";
import { useWmStore } from "../wm/store";

const BOOT_KEY = "kellos-boot-skipped";
const TIP_KEY = "kellos-first-run-dismissed";

export function DesktopShell() {
  return (
    <VersionProvider>
      <DesktopShellInner />
    </VersionProvider>
  );
}

function DesktopShellInner() {
  const compact = useCompact();
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/about";
  const [boot, setBoot] = useState(false);
  const [tip, setTip] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [power, setPower] = useState<null | "restarting" | "shutdown">(null);
  const [sleeping, setSleeping] = useState(false);
  const ensuredPath = useRef<string | null>(null);
  const ensureRoute = useWmStore((s) => s.ensureRoute);
  const close = useWmStore((s) => s.close);
  const workspace = useWmStore((s) => s.workspace);
  const { ceremony, dismissCeremony, viewing } = useVersion();
  const wallpaper = useWallpaper((s) => s.wallpaper);
  const desktopBg = wallpaperBackground(wallpaper);

  const onPower = useCallback((action: PowerAction) => {
    if (action === "sleep") setSleeping(true);
    else if (action === "restart") setPower("restarting");
    else setPower("shutdown");
  }, []);

  useLayoutEffect(() => {
    const showBoot = isHome && sessionStorage.getItem(BOOT_KEY) !== "1";
    setBoot(showBoot);
    setTip(isHome && sessionStorage.getItem(TIP_KEY) !== "1");
  }, [isHome]);

  const skipBoot = () => {
    sessionStorage.setItem(BOOT_KEY, "1");
    setBoot(false);
  };
  const dismissTip = () => {
    sessionStorage.setItem(TIP_KEY, "1");
    setTip(false);
    close(TIP_ID);
  };

  const onEscapeOverlays = useCallback(() => {
    setSearchOpen(false);
    setStartOpen(false);
  }, []);
  const onToggleSearch = useCallback(() => {
    setStartOpen(false);
    setSearchOpen((v) => !v);
  }, []);
  useOsKeyboard({ compact, onDismissTip: dismissTip, onEscapeOverlays, onToggleSearch });

  const showTip = tip && !compact && isHome && !boot;

  useLayoutEffect(() => {
    if (workspace.w < 2 || workspace.h < 2) return;
    if (ensuredPath.current !== location.pathname) {
      ensuredPath.current = location.pathname;
      ensureRoute(location.pathname);
    }
  }, [location.pathname, workspace.w, workspace.h, ensureRoute]);

  // The first-run guide is now the mascot overlay (below), not a WM window.
  useLayoutEffect(() => {
    close(TIP_ID);
  }, [close]);

  if (!knownDesktopPath(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  const showCeremony = Boolean(ceremony) && !boot;

  return (
    <div
      className="os-desktop flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      data-os-era={viewing}
      style={desktopBg ? { background: desktopBg } : undefined}
    >
      {power ? <PowerScreen mode={power} /> : null}
      {boot ? <BootOverlay onSkip={skipBoot} /> : null}
      {showCeremony && ceremony ? (
        <UpdateCeremony ceremony={ceremony} onClose={dismissCeremony} />
      ) : null}
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        {...(boot || showCeremony ? { inert: true } : {})}
      >
        <div
          className={
            compact ? "relative flex min-h-0 flex-1 flex-col overflow-hidden" : "relative min-h-0 flex-1"
          }
        >
          <DesktopIcons compact={compact} />
          <Workspace compact={compact} onDismissTip={dismissTip} />
          <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
          <DesktopTips enabled={!showTip && isHome && !compact && !searchOpen} />
        </div>
        <Taskbar startOpen={startOpen} setStartOpen={setStartOpen} onPower={onPower} />
      </div>
      {showTip ? <GuideMascot onDismiss={dismissTip} /> : null}
      <UpdateToast />
      <EditionUpdateToast enabled={!boot && !showCeremony} />
      <Screensaver
        enabled={!boot && !showCeremony && !searchOpen}
        forceActive={sleeping}
        onDeactivate={() => setSleeping(false)}
      />
    </div>
  );
}

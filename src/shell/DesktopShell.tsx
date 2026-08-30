import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { BootOverlay } from "./BootOverlay";
import { DesktopIcons } from "./DesktopIcons";
import { SearchPalette } from "./SearchPalette";
import { Taskbar } from "./Taskbar";
import { useCompact } from "./useCompact";
import { useOsKeyboard } from "./useOsKeyboard";
import { Workspace } from "../wm/Workspace";
import { TIP_ID, knownDesktopPath, tipSpec } from "../wm/specs";
import { useWmStore } from "../wm/store";

const BOOT_KEY = "kellos-boot-skipped";
const TIP_KEY = "kellos-first-run-dismissed";

export function DesktopShell() {
  const compact = useCompact();
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "/about";
  const [boot, setBoot] = useState(false);
  const [tip, setTip] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const ensuredPath = useRef<string | null>(null);
  const ensureRoute = useWmStore((s) => s.ensureRoute);
  const open = useWmStore((s) => s.open);
  const close = useWmStore((s) => s.close);
  const workspace = useWmStore((s) => s.workspace);

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

  useLayoutEffect(() => {
    if (workspace.w < 2 || workspace.h < 2) return;
    if (showTip) open(tipSpec(location.pathname), { focus: false });
    else close(TIP_ID);
  }, [showTip, location.pathname, workspace.w, workspace.h, open, close]);

  if (!knownDesktopPath(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="os-desktop flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {boot ? <BootOverlay onSkip={skipBoot} /> : null}
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        {...(boot ? { inert: true } : {})}
      >
        <div
          className={
            compact ? "relative flex min-h-0 flex-1 flex-col overflow-hidden" : "relative min-h-0 flex-1"
          }
        >
          <DesktopIcons compact={compact} />
          <Workspace compact={compact} onDismissTip={dismissTip} />
          <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
        <Taskbar startOpen={startOpen} setStartOpen={setStartOpen} />
      </div>
    </div>
  );
}

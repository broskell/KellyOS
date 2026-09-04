import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dispatch, KeyboardEvent, SetStateAction } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Wordmark } from "../brand/marks";
import { OsButton } from "../chrome/WindowFrame";
import { appsLaunchableOn, readerPathFor } from "../registry/manifest";
import { playMenuIn } from "../motion/play";
import { taskWindows } from "../wm/core";
import { specForPath } from "../wm/specs";
import { useWmStore } from "../wm/store";
import { useVersion } from "./VersionContext";

export type PowerAction = "shutdown" | "restart" | "sleep";

export function Taskbar({
  startOpen,
  setStartOpen,
  onPower,
}: {
  startOpen: boolean;
  setStartOpen: Dispatch<SetStateAction<boolean>>;
  onPower: (action: PowerAction) => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const readTo = readerPathFor(location.pathname);
  const [clock, setClock] = useState("—");
  const wm = useWmStore((s) => s.wm);
  const focus = useWmStore((s) => s.focus);
  const chips = taskWindows(wm);
  const { latest, pendingUpdate, installUpdate } = useVersion();

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
    setClock(fmt());
    const id = window.setInterval(() => setClock(fmt()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="os-taskbar os-raised relative shrink-0">
      <StartMenu open={startOpen} setOpen={setStartOpen} onPower={onPower} />
      <div className="os-task-strip">
        {chips.map((win) => (
          <button
            key={win.id}
            type="button"
            className="os-task os-raised os-btn"
            data-active={wm.focusedId === win.id}
            aria-current={wm.focusedId === win.id ? "true" : undefined}
            onClick={() => {
              focus(win.id);
              if (win.route !== location.pathname) navigate(win.route);
            }}
          >
            {win.title}
          </button>
        ))}
      </div>
      <div className="os-tray os-sunken font-chrome">
        <button
          type="button"
          className="os-tray-version os-btn os-raised inline-flex items-center gap-1"
          aria-label={pendingUpdate ? "Install update" : `Kelly.OS ${latest.replace("v", "")}.0 — OS Update`}
          onClick={() => {
            if (pendingUpdate) {
              installUpdate();
              return;
            }
            navigate("/os-update");
          }}
        >
          {pendingUpdate ? (
            <>
              <span aria-hidden="true" style={{ color: "var(--kellos-title-active-from)" }}>
                ●
              </span>
              Update
            </>
          ) : (
            <>◇ {latest.replace("v", "")}.0</>
          )}
        </button>
        <Link to={readTo} className="os-btn os-raised inline-block no-underline">
          Read
        </Link>
        <span aria-label="Clock">{clock}</span>
      </div>
    </footer>
  );
}

function StartMenu({
  open,
  setOpen,
  onPower,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onPower: (action: PowerAction) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      const t = e.target;
      if (t instanceof Node && document.querySelector("[data-os-start]")?.contains(t)) return;
      setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [open, setOpen]);

  return (
    <div className="relative" data-os-start="">
      <OsButton
        id="os-start-button"
        pressed={open}
        ariaExpanded={open}
        ariaHasPopup="menu"
        ariaControls="os-start-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="os-start inline-flex items-center gap-1">
          <Wordmark size={12} decorative />
          <span>Start</span>
        </span>
      </OsButton>
      {open ? <StartMenuPanel onNavigate={() => setOpen(false)} onPower={onPower} /> : null}
    </div>
  );
}

function StartMenuPanel({
  onNavigate,
  onPower,
}: {
  onNavigate: () => void;
  onPower: (action: PowerAction) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const startApps = appsLaunchableOn("startMenu");
  const openWin = useWmStore((s) => s.open);
  const POWER: { action: PowerAction; label: string; glyph: string }[] = [
    { action: "sleep", label: "Sleep", glyph: "🌙" },
    { action: "restart", label: "Restart", glyph: "🔄" },
    { action: "shutdown", label: "Shut Down…", glyph: "⏻" },
  ];

  useLayoutEffect(() => {
    playMenuIn(ref.current);
    const first = ref.current?.querySelector<HTMLElement>("[role='menuitem']");
    first?.focus();
  }, []);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = [...(ref.current?.querySelectorAll<HTMLElement>("[role='menuitem']") ?? [])];
    if (!items.length) return;
    const i = items.findIndex((el) => el === document.activeElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1 + items.length) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };

  return (
    <div
      ref={ref}
      id="os-start-menu"
      role="menu"
      aria-labelledby="os-start-button"
      className="os-menu os-raised os-start-menu absolute bottom-full left-0 mb-1 flex w-56 flex-col"
      style={{ zIndex: "var(--kellos-z-start)" }}
      onKeyDown={onKeyDown}
    >
      {startApps.map((app) => {
        const to = app.id === "reader" ? (app.readerRoute ?? app.route) : app.route;
        if (!to) return null;
        return (
          <NavLink
            key={app.id}
            role="menuitem"
            to={to}
            onClick={() => {
              const spec = specForPath(app.route);
              if (spec) openWin(spec);
              onNavigate();
            }}
          >
            {app.title}
          </NavLink>
        );
      })}
      <div className="my-1 h-px" style={{ background: "var(--kellos-bevel-shadow)" }} aria-hidden="true" />
      {POWER.map((item) => (
        <button
          key={item.action}
          type="button"
          role="menuitem"
          className="flex items-center gap-2 border-0 bg-transparent text-left"
          onClick={() => {
            onNavigate();
            onPower(item.action);
          }}
        >
          <span aria-hidden="true" className="w-4 text-center">
            {item.glyph}
          </span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

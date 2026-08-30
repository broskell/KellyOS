import { useLayoutEffect, useRef } from "react";
import type { PointerEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { killMotion, playWindowClose, playWindowFocus, playWindowOpen } from "../motion/play";
import { WindowChromeContext } from "./chromeContext";
import type { ResizeEdge, WmWindow } from "./core";
import { focusedRoute, maximizedRect } from "./core";
import {
  activeGestureId,
  applyRectToElement,
  endGestureWith,
  moveGesture,
  startDrag,
  startResize,
} from "./interact";
import { useWmStore } from "./store";
import { TIP_ID, pathAfterClosingWindow } from "./specs";
import { WindowBody } from "./windowContent";

export function ManagedWindow({
  win,
  compact,
  onDismissTip,
}: {
  win: WmWindow;
  compact: boolean;
  onDismissTip: () => void;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const lastRect = useRef(win.rect);
  const exiting = useRef(false);
  const wasInactive = useRef<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const wm = useWmStore((s) => s.wm);
  const workspace = useWmStore((s) => s.workspace);
  const focus = useWmStore((s) => s.focus);
  const close = useWmStore((s) => s.close);
  const minimize = useWmStore((s) => s.minimize);
  const toggleMaximize = useWmStore((s) => s.toggleMaximize);
  const commitRect = useWmStore((s) => s.commitRect);
  const prepareDrag = useWmStore((s) => s.prepareDrag);

  const inactive = wm.focusedId !== win.id;
  const maximized = win.mode === "maximized";
  const visible = win.mode !== "minimized";

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el || compact) return;
    if (activeGestureId() === win.id) return;
    const rect = win.mode === "maximized" ? maximizedRect(workspace) : win.rect;
    lastRect.current = rect;
    applyRectToElement(el, rect);
  }, [win.rect, win.mode, workspace, compact, win.id]);

  useLayoutEffect(() => {
    if (!visible) return;
    const el = elRef.current;
    if (!el) return;
    playWindowOpen(el);
    wasInactive.current = inactive;
    return () => killMotion(el);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.id, visible]);

  useLayoutEffect(() => {
    const el = elRef.current;
    if (!el || wasInactive.current === null || exiting.current) return;
    if (wasInactive.current && !inactive) playWindowFocus(el);
    wasInactive.current = inactive;
  }, [inactive]);

  if (win.mode === "minimized") return null;

  const finishGesture = (e: PointerEvent<HTMLElement>) => {
    if (activeGestureId() !== win.id) return;
    const next = moveGesture(e.nativeEvent, workspace);
    const rect = next ?? lastRect.current;
    lastRect.current = rect;
    const el = elRef.current;
    if (el) applyRectToElement(el, rect);
    endGestureWith(rect);
    commitRect(win.id, rect);
  };

  const onTitlePointerDown = (e: PointerEvent<HTMLElement>) => {
    if (compact || win.kind === "tip") return;
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    focus(win.id);
    const start = prepareDrag(win.id);
    if (!start) return;
    lastRect.current = start;
    const el = elRef.current;
    if (el) applyRectToElement(el, start);
    startDrag(win.id, start, e.nativeEvent);
    el?.setPointerCapture(e.pointerId);
  };

  const onResizePointerDown = (edge: ResizeEdge, e: PointerEvent<HTMLElement>) => {
    if (compact || maximized || win.kind === "tip") return;
    e.preventDefault();
    e.stopPropagation();
    focus(win.id);
    const start = win.rect;
    lastRect.current = start;
    startResize(win.id, start, edge, e.nativeEvent);
    elRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (activeGestureId() !== win.id) return;
    const next = moveGesture(e.nativeEvent, workspace);
    if (!next) return;
    lastRect.current = next;
    if (elRef.current) applyRectToElement(elRef.current, next);
  };

  const commitClose = () => {
    if (win.id === TIP_ID) onDismissTip();
    close(win.id);
    const next = useWmStore.getState().wm;
    const target = pathAfterClosingWindow(win, focusedRoute(next), location.pathname);
    if (target) navigate(target);
  };

  const onClose = () => {
    if (exiting.current) return;
    exiting.current = true;
    playWindowClose(elRef.current, commitClose);
  };

  const onMinimize = () => {
    if (exiting.current) return;
    playWindowClose(elRef.current, () => {
      if (elRef.current) elRef.current.style.opacity = "1";
      minimize(win.id);
    });
  };

  const chrome = {
    id: win.id,
    inactive,
    onMinimize: win.kind === "tip" ? undefined : onMinimize,
    onMaximize: win.kind === "tip" ? undefined : () => toggleMaximize(win.id),
    onClose,
    onTitlePointerDown,
    onResizePointerDown,
    showResize: !compact && !maximized && win.kind !== "tip",
  };

  const orderIndex = Math.max(0, wm.order.indexOf(win.id));

  return (
    <div
      ref={elRef}
      data-wm-id={win.id}
      data-wm-mode={win.mode}
      className={compact ? "relative flex min-h-0 w-full flex-1 flex-col" : "absolute"}
      style={
        compact
          ? { zIndex: `calc(var(--kellos-z-window-base) + ${orderIndex})` }
          : {
              zIndex: `calc(var(--kellos-z-window-base) + ${orderIndex})`,
              minWidth: "var(--kellos-window-min-w)",
              minHeight: "var(--kellos-window-min-h)",
            }
      }
      onPointerDown={() => {
        focus(win.id);
        if (win.kind !== "tip" && win.route !== location.pathname) {
          navigate(win.route, { replace: true });
        }
      }}
      onPointerMove={onPointerMove}
      onPointerUp={finishGesture}
      onPointerCancel={finishGesture}
    >
      <WindowChromeContext.Provider value={chrome}>
        <WindowBody win={win} onDismissTip={onDismissTip} />
      </WindowChromeContext.Provider>
    </div>
  );
}

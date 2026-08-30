import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { readerPathFor } from "../registry/manifest";
import { playWindowClose } from "../motion/play";
import { KEYBOARD_NUDGE, focusedRoute, getWindow } from "../wm/core";
import { TIP_ID, pathAfterClosingWindow } from "../wm/specs";
import { useWmStore } from "../wm/store";

function typingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  return el.isContentEditable;
}

/**
 * Recruiter keyboard: Reader Mode, window move/close/focus, Ctrl+K Search.
 * Avoids Alt+Arrow (browser Back) and Ctrl+F4 (closes the tab). Does not steal Ctrl+F.
 */
export function useOsKeyboard({
  compact,
  onDismissTip,
  onEscapeOverlays,
  onToggleSearch,
}: {
  compact: boolean;
  onDismissTip: () => void;
  onEscapeOverlays: () => void;
  onToggleSearch: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onToggleSearch();
        return;
      }
      if (e.key === "Escape") {
        onEscapeOverlays();
        return;
      }
      if (typingTarget(e.target)) return;

      if (e.altKey && !e.ctrlKey && !e.metaKey && e.code === "KeyR" && !e.shiftKey) {
        e.preventDefault();
        navigate(readerPathFor(location.pathname));
        return;
      }

      if (e.altKey && e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const { wm, cycleTask, nudge, close } = useWmStore.getState();
        const focusedId = wm.focusedId;

        if (e.code === "KeyC") {
          e.preventDefault();
          if (!focusedId) return;
          if (focusedId === TIP_ID) {
            onDismissTip();
            return;
          }
          const closed = getWindow(wm, focusedId);
          if (!closed) return;
          const node = document.querySelector(`[data-wm-id="${CSS.escape(focusedId)}"]`);
          playWindowClose(node instanceof HTMLElement ? node : null, () => {
            close(focusedId);
            const next = useWmStore.getState().wm;
            const target = pathAfterClosingWindow(closed, focusedRoute(next), location.pathname);
            if (target) navigate(target);
          });
          return;
        }

        if (e.code === "KeyF") {
          e.preventDefault();
          cycleTask(1);
          const route = focusedRoute(useWmStore.getState().wm);
          if (route && route !== location.pathname) navigate(route);
          return;
        }

        if (!compact && focusedId && focusedId !== TIP_ID) {
          const arrows: Record<string, [number, number]> = {
            ArrowLeft: [-KEYBOARD_NUDGE, 0],
            ArrowRight: [KEYBOARD_NUDGE, 0],
            ArrowUp: [0, -KEYBOARD_NUDGE],
            ArrowDown: [0, KEYBOARD_NUDGE],
          };
          const delta = arrows[e.key];
          if (delta) {
            e.preventDefault();
            nudge(focusedId, delta[0], delta[1]);
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact, location.pathname, navigate, onDismissTip, onEscapeOverlays, onToggleSearch]);
}

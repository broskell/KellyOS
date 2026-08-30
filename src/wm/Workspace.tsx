import { useLayoutEffect, useRef } from "react";
import { ManagedWindow } from "./ManagedWindow";
import { visibleWindows } from "./core";
import { readWorkspaceSize } from "./interact";
import { useWmStore } from "./store";

export function Workspace({
  compact,
  onDismissTip,
}: {
  compact: boolean;
  onDismissTip: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wm = useWmStore((s) => s.wm);
  const setWorkspace = useWmStore((s) => s.setWorkspace);
  const windows = compact
    ? [...visibleWindows(wm)].sort((a, b) => {
        if (a.id === wm.focusedId) return -1;
        if (b.id === wm.focusedId) return 1;
        return 0;
      })
    : visibleWindows(wm);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => setWorkspace(readWorkspaceSize(el));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [setWorkspace]);

  return (
    <main
      ref={ref}
      className={
        compact
          ? "relative flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-2 pb-2"
          : "absolute inset-0 overflow-hidden"
      }
    >
      {windows.map((win) => (
        <ManagedWindow key={win.id} win={win} compact={compact} onDismissTip={onDismissTip} />
      ))}
    </main>
  );
}

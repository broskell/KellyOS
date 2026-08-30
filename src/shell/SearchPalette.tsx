import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { searchRegistry, type LaunchTarget } from "../registry/resolve";
import { useRegistryLaunch } from "../registry/useRegistryLaunch";
import { playMenuIn } from "../motion/play";

export function SearchPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launch = useRegistryLaunch();
  const hits = useMemo(() => searchRegistry(query, "search"), [query]);

  useLayoutEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
      return;
    }
    playMenuIn(panelRef.current);
    inputRef.current?.focus();
  }, [open]);

  useLayoutEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  const go = (target: LaunchTarget) => {
    launch(target);
    onClose();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (hits.length ? (i + 1) % hits.length : 0));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (hits.length ? (i - 1 + hits.length) % hits.length : 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = hits[active];
      if (target) go(target);
    }
  };

  const listed = hits;

  return (
    <div
      data-os-search=""
      className="absolute inset-0 flex justify-center pt-10"
      style={{ zIndex: "var(--kellos-z-start)" }}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="os-window flex max-h-[min(24rem,70%)] w-[min(22rem,calc(100%-1.5rem))] flex-col"
      >
        <div className="os-titlebar">
          <span className="os-titlebar-label">Search</span>
        </div>
        <div className="os-sunken os-well flex min-h-0 flex-1 flex-col p-1">
          <input
            ref={inputRef}
            id="os-search-input"
            aria-label="Find an app"
            className="os-sunken font-chrome mb-1 w-full px-2 py-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a name from the registry"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <ul className="os-menu min-h-0 flex-1 overflow-auto" role="listbox" aria-label="Apps">
            {listed.length === 0 ? (
              <li className="font-chrome px-2 py-1">No registry match.</li>
            ) : (
              listed.map((item, i) => (
                <li key={item.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    data-active={i === active ? "true" : undefined}
                    className="w-full"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                  >
                    {item.title}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

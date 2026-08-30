import type { CSSProperties, PointerEvent, ReactNode } from "react";
import type { ResizeEdge } from "../wm/core";
import { useWindowChrome } from "../wm/chromeContext";

const EDGES: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

export function WindowFrame({
  title,
  children,
  inactive = false,
  menu,
  status,
  className = "",
  style,
}: {
  title: string;
  children: ReactNode;
  inactive?: boolean;
  menu?: ReactNode;
  status?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const chrome = useWindowChrome();
  const isInactive = chrome?.inactive ?? inactive;
  const titleId = chrome?.id ? `os-title-${chrome.id.replace(/[^a-zA-Z0-9_-]/g, "-")}` : undefined;

  const onTitleDown = (e: PointerEvent<HTMLElement>) => {
    chrome?.onTitlePointerDown?.(e);
  };

  const onTitleDoubleClick = () => {
    chrome?.onMaximize?.();
  };

  return (
    <section
      className={`os-window relative flex h-full min-h-0 flex-col ${className}`}
      style={style}
      aria-labelledby={titleId}
      aria-label={titleId ? undefined : title}
    >
      <header
        className="os-titlebar"
        data-inactive={isInactive}
        onPointerDown={onTitleDown}
        onDoubleClick={onTitleDoubleClick}
      >
        {isInactive ? (
          <span id={titleId} className="os-titlebar-label">
            {title}
          </span>
        ) : (
          <h1 id={titleId} className="os-titlebar-label">
            {title}
          </h1>
        )}
        <span className="flex gap-px">
          <button
            type="button"
            className="os-ctrl os-raised"
            aria-label="Minimize"
            disabled={!chrome?.onMinimize}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => chrome?.onMinimize?.()}
          >
            _
          </button>
          <button
            type="button"
            className="os-ctrl os-raised"
            aria-label="Maximize"
            disabled={!chrome?.onMaximize}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => chrome?.onMaximize?.()}
          >
            □
          </button>
          <button
            type="button"
            className="os-ctrl os-raised"
            aria-label="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => chrome?.onClose?.()}
          >
            ×
          </button>
        </span>
      </header>
      {menu}
      <div className="os-sunken os-well os-scroll min-h-0 flex-1">{children}</div>
      {status ? (
        <footer className="os-status os-sunken mt-0.5">{status}</footer>
      ) : null}
      {chrome?.showResize
        ? EDGES.map((edge) => (
            <button
              key={edge}
              type="button"
              tabIndex={-1}
              aria-label={`Resize ${edge}`}
              className={`os-resize os-resize-${edge}`}
              onPointerDown={(e) => chrome.onResizePointerDown?.(edge, e)}
            />
          ))
        : null}
    </section>
  );
}

export function OsButton({
  children,
  pressed,
  disabled,
  onClick,
  className = "",
  id,
  ariaExpanded,
  ariaHasPopup,
  ariaControls,
}: {
  children: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean | "menu";
  ariaControls?: string;
}) {
  return (
    <button
      type="button"
      id={id}
      className={`os-btn os-raised ${className}`}
      data-pressed={pressed}
      disabled={disabled}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-controls={ariaControls}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

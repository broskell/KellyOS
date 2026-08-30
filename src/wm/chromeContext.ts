import type { PointerEvent } from "react";
import { createContext, useContext } from "react";
import type { ResizeEdge } from "./core";

export type WindowChromeApi = {
  id: string;
  inactive: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  onTitlePointerDown?: (e: PointerEvent<HTMLElement>) => void;
  onResizePointerDown?: (edge: ResizeEdge, e: PointerEvent<HTMLElement>) => void;
  showResize: boolean;
};

export const WindowChromeContext = createContext<WindowChromeApi | null>(null);

export function useWindowChrome(): WindowChromeApi | null {
  return useContext(WindowChromeContext);
}

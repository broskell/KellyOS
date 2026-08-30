import type { ResizeEdge, Rect, Size } from "./core";
import { dragRect, resizeRect } from "./core";

/** Write geometry to the element. Never goes through React during a gesture. */
export function applyRectToElement(el: HTMLElement, rect: Rect): void {
  el.style.position = "absolute";
  el.style.left = `${rect.x}px`;
  el.style.top = `${rect.y}px`;
  el.style.width = `${rect.w}px`;
  el.style.height = `${rect.h}px`;
}

export function readWorkspaceSize(el: HTMLElement): Size {
  return { w: Math.max(1, el.clientWidth), h: Math.max(1, el.clientHeight) };
}

type Gesture =
  | { type: "drag"; id: string; start: Rect; px: number; py: number }
  | { type: "resize"; id: string; start: Rect; px: number; py: number; edge: ResizeEdge };

let gesture: Gesture | null = null;

export function isGesturing(): boolean {
  return gesture !== null;
}

export function activeGestureId(): string | null {
  return gesture?.id ?? null;
}

export function startDrag(
  id: string,
  start: Rect,
  e: Pick<PointerEvent, "clientX" | "clientY">,
): void {
  gesture = { type: "drag", id, start, px: e.clientX, py: e.clientY };
}

export function startResize(
  id: string,
  start: Rect,
  edge: ResizeEdge,
  e: Pick<PointerEvent, "clientX" | "clientY">,
): void {
  gesture = { type: "resize", id, start, edge, px: e.clientX, py: e.clientY };
}

export function moveGesture(e: Pick<PointerEvent, "clientX" | "clientY">, workspace: Size): Rect | null {
  if (!gesture) return null;
  const dx = e.clientX - gesture.px;
  const dy = e.clientY - gesture.py;
  if (gesture.type === "drag") return dragRect(gesture.start, dx, dy, workspace);
  return resizeRect(gesture.start, gesture.edge, dx, dy, workspace);
}

export function endGesture(): { id: string; rect: Rect } | null {
  if (!gesture) return null;
  const id = gesture.id;
  const start = gesture.start;
  gesture = null;
  return { id, rect: start };
}

export function endGestureWith(rect: Rect): { id: string; rect: Rect } | null {
  if (!gesture) return null;
  const id = gesture.id;
  gesture = null;
  return { id, rect };
}

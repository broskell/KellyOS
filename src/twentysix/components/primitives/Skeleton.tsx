import type { CSSProperties } from "react";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/** Monochrome shimmer placeholder for slow/pending content. */
export function Skeleton({
  width = "100%",
  height = 16,
  radius = 6,
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      className={["t26-skeleton", className].filter(Boolean).join(" ")}
      role="status"
      aria-busy="true"
      aria-live="polite"
      style={{ width, height, borderRadius: radius, ...style }}
      {...rest}
    />
  );
}

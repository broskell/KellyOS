import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Constrain inner content to the standard or wide container. "none" opts out. */
  container?: "default" | "wide" | "none";
  /** aria-label for the landmark. */
  label?: string;
  as?: "section" | "footer" | "header" | "div";
}

/** Standard 26' section landmark with consistent vertical rhythm + container. */
export function Section({
  id,
  children,
  className,
  container = "default",
  label,
  as: Tag = "section",
}: SectionProps) {
  const inner =
    container === "none" ? (
      children
    ) : (
      <div className={container === "wide" ? "t26-container-wide" : "t26-container"}>{children}</div>
    );

  return (
    <Tag
      id={id}
      aria-label={label}
      className={["t26-section", className].filter(Boolean).join(" ")}
    >
      {inner}
    </Tag>
  );
}

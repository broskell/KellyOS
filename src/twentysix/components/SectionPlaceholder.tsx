import type { ReactNode } from "react";
import { Section } from "./primitives/Section";
import { Reveal } from "./primitives/Reveal";

interface SectionPlaceholderProps {
  id: string;
  index: string;
  title: string;
  note: string;
  minH?: number | string;
  children?: ReactNode;
}

/**
 * Chunk-0 slot: labeled, on-brand placeholder that holds correct layout, spacing,
 * and scroll-reveal until the real section (or sent 21st component) lands.
 */
export function SectionPlaceholder({
  id,
  index,
  title,
  note,
  minH = 280,
  children,
}: SectionPlaceholderProps) {
  return (
    <Section id={id} label={title}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <span className="t26-eyebrow">{index}</span>
          <hr className="t26-hairline" style={{ flex: 1 }} />
        </div>
        <h2 className="t26-h2" style={{ marginTop: "1.25rem" }}>
          {title}
        </h2>
        <p className="t26-caption" style={{ marginTop: "0.5rem" }}>
          {note}
        </p>
      </Reveal>

      {children ?? (
        <Reveal delay={0.05}>
          <div
            className="t26-card"
            style={{
              marginTop: "1.75rem",
              minHeight: minH,
              display: "grid",
              placeItems: "center",
              color: "var(--c-muted-2)",
              fontFamily: "var(--f-mono)",
              fontSize: "var(--fs-mono)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            component slot
          </div>
        </Reveal>
      )}
    </Section>
  );
}

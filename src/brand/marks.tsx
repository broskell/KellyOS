export function Wordmark({
  size = 16,
  invert = false,
  decorative = false,
}: {
  size?: number;
  invert?: boolean;
  decorative?: boolean;
}) {
  const fg = invert ? "var(--kellos-title-text)" : "var(--kellos-title-active-from)";
  const os = invert ? "var(--kellos-title-text)" : "var(--kellos-ink)";
  return (
    <svg
      width={size * 5.6}
      height={size}
      viewBox="0 0 90 16"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "KELL.OS"}
      aria-hidden={decorative ? true : undefined}
      style={{ imageRendering: "pixelated" }}
    >
      <rect width="90" height="16" fill="transparent" />
      <g fill={fg}>
        {/* K */}
        <rect x="1" y="2" width="2" height="12" />
        <rect x="3" y="7" width="2" height="2" />
        <rect x="5" y="2" width="2" height="4" />
        <rect x="5" y="10" width="2" height="4" />
        {/* E */}
        <rect x="9" y="2" width="2" height="12" />
        <rect x="11" y="2" width="5" height="2" />
        <rect x="11" y="7" width="4" height="2" />
        <rect x="11" y="12" width="5" height="2" />
        {/* L */}
        <rect x="18" y="2" width="2" height="12" />
        <rect x="20" y="12" width="5" height="2" />
        {/* L */}
        <rect x="27" y="2" width="2" height="12" />
        <rect x="29" y="12" width="5" height="2" />
      </g>
      <g fill={os}>
        <rect x="36" y="11" width="2" height="2" />
        {/* O */}
        <rect x="41" y="2" width="6" height="2" />
        <rect x="41" y="12" width="6" height="2" />
        <rect x="39" y="4" width="2" height="8" />
        <rect x="47" y="4" width="2" height="8" />
        {/* S */}
        <rect x="51" y="2" width="7" height="2" />
        <rect x="51" y="2" width="2" height="5" />
        <rect x="51" y="6" width="7" height="2" />
        <rect x="56" y="8" width="2" height="4" />
        <rect x="51" y="12" width="7" height="2" />
      </g>
    </svg>
  );
}

export function BootMark({ size = 32, decorative = false }: { size?: number; decorative?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "KELL.OS"}
      aria-hidden={decorative ? true : undefined}
    >
      <rect x="1" y="1" width="30" height="30" fill="var(--kellos-face)" />
      <rect x="1" y="1" width="30" height="2" fill="var(--kellos-bevel-light)" />
      <rect x="1" y="1" width="2" height="30" fill="var(--kellos-bevel-light)" />
      <rect x="29" y="1" width="2" height="30" fill="var(--kellos-bevel-dark)" />
      <rect x="1" y="29" width="30" height="2" fill="var(--kellos-bevel-dark)" />
      <rect x="3" y="3" width="26" height="8" fill="var(--kellos-title-active-from)" />
      <rect x="5" y="5" width="2" height="4" fill="var(--kellos-title-text)" />
      <rect x="7" y="6" width="2" height="2" fill="var(--kellos-title-text)" />
      <rect x="9" y="5" width="2" height="2" fill="var(--kellos-title-text)" />
      <rect x="9" y="8" width="2" height="1" fill="var(--kellos-title-text)" />
      <rect x="5" y="14" width="22" height="14" fill="var(--kellos-window-paper)" />
      <rect x="7" y="16" width="18" height="2" fill="var(--kellos-bevel-shadow)" />
      <rect x="7" y="20" width="12" height="2" fill="var(--kellos-bevel-hi)" />
      <rect x="7" y="24" width="16" height="2" fill="var(--kellos-bevel-hi)" />
    </svg>
  );
}

export function PixelIcon({
  name,
}: {
  name: "about" | "projects" | "skills" | "resume" | "contact" | "recycle" | "now" | "timeline" | "reader";
}) {
  const common = { width: 32, height: 32, viewBox: "0 0 32 32" } as const;
  if (name === "recycle") {
    return (
      <svg {...common} aria-hidden>
        <rect x="6" y="8" width="20" height="18" fill="#808080" />
        <rect x="8" y="6" width="16" height="6" fill="#c0c0c0" />
        <rect x="10" y="4" width="12" height="4" fill="#808080" />
        <rect x="12" y="14" width="8" height="8" fill="#008080" />
      </svg>
    );
  }
  if (name === "projects") {
    return (
      <svg {...common} aria-hidden>
        <rect x="4" y="6" width="24" height="20" fill="var(--kellos-window-paper)" />
        <rect x="4" y="6" width="24" height="5" fill="var(--kellos-title-active-from)" />
        <rect x="7" y="14" width="10" height="2" fill="var(--kellos-ink)" />
        <rect x="7" y="18" width="16" height="2" fill="var(--kellos-bevel-shadow)" />
        <rect x="7" y="22" width="12" height="2" fill="var(--kellos-bevel-shadow)" />
      </svg>
    );
  }
  if (name === "skills") {
    return (
      <svg {...common} aria-hidden>
        <rect x="6" y="4" width="20" height="24" fill="var(--kellos-window-paper)" />
        <rect x="6" y="4" width="20" height="5" fill="var(--kellos-title-active-from)" />
        <rect x="9" y="12" width="14" height="2" fill="var(--kellos-ink)" />
        <rect x="9" y="16" width="14" height="2" fill="var(--kellos-ink)" />
        <rect x="9" y="20" width="8" height="2" fill="var(--kellos-bevel-shadow)" />
      </svg>
    );
  }
  if (name === "resume") {
    return (
      <svg {...common} aria-hidden>
        <rect x="8" y="4" width="16" height="24" fill="var(--kellos-window-paper)" />
        <rect x="10" y="8" width="12" height="2" fill="var(--kellos-ink)" />
        <rect x="10" y="12" width="12" height="1" fill="var(--kellos-bevel-shadow)" />
        <rect x="10" y="15" width="12" height="1" fill="var(--kellos-bevel-shadow)" />
        <rect x="10" y="18" width="8" height="1" fill="var(--kellos-bevel-shadow)" />
      </svg>
    );
  }
  if (name === "contact") {
    return (
      <svg {...common} aria-hidden>
        <rect x="4" y="8" width="24" height="16" fill="var(--kellos-window-paper)" />
        <polygon points="4,8 16,18 28,8" fill="var(--kellos-title-active-from)" />
      </svg>
    );
  }
  if (name === "now") {
    return (
      <svg {...common} aria-hidden>
        <rect x="6" y="6" width="20" height="20" fill="var(--kellos-window-paper)" />
        <rect x="14" y="10" width="2" height="8" fill="var(--kellos-ink)" />
        <rect x="16" y="16" width="6" height="2" fill="var(--kellos-ink)" />
        <circle cx="16" cy="16" r="9" fill="none" stroke="var(--kellos-ink)" strokeWidth="2" />
      </svg>
    );
  }
  if (name === "timeline") {
    return (
      <svg {...common} aria-hidden>
        <rect x="6" y="6" width="20" height="20" fill="var(--kellos-window-paper)" />
        <rect x="6" y="6" width="20" height="5" fill="var(--kellos-title-active-from)" />
        <rect x="9" y="14" width="14" height="2" fill="var(--kellos-ink)" />
        <rect x="9" y="18" width="10" height="2" fill="var(--kellos-bevel-shadow)" />
        <rect x="9" y="22" width="6" height="2" fill="var(--kellos-bevel-shadow)" />
      </svg>
    );
  }
  if (name === "reader") {
    return (
      <svg {...common} aria-hidden>
        <rect x="5" y="6" width="10" height="20" fill="var(--kellos-reader-bg)" />
        <rect x="15" y="6" width="12" height="20" fill="var(--kellos-reader-paper)" />
        <rect x="8" y="10" width="5" height="1" fill="var(--kellos-ink)" />
        <rect x="8" y="13" width="5" height="1" fill="var(--kellos-ink)" />
        <rect x="18" y="10" width="6" height="1" fill="var(--kellos-ink)" />
      </svg>
    );
  }
  return (
    <svg {...common} aria-hidden>
      <rect x="6" y="5" width="20" height="22" fill="var(--kellos-window-paper)" />
      <rect x="6" y="5" width="20" height="6" fill="var(--kellos-title-active-from)" />
      <rect x="9" y="14" width="8" height="8" fill="#c4a574" />
      <rect x="18" y="16" width="5" height="8" fill="var(--kellos-bevel-shadow)" />
    </svg>
  );
}

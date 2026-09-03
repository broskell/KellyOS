export function Wordmark({
  size = 16,
  invert = false,
  decorative = false,
}: {
  size?: number;
  invert?: boolean;
  decorative?: boolean;
}) {
  const name = invert ? "var(--kellos-title-text)" : "var(--kellos-title-active-from)";
  const os = invert ? "var(--kellos-title-text)" : "var(--kellos-ink)";
  return (
    <span
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Kelly.OS"}
      aria-hidden={decorative ? true : undefined}
      style={{
        fontFamily: "var(--kellos-font-wordmark)",
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "baseline",
        userSelect: "none",
      }}
    >
      <span style={{ color: name }}>Kelly</span>
      <span style={{ color: os }}>.OS</span>
    </span>
  );
}

export function BootMark({ size = 32, decorative = false }: { size?: number; decorative?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Kelly.OS"}
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

const OUTLINE = "#2a2a2a";

/**
 * Hand-drawn app icons in a consistent Win95/98 desktop style — flat fills, a
 * dark outline, one or two shades. Keyed by the registry `icon` field. Not
 * emoji: one visual language across every surface.
 */
export function PixelIcon({ name }: { name: string }) {
  const p = { width: 32, height: 32, viewBox: "0 0 32 32" } as const;

  switch (name) {
    case "about":
      return (
        <svg {...p} aria-hidden>
          <rect x="6" y="3" width="20" height="26" rx="1.5" fill="#2f6fb0" stroke={OUTLINE} strokeWidth="1.5" />
          <rect x="10" y="5" width="12" height="2.5" rx="1" fill="#cdd8e6" />
          <circle cx="16" cy="15" r="4" fill="#f2d3ae" stroke={OUTLINE} strokeWidth="0.8" />
          <path d="M9 27c0-4.5 3.2-6.5 7-6.5s7 2 7 6.5z" fill="#f2d3ae" stroke={OUTLINE} strokeWidth="0.8" />
        </svg>
      );
    case "projects":
      return (
        <svg {...p} aria-hidden>
          <path d="M3 8h8l2.4 3H29v4H3z" fill="#e0a838" stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M4 12h25l-2.2 15H6.2z" fill="#f7c948" stroke={OUTLINE} strokeWidth="1.2" />
        </svg>
      );
    case "skills":
      return (
        <svg {...p} aria-hidden>
          <path d="M11 17l-2.5 11 4-2.2 2.5 2.7z" fill="#c0392b" stroke={OUTLINE} strokeWidth="0.8" />
          <path d="M21 17l2.5 11-4-2.2-2.5 2.7z" fill="#a93226" stroke={OUTLINE} strokeWidth="0.8" />
          <circle cx="16" cy="12" r="9" fill="#f6c744" stroke={OUTLINE} strokeWidth="1.2" />
          <circle cx="16" cy="12" r="5" fill="#ffe28c" stroke={OUTLINE} strokeWidth="0.8" />
          <path d="M16 8l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" fill="#d99a1c" />
        </svg>
      );
    case "resume":
      return (
        <svg {...p} aria-hidden>
          <path d="M8 3h12l5 5v21H8z" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.3" />
          <path d="M20 3v5h5" fill="#d6d6d6" stroke={OUTLINE} strokeWidth="1.3" />
          <g fill="#3f6fae">
            <rect x="11" y="12" width="10" height="1.8" />
            <rect x="11" y="16" width="11" height="1.8" />
            <rect x="11" y="20" width="8" height="1.8" />
            <rect x="11" y="24" width="11" height="1.8" />
          </g>
        </svg>
      );
    case "contact":
      return (
        <svg {...p} aria-hidden>
          <rect x="3" y="8" width="26" height="17" rx="1" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.3" />
          <path d="M3.5 8.5L16 18 28.5 8.5" fill="none" stroke={OUTLINE} strokeWidth="1.3" />
          <path d="M3.5 8.5h25L16 18z" fill="#4a90d9" stroke={OUTLINE} strokeWidth="1" />
        </svg>
      );
    case "recycle":
      return (
        <svg {...p} aria-hidden>
          <rect x="11" y="5" width="10" height="2.4" rx="1" fill="#9aa0a6" stroke={OUTLINE} strokeWidth="1" />
          <rect x="6.5" y="7.5" width="19" height="3.2" rx="1" fill="#c3c7cc" stroke={OUTLINE} strokeWidth="1.1" />
          <path d="M8.5 11h15l-1.4 16.5H9.9z" fill="#aeb3b8" stroke={OUTLINE} strokeWidth="1.1" />
          <g stroke="#7d8288" strokeWidth="1.2">
            <line x1="13" y1="14" x2="12.3" y2="24" />
            <line x1="16" y1="14" x2="16" y2="24" />
            <line x1="19" y1="14" x2="19.7" y2="24" />
          </g>
        </svg>
      );
    case "now":
      return (
        <svg {...p} aria-hidden>
          <circle cx="16" cy="16" r="11.5" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.6" />
          <circle cx="16" cy="16" r="11.5" fill="none" stroke="#4a90d9" strokeWidth="1.6" opacity="0.35" />
          <line x1="16" y1="16" x2="16" y2="8.5" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="16" x2="21.5" y2="16" stroke={OUTLINE} strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.6" fill={OUTLINE} />
        </svg>
      );
    case "timeline":
      return (
        <svg {...p} aria-hidden>
          <rect x="4" y="6" width="24" height="22" rx="1.5" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.3" />
          <rect x="4" y="6" width="24" height="6" rx="1.5" fill="#c0392b" stroke={OUTLINE} strokeWidth="1.3" />
          <rect x="9" y="3.5" width="2.2" height="5" rx="1" fill="#6b7076" />
          <rect x="20.8" y="3.5" width="2.2" height="5" rx="1" fill="#6b7076" />
          <g fill="#8a9099">
            <rect x="8" y="16" width="3" height="3" /><rect x="14.5" y="16" width="3" height="3" /><rect x="21" y="16" width="3" height="3" />
            <rect x="8" y="21" width="3" height="3" /><rect x="14.5" y="21" width="3" height="3" fill="#4a90d9" />
          </g>
        </svg>
      );
    case "reader":
      return (
        <svg {...p} aria-hidden>
          <path d="M16 7C12 4.5 8 4.5 4 6.5V26c4-2 8-2 12 .5z" fill="#f6f6f2" stroke={OUTLINE} strokeWidth="1.2" />
          <path d="M16 7c4-2.5 8-2.5 12-.5V26c-4-2-8-2-12 .5z" fill="#e6e6df" stroke={OUTLINE} strokeWidth="1.2" />
          <g stroke="#8a9099" strokeWidth="1">
            <line x1="7" y1="11" x2="13" y2="11.8" /><line x1="7" y1="15" x2="13" y2="15.8" /><line x1="7" y1="19" x2="13" y2="19.8" />
            <line x1="19" y1="11.8" x2="25" y2="11" /><line x1="19" y1="15.8" x2="25" y2="15" />
          </g>
        </svg>
      );
    case "terminal":
      return (
        <svg {...p} aria-hidden>
          <rect x="3" y="6" width="26" height="20" rx="1.5" fill="#0c0c0c" stroke={OUTLINE} strokeWidth="1.3" />
          <path d="M7 12l4 3-4 3" fill="none" stroke="#39ff6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="13" y="18" width="6" height="1.8" fill="#39ff6a" />
        </svg>
      );
    case "settings":
      return (
        <svg {...p} aria-hidden>
          <g fill="#b7bcc2" stroke={OUTLINE} strokeWidth="1">
            <rect x="14.4" y="3" width="3.2" height="26" rx="1" />
            <rect x="3" y="14.4" width="26" height="3.2" rx="1" />
            <rect x="6.5" y="6.5" width="3.2" height="19" rx="1" transform="rotate(45 8 16)" />
            <rect x="22.3" y="6.5" width="3.2" height="19" rx="1" transform="rotate(-45 24 16)" />
          </g>
          <circle cx="16" cy="16" r="8" fill="#c9ced4" stroke={OUTLINE} strokeWidth="1.2" />
          <circle cx="16" cy="16" r="3.4" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.2" />
        </svg>
      );
    case "kellai":
      return (
        <svg {...p} aria-hidden>
          <rect x="6" y="8" width="20" height="15" rx="3" fill="#4a90d9" stroke={OUTLINE} strokeWidth="1.3" />
          <path d="M11 23l-2 5 6-3z" fill="#4a90d9" stroke={OUTLINE} strokeWidth="1.3" />
          <circle cx="16" cy="6" r="1.4" fill="#2a5a9a" /><line x1="16" y1="7" x2="16" y2="8.5" stroke="#2a5a9a" strokeWidth="1.3" />
          <g fill="#eaf3fb"><circle cx="11.5" cy="15.5" r="1.7" /><circle cx="16" cy="15.5" r="1.7" /><circle cx="20.5" cy="15.5" r="1.7" /></g>
        </svg>
      );
    case "osUpdate":
      return (
        <svg {...p} aria-hidden>
          <circle cx="16" cy="16" r="10.5" fill="#eef3ee" stroke={OUTLINE} strokeWidth="1" opacity="0.6" />
          <path d="M24 12a9 9 0 1 0 1 6" fill="none" stroke="#2f8f4e" strokeWidth="3" strokeLinecap="round" />
          <path d="M25.5 6.5l-.6 6-5.6-1.6z" fill="#2f8f4e" stroke={OUTLINE} strokeWidth="0.6" />
        </svg>
      );
    case "search":
      return (
        <svg {...p} aria-hidden>
          <circle cx="14" cy="14" r="7.5" fill="#dbeafe" stroke={OUTLINE} strokeWidth="2.2" />
          <circle cx="14" cy="14" r="4" fill="#ffffff" opacity="0.8" />
          <line x1="19.5" y1="19.5" x2="27" y2="27" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...p} aria-hidden>
          <rect x="6" y="4" width="20" height="24" rx="1.5" fill="#ffffff" stroke={OUTLINE} strokeWidth="1.3" />
        </svg>
      );
  }
}

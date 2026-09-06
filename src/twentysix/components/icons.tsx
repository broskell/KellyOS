import type { SVGProps } from "react";

/**
 * Monochrome line icons for the 26' dock. Stroke = currentColor so they inherit
 * the dock ink and animate with it. 24×24 viewBox, 1.6 stroke — editorial, not
 * the colorful macOS glyphs; the 26' system is strictly grayscale.
 */
const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export const IconHome = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </svg>
);

export const IconUser = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c.7-4 3.6-6 7.5-6s6.8 2 7.5 6" />
  </svg>
);

export const IconWork = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="4" width="7" height="7" rx="1.2" />
    <rect x="13.5" y="4" width="7" height="7" rx="1.2" />
    <rect x="3.5" y="13" width="7" height="7" rx="1.2" />
    <rect x="13.5" y="13" width="7" height="7" rx="1.2" />
  </svg>
);

export const IconStack = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
    <path d="m3.5 12 8.5 4.5L20.5 12" />
    <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
  </svg>
);

export const IconTimeline = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="6" r="2.2" />
    <circle cx="18" cy="18" r="2.2" />
    <path d="M6 8.2V14a4 4 0 0 0 4 4h5.8" />
  </svg>
);

export const IconMail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const IconResume = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M6 3h8l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v4h4" />
    <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18h4" />
  </svg>
);

export const IconTerminal = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

/* —— Social / brand marks (filled where the logo demands it) —— */
const filled: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
};

export const IconGithub = (p: SVGProps<SVGSVGElement>) => (
  <svg {...filled} {...p}>
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.2-3.37-1.2-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);

export const IconLinkedin = (p: SVGProps<SVGSVGElement>) => (
  <svg {...filled} {...p}>
    <path d="M6.94 5a2 2 0 1 1-4-.02 2 2 0 0 1 4 .02ZM3.2 8.25h3.5V21H3.2V8.25Zm5.46 0h3.36v1.74h.05c.47-.86 1.6-1.77 3.3-1.77 3.53 0 4.18 2.24 4.18 5.15V21h-3.5v-5.68c0-1.36-.03-3.1-1.9-3.1-1.9 0-2.19 1.47-2.19 3v5.78h-3.5V8.25Z" />
  </svg>
);

export const IconInstagram = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconLeetcode = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M14.5 4 7.2 11.2a1.5 1.5 0 0 0 0 2.1l3.4 3.4a2 2 0 0 0 2.8 0l1.9-1.9" />
    <path d="M9.5 12.2h8" />
  </svg>
);

export const IconGmail = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
);

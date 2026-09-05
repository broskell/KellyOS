import "../styles/socials.css";
import { socials } from "../data/socials";

interface SocialsProps {
  className?: string;
}

/**
 * Row of monochrome social icon links (GitHub, LinkedIn, LeetCode, Instagram,
 * Email). External links open in a new tab; email is a mailto. Grey by default,
 * brightening to the ink on hover — no colour, no chrome.
 */
export function Socials({ className }: SocialsProps) {
  return (
    <ul className={["t26-socials", className].filter(Boolean).join(" ")}>
      {socials.map((s) => {
        const external = s.url.startsWith("http");
        return (
          <li key={s.id}>
            <a
              className="t26-social"
              href={s.url}
              aria-label={`${s.label} — ${s.handle}`}
              title={s.label}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {s.icon}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

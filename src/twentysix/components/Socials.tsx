import "../styles/socials.css";
import { socials } from "../data/socials";

interface SocialsProps {
  className?: string;
  /** Ids to omit from the row (e.g. drop "gmail" where an email CTA already shows). */
  exclude?: string[];
  /** Explicit id order; any ids not listed keep their default order after these. */
  order?: string[];
}

/**
 * Row of monochrome social icon links (GitHub, LinkedIn, LeetCode, Instagram,
 * Email). External links open in a new tab; email is a mailto. Grey by default,
 * brightening to the ink on hover — no colour, no chrome. `exclude` / `order`
 * let a caller drop or reorder entries (the hero uses the defaults).
 */
export function Socials({ className, exclude, order }: SocialsProps) {
  let items = exclude ? socials.filter((s) => !exclude.includes(s.id)) : socials;
  if (order && order.length) {
    const rank = (id: string) => {
      const i = order.indexOf(id);
      return i === -1 ? order.length + 1 : i;
    };
    items = [...items].sort((a, b) => rank(a.id) - rank(b.id));
  }

  return (
    <ul className={["t26-socials", className].filter(Boolean).join(" ")}>
      {items.map((s) => {
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

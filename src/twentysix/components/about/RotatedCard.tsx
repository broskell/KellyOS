import type { ReactNode } from "react";

/**
 * RotatedCard — a "pasted paper" composition: a tilted blue label box overlapping
 * a rotated tan card, echoing the portfolio card art (reference
 * `03-challenges-rotated-cards.png`). Presentational only; the parent handles the
 * scroll-in tween (GSAP) on the `.t26-rcard` wrapper.
 *
 * `side` mirrors the layout so a stack of cards reads like casually placed paper.
 * Body content is either the simple `body`/`bodyLead` text or arbitrary `children`
 * (used for structured content like education rows).
 */
export interface RotatedCardProps {
  /** Small tag rendered above the label (e.g. "Education", "01 / About"). */
  tag?: string;
  /** Label text shown in the blue block. */
  label: string;
  /** Body copy shown on the tan paper (ignored when `children` is provided). */
  body?: string;
  /** Optional prefix rendered bold before the body (e.g. "Approach:"). */
  bodyLead?: string;
  /** Rich body content for the tan paper (overrides `body`). */
  children?: ReactNode;
  /** Which way the composition leans / offsets. */
  side?: "left" | "right";
}

export function RotatedCard({
  tag,
  label,
  body,
  bodyLead,
  children,
  side = "left",
}: RotatedCardProps) {
  return (
    <article className={`t26-rcard t26-rcard--${side}`}>
      <div className="t26-rcard__label">
        {tag ? <span className="t26-rcard__tag">{tag}</span> : null}
        <h3 className="t26-rcard__title">{label}</h3>
      </div>
      <div className="t26-rcard__body">
        {children ?? (
          <p className="t26-rcard__p">
            {bodyLead ? <strong className="t26-rcard__lead">{bodyLead} </strong> : null}
            {body}
          </p>
        )}
      </div>
    </article>
  );
}

import { useState } from "react";

/**
 * LeetCode stats + activity graph. Renders the live LeetCard SVG on a dark
 * card, keeping a green ring + green heatmap so the activity reads at a glance.
 * Falls back to a labelled card + profile link if it can't load.
 */
const LC_USER = "kellysolves";
const LC_PROFILE = `https://leetcode.com/u/${LC_USER}/`;
// Dark card with a green ring/heatmap; the difficulty bars keep LeetCode's own
// easy/medium/hard colours so activity is legible.
const LC_SRC =
  `https://leetcard.jacoblin.cool/${LC_USER}` +
  `?theme=dark&ext=heatmap&font=IBM%20Plex%20Mono` +
  `&background=0d0d0d&border=242424&radius=14` +
  `&text=e8e8e8&sub=8a8a8a&ring=1f9d55&currStreak=1f9d55` +
  `&bg_datedcolor=161616`;

export function LeetCodeGraph() {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  return (
    <div className="t26-graph t26-graph--lc">
      <div className="t26-graph__head">
        <span className="t26-graph__label">LeetCode · activity</span>
        <a className="t26-graph__link" href={LC_PROFILE} target="_blank" rel="noreferrer">
          @{LC_USER}
        </a>
      </div>

      <div className="t26-graph__body" data-state={state}>
        {state === "loading" && <div className="t26-graph__skeleton" aria-hidden="true" />}

        {state !== "error" && (
          <div className="t26-graph__scroll">
            <img
              className="t26-graph__img t26-graph__img--lc"
              src={LC_SRC}
              alt={`LeetCode stats and activity for ${LC_USER}`}
              loading="lazy"
              onLoad={() => setState("ok")}
              onError={() => setState("error")}
              style={{ opacity: state === "ok" ? 1 : 0 }}
            />
          </div>
        )}

        {state === "error" && (
          <div className="t26-graph__fallback">
            <p>LeetCode graph unavailable right now.</p>
            <a className="t26-btn t26-btn--ghost" href={LC_PROFILE} target="_blank" rel="noreferrer">
              View profile →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

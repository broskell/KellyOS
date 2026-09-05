import { useState } from "react";

/**
 * GitHub contribution graph. Renders the live contribution chart from the
 * ghchart service in GitHub's native green so the activity levels read at a
 * glance. If it can't load (offline / service down / rate-limited), it degrades
 * to a labelled card with a link to the profile — never a broken image
 * (phase-4 fallback table).
 */
const GH_USER = "broskell";
const GH_PROFILE = `https://github.com/${GH_USER}`;
// No base hex → ghchart uses GitHub's default green contribution scale.
const GH_SRC = `https://ghchart.rshah.org/${GH_USER}`;

export function GitHubGraph() {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");

  return (
    <div className="t26-graph t26-graph--gh">
      <div className="t26-graph__head">
        <span className="t26-graph__label">GitHub · contributions</span>
        <a className="t26-graph__link" href={GH_PROFILE} target="_blank" rel="noreferrer">
          @{GH_USER}
        </a>
      </div>

      <div className="t26-graph__body" data-state={state}>
        {state === "loading" && <div className="t26-graph__skeleton" aria-hidden="true" />}

        {state !== "error" && (
          <div className="t26-graph__scroll">
            <img
              className="t26-graph__img"
              src={GH_SRC}
              alt={`GitHub contribution graph for ${GH_USER}`}
              loading="lazy"
              onLoad={() => setState("ok")}
              onError={() => setState("error")}
              style={{ opacity: state === "ok" ? 1 : 0 }}
            />
          </div>
        )}

        {state === "error" && (
          <div className="t26-graph__fallback">
            <p>GitHub graph unavailable right now.</p>
            <a className="t26-btn t26-btn--ghost" href={GH_PROFILE} target="_blank" rel="noreferrer">
              View profile →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

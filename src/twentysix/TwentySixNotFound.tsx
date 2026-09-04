import { Link } from "react-router-dom";

/** Monochrome 404 for unknown /2026/* routes. Stays in the 26' era, no redirect to retro. */
export function TwentySixNotFound() {
  return (
    <div
      data-era26=""
      className="t26-root"
      style={{ display: "grid", placeItems: "center", padding: "var(--gutter)" }}
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p className="t26-eyebrow">Error 404</p>
        <h1 className="t26-display" style={{ marginTop: "0.5rem" }}>
          Lost signal
        </h1>
        <p className="t26-lead" style={{ marginTop: "1rem" }}>
          That page doesn’t exist in this edition.
        </p>
        <div style={{ marginTop: "2rem", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/2026" className="t26-btn t26-btn--solid">
            Home
          </Link>
          <Link to="/2026/blog" className="t26-btn">
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";

/**
 * Kelly.OS 2026 — placeholder landing after the transition. Deliberately NOT the
 * retro OS: a clean modern shell to signal the new era. The real 2026 site is
 * planned later; this is the destination the transition lands on for now.
 */
export function NextEdition() {
  return (
    <div
      className="flex min-h-full flex-col items-center justify-center px-6 text-center"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(120% 120% at 50% 0%, #14161c 0%, #050608 60%, #000 100%)",
        color: "#e8eaf0",
        fontFamily: "var(--kellos-font-ui-sans, system-ui, sans-serif)",
      }}
    >
      <p style={{ letterSpacing: "0.35em", fontSize: 12, color: "#7a8296", margin: 0 }}>KELLY.OS</p>
      <h1
        style={{
          margin: "0.4rem 0 0",
          fontSize: "clamp(48px, 12vw, 128px)",
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          background: "linear-gradient(180deg, #fff 0%, #9aa6c4 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        2026
      </h1>
      <p style={{ marginTop: "1.2rem", fontSize: "clamp(15px, 2.6vw, 20px)", color: "#aab2c6", maxWidth: 520 }}>
        A new edition is on the way. The 1996 desktop was chapter one — this is what comes next.
      </p>
      <p style={{ marginTop: "0.5rem", fontSize: 13, color: "#5f6678" }}>Saathvik Kellampalli · coming soon</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid #2a2f3a",
            color: "#cdd3e0",
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          ← Back to Kelly.OS ’96
        </Link>
        <Link
          to="/read/about"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: 8,
            background: "#e8eaf0",
            color: "#0a0b0e",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Read the portfolio →
        </Link>
      </div>
    </div>
  );
}

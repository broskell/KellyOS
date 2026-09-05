import { useEffect, useState, type CSSProperties } from "react";

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  /** Initials shown in the monochrome placeholder when the image is missing/broken. */
  initials?: string;
  ratio?: string; // e.g. "3 / 4"
  className?: string;
  imgClassName?: string;
  style?: CSSProperties;
  /** Apply grayscale-with-hover-recovery treatment. */
  recover?: boolean;
  /** Monochrome (26' default). Set false to render the image in full color. */
  grayscale?: boolean;
  /** Wrap in the standard card frame (border + surface + radius). Set false for
   *  a full-bleed, frameless image that blends into the canvas. */
  frame?: boolean;
  eager?: boolean;
}

/**
 * Image that never leaves a hole in the layout: on missing src or load error it
 * renders a sized monochrome placeholder (initials / silhouette). Grayscale by
 * default per the 26' image treatment.
 */
export function ImageWithFallback({
  src,
  alt,
  initials,
  ratio = "3 / 4",
  className,
  imgClassName,
  style,
  recover = true,
  grayscale = true,
  frame = true,
  eager = false,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const showImg = Boolean(src) && !failed;

  return (
    <div
      className={["t26-imgwrap", className].filter(Boolean).join(" ")}
      style={{
        position: "relative",
        aspectRatio: ratio,
        overflow: "hidden",
        borderRadius: frame ? "var(--r-md)" : 0,
        background: frame ? "var(--c-surface-2)" : "transparent",
        border: frame ? "1px solid var(--c-line)" : "none",
        ...style,
      }}
    >
      {showImg ? (
        <img
          src={src as string}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={[
            grayscale ? "t26-img" : "",
            grayscale && recover ? "t26-img--recover" : "",
            imgClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...(grayscale ? null : { filter: "none", background: "transparent" }),
          }}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(120% 120% at 50% 0%, var(--c-surface-2) 0%, var(--c-bg-2) 100%)",
            color: "var(--c-muted)",
            fontFamily: "var(--f-display)",
            fontSize: "clamp(1.5rem, 6vw, 3rem)",
            letterSpacing: "0.05em",
          }}
        >
          {initials ?? "◦"}
        </div>
      )}
    </div>
  );
}

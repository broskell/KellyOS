import { useEffect, useRef, useState } from "react";
import SphereImageGrid from "@/components/ui/img-sphere";
import { tech, techImages, techById, gridLogoUrl, initialsFallback, type Tech } from "../../data/tech";

interface TechSphereProps {
  /** "globe" = interactive sphere; "grid" = static icon grid (the mobile style). */
  mode: "globe" | "grid";
  selectedId: string | null;
  onSelect: (tech: Tech) => void;
}

/**
 * TechGlobe slot — wraps the reusable <SphereImageGrid/> (src/components/ui) with
 * the 26' tech logos. Renders either the interactive sphere or a static icon grid
 * depending on `mode` (TechStack forces "grid" on touch / reduced-motion).
 */
export function TechSphere({ mode, selectedId, onSelect }: TechSphereProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(440);

  // Size the sphere to its column (keeps it square and never overflows).
  useEffect(() => {
    if (mode !== "globe") return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setSize(Math.max(260, Math.min(460, Math.round(w))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  return (
    <div className="t26-techsphere-wrap" ref={wrapRef}>
      {mode === "grid" ? (
        <ul className="t26-techgrid" role="listbox" aria-label="Technologies">
          {tech.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                role="option"
                aria-selected={selectedId === t.id}
                className={"t26-techgrid__chip" + (selectedId === t.id ? " is-active" : "")}
                onClick={() => onSelect(t)}
                title={t.name}
              >
                <img
                  src={gridLogoUrl(t.slug)}
                  alt={`${t.name} logo`}
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget;
                    const fb = initialsFallback(t.name, true);
                    if (img.src !== fb) img.src = fb;
                  }}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="t26-techsphere"
          style={{ width: size, height: size }}
          data-selected={selectedId ?? ""}
        >
          <SphereImageGrid
            images={techImages}
            containerSize={size}
            sphereRadius={Math.round(size * 0.42)}
            baseImageScale={0.17}
            dragSensitivity={0.8}
            momentumDecay={0.96}
            maxRotationSpeed={6}
            perspective={1100}
            autoRotate
            autoRotateSpeed={0.18}
            eagerImages
            onSelect={(img) => {
              const t = techById.get(img.id);
              if (t) onSelect(t);
            }}
          />
        </div>
      )}
    </div>
  );
}

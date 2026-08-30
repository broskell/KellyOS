import { NavLink, useLocation } from "react-router-dom";
import { PixelIcon } from "../brand/marks";
import { appsLaunchableOn } from "../registry/manifest";
import type { AppManifestEntry } from "../registry/types";
import { specForPath } from "../wm/specs";
import { useWmStore } from "../wm/store";

export function DesktopIcons({ compact }: { compact: boolean }) {
  const icons = appsLaunchableOn(compact ? "mobileGrid" : "desktopIcon");
  const wm = useWmStore((s) => s.wm);
  const focused = wm.windows.find((w) => w.id === wm.focusedId);
  const selectedSlug =
    focused?.appId === "caseStudy" ? "projects" : (focused?.appId ?? "about");

  return (
    <nav
      className={compact ? "os-icon-grid" : "os-icon-col"}
      data-os-icons=""
      aria-label="Desktop"
      style={{ zIndex: "var(--kellos-z-icons)" }}
    >
      {icons.map((app) => (
        <IconButton key={app.id} app={app} selected={app.slug === selectedSlug} />
      ))}
    </nav>
  );
}

function IconButton({ app, selected }: { app: AppManifestEntry; selected: boolean }) {
  const location = useLocation();
  const open = useWmStore((s) => s.open);
  if (!app.route || app.route.includes(":")) return null;
  return (
    <NavLink
      to={app.route}
      className="os-icon flex flex-col items-center gap-1 border-0 bg-transparent p-1 no-underline"
      data-selected={selected}
      aria-current={selected ? "page" : undefined}
      onClick={() => {
        const spec = specForPath(app.route === "/about" && location.pathname === "/" ? "/" : app.route);
        if (spec) open(spec);
      }}
    >
      <PixelIcon name={app.icon} />
      <span className="os-icon-label">{app.title}</span>
    </NavLink>
  );
}

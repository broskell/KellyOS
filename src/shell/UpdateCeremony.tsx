import { useEffect, useRef } from "react";
import { BootMark, Wordmark } from "../brand/marks";
import { OS_VERSIONS, VERSION_REPRESENTS, osVersion } from "../content/versions";
import { versionRank } from "../content/versionFlags";
import { playCeremonyIn, playCeremonyOut } from "../motion/play";
import type { Ceremony } from "./VersionContext";

/**
 * The update ceremony — shown to returning visitors only, when the site has
 * grown since their last visit. New visitors never see it (they boot latest).
 * Skippable on the first frame; reduced motion resolves it without animation.
 * A shell overlay, not a window and never part of the WM core.
 */
export function UpdateCeremony({
  ceremony,
  onClose,
}: {
  ceremony: Ceremony;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  useEffect(() => {
    playCeremonyIn(rootRef.current);
    btnRef.current?.focus();
  }, []);

  const close = () => {
    if (leaving.current) return;
    leaving.current = true;
    playCeremonyOut(rootRef.current, onClose);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const from = osVersion(ceremony.from);
  const to = osVersion(ceremony.to);
  const added = OS_VERSIONS.filter(
    (v) => versionRank(v.id) > versionRank(ceremony.from) && versionRank(v.id) <= versionRank(ceremony.to),
  );

  return (
    <div
      ref={rootRef}
      className="os-desktop absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-6 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="os-ceremony-title"
      data-os-ceremony=""
    >
      <div className="os-raised bg-face max-w-md p-6">
        <div className="flex items-center gap-3">
          <BootMark size={40} decorative />
          <Wordmark size={14} decorative />
        </div>
        <h1 id="os-ceremony-title" className="font-chrome mt-4 text-[13px] font-bold">
          {ceremony.real ? "Kelly.OS updated while you were away" : "Replaying the last update"}
        </h1>
        <p className="font-chrome text-muted mt-1 m-0">
          {from.number} → {to.number}. Same site, more of it — versions are feature flags over one
          data set, never a separate build.
        </p>
        <ul className="mt-4 space-y-3">
          {added.map((v) => (
            <li key={v.id} className="os-sunken os-well p-3">
              <p className="font-chrome m-0 text-[11px] font-bold">
                Kelly.OS {v.number}
                {v.codename ? ` — ${v.codename}` : ""}
              </p>
              <p className="font-chrome mt-1 m-0">{VERSION_REPRESENTS[v.id]}</p>
            </li>
          ))}
        </ul>
        <p className="font-chrome text-muted mt-4 m-0">
          New visitors always boot the newest version. This ceremony is for returning visitors only.
        </p>
      </div>
      <button ref={btnRef} type="button" className="os-btn os-raised z-[10010]" onClick={close}>
        {ceremony.real ? `Continue to ${to.number}` : "Close"}
      </button>
    </div>
  );
}

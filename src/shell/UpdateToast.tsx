import { useEffect, useRef } from "react";
import { osVersion } from "../content/versions";
import { playMenuIn } from "../motion/play";
import { useVersion } from "./VersionContext";

/**
 * Update toast — shown only to a returning visitor whose site grew since their
 * last visit (honest: new visitors always boot latest, so they never see it).
 * "Install update" plays the update ceremony; dismiss acknowledges it. This is
 * the desktop-native front door to the Phase 14 ceremony.
 */
export function UpdateToast() {
  const { pendingUpdate, installUpdate, acknowledgeUpdate } = useVersion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pendingUpdate) playMenuIn(ref.current);
  }, [pendingUpdate]);

  if (!pendingUpdate) return null;
  const to = osVersion(pendingUpdate.to);

  return (
    <div
      ref={ref}
      className="os-raised bg-face fixed bottom-14 right-3 z-[9000] w-72 max-w-[80vw]"
      data-os-update-toast=""
      role="status"
      aria-live="polite"
    >
      <div className="os-titlebar">
        <span className="os-titlebar-label">✦ Kelly.OS Update</span>
        <button
          type="button"
          className="os-ctrl os-raised"
          aria-label="Dismiss update"
          onClick={acknowledgeUpdate}
        >
          ×
        </button>
      </div>
      <p className="font-chrome mb-0 mt-0 px-3 pt-3 leading-snug">
        A newer version of this portfolio is available.
        <br />
        <strong>
          Kelly.OS {osVersion(pendingUpdate.from).number} → {to.number}.
        </strong>
      </p>
      <div className="px-3 pb-3 pt-2">
        <button type="button" className="os-btn os-raised" onClick={installUpdate}>
          Install update ↻
        </button>
      </div>
    </div>
  );
}

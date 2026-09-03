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
      className="os-raised bg-face fixed bottom-14 right-3 z-[9000] w-72 max-w-[80vw] p-3"
      data-os-update-toast=""
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span className="font-chrome text-[11px] font-bold">✦ Kelly.OS Update</span>
        <button
          type="button"
          className="os-btn os-raised px-1 py-0 text-[11px] leading-none"
          aria-label="Dismiss update"
          onClick={acknowledgeUpdate}
        >
          ×
        </button>
      </div>
      <p className="font-chrome mt-2 mb-0 leading-snug">
        A newer version of this portfolio is available.
        <br />
        <strong>
          Kelly.OS {osVersion(pendingUpdate.from).number} → {to.number}.
        </strong>
      </p>
      <div className="mt-2">
        <button type="button" className="os-btn os-raised" onClick={installUpdate}>
          Install update ↻
        </button>
      </div>
    </div>
  );
}

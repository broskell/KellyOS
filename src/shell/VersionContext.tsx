import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { timelineEntries } from "../content/live";
import type { TimelineEntry } from "../content/timeline";
import type { VersionId } from "../content/types";
import { LATEST_VERSION_ID, osVersion } from "../content/versions";
import {
  classifyVisit,
  readSeenVersion,
  readViewingVersion,
  visibleUpTo,
  writeSeenVersion,
  writeViewingVersion,
  type VisitClass,
} from "../content/versionState";

/**
 * Version flags at content load (blueprint §4.2). This provider is the single
 * place that turns "which version" into already-filtered data. Window
 * components read the filtered lists and labels below — they never branch on a
 * version id themselves. Lives in the shell, never in the WM core.
 */

export interface Ceremony {
  from: VersionId;
  to: VersionId;
  /** True when this is the real returning-visitor update (dismissing it marks latest seen). */
  real: boolean;
}

interface VersionContextValue {
  latest: VersionId;
  viewing: VersionId;
  viewingLabel: string;
  setViewing: (id: VersionId) => void;
  timelineEntries: TimelineEntry[];
  ceremony: Ceremony | null;
  replayCeremony: (from: VersionId, to: VersionId) => void;
  dismissCeremony: () => void;
}

const VersionCtx = createContext<VersionContextValue | null>(null);

function initialViewing(): VersionId {
  return readViewingVersion() ?? LATEST_VERSION_ID;
}

function initialVisit(): VisitClass {
  return classifyVisit(readSeenVersion(), LATEST_VERSION_ID);
}

export function VersionProvider({ children }: { children: ReactNode }) {
  const [viewing, setViewingState] = useState<VersionId>(initialViewing);

  // Classify the visit once, at load. A new or already-current visitor is
  // marked as having seen latest immediately; a returning-updated visitor is
  // marked only when they dismiss the ceremony.
  const [ceremony, setCeremony] = useState<Ceremony | null>(() => {
    const visit = initialVisit();
    if (visit.kind === "returning-updated") {
      return { from: visit.from, to: visit.to, real: true };
    }
    writeSeenVersion(LATEST_VERSION_ID);
    return null;
  });

  const setViewing = useCallback((id: VersionId) => {
    setViewingState(id);
    writeViewingVersion(id);
  }, []);

  const replayCeremony = useCallback((from: VersionId, to: VersionId) => {
    setCeremony({ from, to, real: false });
  }, []);

  const dismissCeremony = useCallback(() => {
    setCeremony((c) => {
      if (c?.real) writeSeenVersion(LATEST_VERSION_ID);
      return null;
    });
  }, []);

  const value = useMemo<VersionContextValue>(() => {
    return {
      latest: LATEST_VERSION_ID,
      viewing,
      viewingLabel: `KELL.OS ${osVersion(viewing).number}`,
      setViewing,
      timelineEntries: visibleUpTo(timelineEntries, viewing),
      ceremony,
      replayCeremony,
      dismissCeremony,
    };
  }, [viewing, setViewing, ceremony, replayCeremony, dismissCeremony]);

  return <VersionCtx.Provider value={value}>{children}</VersionCtx.Provider>;
}

export function useVersion(): VersionContextValue {
  const ctx = useContext(VersionCtx);
  if (!ctx) {
    // Prerender / Reader Mode render outside the shell — always latest, full data.
    return {
      latest: LATEST_VERSION_ID,
      viewing: LATEST_VERSION_ID,
      viewingLabel: `KELL.OS ${osVersion(LATEST_VERSION_ID).number}`,
      setViewing: () => {},
      timelineEntries,
      ceremony: null,
      replayCeremony: () => {},
      dismissCeremony: () => {},
    };
  }
  return ctx;
}

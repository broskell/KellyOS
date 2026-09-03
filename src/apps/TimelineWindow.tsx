import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { timelineBlocksFor } from "../content/live";
import { useVersion } from "../shell/VersionContext";
import { ReaderMenu } from "./ReaderMenu";

export default function TimelineWindow() {
  // Already version-filtered at content load by VersionContext — this window
  // never asks "which version are we in?"; it renders the entries it is given.
  const { timelineEntries, viewingLabel } = useVersion();

  return (
    <WindowFrame
      title="Timeline"
      status={`KELL.OS 1.0 ORIGIN era  ·  2.0  ·  3.0 current  ·  viewing ${viewingLabel}`}
      menu={<ReaderMenu to="/read/timeline" />}
      className="h-full min-h-0 w-full"
    >
      <BlockRenderer blocks={timelineBlocksFor(timelineEntries)} />
    </WindowFrame>
  );
}

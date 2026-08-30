import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { timelineBlocks } from "../content/live";
import { ReaderMenu } from "./ReaderMenu";

export default function TimelineWindow() {
  return (
    <WindowFrame
      title="Timeline"
      status="KELL.OS 1.0 ORIGIN era  ·  2.0  ·  3.0 current"
      menu={<ReaderMenu to="/read/timeline" />}
      className="h-full min-h-0 w-full"
    >
      <BlockRenderer blocks={timelineBlocks()} />
    </WindowFrame>
  );
}

import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { nowBlocks } from "../content/live";
import { ReaderMenu } from "./ReaderMenu";

export default function NowWindow() {
  return (
    <WindowFrame
      title="Now"
      status="Visibly dated  ·  review monthly"
      menu={<ReaderMenu to="/read/now" />}
      className="h-full min-h-0 w-full"
    >
      <BlockRenderer blocks={nowBlocks()} />
    </WindowFrame>
  );
}

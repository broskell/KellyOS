import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { recycleBlocks } from "../content/recycle";
import { ReaderMenu } from "./ReaderMenu";

export default function RecycleWindow() {
  return (
    <WindowFrame
      title="Recycle Bin"
      status="Abandoned projects  ·  not a product"
      menu={<ReaderMenu to="/read/recycle" />}
      className="h-full min-h-0 w-full"
    >
      <BlockRenderer blocks={recycleBlocks} />
    </WindowFrame>
  );
}

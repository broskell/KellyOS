import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { contactBlocks } from "../content/contact";
import { ReaderMenu } from "./ReaderMenu";

export default function ContactWindow() {
  return (
    <WindowFrame title="Contact" menu={<ReaderMenu to="/read/contact" />} className="h-full min-h-0 w-full">
      <BlockRenderer blocks={contactBlocks} />
    </WindowFrame>
  );
}

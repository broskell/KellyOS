import { Link } from "react-router-dom";
import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { aboutBlocks } from "../content/about";
import { appById } from "../registry/manifest";
import { ReaderMenu } from "./ReaderMenu";

export default function AboutWindow() {
  const title = appById("about")?.windowTitle ?? "About Me";
  return (
    <WindowFrame
      title={title}
      menu={<ReaderMenu to="/read/about" extra={<Link to="/projects">Projects</Link>} />}
      status="Kelly.OS 3.0  ·  new visitors boot latest"
      className="h-full min-h-0 w-full"
    >
      <BlockRenderer blocks={aboutBlocks} />
    </WindowFrame>
  );
}

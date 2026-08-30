import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { resumeBlocks } from "../content/resume";
import { ReaderMenu } from "./ReaderMenu";

export default function ResumeWindow() {
  return (
    <WindowFrame title="Résumé" menu={<ReaderMenu to="/read/resume" />} className="h-full min-h-0 w-full">
      <BlockRenderer blocks={resumeBlocks} />
    </WindowFrame>
  );
}

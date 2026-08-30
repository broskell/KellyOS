import { BlockRenderer } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { langchainBlocks, langchainTitle } from "../content/live";
import { FEATURED_CASE_STUDY_SLUG } from "../registry/manifest";
import { ReaderMenu } from "./ReaderMenu";

export default function CaseStudyWindow({ slug }: { slug: string }) {
  if (slug !== FEATURED_CASE_STUDY_SLUG) {
    return (
      <WindowFrame title="Case Study" className="h-full min-h-0 w-full">
        <div className="p-5 font-body">
          <p>No published case study at this URL. The written study is {FEATURED_CASE_STUDY_SLUG}.</p>
        </div>
      </WindowFrame>
    );
  }
  return (
    <WindowFrame
      title={`Case Study — ${slug}`}
      status="Deep link target  ·  OS remains around this window"
      menu={<ReaderMenu to={`/read/project/${slug}`} />}
      className="h-full min-h-0 w-full"
    >
      <header className="border-b border-bevel-shadow bg-window-paper px-5 py-4 font-ui">
        <h2 className="text-2xl font-bold tracking-tight">{langchainTitle}</h2>
      </header>
      <BlockRenderer blocks={langchainBlocks} />
    </WindowFrame>
  );
}

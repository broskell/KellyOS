import { BlockRenderer } from "../blocks/BlockRenderer";
import { aboutBlocks, langchainBlocks } from "../content/sample";
import { OsButton } from "../chrome/WindowFrame";

export function ReaderMode({ onBack }: { onBack: () => void }) {
  return (
    <div className="reader-shell min-h-full">
      <header className="border-b border-reader-rule px-4 py-3 font-ui text-sm text-reader-muted">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span>Kelly.OS · Reader Mode</span>
          <OsButton onClick={onBack}>Back to desktop</OsButton>
        </div>
      </header>
      <article className="reader-doc">
        <p className="font-ui mb-8 text-sm tracking-wide text-reader-muted uppercase">
          Stripped of the OS. Same words. For a hurried recruiter and for a crawler.
        </p>
        <BlockRenderer blocks={aboutBlocks} surface="reader" gateExternalLinks={false} />
        <hr className="my-10 border-reader-rule" />
        <h1 className="font-ui mb-6 text-3xl font-bold tracking-tight">
          Landing a feature in LangChain in 24 hours
        </h1>
        <BlockRenderer blocks={langchainBlocks} surface="reader" gateExternalLinks={false} />
      </article>
    </div>
  );
}

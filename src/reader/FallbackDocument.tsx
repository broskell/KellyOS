import { BlockRenderer } from "../blocks/BlockRenderer";
import { blocksAfterDocumentTitle } from "../content/outline";
import type { DocumentDoc } from "../content/documents";

export function FallbackDocument({ doc }: { doc: DocumentDoc }) {
  return (
    <>
      <h1 className="font-ui mb-6 text-3xl font-bold tracking-tight">{doc.heading}</h1>
      <BlockRenderer blocks={blocksAfterDocumentTitle(doc)} surface="reader" />
    </>
  );
}

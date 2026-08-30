import { documents } from "../content/documents";
import { FallbackDocument } from "../reader/FallbackDocument";
import type { StaticPage } from "./pages";

export function StaticFallback({ page }: { page: StaticPage }) {
  const doc = documents[page.docId];
  return (
    <div className="reader-shell" data-static-fallback="true">
      <header className="border-b border-reader-rule px-4 py-3 font-ui text-sm text-reader-muted">
        <div className="mx-auto max-w-xl">KELL.OS · Reader Mode · static fallback</div>
      </header>
      <main>
        <article className="reader-doc">
          <p className="font-ui mb-8 text-sm tracking-wide text-reader-muted uppercase">
            Stripped of the OS. Same words. For a hurried recruiter and for a crawler.
          </p>
          <FallbackDocument doc={doc} />
        </article>
      </main>
    </div>
  );
}

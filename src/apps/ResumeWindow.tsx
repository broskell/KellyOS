import { WindowFrame } from "../chrome/WindowFrame";
import { ReaderMenu } from "./ReaderMenu";

const RESUME_PDF = "/Saathvik_Kellampalli_Resume.pdf";

/**
 * Résumé window embeds the real PDF (the authoritative CV). The plain-text
 * version stays in Reader Mode and the static prerender (documents.ts) so
 * crawlers, link previews, and no-JS visitors still get the content.
 */
export default function ResumeWindow() {
  return (
    <WindowFrame
      title="Résumé"
      status="Saathvik_Kellampalli_Resume.pdf"
      menu={<ReaderMenu to="/read/resume" />}
      className="h-full min-h-0 w-full"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--kellos-bevel-shadow)] p-1">
          <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="os-btn os-raised no-underline">
            Open in new tab
          </a>
          <a href={RESUME_PDF} download className="os-btn os-raised no-underline">
            Download PDF
          </a>
          <span className="font-chrome text-muted text-[11px]">Plain-text version is in Reader Mode.</span>
        </div>
        <object
          data={RESUME_PDF}
          type="application/pdf"
          className="min-h-0 w-full flex-1"
          aria-label="Saathvik Kellampalli résumé (PDF)"
        >
          <div className="p-4 font-chrome">
            This browser can’t display the PDF inline.{" "}
            <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="underline">
              Open the résumé PDF
            </a>
            .
          </div>
        </object>
      </div>
    </WindowFrame>
  );
}

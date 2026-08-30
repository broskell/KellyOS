import { WindowFrame, OsButton } from "../chrome/WindowFrame";
import { BlockRenderer } from "../blocks/BlockRenderer";
import { langchainBlocks } from "../content/sample";

export function ProjectsOneStudy({ onOpenStudy }: { onOpenStudy: () => void }) {
  return (
    <WindowFrame
      title="Projects"
      status="1 case study  ·  gallery is a view, not a second app"
      className="min-h-[32rem] w-full max-w-3xl"
    >
      <div className="p-4 font-ui">
        <fieldset className="os-group os-sunken">
          <span className="os-group-label">Case study</span>
          <button
            type="button"
            onClick={onOpenStudy}
            className="flex w-full flex-col gap-1 border-0 bg-window-paper p-3 text-left"
          >
            <span className="font-chrome text-chrome font-bold">
              Landing a feature in LangChain in 24 hours
            </span>
            <span className="text-sm text-muted">
              The only externally verified engineering work in this portfolio
            </span>
            <span className="font-chrome text-chrome">OpenRouter provider · PR #39301</span>
          </button>
        </fieldset>

        <fieldset className="os-group os-sunken mt-6">
          <span className="os-group-label">Also shipped</span>
          <p className="mb-3 text-sm text-muted">
            Short factual rows. Not case studies. Layout holds with a short list and no
            screenshots.
          </p>
          {[
            "Roast My Project — gallery (case study blocked)",
            "PawSethu — gallery until technical review",
            "Ducati Scrollytelling — gallery",
          ].map((row) => (
            <div key={row} className="os-sunken mb-1 bg-window-paper px-2 py-2 text-sm">
              {row}
            </div>
          ))}
        </fieldset>
      </div>
    </WindowFrame>
  );
}

export function CaseStudyWindow() {
  return (
    <WindowFrame
      title="Case Study — langchain-openrouter-provider"
      status="Deep link target  ·  OS remains around this window"
      className="min-h-[36rem] w-full max-w-3xl"
    >
      <header className="border-b border-bevel-shadow bg-window-paper px-5 py-4 font-ui">
        <h1 className="text-2xl font-bold tracking-tight">
          Landing a feature in LangChain in 24 hours
        </h1>
      </header>
      <BlockRenderer blocks={langchainBlocks} gateExternalLinks={false} />
    </WindowFrame>
  );
}

export function EmptyAndSkills() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <WindowFrame title="Outcomes" className="min-h-0">
        <div className="os-sunken block-metrics-empty m-4">
          No verified metrics yet. Figures appear here only when they have a source.
        </div>
      </WindowFrame>
      <WindowFrame title="Skills — evidence type, not ability" className="min-h-0 max-w-3xl">
        <div className="space-y-4 p-4 font-ui">
          <p className="font-body text-body leading-[1.62]">
            Every skill is placed by the kind of evidence behind it, not by how confident I
            feel. There are no percentages, no five-star ratings, and no progress bars, because
            those are opinions dressed up as data.
          </p>
          <fieldset className="os-group os-sunken">
            <span className="os-group-label">Tier 1 — Externally verified</span>
            <p className="mb-2 text-sm text-muted">
              Someone outside me paid for it, merged it, or reviewed it.
            </p>
            <p>
              <strong>Git / GitHub</strong> — Merged PR #39301 in langchain-ai/langchain
            </p>
          </fieldset>
          <fieldset className="os-group os-sunken">
            <span className="os-group-label">Tier 2 — Shipped publicly</span>
            <p className="text-sm">React · JavaScript · HTML / CSS · Tailwind CSS · Next.js · Firebase · SQL / PostgreSQL · REST APIs · Python for data work</p>
          </fieldset>
          <details className="os-group os-sunken">
            <summary className="os-group-label cursor-pointer">
              Tier 3 — Worked with (34 — expand)
            </summary>
            <p className="mt-2 text-sm text-muted">
              Used in a project or in coursework. I'd need to look things up.
            </p>
            <p className="mt-2 text-sm">
              Node.js / Express · Fastify · MongoDB · Three.js · GSAP · Lenis · React Native ·
              Flutter · Docker · Linux / Ubuntu / networking · PHP · Supabase · Prisma · Payload
              CMS · Zustand · React Three Fiber · Azure · Redis · Socket.IO · AWS · Tableau ·
              Power BI · KNIME · Weka · OpenCV · MediaPipe · React Router · Axios · React Hook Form
              · Zod · Postman · Hugging Face · Google Colab · Kaggle
            </p>
          </details>
        </div>
      </WindowFrame>
      <p className="font-chrome">
        <OsButton disabled>No stats grid</OsButton> — a metrics block with no numbers is a
        written empty state, never a row of zeros.
      </p>
    </div>
  );
}

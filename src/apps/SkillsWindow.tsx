import { InlineRichText } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { skillsHowToRead, skillTiers } from "../content/live";
import { appById } from "../registry/manifest";
import { ReaderMenu } from "./ReaderMenu";

export default function SkillsWindow() {
  return (
    <WindowFrame
      title={appById("skills")?.windowTitle ?? "Skills"}
      menu={<ReaderMenu to="/read/skills" />}
      className="h-full min-h-0 w-full"
    >
      <div className="space-y-4 p-4 font-ui">
        {skillsHowToRead.map((p) => (
          <p key={p.slice(0, 20)} className="font-body text-body leading-[1.62]">
            {p}
          </p>
        ))}
        <fieldset className="os-group os-sunken">
          <span className="os-group-label">{skillTiers[1].title}</span>
          <p className="mb-2 text-sm text-muted">{skillTiers[1].subtitle}</p>
          {skillTiers[1].items.map((item) => (
            <p key={item.name} className="mb-2">
              <strong>{item.name}</strong>
              {item.scopeNote ? ` (${item.scopeNote})` : null} —{" "}
              <InlineRichText text={item.evidence} />
            </p>
          ))}
        </fieldset>
        <fieldset className="os-group os-sunken">
          <span className="os-group-label">{skillTiers[2].title}</span>
          <p className="mb-2 text-sm text-muted">{skillTiers[2].subtitle}</p>
          <p>{skillTiers[2].names.join(" · ")}</p>
        </fieldset>
        <details className="os-group os-sunken">
          <summary className="os-group-label cursor-pointer">
            {skillTiers[3].title} ({skillTiers[3].names.length} — expand)
          </summary>
          <p className="mt-2 text-sm text-muted">{skillTiers[3].subtitle}</p>
          <p className="mt-2 text-sm">{skillTiers[3].names.join(" · ")}</p>
        </details>
      </div>
    </WindowFrame>
  );
}

import type { ExternalLink } from "../../src/content/types";
import { emptyLink } from "./forms";

const KINDS: ExternalLink["kind"][] = [
  "live",
  "repo",
  "pr",
  "issue",
  "article",
  "video",
  "profile",
  "other",
];

export function LinksField({
  value,
  onChange,
}: {
  value: ExternalLink[];
  onChange: (links: ExternalLink[]) => void;
}) {
  return (
    <fieldset className="stack">
      <legend>External links</legend>
      <p className="hint">
        Unverified links can be stored as draft. They cannot publish. Do not tick verified unless the
        A1.1 sweep actually happened — this form will not invent <code>verified: true</code> for you.
      </p>
      {value.map((link, i) => (
        <div className="card" key={i}>
          <div className="grid-2">
            <label>
              Kind
              <select
                value={link.kind}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...link, kind: e.target.value as ExternalLink["kind"] };
                  onChange(next);
                }}
              >
                {KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Label
              <input
                value={link.label}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...link, label: e.target.value };
                  onChange(next);
                }}
              />
            </label>
            <label className="span-2">
              URL
              <input
                value={link.url}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...link, url: e.target.value };
                  onChange(next);
                }}
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={link.verified}
                onChange={(e) => {
                  const verified = e.target.checked;
                  const next = [...value];
                  next[i] = {
                    ...link,
                    verified,
                    verifiedAt: verified ? (link.verifiedAt || new Date().toISOString().slice(0, 10)) : undefined,
                  };
                  onChange(next);
                }}
              />
              verified
            </label>
            <label>
              verifiedAt (required if verified)
              <input
                value={link.verifiedAt ?? ""}
                onChange={(e) => {
                  const next = [...value];
                  next[i] = { ...link, verifiedAt: e.target.value || undefined };
                  onChange(next);
                }}
              />
            </label>
          </div>
          {!link.verified ? <p className="warn">Unverified — cannot publish</p> : null}
          <button type="button" className="ghost" onClick={() => onChange(value.filter((_, j) => j !== i))}>
            Remove link
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, emptyLink()])}>
        Add link
      </button>
    </fieldset>
  );
}

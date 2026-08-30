import type { AssetRef, ContentBlock } from "../../src/content/types";
import { blockLiveNotes, emptyAssetRef, emptyBlock, emptyLink } from "./forms";
import { LinksField } from "./LinksField";

const TYPES: ContentBlock["type"][] = [
  "heading",
  "prose",
  "list",
  "code",
  "quote",
  "callout",
  "image",
  "gallery",
  "diagram",
  "keyValue",
  "comparison",
  "metrics",
  "linkGroup",
  "embed",
  "divider",
];

function AssetRefFields({
  value,
  onChange,
}: {
  value: AssetRef;
  onChange: (next: AssetRef) => void;
}) {
  return (
    <div className="grid-2">
      <label>
        asset id
        <input value={value.id} onChange={(e) => onChange({ ...value, id: e.target.value })} />
      </label>
      <label>
        alt (required)
        <input value={value.alt} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
      </label>
      <label className="span-2">
        caption
        <input
          value={value.caption ?? ""}
          onChange={(e) => onChange({ ...value, caption: e.target.value || undefined })}
        />
      </label>
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onRemove,
}: {
  block: ContentBlock;
  onChange: (next: ContentBlock) => void;
  onRemove: () => void;
}) {
  const notes = blockLiveNotes(block);
  return (
    <article className="card">
      <header className="row">
        <code>{block.id}</code>
        <span className="muted">order {block.order}</span>
        <button type="button" className="ghost" onClick={onRemove}>
          Remove block
        </button>
      </header>
      {notes.length ? (
        <ul className="warn-list">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}
      {block.type === "heading" ? (
        <div className="grid-2">
          <label>
            level
            <select
              value={block.level}
              onChange={(e) =>
                onChange({ ...block, level: Number(e.target.value) as 2 | 3 | 4 })
              }
            >
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </label>
          <label>
            anchor
            <input value={block.anchor} onChange={(e) => onChange({ ...block, anchor: e.target.value })} />
          </label>
          <label className="span-2">
            text
            <input value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
          </label>
        </div>
      ) : null}
      {block.type === "prose" ? (
        <label>
          text
          <textarea rows={5} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
        </label>
      ) : null}
      {block.type === "list" ? (
        <>
          <label>
            style
            <select
              value={block.style}
              onChange={(e) =>
                onChange({ ...block, style: e.target.value as "bullet" | "numbered" })
              }
            >
              <option value="bullet">bullet</option>
              <option value="numbered">numbered</option>
            </select>
          </label>
          <label>
            items (one per line)
            <textarea
              rows={5}
              value={block.items.join("\n")}
              onChange={(e) => onChange({ ...block, items: e.target.value.split("\n") })}
            />
          </label>
        </>
      ) : null}
      {block.type === "code" ? (
        <>
          <div className="grid-2">
            <label>
              language
              <input
                value={block.language}
                onChange={(e) => onChange({ ...block, language: e.target.value })}
              />
            </label>
            <label>
              filename
              <input
                value={block.filename ?? ""}
                onChange={(e) => onChange({ ...block, filename: e.target.value || undefined })}
              />
            </label>
          </div>
          <label>
            code
            <textarea rows={8} value={block.code} onChange={(e) => onChange({ ...block, code: e.target.value })} />
          </label>
        </>
      ) : null}
      {block.type === "quote" ? (
        <>
          <label>
            text
            <textarea rows={3} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
          </label>
          <label>
            attribution
            <input
              value={block.attribution ?? ""}
              onChange={(e) => onChange({ ...block, attribution: e.target.value || undefined })}
            />
          </label>
          <label>
            sourceUrl
            <input
              value={block.sourceUrl ?? ""}
              onChange={(e) => onChange({ ...block, sourceUrl: e.target.value || undefined })}
            />
          </label>
        </>
      ) : null}
      {block.type === "callout" ? (
        <>
          <label>
            variant
            <select
              value={block.variant}
              onChange={(e) =>
                onChange({
                  ...block,
                  variant: e.target.value as "note" | "caution" | "limitation" | "disclosure",
                })
              }
            >
              <option value="note">note</option>
              <option value="caution">caution</option>
              <option value="limitation">limitation</option>
              <option value="disclosure">disclosure</option>
            </select>
          </label>
          <label>
            title
            <input
              value={block.title ?? ""}
              onChange={(e) => onChange({ ...block, title: e.target.value || undefined })}
            />
          </label>
          <label>
            text
            <textarea rows={3} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
          </label>
        </>
      ) : null}
      {block.type === "image" ? (
        <AssetRefFields value={block.asset} onChange={(asset) => onChange({ ...block, asset })} />
      ) : null}
      {block.type === "gallery" ? (
        <>
          {block.assets.map((asset, i) => (
            <AssetRefFields
              key={i}
              value={asset}
              onChange={(next) => {
                const assets = [...block.assets];
                assets[i] = next;
                onChange({ ...block, assets });
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...block, assets: [...block.assets, emptyAssetRef()] })}
          >
            Add asset
          </button>
        </>
      ) : null}
      {block.type === "diagram" ? (
        <>
          <label>
            format
            <select
              value={block.format}
              onChange={(e) =>
                onChange({ ...block, format: e.target.value as "mermaid" | "svg" | "image" })
              }
            >
              <option value="mermaid">mermaid</option>
              <option value="svg">svg</option>
              <option value="image">image</option>
            </select>
          </label>
          <label>
            altDescription (required)
            <textarea
              rows={3}
              value={block.altDescription}
              onChange={(e) => onChange({ ...block, altDescription: e.target.value })}
            />
          </label>
          <label>
            source
            <textarea
              rows={4}
              value={block.source ?? ""}
              onChange={(e) => onChange({ ...block, source: e.target.value || undefined })}
            />
          </label>
        </>
      ) : null}
      {block.type === "keyValue" ? (
        <label>
          rows as key|value per line
          <textarea
            rows={5}
            value={block.rows.map((r) => `${r.key}|${r.value}`).join("\n")}
            onChange={(e) =>
              onChange({
                ...block,
                rows: e.target.value.split("\n").map((line) => {
                  const [key, ...rest] = line.split("|");
                  return { key: key ?? "", value: rest.join("|") };
                }),
              })
            }
          />
        </label>
      ) : null}
      {block.type === "comparison" ? (
        <>
          <label>
            columns (comma)
            <input
              value={block.columns.join(", ")}
              onChange={(e) => {
                const columns = e.target.value.split(",").map((c) => c.trim());
                onChange({ ...block, columns, rows: block.rows.map((row) => row.slice(0, columns.length)) });
              }}
            />
          </label>
          <label>
            rows (pipe-separated, one per line)
            <textarea
              rows={5}
              value={block.rows.map((row) => row.join("|")).join("\n")}
              onChange={(e) =>
                onChange({
                  ...block,
                  rows: e.target.value.split("\n").map((line) => line.split("|")),
                })
              }
            />
          </label>
        </>
      ) : null}
      {block.type === "metrics" ? (
        <>
          <p className="hint">Every metric needs a source. verified is explicit — default false.</p>
          {block.metrics.map((metric, i) => (
            <div className="card" key={i}>
              <label>
                label
                <input
                  value={metric.label}
                  onChange={(e) => {
                    const metrics = [...block.metrics];
                    metrics[i] = { ...metric, label: e.target.value };
                    onChange({ ...block, metrics });
                  }}
                />
              </label>
              <label>
                value (string)
                <input
                  value={metric.value}
                  onChange={(e) => {
                    const metrics = [...block.metrics];
                    metrics[i] = { ...metric, value: e.target.value };
                    onChange({ ...block, metrics });
                  }}
                />
              </label>
              <label>
                source (required)
                <input
                  required
                  value={metric.source}
                  onChange={(e) => {
                    const metrics = [...block.metrics];
                    metrics[i] = { ...metric, source: e.target.value };
                    onChange({ ...block, metrics });
                  }}
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={metric.verified}
                  onChange={(e) => {
                    const metrics = [...block.metrics];
                    metrics[i] = { ...metric, verified: e.target.checked };
                    onChange({ ...block, metrics });
                  }}
                />
                verified
              </label>
            </div>
          ))}
        </>
      ) : null}
      {block.type === "linkGroup" ? (
        <LinksField
          value={block.links}
          onChange={(links) => onChange({ ...block, links: links.length ? links : [emptyLink()] })}
        />
      ) : null}
      {block.type === "embed" ? (
        <div className="grid-2">
          <label>
            provider
            <input
              value={block.provider}
              onChange={(e) => onChange({ ...block, provider: e.target.value })}
            />
          </label>
          <label>
            title
            <input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} />
          </label>
          <label className="span-2">
            url
            <input value={block.url} onChange={(e) => onChange({ ...block, url: e.target.value })} />
          </label>
        </div>
      ) : null}
    </article>
  );
}

export function BlocksField({
  value,
  onChange,
}: {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  return (
    <fieldset className="stack">
      <legend>ContentBlock[]</legend>
      <p className="hint">No visual fields. Semantics only. Array position is canonical order.</p>
      {value.map((block, i) => (
        <BlockEditor
          key={block.id}
          block={block}
          onChange={(next) => {
            const blocks = [...value];
            blocks[i] = next;
            onChange(blocks);
          }}
          onRemove={() => onChange(value.filter((_, j) => j !== i).map((b, j) => ({ ...b, order: j + 1 })))}
        />
      ))}
      <label>
        Add block
        <select
          defaultValue=""
          onChange={(e) => {
            const type = e.target.value as ContentBlock["type"];
            if (!type) return;
            onChange([...value, emptyBlock(type, value.length + 1)]);
            e.target.value = "";
          }}
        >
          <option value="">Choose type…</option>
          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

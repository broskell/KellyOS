import { resolveAsset } from "../content/assets";
import { publishedExternalLinks, UNVERIFIED_LINKS_COPY } from "../content/publish";
import type { AssetRef, ContentBlock } from "../content/types";

export function InlineRichText({ text }: { text: string }) {
  return <>{md(text)}</>;
}

function md(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]}>
          {link[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function EmptyAssetWell({ alt, caption }: { alt: string; caption?: string }) {
  return (
    <div className="os-sunken block-asset-missing">
      <div>
        <strong>Image not captured yet</strong>
        <span>{alt}</span>
        {caption ? <div className="mt-2">{caption}</div> : null}
      </div>
    </div>
  );
}

function ResolvedImage({
  asset,
  size,
}: {
  asset: AssetRef;
  size?: "inline" | "full" | "bleed";
}) {
  const resolved = resolveAsset(asset.id);
  if (!resolved) {
    return <EmptyAssetWell alt={asset.alt} caption={asset.caption} />;
  }
  const sizeClass =
    size === "inline" ? "block-image-inline" : size === "bleed" ? "block-image-bleed" : "block-image-full";
  return (
    <img
      src={resolved.url}
      alt={asset.alt}
      width={resolved.width ?? asset.width}
      height={resolved.height ?? asset.height}
      className={sizeClass}
    />
  );
}

export function BlockRenderer({
  blocks,
  surface = "os",
  /** Visitor, Reader, and prerender gate ExternalLink. Playground may show unverified. */
  gateExternalLinks = true,
}: {
  blocks: ContentBlock[];
  surface?: "os" | "reader";
  gateExternalLinks?: boolean;
}) {
  return (
    <div className="block-stack p-5" data-surface={surface}>
      {blocks.map((block) => {
        switch (block.type) {
          case "heading": {
            const cls =
              block.level === 2 ? "block-h2" : block.level === 3 ? "block-h3" : "block-h4";
            if (block.level === 2) {
              return (
                <h2 key={block.id} id={block.anchor} className={cls}>
                  {block.text}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3 key={block.id} id={block.anchor} className={cls}>
                  {block.text}
                </h3>
              );
            }
            return (
              <h4 key={block.id} id={block.anchor} className={cls}>
                {block.text}
              </h4>
            );
          }
          case "prose":
            return (
              <div
                key={block.id}
                className="block-prose"
                data-emphasis={block.emphasis ?? "default"}
              >
                {block.text.split("\n\n").map((p, i) => (
                  <p key={i}>{md(p)}</p>
                ))}
              </div>
            );
          case "list": {
            const List = block.style === "numbered" ? "ol" : "ul";
            return (
              <List key={block.id} className="block-list">
                {block.items.map((item, i) => (
                  <li key={i}>{md(item)}</li>
                ))}
              </List>
            );
          }
          case "code":
            return (
              <figure key={block.id} className="block-code os-raised m-0">
                {block.filename ? <div className="block-code-file">{block.filename}</div> : null}
                <pre>
                  <code>
                    {block.code.split("\n").map((line, i) => {
                      const n = i + 1;
                      const hl = block.highlightLines?.includes(n);
                      return (
                        <span key={n} className={hl ? "hl" : undefined}>
                          {line}
                          {"\n"}
                        </span>
                      );
                    })}
                  </code>
                </pre>
                {block.caption ? <figcaption className="px-2 py-1">{md(block.caption)}</figcaption> : null}
              </figure>
            );
          case "quote":
            return (
              <blockquote key={block.id} className="block-quote">
                <p>{md(block.text)}</p>
                {block.attribution ? <footer>{block.attribution}</footer> : null}
              </blockquote>
            );
          case "callout":
            return (
              <aside key={block.id} className="block-callout os-raised" data-variant={block.variant}>
                <div className="block-callout-bar">
                  {block.title ??
                    (block.variant === "disclosure"
                      ? "One thing you should know"
                      : block.variant === "limitation"
                        ? "Limitation"
                        : block.variant === "caution"
                          ? "Caution"
                          : "Note")}
                </div>
                <div className="block-callout-body">{md(block.text)}</div>
              </aside>
            );
          case "image":
            return (
              <figure key={block.id} className="block-figure">
                <ResolvedImage asset={block.asset} size={block.size} />
              </figure>
            );
          case "gallery":
            return (
              <figure key={block.id}>
                <div className="block-gallery">
                  {block.assets.map((a) => (
                    <ResolvedImage key={a.id} asset={a} size="inline" />
                  ))}
                </div>
                {block.caption ? <figcaption className="mt-2">{md(block.caption)}</figcaption> : null}
              </figure>
            );
          case "diagram":
            return (
              <figure key={block.id} className="os-sunken block-asset-missing">
                <div>
                  <strong>Diagram not authored yet</strong>
                  <span>{block.altDescription}</span>
                </div>
              </figure>
            );
          case "keyValue":
            return (
              <table key={block.id} className="block-kv os-sunken">
                {block.title ? <caption className="font-ui mb-2 text-left font-bold">{block.title}</caption> : null}
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      <th scope="row">{row.key}</th>
                      <td>{md(row.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "comparison":
            return (
              <table key={block.id} className="block-cmp os-sunken">
                {block.title ? <caption className="font-ui mb-2 text-left font-bold">{block.title}</caption> : null}
                <thead>
                  <tr>
                    {block.columns.map((c) => (
                      <th key={c} scope="col" className="bg-bevel-hi">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{md(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          case "metrics":
            if (block.metrics.length === 0) {
              return (
                <div key={block.id} className="os-sunken block-metrics-empty">
                  No verified metrics yet. Figures appear here only when they have a source.
                </div>
              );
            }
            return (
              <dl key={block.id} className="os-sunken p-3 font-ui">
                {block.metrics.map((m) => (
                  <div key={m.label} className="mb-2">
                    <dt className="font-bold">{m.label}</dt>
                    <dd>
                      {m.approximate ? "approximately " : null}
                      {m.value}
                      <div className="text-muted text-sm">Source: {m.source}</div>
                    </dd>
                  </div>
                ))}
              </dl>
            );
          case "linkGroup": {
            const links = gateExternalLinks ? publishedExternalLinks(block.links) : block.links;
            if (links.length === 0) {
              return (
                <div key={block.id} className="os-sunken block-metrics-empty">
                  {block.title ? <p className="block-h4 mb-2">{block.title}</p> : null}
                  {UNVERIFIED_LINKS_COPY}
                </div>
              );
            }
            return (
              <div key={block.id}>
                {block.title ? <p className="block-h4 mb-2">{block.title}</p> : null}
                <div className="block-links">
                  {links.map((l) => (
                    <a key={l.url} className="os-btn os-raised inline-block no-underline" href={l.url}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          }
          case "embed":
            return (
              <div key={block.id} className="os-sunken block-embed">
                {block.title} — not loaded in the design playground
              </div>
            );
          case "divider":
            return <hr key={block.id} className="block-divider" />;
          default:
            return null;
        }
      })}
    </div>
  );
}

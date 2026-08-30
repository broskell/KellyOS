import { OG_IMAGE_ALT, OS_PRODUCT, headForPath, type PageHead } from "./site";

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function metaBlock(page: PageHead): string {
  const head = headForPath(page.path);
  const title = escapeHtml(head.title);
  const desc = escapeHtml(head.description);
  const url = escapeHtml(head.canonical);
  const image = escapeHtml(head.ogImage);
  const alt = escapeHtml(OG_IMAGE_ALT);
  const site = escapeHtml(OS_PRODUCT);
  return [
    `<meta name="description" content="${desc}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${site}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:alt" content="${alt}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<title>${title}</title>`,
  ].join("\n    ");
}

/** One head block per page. Drops the template title/description so they are not duplicated. */
export function injectHead(html: string, page: PageHead): string {
  const block = `<!-- kellos-head -->\n    ${metaBlock(page)}\n    <!-- /kellos-head -->`;
  if (/<!-- kellos-head -->/.test(html)) {
    return html.replace(/<!-- kellos-head -->[\s\S]*?<!-- \/kellos-head -->/, block);
  }
  let next = html.replace(/<title>[^<]*<\/title>\s*/g, "");
  next = next.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>\s*/g, "");
  return next.replace("</head>", `    ${block}\n  </head>`);
}

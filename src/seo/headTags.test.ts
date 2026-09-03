import { describe, expect, it } from "vitest";
import { injectHead } from "./headTags";

describe("injectHead", () => {
  it("writes one title, canonical, and OG image for the page", () => {
    const html = `<!doctype html><html><head>
    <meta name="description" content="old" />
    <title>old</title>
  </head><body></body></html>`;
    const out = injectHead(html, {
      path: "/",
      title: "x",
      description: "y",
    });
    expect(out.match(/<title>/g)?.length).toBe(1);
    expect(out).toContain("Kelly.OS 1.0 — Saathvik Kellampalli");
    expect(out).toContain('rel="canonical"');
    expect(out).toContain("/og.png");
    expect(out).toContain("og:site_name");
    expect(out).not.toContain(">old<");
    expect(out.match(/name="description"/g)?.length).toBe(1);
  });
});

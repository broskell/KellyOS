import { describe, expect, it } from "vitest";
import { PAGE_HEADS, canonicalFor, headForPath, siteOrigin } from "./site";

describe("launch metadata", () => {
  it("never titles the OS as a naked ORIGIN next to a version", () => {
    for (const page of PAGE_HEADS) {
      expect(page.title).not.toMatch(/^ORIGIN\b/);
      expect(page.title).not.toMatch(/\bORIGIN \d/);
      expect(page.title).toMatch(/KELL\.OS/);
    }
  });

  it("home title is KELL.OS 1.0, with ORIGIN only as era in the description", () => {
    const home = PAGE_HEADS.find((p) => p.path === "/")!;
    expect(home.title).toBe("KELL.OS 1.0 — Saathvik Kellampalli");
    expect(home.description).toContain("ORIGIN era");
    expect(home.description).toContain("I develop AI-assisted");
    expect(home.description).not.toMatch(/graduat/i);
    expect(home.description).not.toMatch(/Jodhpur/);
  });

  it("does not put unverified live URLs in meta", () => {
    const blob = PAGE_HEADS.map((p) => `${p.title} ${p.description}`).join("\n");
    expect(blob).not.toContain("github.com/langchain-ai");
    expect(blob).not.toContain("roast-my-project.vercel.app");
    expect(blob).not.toContain("ducati-scrollytelling");
  });

  it("canonical URLs are absolute and not a trailing-slash nest", () => {
    expect(canonicalFor("/projects")).toBe(`${siteOrigin()}/projects`);
    expect(canonicalFor("/")).toBe(`${siteOrigin()}/`);
    const head = headForPath("/project/langchain-openrouter-provider/");
    expect(head.canonical.endsWith("/project/langchain-openrouter-provider")).toBe(true);
    expect(head.ogImage.endsWith("/og.png")).toBe(true);
  });
});

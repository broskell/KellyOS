import { describe, expect, it } from "vitest";
import { answerFor } from "./intents";

describe("Kelly.AI deterministic intents", () => {
  it("routes a content question to the sourced surface, never inventing", () => {
    const a = answerFor("what are his skills?");
    expect(a.kind).toBe("content");
    expect(a.source).toBe("Skills");
    expect(a.open?.path).toBe("/skills");
  });

  it("sends project/case-study questions to the one verified piece", () => {
    const a = answerFor("tell me about the langchain project");
    expect(a.kind).toBe("content");
    expect(a.open?.path).toBe("/project/langchain-openrouter-provider");
  });

  it("treats 'open X' as registry navigation", () => {
    const a = answerFor("open resume");
    expect(a.kind).toBe("nav");
    expect(a.open?.path).toBe("/resume");
  });

  it("answers 'who are you' honestly — no LLM", () => {
    const a = answerFor("who are you");
    expect(a.kind).toBe("help");
    expect(a.text.toLowerCase()).toContain("no large language model");
  });

  it("falls back without fabricating when it cannot source an answer", () => {
    const a = answerFor("what is the airspeed of an unladen swallow");
    expect(a.kind).toBe("fallback");
    expect(a.open).toBeUndefined();
    expect(a.suggestions?.length).toBeGreaterThan(0);
  });

  it("greets on an empty query", () => {
    expect(answerFor("").kind).toBe("help");
  });
});

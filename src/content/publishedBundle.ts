import { CONTENT_SCHEMA_VERSION, type ContentBundle } from "./types";

const modules = import.meta.glob("./published/bundle.json", {
  eager: true,
  import: "default",
}) as Record<string, ContentBundle>;

/** Emitted ContentBundle, or null when Phase 13 has not written the drop path. */
export function loadEmittedBundle(): ContentBundle | null {
  const bundle = modules["./published/bundle.json"];
  if (!bundle || bundle.schemaVersion !== CONTENT_SCHEMA_VERSION) return null;
  return bundle;
}

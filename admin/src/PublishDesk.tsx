import { useState } from "react";
import type { ContentBundle } from "../../src/content/types";
import { EditingApiError, editingFetch } from "./api";
import { PHASE_13_SEQUENCE } from "./phase13";

type CheckBody = {
  ok: boolean;
  failures: { id: string; kind: string; blockers: string[] }[];
};

export function PublishDesk({ apiUrl, token }: { apiUrl: string; token: string }) {
  const [check, setCheck] = useState<CheckBody | null>(null);
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [emitNote, setEmitNote] = useState("");
  const [error, setError] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function runCheck() {
    setBusy(true);
    setError("");
    try {
      const body = await editingFetch<CheckBody>(apiUrl, token, "/v1/publish-check");
      setCheck(body);
    } catch (err) {
      setError(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function previewBundle() {
    setBusy(true);
    setError("");
    try {
      const body = await editingFetch<{ ok: boolean; bundle: ContentBundle }>(
        apiUrl,
        token,
        "/v1/bundle",
      );
      setBundle(body.bundle);
    } catch (err) {
      setError(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function emitWrite() {
    setBusy(true);
    setError("");
    setEmitNote("");
    try {
      const latest = await editingFetch<CheckBody>(apiUrl, token, "/v1/publish-check");
      setCheck(latest);
      if (!latest.ok) {
        setError("publish-check refused emit. No files written.");
        return;
      }
      const body = await editingFetch<{ ok: boolean; written: string; deployed: boolean }>(
        apiUrl,
        token,
        "/v1/emit",
        { method: "POST", body: JSON.stringify({ deploy: false }) },
      );
      setEmitNote(
        `Wrote ${body.written} on the API host. Deploy hook not run from this button — use npm run publish (rebuilds visitor Vite). GET /v1/bundle is still not dist/.`,
      );
    } catch (err) {
      setError(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="stack">
      <h2>Phase 13 publish-to-static</h2>
      <ol>
        {PHASE_13_SEQUENCE.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="hint">
        GET /v1/bundle does not write <code>dist/</code>. POST /v1/emit writes JSON on the editing API
        host after publish-check. The visitor origin must never call this API. Full sequence +{" "}
        <code>npm run build</code>: <code>npm run publish</code>.
      </p>
      <div className="row">
        <button type="button" disabled={busy} onClick={() => void runCheck()}>
          GET /v1/publish-check
        </button>
        <button type="button" disabled={busy} onClick={() => void previewBundle()}>
          GET /v1/bundle (preview)
        </button>
        <button type="button" disabled={busy} onClick={() => void emitWrite()}>
          POST /v1/emit (write JSON only)
        </button>
      </div>
      {error ? <p className="warn">{error}</p> : null}
      {emitNote ? <p className="ok-box">{emitNote}</p> : null}
      {check ? (
        <aside className={check.ok ? "ok-box" : "blocker-box"}>
          <strong>publish-check ok={String(check.ok)}</strong>
          {check.failures.length === 0 ? (
            <p>No published-row failures. Emit may write.</p>
          ) : (
            <ul>
              {check.failures.map((f) => (
                <li key={`${f.kind}:${f.id}`}>
                  <code>
                    {f.kind} {f.id}
                  </code>
                  : {f.blockers.join("; ")}
                </li>
              ))}
            </ul>
          )}
        </aside>
      ) : null}
      {bundle ? (
        <pre className="bundle-preview">{JSON.stringify(bundle, null, 2)}</pre>
      ) : null}
    </section>
  );
}

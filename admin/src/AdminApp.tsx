import { useCallback, useEffect, useState } from "react";
import type {
  AssetRecord,
  NowSnapshot,
  OSVersion,
  Project,
  Skill,
  TimelineEntry,
} from "../../src/content/types";
import { EditingApiError, editingFetch } from "./api";
import {
  AssetEditor,
  NowEditor,
  ProjectEditor,
  SkillEditor,
  TimelineEditor,
  VersionEditor,
} from "./Editors";
import {
  emptyAsset,
  emptyNow,
  emptyProject,
  emptySkill,
  emptyTimeline,
  emptyVersion,
  toProject,
  toProjectForm,
  type ProjectForm,
} from "./forms";
import { PublishDesk } from "./PublishDesk";
import { DEFAULT_API_URL, loadApiUrl, loadToken, saveApiUrl, saveToken } from "./session";

type Section = "projects" | "skills" | "timeline" | "now" | "versions" | "assets" | "phase13";

export function AdminApp() {
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState<Section>("projects");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<ProjectForm>(emptyProject());
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skill, setSkill] = useState<Skill>(emptySkill());
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [entry, setEntry] = useState<TimelineEntry>(emptyTimeline());
  const [now, setNow] = useState<NowSnapshot>(emptyNow());
  const [versions, setVersions] = useState<OSVersion[]>([]);
  const [version, setVersion] = useState<OSVersion>(emptyVersion("v3"));
  const [assets, setAssets] = useState<AssetRecord[]>([]);
  const [asset, setAsset] = useState<AssetRecord>(emptyAsset());

  useEffect(() => {
    setToken(loadToken());
    setApiUrl(loadApiUrl());
    setReady(true);
  }, []);

  const authed = Boolean(token);

  const loadLists = useCallback(async () => {
    if (!token) return;
    setBusy(true);
    setNotice("");
    try {
      const [p, s, t, n, v, a] = await Promise.all([
        editingFetch<{ items: Project[] }>(apiUrl, token, "/v1/projects"),
        editingFetch<{ items: Skill[] }>(apiUrl, token, "/v1/skills"),
        editingFetch<{ items: TimelineEntry[] }>(apiUrl, token, "/v1/timeline"),
        editingFetch<{ item?: NowSnapshot; errors?: string[] }>(apiUrl, token, "/v1/now").catch(
          () => ({ item: undefined }),
        ),
        editingFetch<{ items: OSVersion[] }>(apiUrl, token, "/v1/versions"),
        editingFetch<{ items: AssetRecord[] }>(apiUrl, token, "/v1/assets"),
      ]);
      setProjects(p.items);
      setSkills(s.items);
      setTimeline(t.items);
      if (n.item) setNow(n.item);
      setVersions(v.items);
      setAssets(a.items);
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, [apiUrl, token]);

  useEffect(() => {
    if (ready && authed) void loadLists();
  }, [ready, authed, loadLists]);

  function persistSession() {
    saveToken(token);
    saveApiUrl(apiUrl);
  }

  async function saveProject() {
    const body = toProject(project);
    setBusy(true);
    setNotice("");
    try {
      const res = await editingFetch<{ item: Project; publishable: boolean; blockers: string[] }>(
        apiUrl,
        token,
        `/v1/projects/${body.id}`,
        { method: "PUT", body: JSON.stringify(body) },
      );
      setProject(toProjectForm(res.item));
      setNotice(
        res.publishable
          ? "Saved. Publishable."
          : `Saved as draft. Blockers: ${res.blockers.join("; ")}`,
      );
      await loadLists();
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveSkill() {
    setBusy(true);
    setNotice("");
    try {
      const res = await editingFetch<{ item: Skill; blockers: string[] }>(
        apiUrl,
        token,
        `/v1/skills/${skill.id}`,
        { method: "PUT", body: JSON.stringify(skill) },
      );
      setSkill(res.item);
      setNotice(res.blockers.length ? `Saved. Blockers: ${res.blockers.join("; ")}` : "Saved.");
      await loadLists();
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveTimeline() {
    setBusy(true);
    setNotice("");
    try {
      const res = await editingFetch<{ item: TimelineEntry; blockers: string[] }>(
        apiUrl,
        token,
        `/v1/timeline/${entry.id}`,
        { method: "PUT", body: JSON.stringify(entry) },
      );
      setEntry(res.item);
      setNotice(res.blockers.length ? `Saved. Blockers: ${res.blockers.join("; ")}` : "Saved.");
      await loadLists();
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveNow() {
    setBusy(true);
    setNotice("");
    try {
      const res = await editingFetch<{ item: NowSnapshot; blockers: string[] }>(
        apiUrl,
        token,
        "/v1/now",
        { method: "PUT", body: JSON.stringify(now) },
      );
      setNow(res.item);
      setNotice(res.blockers.length ? `Saved. Blockers: ${res.blockers.join("; ")}` : "Saved.");
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveVersion() {
    setBusy(true);
    setNotice("");
    try {
      const res = await editingFetch<{ item: OSVersion }>(
        apiUrl,
        token,
        `/v1/versions/${version.id}`,
        { method: "PUT", body: JSON.stringify(version) },
      );
      setVersion(res.item);
      setNotice("Saved.");
      await loadLists();
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function saveAsset() {
    setBusy(true);
    setNotice("");
    try {
      const res = await editingFetch<{ item: AssetRecord }>(
        apiUrl,
        token,
        `/v1/assets/${asset.id}`,
        { method: "PUT", body: JSON.stringify(asset) },
      );
      setAsset(res.item);
      setNotice("Saved. Visitor sees this asset after emit writes bundle.json and a static rebuild.");
      await loadLists();
    } catch (err) {
      setNotice(err instanceof EditingApiError ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <p>Loading…</p>;

  return (
    <div className="shell">
      <header className="mast">
        <p className="kicker">KELL.OS editing desk — not the visitor OS</p>
        <h1>Admin CMS</h1>
        <p>
          Talks only to the Phase 11 Fastify API. Zero database calls on the visitor read path. Emit
          is POST /v1/emit or <code>npm run publish</code> — never from the visitor origin. Not OS
          Update, not KELL.AI.
        </p>
      </header>
      <section className="session card">
        <label>
          API (default 127.0.0.1:8787)
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            onBlur={persistSession}
          />
        </label>
        <label>
          Bearer token (sessionStorage only — never commit)
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onBlur={persistSession}
          />
        </label>
        <button type="button" onClick={() => { persistSession(); void loadLists(); }}>
          Connect
        </button>
      </section>
      <nav className="tabs" aria-label="Entities">
        {(
          [
            ["projects", "Projects"],
            ["skills", "Skills"],
            ["timeline", "Timeline"],
            ["now", "Now"],
            ["versions", "OSVersion"],
            ["assets", "Assets"],
            ["phase13", "Phase 13 emit"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={section === id ? "tab on" : "tab"}
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </nav>
      {notice ? <p className="notice">{notice}</p> : null}
      {section === "projects" ? (
        <div className="split">
          <aside>
            <button type="button" onClick={() => setProject(emptyProject())}>
              New project
            </button>
            <ul>
              {projects.map((item) => (
                <li key={item.id}>
                  <button type="button" className="ghost" onClick={() => setProject(toProjectForm(item))}>
                    {item.title || item.id}{" "}
                    <span className="muted">{item.publish.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <ProjectEditor form={project} onChange={setProject} onSave={saveProject} busy={busy} />
        </div>
      ) : null}
      {section === "skills" ? (
        <div className="split">
          <aside>
            <button type="button" onClick={() => setSkill(emptySkill())}>
              New skill
            </button>
            <ul>
              {skills.map((item) => (
                <li key={item.id}>
                  <button type="button" className="ghost" onClick={() => setSkill(item)}>
                    {item.name || item.id} · T{item.tier}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <SkillEditor skill={skill} onChange={setSkill} onSave={saveSkill} busy={busy} />
        </div>
      ) : null}
      {section === "timeline" ? (
        <div className="split">
          <aside>
            <button type="button" onClick={() => setEntry(emptyTimeline())}>
              New entry
            </button>
            <ul>
              {timeline.map((item) => (
                <li key={item.id}>
                  <button type="button" className="ghost" onClick={() => setEntry(item)}>
                    {item.title || item.id}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <TimelineEditor entry={entry} onChange={setEntry} onSave={saveTimeline} busy={busy} />
        </div>
      ) : null}
      {section === "now" ? (
        <NowEditor snapshot={now} onChange={setNow} onSave={saveNow} busy={busy} />
      ) : null}
      {section === "versions" ? (
        <div className="split">
          <aside>
            <ul>
              {versions.map((item) => (
                <li key={item.id}>
                  <button type="button" className="ghost" onClick={() => setVersion(item)}>
                    {item.id} {item.number}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <VersionEditor version={version} onChange={setVersion} onSave={saveVersion} busy={busy} />
        </div>
      ) : null}
      {section === "assets" ? (
        <div className="split">
          <aside>
            <button type="button" onClick={() => setAsset(emptyAsset())}>
              New asset
            </button>
            <ul>
              {assets.map((item) => (
                <li key={item.id}>
                  <button type="button" className="ghost" onClick={() => setAsset(item)}>
                    {item.id}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <AssetEditor asset={asset} onChange={setAsset} onSave={saveAsset} busy={busy} />
        </div>
      ) : null}
      {section === "phase13" ? <PublishDesk apiUrl={apiUrl} token={token} /> : null}
    </div>
  );
}

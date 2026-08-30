import { type FormEvent } from "react";
import type { AssetRecord, NowSnapshot, OSVersion, Skill, TimelineEntry } from "../../src/content/types";
import { BlocksField } from "./BlocksField";
import {
  joinCsv,
  liveNowBlockers,
  liveProjectBlockers,
  liveSkillBlockers,
  liveTimelineBlockers,
  parseCsv,
  projectClientErrors,
  skillClientErrors,
  toProject,
  type ProjectForm,
} from "./forms";
import { LinksField } from "./LinksField";
import { BlockerList, PublishField } from "./PublishField";

function VersionGate({
  introducedIn,
  retiredIn,
  onIntro,
  onRetire,
}: {
  introducedIn: "v1" | "v2" | "v3";
  retiredIn?: "v1" | "v2" | "v3";
  onIntro: (v: "v1" | "v2" | "v3") => void;
  onRetire: (v: "v1" | "v2" | "v3" | undefined) => void;
}) {
  return (
    <div className="grid-2">
      <label>
        introducedIn
        <select value={introducedIn} onChange={(e) => onIntro(e.target.value as "v1" | "v2" | "v3")}>
          <option value="v1">v1</option>
          <option value="v2">v2</option>
          <option value="v3">v3</option>
        </select>
      </label>
      <label>
        retiredIn
        <select
          value={retiredIn ?? ""}
          onChange={(e) => onRetire((e.target.value || undefined) as "v1" | "v2" | "v3" | undefined)}
        >
          <option value="">(still present)</option>
          <option value="v1">v1</option>
          <option value="v2">v2</option>
          <option value="v3">v3</option>
        </select>
      </label>
    </div>
  );
}

export function ProjectEditor({
  form,
  onChange,
  onSave,
  busy,
}: {
  form: ProjectForm;
  onChange: (next: ProjectForm) => void;
  onSave: () => Promise<void>;
  busy: boolean;
}) {
  const client = projectClientErrors(form);
  const live = liveProjectBlockers(form);
  async function submit(e: FormEvent) {
    e.preventDefault();
    toProject(form);
    await onSave();
  }
  return (
    <form className="stack" onSubmit={(e) => void submit(e)}>
      <BlockerList title="Client errors (block PUT)" items={client} />
      <BlockerList title="Publish blockers (unverified links + stored)" items={live} />
      <div className="grid-2">
        <label>
          id (EntityId / Mongo _id)
          <input value={form.id} onChange={(e) => onChange({ ...form, id: e.target.value })} />
        </label>
        <label>
          slug
          <input value={form.slug} onChange={(e) => onChange({ ...form, slug: e.target.value })} />
        </label>
        <label>
          title
          <input value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} />
        </label>
        <label>
          tagline
          <input value={form.tagline} onChange={(e) => onChange({ ...form, tagline: e.target.value })} />
        </label>
        <label>
          tier
          <select
            value={form.tier}
            onChange={(e) => onChange({ ...form, tier: e.target.value as ProjectForm["tier"] })}
          >
            <option value="caseStudy">caseStudy</option>
            <option value="gallery">gallery — do not promote to case study here</option>
            <option value="recycled">recycled</option>
          </select>
        </label>
        <label>
          status
          <select
            value={form.status}
            onChange={(e) => onChange({ ...form, status: e.target.value as ProjectForm["status"] })}
          >
            <option value="live">live</option>
            <option value="inProgress">inProgress</option>
            <option value="unlaunched">unlaunched</option>
            <option value="archived">archived</option>
            <option value="abandoned">abandoned</option>
          </select>
        </label>
        <label>
          authorship (required — no default)
          <select
            required
            value={form.authorship}
            onChange={(e) =>
              onChange({ ...form, authorship: e.target.value as ProjectForm["authorship"] })
            }
          >
            <option value="">Choose…</option>
            <option value="manual">manual</option>
            <option value="aiAssisted">aiAssisted</option>
            <option value="aiGenerated">aiGenerated</option>
          </select>
        </label>
        <label>
          rank
          <input
            type="number"
            value={form.rank}
            onChange={(e) => onChange({ ...form, rank: Number(e.target.value) })}
          />
        </label>
        <label>
          startedAt (ISO month — do not invent)
          <input
            value={form.startedAt}
            placeholder="YYYY-MM"
            onChange={(e) => onChange({ ...form, startedAt: e.target.value })}
          />
        </label>
        <label>
          endedAt
          <input
            value={form.endedAt ?? ""}
            onChange={(e) => onChange({ ...form, endedAt: e.target.value || undefined })}
          />
        </label>
        <label className="span-2">
          stack (comma)
          <input
            value={joinCsv(form.stack)}
            onChange={(e) => onChange({ ...form, stack: parseCsv(e.target.value) })}
          />
        </label>
      </div>
      <VersionGate
        introducedIn={form.introducedIn}
        retiredIn={form.retiredIn}
        onIntro={(introducedIn) => onChange({ ...form, introducedIn })}
        onRetire={(retiredIn) => onChange({ ...form, retiredIn })}
      />
      <fieldset className="stack">
        <legend>role</legend>
        <label className="check">
          <input
            type="checkbox"
            checked={form.role.solo}
            onChange={(e) =>
              onChange({
                ...form,
                role: { ...form.role, solo: e.target.checked },
              })
            }
          />
          solo
        </label>
        <label>
          teamSize
          <input
            type="number"
            value={form.role.teamSize ?? ""}
            onChange={(e) =>
              onChange({
                ...form,
                role: {
                  ...form.role,
                  teamSize: e.target.value ? Number(e.target.value) : undefined,
                },
              })
            }
          />
        </label>
        <label>
          ownedAreas (required when not solo; comma)
          <input
            value={joinCsv(form.role.ownedAreas)}
            onChange={(e) =>
              onChange({
                ...form,
                role: { ...form.role, ownedAreas: parseCsv(e.target.value) },
              })
            }
          />
        </label>
      </fieldset>
      <label>
        abandonmentReason
        <textarea
          rows={2}
          value={form.abandonmentReason ?? ""}
          onChange={(e) => onChange({ ...form, abandonmentReason: e.target.value || null })}
        />
      </label>
      <LinksField value={form.links} onChange={(links) => onChange({ ...form, links })} />
      <BlocksField value={form.blocks} onChange={(blocks) => onChange({ ...form, blocks })} />
      <PublishField value={form.publish} onChange={(publish) => onChange({ ...form, publish })} />
      <button type="submit" disabled={busy || client.length > 0}>
        PUT /v1/projects/:id
      </button>
    </form>
  );
}

export function SkillEditor({
  skill,
  onChange,
  onSave,
  busy,
}: {
  skill: Skill;
  onChange: (next: Skill) => void;
  onSave: () => Promise<void>;
  busy: boolean;
}) {
  const client = skillClientErrors(skill);
  const live = liveSkillBlockers(skill);
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave();
      }}
    >
      <p className="hint">
        Evidence types, not ability. No meters, percentages, stars, or ability booleans — including as
        a visual. Tier 2/3 rows must not publish as named instances without a named project; keep the
        seed blocker until that is true. LangChain authorship on the project is ASSUMED aiAssisted —
        correct it here on the <em>project</em>, do not hide it.
      </p>
      <BlockerList title="Client errors" items={client} />
      <BlockerList title="Publish blockers" items={live} />
      <div className="grid-2">
        <label>
          id
          <input value={skill.id} onChange={(e) => onChange({ ...skill, id: e.target.value })} />
        </label>
        <label>
          name
          <input value={skill.name} onChange={(e) => onChange({ ...skill, name: e.target.value })} />
        </label>
        <label>
          tier (evidence type)
          <select
            value={skill.tier}
            onChange={(e) => onChange({ ...skill, tier: Number(e.target.value) as Skill["tier"] })}
          >
            <option value={1}>1 — externally verified</option>
            <option value={2}>2 — shipped publicly</option>
            <option value={3}>3 — worked with</option>
          </select>
        </label>
        <label>
          category
          <select
            value={skill.category}
            onChange={(e) => onChange({ ...skill, category: e.target.value as Skill["category"] })}
          >
            {["language", "frontend", "backend", "data", "infra", "tooling", "other"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="span-2">
          scopeNote
          <input
            value={skill.scopeNote ?? ""}
            onChange={(e) => onChange({ ...skill, scopeNote: e.target.value || undefined })}
          />
        </label>
      </div>
      <VersionGate
        introducedIn={skill.introducedIn}
        retiredIn={skill.retiredIn}
        onIntro={(introducedIn) => onChange({ ...skill, introducedIn })}
        onRetire={(retiredIn) => onChange({ ...skill, retiredIn })}
      />
      <fieldset className="stack">
        <legend>evidence (required, non-empty)</legend>
        {skill.evidence.map((ev, i) => (
          <div className="card" key={i}>
            <label>
              kind
              <select
                value={ev.kind}
                onChange={(e) => {
                  const evidence = [...skill.evidence];
                  evidence[i] = { ...ev, kind: e.target.value as typeof ev.kind };
                  onChange({ ...skill, evidence });
                }}
              >
                {["mergedPR", "paidWork", "deployedProject", "coursework", "competition"].map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </label>
            <label>
              statement
              <input
                value={ev.statement}
                onChange={(e) => {
                  const evidence = [...skill.evidence];
                  evidence[i] = { ...ev, statement: e.target.value };
                  onChange({ ...skill, evidence });
                }}
              />
            </label>
            <label>
              url (optional)
              <input
                value={ev.url ?? ""}
                onChange={(e) => {
                  const evidence = [...skill.evidence];
                  evidence[i] = { ...ev, url: e.target.value || undefined };
                  onChange({ ...skill, evidence });
                }}
              />
            </label>
            <label>
              projectId
              <input
                value={ev.projectId ?? ""}
                onChange={(e) => {
                  const evidence = [...skill.evidence];
                  evidence[i] = { ...ev, projectId: e.target.value || undefined };
                  onChange({ ...skill, evidence });
                }}
              />
            </label>
            <button
              type="button"
              className="ghost"
              onClick={() =>
                onChange({ ...skill, evidence: skill.evidence.filter((_, j) => j !== i) })
              }
            >
              Remove evidence
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange({ ...skill, evidence: [...skill.evidence, { kind: "coursework", statement: "" }] })}>
          Add evidence
        </button>
      </fieldset>
      <PublishField value={skill.publish} onChange={(publish) => onChange({ ...skill, publish })} />
      <button type="submit" disabled={busy || client.length > 0}>
        PUT /v1/skills/:id
      </button>
    </form>
  );
}

export function TimelineEditor({
  entry,
  onChange,
  onSave,
  busy,
}: {
  entry: TimelineEntry;
  onChange: (next: TimelineEntry) => void;
  onSave: () => Promise<void>;
  busy: boolean;
}) {
  const live = liveTimelineBlockers(entry);
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave();
      }}
    >
      <BlockerList title="Publish blockers" items={live} />
      <div className="grid-2">
        <label>
          id
          <input value={entry.id} onChange={(e) => onChange({ ...entry, id: e.target.value })} />
        </label>
        <label>
          versionEra
          <select
            value={entry.versionEra}
            onChange={(e) => onChange({ ...entry, versionEra: e.target.value as TimelineEntry["versionEra"] })}
          >
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
          </select>
        </label>
        <label>
          startedAt
          <input
            value={entry.startedAt}
            onChange={(e) => onChange({ ...entry, startedAt: e.target.value })}
          />
        </label>
        <label>
          endedAt
          <input
            value={entry.endedAt ?? ""}
            onChange={(e) => onChange({ ...entry, endedAt: e.target.value || undefined })}
          />
        </label>
        <label>
          kind
          <select
            value={entry.kind}
            onChange={(e) => onChange({ ...entry, kind: e.target.value as TimelineEntry["kind"] })}
          >
            {["education", "work", "project", "openSource", "recognition", "milestone"].map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label>
          title
          <input value={entry.title} onChange={(e) => onChange({ ...entry, title: e.target.value })} />
        </label>
        <label className="span-2">
          organisation
          <input
            value={entry.organisation ?? ""}
            onChange={(e) => onChange({ ...entry, organisation: e.target.value || undefined })}
          />
        </label>
        <label className="span-2">
          body
          <textarea rows={4} value={entry.body} onChange={(e) => onChange({ ...entry, body: e.target.value })} />
        </label>
        <label>
          projectId
          <input
            value={entry.projectId ?? ""}
            onChange={(e) => onChange({ ...entry, projectId: e.target.value || undefined })}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={Boolean(entry.approximateDates)}
            onChange={(e) => onChange({ ...entry, approximateDates: e.target.checked || undefined })}
          />
          approximateDates
        </label>
      </div>
      <VersionGate
        introducedIn={entry.introducedIn}
        retiredIn={entry.retiredIn}
        onIntro={(introducedIn) => onChange({ ...entry, introducedIn })}
        onRetire={(retiredIn) => onChange({ ...entry, retiredIn })}
      />
      <LinksField
        value={entry.links ?? []}
        onChange={(links) => onChange({ ...entry, links })}
      />
      <PublishField value={entry.publish} onChange={(publish) => onChange({ ...entry, publish })} />
      <button type="submit" disabled={busy}>
        PUT /v1/timeline/:id
      </button>
    </form>
  );
}

export function NowEditor({
  snapshot,
  onChange,
  onSave,
  busy,
}: {
  snapshot: NowSnapshot;
  onChange: (next: NowSnapshot) => void;
  onSave: () => Promise<void>;
  busy: boolean;
}) {
  const live = liveNowBlockers(snapshot);
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave();
      }}
    >
      <BlockerList title="Publish blockers" items={live} />
      <div className="grid-2">
        <label>
          id
          <input value={snapshot.id} onChange={(e) => onChange({ ...snapshot, id: e.target.value })} />
        </label>
        <label>
          updatedAt (must look stale when stale)
          <input
            value={snapshot.updatedAt}
            onChange={(e) => onChange({ ...snapshot, updatedAt: e.target.value })}
          />
        </label>
        <label>
          stalenessThresholdDays
          <input
            type="number"
            value={snapshot.stalenessThresholdDays}
            onChange={(e) => onChange({ ...snapshot, stalenessThresholdDays: Number(e.target.value) })}
          />
        </label>
      </div>
      <VersionGate
        introducedIn={snapshot.introducedIn}
        retiredIn={snapshot.retiredIn}
        onIntro={(introducedIn) => onChange({ ...snapshot, introducedIn })}
        onRetire={(retiredIn) => onChange({ ...snapshot, retiredIn })}
      />
      {snapshot.entries.map((entry, i) => (
        <div className="card" key={entry.id}>
          <label>
            category
            <select
              value={entry.category}
              onChange={(e) => {
                const entries = [...snapshot.entries];
                entries[i] = { ...entry, category: e.target.value as typeof entry.category };
                onChange({ ...snapshot, entries });
              }}
            >
              {["learning", "building", "openSource", "applying", "stuckOn", "studying"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            text
            <textarea
              rows={3}
              value={entry.text}
              onChange={(e) => {
                const entries = [...snapshot.entries];
                entries[i] = { ...entry, text: e.target.value };
                onChange({ ...snapshot, entries });
              }}
            />
          </label>
          <PublishField
            value={entry.publish}
            onChange={(publish) => {
              const entries = [...snapshot.entries];
              entries[i] = { ...entry, publish };
              onChange({ ...snapshot, entries });
            }}
          />
          <button
            type="button"
            className="ghost"
            onClick={() =>
              onChange({ ...snapshot, entries: snapshot.entries.filter((_, j) => j !== i) })
            }
          >
            Remove entry
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({
            ...snapshot,
            entries: [
              ...snapshot.entries,
              {
                id: `now_${snapshot.entries.length + 1}`,
                category: "stuckOn",
                text: "",
                publish: { status: "draft", updatedAt: new Date().toISOString() },
              },
            ],
          })
        }
      >
        Add NowEntry
      </button>
      <PublishField
        value={snapshot.publish}
        onChange={(publish) => onChange({ ...snapshot, publish })}
      />
      <button type="submit" disabled={busy}>
        PUT /v1/now
      </button>
    </form>
  );
}

export function VersionEditor({
  version,
  onChange,
  onSave,
  busy,
}: {
  version: OSVersion;
  onChange: (next: OSVersion) => void;
  onSave: () => Promise<void>;
  busy: boolean;
}) {
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave();
      }}
    >
      <p className="hint">features[] stay empty until Phase 14 names flags. Do not invent flags.</p>
      <div className="grid-2">
        <label>
          id
          <select
            value={version.id}
            onChange={(e) => onChange({ ...version, id: e.target.value as OSVersion["id"] })}
          >
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
          </select>
        </label>
        <label>
          number
          <input value={version.number} onChange={(e) => onChange({ ...version, number: e.target.value })} />
        </label>
        <label>
          codename
          <input
            value={version.codename ?? ""}
            onChange={(e) => onChange({ ...version, codename: e.target.value || undefined })}
          />
        </label>
        <label>
          sequence
          <input
            type="number"
            value={version.sequence}
            onChange={(e) => onChange({ ...version, sequence: Number(e.target.value) })}
          />
        </label>
        <label>
          eraStart
          <input value={version.eraStart} onChange={(e) => onChange({ ...version, eraStart: e.target.value })} />
        </label>
        <label>
          eraEnd
          <input
            value={version.eraEnd ?? ""}
            onChange={(e) => onChange({ ...version, eraEnd: e.target.value || undefined })}
          />
        </label>
        <label className="span-2">
          eraSummary
          <textarea
            rows={4}
            value={version.eraSummary}
            onChange={(e) => onChange({ ...version, eraSummary: e.target.value })}
          />
        </label>
        <label>
          releasedAt
          <input
            value={version.releasedAt}
            onChange={(e) => onChange({ ...version, releasedAt: e.target.value })}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={version.isLatest}
            onChange={(e) => onChange({ ...version, isLatest: e.target.checked })}
          />
          isLatest (exactly one should be true)
        </label>
        <label className="span-2">
          features (comma — leave empty)
          <input
            value={joinCsv(version.features)}
            onChange={(e) => onChange({ ...version, features: parseCsv(e.target.value) })}
          />
        </label>
      </div>
      <BlocksField
        value={version.releaseNotes ?? []}
        onChange={(releaseNotes) => onChange({ ...version, releaseNotes })}
      />
      <button type="submit" disabled={busy}>
        PUT /v1/versions/:id
      </button>
    </form>
  );
}

export function AssetEditor({
  asset,
  onChange,
  onSave,
  busy,
}: {
  asset: AssetRecord;
  onChange: (next: AssetRecord) => void;
  onSave: () => Promise<void>;
  busy: boolean;
}) {
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave();
      }}
    >
      <p className="hint">Bytes stay on the static host. Mongo stores id + url. Do not invent screenshots.</p>
      <label>
        id
        <input value={asset.id} onChange={(e) => onChange({ ...asset, id: e.target.value })} />
      </label>
      <label>
        url
        <input required value={asset.url} onChange={(e) => onChange({ ...asset, url: e.target.value })} />
      </label>
      <label>
        width
        <input
          type="number"
          value={asset.width ?? ""}
          onChange={(e) => onChange({ ...asset, width: e.target.value ? Number(e.target.value) : undefined })}
        />
      </label>
      <label>
        height
        <input
          type="number"
          value={asset.height ?? ""}
          onChange={(e) => onChange({ ...asset, height: e.target.value ? Number(e.target.value) : undefined })}
        />
      </label>
      <button type="submit" disabled={busy}>
        PUT /v1/assets/:id
      </button>
    </form>
  );
}

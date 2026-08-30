import type { PublishState } from "../../src/content/types";

export function PublishField({
  value,
  onChange,
}: {
  value: PublishState;
  onChange: (next: PublishState) => void;
}) {
  const blockers = (value.blockers ?? []).join("\n");
  return (
    <fieldset className="stack">
      <legend>PublishState</legend>
      <div className="grid-2">
        <label>
          status
          <select
            value={value.status}
            onChange={(e) =>
              onChange({ ...value, status: e.target.value as PublishState["status"] })
            }
          >
            <option value="draft">draft</option>
            <option value="review">review</option>
            <option value="published">published (API 409 if blockers remain)</option>
          </select>
        </label>
        <label>
          publishedAt
          <input
            value={value.publishedAt ?? ""}
            onChange={(e) => onChange({ ...value, publishedAt: e.target.value || undefined })}
          />
        </label>
        <label>
          updatedAt
          <input
            value={value.updatedAt}
            onChange={(e) => onChange({ ...value, updatedAt: e.target.value })}
          />
        </label>
      </div>
      <label>
        Stored blockers (one per line). Non-empty refuses Phase 13 emit.
        <textarea
          rows={4}
          value={blockers}
          onChange={(e) => {
            const lines = e.target.value
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);
            onChange({ ...value, blockers: lines.length ? lines : undefined });
          }}
        />
      </label>
    </fieldset>
  );
}

export function BlockerList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return (
      <aside className="ok-box" aria-live="polite">
        <strong>{title}</strong>
        <p>No blockers computed from this form.</p>
      </aside>
    );
  }
  return (
    <aside className="blocker-box" aria-live="polite">
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}

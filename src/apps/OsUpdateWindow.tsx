import { Wordmark } from "../brand/marks";
import { WindowFrame } from "../chrome/WindowFrame";
import { OS_VERSIONS, VERSION_REPRESENTS, VERSION_SPANS, osVersion } from "../content/versions";
import type { VersionId } from "../content/types";
import { useVersion } from "../shell/VersionContext";

/**
 * OS Update — the home of the version system (Phase 14). Gives the previously
 * empty `osUpdate` registry row a runtime. Shows the current version, lets a
 * visitor explore any era (feature flags over one data set), and replays the
 * last real update. New visitors always boot the newest version; the ceremony
 * is for returning visitors only.
 */
export default function OsUpdateWindow() {
  const { latest, viewing, setViewing, replayCeremony } = useVersion();
  const current = osVersion(latest);

  return (
    <WindowFrame
      title="OS Update"
      status={`Current: Kelly.OS ${current.number}  ·  viewing ${osVersion(viewing).number}`}
      className="h-full min-h-0 w-full"
    >
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Wordmark size={14} />
          <p className="font-chrome m-0">
            Kelly.OS {current.number}
            {current.codename ? ` — ${current.codename}` : ""}. Newest for new visitors. Always.
          </p>
        </div>

        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">View an era</h2>
          <p className="font-chrome mt-1 m-0">
            Versions are feature flags over one data set, never separate builds. Switching re-filters
            the OS — the Timeline reflects how it looked in that era.
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Version to view">
            {OS_VERSIONS.map((v) => (
              <button
                key={v.id}
                type="button"
                className="os-btn os-raised"
                data-active={viewing === v.id}
                aria-pressed={viewing === v.id}
                onClick={() => setViewing(v.id)}
              >
                Kelly.OS {v.number}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">Release history</h2>
          <ul className="mt-2 space-y-3">
            {OS_VERSIONS.map((v) => (
              <li key={v.id} className="os-sunken os-well p-3">
                <p className="font-chrome m-0 text-[11px] font-bold">
                  Kelly.OS {v.number}
                  {v.codename ? ` — ${v.codename}` : ""}
                  {v.isLatest ? "  ·  current" : ""}
                </p>
                <p className="font-chrome text-muted mt-1 m-0">{VERSION_SPANS[v.id]}</p>
                <p className="font-chrome mt-1 m-0">{VERSION_REPRESENTS[v.id]}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">The update ceremony</h2>
          <p className="font-chrome mt-1 m-0">
            Returning visitors are walked forward when the site grows since their last visit. New
            visitors never see it. You can replay the most recent real update:
          </p>
          <div className="mt-2">
            <button
              type="button"
              className="os-btn os-raised"
              onClick={() => replayCeremony(previousOf(latest), latest)}
            >
              Replay {osVersion(previousOf(latest)).number} → {current.number}
            </button>
          </div>
        </section>
      </div>
    </WindowFrame>
  );
}

/** The version immediately before `id`, for replaying the last real transition. */
function previousOf(id: VersionId): VersionId {
  const i = OS_VERSIONS.findIndex((v) => v.id === id);
  return OS_VERSIONS[Math.max(0, i - 1)].id;
}

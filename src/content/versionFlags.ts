import type { ContentBlock, ContentBundle, Project, Skill, TimelineEntry, VersionId } from "./types";

const ORDER: VersionId[] = ["v1", "v2", "v3"];

export function versionRank(id: VersionId): number {
  return ORDER.indexOf(id);
}

export function latestVersionId(bundle: ContentBundle): VersionId {
  const latest = bundle.versions.find((v) => v.isLatest);
  return latest?.id ?? "v3";
}

export function visibleInVersion(
  version: VersionId,
  gated: { introducedIn: VersionId; retiredIn?: VersionId },
): boolean {
  const cur = versionRank(version);
  if (versionRank(gated.introducedIn) > cur) return false;
  if (gated.retiredIn !== undefined && versionRank(gated.retiredIn) <= cur) return false;
  return true;
}

function filterBlock(block: ContentBlock, version: VersionId): boolean {
  return visibleInVersion(version, block);
}

/**
 * Version flags at content load (blueprint §4.2 / Phase 14). Components must not ask
 * "which version are we in?". Phase 14 adds the returning-visitor ceremony; it should
 * pass the chosen VersionId into this function and nowhere else.
 */
export function filterBundleForVersion(bundle: ContentBundle, version: VersionId): ContentBundle {
  const projects: Project[] = bundle.projects
    .filter((p) => visibleInVersion(version, p))
    .map((p) => ({ ...p, blocks: p.blocks.filter((b) => filterBlock(b, version)) }));
  const skills: Skill[] = bundle.skills.filter((s) => visibleInVersion(version, s));
  const timeline: TimelineEntry[] = bundle.timeline.filter((t) => visibleInVersion(version, t));
  return {
    ...bundle,
    projects,
    skills,
    timeline,
  };
}

/** New visitors always boot latest. Phase 14 may pass a remembered id instead. */
export function bundleForVisitorBoot(bundle: ContentBundle, version?: VersionId): ContentBundle {
  return filterBundleForVersion(bundle, version ?? latestVersionId(bundle));
}

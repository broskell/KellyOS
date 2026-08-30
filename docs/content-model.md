# KELL.OS Content Model — the type contract

> ## ⚠ RECONCILIATION REQUIRED
>
> **The original Master Blueprint never reached the Phase 0 session.** This model is
> derived from the locked architecture decisions carried forward from prior sessions, plus
> the actual content written in Phase 0.
>
> [`MASTER-BLUEPRINT.md`](MASTER-BLUEPRINT.md) is a **reconstruction**, and §5.2 of it was
> derived *from this document*. **The two cannot reconcile each other** — they agree by
> construction, which is not the same as being correct.
>
> **Still unconfirmed, and only Saathvik or the original blueprint can settle it:**
> 1. The **canonical `ContentBlock` variant list** — §3 below is a derivation from what the
>    Phase 0 case studies actually require, not a recovered specification.
> 2. **`OSVersion` feature-flag shape.**
> 3. Any entity the original blueprint requires that is absent here.
>
> **If the original blueprint is recovered, it wins over both this document and the
> reconstruction.** Flag the difference; do not silently merge.

---

## 0. Status and purpose

**This contract must survive unchanged into Phase 11's database.** It is written as
documentation, not compiling code. No implementation, no ORM, no schema DDL.

**Design constraints it is built to satisfy** *(all from locked decisions)*:

| Constraint | Consequence in this model |
|---|---|
| Case studies are ordered typed blocks, not fixed fields | `ContentBlock[]` discriminated union |
| Publish-to-static: Mongo edits → JSON bundle → zero DB reads for visitors | Every entity carries publish state; the bundle is a projection of published rows |
| Versions are feature flags over data, never separate builds | Every entity carries version gating |
| One App Registry manifest feeds desktop, Start menu, Ctrl+K, terminal, mobile, updates | Content entities are addressable by stable id, independent of the app displaying them |
| V1 ships with zero backend | V1 authors this as JSON by hand; Phase 11 adds Mongo behind the *same* shapes |

---

## 1. Primitives

```ts
/** Immutable, generated once, never reused. The database key. Never shown to users. */
type EntityId = string;            // e.g. "prj_01H8XK..."

/** Human-readable, URL-facing, changeable. NEVER a primary key. */
type Slug = string;                // e.g. "langchain-openrouter-provider"

/** ISO-8601. Always store full precision; format at render time. */
type ISODate = string;             // "2026-08-15" | "2026-08-15T10:57:00Z"

/** A month-precision date, for timeline entries where the day is unknown. */
type ISOMonth = string;            // "2024-06"

/** Markdown. Inline formatting and links only — no block-level structure. */
type RichText = string;

/**
 * Indirection over an asset. NEVER store a raw URL in content.
 * Moving a CDN must not require a content migration.
 */
interface AssetRef {
  id: EntityId;
  alt: string;                     // required — accessibility is not optional
  caption?: RichText;
  width?: number;                  // intrinsic, for layout reservation
  height?: number;
}

/** An outbound link with an explicit kind, so apps can render/filter by type. */
interface ExternalLink {
  kind: 'live' | 'repo' | 'pr' | 'issue' | 'article' | 'video' | 'profile' | 'other';
  label: string;
  url: string;
  /** False when the URL has not been verified. Unverified links MUST NOT publish. */
  verified: boolean;
  verifiedAt?: ISODate;
}
```

**`ExternalLink.verified` is load-bearing.** Phase 0 established that no project URL has
been checked. The model makes an unverified link a data state rather than a human
promise — the publish step can refuse to emit them.

---

## 2. Version gating — the mechanism behind versions-as-feature-flags

```ts
type VersionId = 'v1' | 'v2' | 'v3';

/**
 * Mixed into EVERY publishable entity.
 * Versions filter the same data set. There is never a second build.
 */
interface VersionGated {
  /** First version in which this exists. */
  introducedIn: VersionId;
  /** Last version in which this appears. Omitted = still present. */
  retiredIn?: VersionId;
}
```

Rendering rule: an entity is visible in version `V` when
`introducedIn <= V` and (`retiredIn` is absent or `V < retiredIn`).

---

## 3. `ContentBlock` — the discriminated union

⚠ **Blueprint-dependent.** Reconcile the variant list and names.

```ts
type ContentBlock =
  | HeadingBlock      | ProseBlock        | ListBlock
  | CodeBlock         | QuoteBlock        | CalloutBlock
  | ImageBlock        | GalleryBlock      | DiagramBlock
  | KeyValueBlock     | ComparisonBlock   | MetricsBlock
  | LinkGroupBlock    | EmbedBlock        | DividerBlock;

/** Every block carries these. */
interface BlockBase extends VersionGated {
  id: EntityId;                    // stable across edits — enables deep links & comments
  type: string;                    // the discriminant
  /**
   * Canonical order is ARRAY POSITION. This field exists only so a relational
   * store in Phase 11 can reconstruct order without relying on row order.
   * Keep the two in sync; array position wins on conflict.
   */
  order: number;
  /** Renderer hint only. Never carries visual styling — Phase 1 owns appearance. */
  emphasis?: 'default' | 'lead' | 'aside';
}
```

### The variants

```ts
interface HeadingBlock extends BlockBase {
  type: 'heading';
  level: 2 | 3 | 4;                // level 1 is the entity title, never a block
  text: string;
  /** Stable anchor for in-page navigation and the Reader Mode outline. */
  anchor: Slug;
}

interface ProseBlock extends BlockBase {
  type: 'prose';
  text: RichText;
}

interface ListBlock extends BlockBase {
  type: 'list';
  style: 'bullet' | 'numbered';
  items: RichText[];
}

interface CodeBlock extends BlockBase {
  type: 'code';
  language: string;                // 'python' | 'ts' | 'bash' | 'text' | ...
  code: string;                    // verbatim; never trimmed or reformatted
  filename?: string;
  /** 1-indexed lines to draw attention to. Semantic, not visual. */
  highlightLines?: number[];
  caption?: RichText;
}

interface QuoteBlock extends BlockBase {
  type: 'quote';
  text: RichText;
  attribution?: string;
  sourceUrl?: string;
}

interface CalloutBlock extends BlockBase {
  type: 'callout';
  /** Semantic intent. Phase 1 decides what each looks like. */
  variant: 'note' | 'caution' | 'limitation' | 'disclosure';
  title?: string;
  text: RichText;
}

interface ImageBlock extends BlockBase {
  type: 'image';
  asset: AssetRef;
  /** Layout intent, not layout. Phase 1 interprets. */
  size?: 'inline' | 'full' | 'bleed';
}

interface GalleryBlock extends BlockBase {
  type: 'gallery';
  assets: AssetRef[];              // 2+
  caption?: RichText;
}

interface DiagramBlock extends BlockBase {
  type: 'diagram';
  /** Source-of-truth format. Prefer authored source over a flat image. */
  format: 'mermaid' | 'svg' | 'image';
  source?: string;                 // mermaid text or inline SVG
  asset?: AssetRef;                // when format === 'image'
  caption?: RichText;
  /** Required. A diagram nobody can read is a decoration. */
  altDescription: string;
}

/** Two-column fact table. Used heavily by "Goals and constraints". */
interface KeyValueBlock extends BlockBase {
  type: 'keyValue';
  title?: string;
  rows: { key: string; value: RichText }[];
}

/** N-column table. Used by "Alternatives considered". */
interface ComparisonBlock extends BlockBase {
  type: 'comparison';
  title?: string;
  columns: string[];
  rows: RichText[][];              // each row length MUST equal columns.length
}

/**
 * Numeric outcomes. Deliberately hard to populate.
 * Phase 0 found ZERO verified metrics across 23 projects.
 */
interface MetricsBlock extends BlockBase {
  type: 'metrics';
  metrics: {
    label: string;
    value: string;                 // string, not number — "~₹30,000", "top 1,500"
    /** REQUIRED. A metric without a source does not publish. */
    source: string;
    /** True only when independently checkable. Drives conservative rendering. */
    verified: boolean;
    /** Set when the figure is a recollection. Forces "approximately" language. */
    approximate?: boolean;
  }[];
}

interface LinkGroupBlock extends BlockBase {
  type: 'linkGroup';
  title?: string;
  links: ExternalLink[];
}

interface EmbedBlock extends BlockBase {
  type: 'embed';
  provider: 'youtube' | 'vimeo' | 'codesandbox' | 'other';
  url: string;
  title: string;
  aspectRatio?: string;            // "16:9"
}

interface DividerBlock extends BlockBase {
  type: 'divider';
}
```

**Rules that must not be relaxed later:**

1. **No block carries visual styling.** No colours, no fonts, no widths, no classNames.
   Blocks carry *semantics*; Phase 1 owns appearance. A `className` field appearing on a
   block in a later phase is a contract violation.
2. **`MetricsBlock.source` is required and `verified` is explicit.** This is the type
   system enforcing the Phase 0 honesty stance.
3. **Block `id`s are stable across edits.** Deep links and future annotations depend on it.

---

## 4. `Project`

```ts
type ProjectTier =
  | 'caseStudy'      // full narrative — 3–4 only
  | 'gallery'        // screenshot + short factual description, no depth claims
  | 'recycled';      // Recycle Bin — started, parked, not maintained

type ProjectStatus =
  | 'live' | 'inProgress' | 'unlaunched' | 'archived' | 'abandoned';

/**
 * How the work was produced. REQUIRED — no default.
 * This field exists because Phase 0 made AI-assistance disclosure the positioning,
 * and an optional honesty field is an honesty field that gets skipped.
 */
type Authorship =
  | 'manual'         // written without AI assistance
  | 'aiAssisted'     // AI-assisted; decisions reviewed and owned
  | 'aiGenerated';   // substantially generated; not fully explainable

interface Project extends VersionGated {
  id: EntityId;
  slug: Slug;

  title: string;
  /** One line. What it does. No adjectives. */
  tagline: string;

  tier: ProjectTier;
  status: ProjectStatus;
  authorship: Authorship;

  /** Ordering within its tier. Lower first. */
  rank: number;

  startedAt: ISOMonth;
  endedAt?: ISOMonth;

  /** Free-text, as reported. NOT the Skill entity — projects don't grant skill tiers. */
  stack: string[];

  links: ExternalLink[];
  cover?: AssetRef;

  /** Case-study body. Empty for gallery and recycled entries. */
  blocks: ContentBlock[];

  /** Solo, or a real division of labour. Never "everything". */
  role: {
    solo: boolean;
    teamSize?: number;
    /** REQUIRED when solo === false. Named subsystems, not "full". */
    ownedAreas?: string[];
  };

  /** Recycle Bin only. Null is permitted — an invented reason is not. */
  abandonmentReason?: RichText | null;

  publish: PublishState;
}
```

**`role.ownedAreas` is required for team projects by contract.** Phase 0 identified
"I did everything" on a 3-person team as the portfolio's most dangerous claim. The model
makes it unrepresentable.

---

## 5. `Skill`

```ts
/**
 * Tiers are EVIDENCE TYPES, not ability levels. No percentages. No ratings.
 * Locked in Phase 0.
 */
type SkillTier =
  | 1   // Externally verified — paid for, merged, or reviewed by someone else
  | 2   // Shipped publicly — used in a live project built end to end
  | 3;  // Worked with — used in a project or coursework

type SkillCategory =
  | 'language' | 'frontend' | 'backend' | 'data' | 'infra' | 'tooling' | 'other';

interface SkillEvidence {
  /** What kind of proof this is. */
  kind: 'mergedPR' | 'paidWork' | 'deployedProject' | 'coursework' | 'competition';
  /** One line stating the evidence. */
  statement: string;
  /** Where to check it. Absent = unverifiable; renders more conservatively. */
  url?: string;
  projectId?: EntityId;
  approximate?: boolean;
}

interface Skill extends VersionGated {
  id: EntityId;
  name: string;
  tier: SkillTier;
  category: SkillCategory;

  /** REQUIRED, non-empty. A skill without evidence does not exist in this model. */
  evidence: SkillEvidence[];

  /**
   * Narrows an over-broad name.
   * e.g. Python — "narrow: the LangChain contribution only".
   */
  scopeNote?: string;

  /**
   * Deliberately absent: any field asserting debugging ability.
   * Phase 0 established no instance can be named. When one can, add
   * `debugEvidence?: SkillEvidence[]` — never a boolean.
   */
  publish: PublishState;
}
```

---

## 6. `TimelineEntry`

```ts
type TimelineKind =
  | 'education' | 'work' | 'project' | 'openSource'
  | 'recognition' | 'milestone';

interface TimelineEntry extends VersionGated {
  id: EntityId;
  /** Which era this belongs to. Drives version filtering of the Timeline app. */
  versionEra: VersionId;

  startedAt: ISOMonth;
  endedAt?: ISOMonth;              // absent = ongoing
  kind: TimelineKind;

  title: string;
  organisation?: string;
  /** 1–3 sentences. Facts only. */
  body: RichText;

  projectId?: EntityId;
  links?: ExternalLink[];

  /** True where dates are recollected. Forces "approx." at render. */
  approximateDates?: boolean;

  publish: PublishState;
}
```

---

## 7. `NowEntry`

```ts
type NowCategory =
  | 'learning' | 'building' | 'openSource' | 'applying' | 'stuckOn' | 'studying';

interface NowEntry {
  id: EntityId;
  category: NowCategory;
  text: RichText;
  projectId?: EntityId;
  publish: PublishState;
}

interface NowSnapshot extends VersionGated {
  id: EntityId;
  /** Rendered visibly. A stale Now must LOOK stale, not read as current. */
  updatedAt: ISODate;
  entries: NowEntry[];
  /** Days after which the UI flags staleness. Suggested: 45. */
  stalenessThresholdDays: number;
  publish: PublishState;
}
```

`stuckOn` is a first-class category by design. Phase 0 recorded "stuck on ML" as real
content, not an embarrassment to be omitted.

---

## 8. `OSVersion`

⚠ **Blueprint-dependent.** The blueprint's version system is authoritative.

```ts
interface OSVersion {
  id: VersionId;
  /** Display number: "1.0" */
  number: string;
  /** Codename. ⚠ v1 is "ORIGIN" — collides with a project of the same name. Resolve. */
  codename?: string;

  /** Real-world era this represents. */
  eraStart: ISOMonth;
  eraEnd?: ISOMonth;               // absent = current
  eraSummary: RichText;

  /** Ascending. Newest = highest. New visitors always boot the highest. */
  sequence: number;
  isLatest: boolean;

  /**
   * Capability flags this version turns on. Feature flags over ONE data set —
   * never a separate build.
   */
  features: string[];

  /** Shown during the update ceremony (returning visitors only). */
  releaseNotes?: ContentBlock[];

  releasedAt: ISODate;
}
```

**Invariants:** exactly one version has `isLatest: true`; `sequence` is unique and dense;
new visitors always boot `isLatest`; the update ceremony never fires on a first visit.

---

## 9. `PublishState` — shared

```ts
interface PublishState {
  status: 'draft' | 'review' | 'published';
  publishedAt?: ISODate;
  updatedAt: ISODate;
  /**
   * Blocks publishing while non-empty. Phase 0 seeds these from every ⚠ VERIFY marker.
   */
  blockers?: string[];
}
```

**The publish step MUST refuse to emit an entity whose `blockers` array is non-empty, or
that contains any `ExternalLink` with `verified: false`.** This is how Phase 0's
verification debt is enforced by machinery rather than by memory.

---

## 10. The published bundle

```ts
interface ContentBundle {
  schemaVersion: string;           // semver of THIS contract
  generatedAt: ISODate;
  versions: OSVersion[];
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEntry[];
  now: NowSnapshot;
  assets: Record<EntityId, { url: string; width?: number; height?: number }>;
}
```

V1 authors this by hand as JSON. Phase 11 generates the identical shape from Mongo.
**The visitor read path is identical in both cases** — that is the point of the contract.

---

## Reconciliation checklist for Phase 1

- [ ] `ContentBlock` variant list vs the blueprint's canonical set
- [ ] `OSVersion.features` flag names vs the blueprint's version system
- [ ] Confirm no blueprint entity is missing here
- [ ] Resolve the **ORIGIN** naming collision (v1 codename vs project)
- [ ] Confirm `Authorship` is acceptable as a **required** field — it is the type-level
      expression of the Phase 0 honesty stance and should not become optional

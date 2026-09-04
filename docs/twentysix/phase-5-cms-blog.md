# Phase 5 — CMS Blog

**Status:** ◻ Specified · **Depends on:** P0 · **Routes:** `/2026/blog`, `/2026/blog/:slug`

The blog is **CMS-driven** (not static markdown). We extend the existing CMS — `admin/`
(editor SPA) + `server/` (Fastify + MongoDB) — by mirroring the `Project` entity end-to-end.

## Goal

Author blog posts in the admin CMS with the same publish/blocker discipline as other
content; render published posts at `/2026/blog` from the shared content bundle.

## Data flow

```mermaid
flowchart LR
  Editor[admin/ Blog tab] -->|PUT /v1/blog/:id| API[server/ routes]
  API --> Store[(ContentStore: mongo/memory)]
  Store -->|assembleBundle| Bundle[(ContentBundle.blog)]
  Bundle --> BlogPage[/2026/blog]
  Bundle --> PostPage[/2026/blog/:slug]
```

## Type (mirror `Project`)

Add to `src/content/types.ts`:

```ts
export interface BlogPost extends VersionGated {
  id: EntityId;
  slug: Slug;
  title: string;
  excerpt: string;
  tags: string[];
  coverAsset?: AssetRef;
  blocks: ContentBlock[];     // body — rendered by BlockRenderer
  publishedAt?: string;
  publish: PublishState;      // draft | review | published, blockers
}
// add to ContentBundle: blog: BlogPost[]
```

## Backend changes (mirror the Project path exactly)

| Step | File | Change |
|------|------|--------|
| Bundle | `server/src/store.ts` | `ContentStore.listBlog/getBlog/putBlog`; include `blog` in `assembleBundle` |
| Mongo | `server/src/mongoStore.ts` | blog collection CRUD |
| Memory | `server/src/memoryStore.ts` | in-memory blog CRUD |
| Seed | `server/src/seed.ts` | seed a sample post |
| Honesty | `src/content/honesty.ts` | `structuralBlogErrors` + `blogPublishBlockers` (slug/title required; unverified links can't publish) |
| Routes | `server/src/routes.ts` | `GET /v1/blog`, `GET /v1/blog/:id`, `PUT /v1/blog/:id` — same `requireAdmin`, `stamp`, blocker gating as projects |

## Admin UI changes

| Step | File | Change |
|------|------|--------|
| Tab | `admin/src/AdminApp.tsx` | add `"blog"` to `Section`, a "Blog" tab, list + editor wiring |
| Editor | `admin/src/Editors.tsx` | `BlogEditor` (title, slug, excerpt, tags, cover, blocks, publish) |
| Form | `admin/src/forms.ts` | `emptyBlog()` + `toBlog/toBlogForm` if a form shape is needed |
| API | `admin/src/api.ts` | include `/v1/blog` in `loadLists` |

## Frontend (26')

```
/2026/blog        <Blog/>       list published posts (title, excerpt, tags, date, cover)
/2026/blog/:slug  <BlogPost/>   render one post via BlockRenderer
```

- Read from the bundle's `blog` (published only), same read path as projects/timeline.
- `<Blog>` grid of cards (monochrome, hairline), sorted by `publishedAt` desc.
- `<BlogPost>` = cover + title + meta + `BlockRenderer(blocks)`; back-to-blog link.

## Motion / mobile

- List cards reveal with `revealStagger`; hover lifts subtly.
- Mobile: single-column cards; post is a comfortable reading measure (~66ch).

## Fallbacks / resilience

- **No published posts:** intentional empty state ("Notes coming soon"), not a broken grid.
- **Bad slug:** `TwentySixNotFound` (or an in-page not-found) with back-to-blog.
- **Missing cover:** `ImageWithFallback`.
- **Backend offline (prod):** blog reads the static/baked bundle, so the public site still
  renders; editing simply requires the local server (matches Phase 16 infra reality).

## Files

- Create: `src/twentysix/pages/Blog.tsx`, `src/twentysix/pages/BlogPost.tsx`,
  `src/twentysix/data/blog.ts` (read adapter over the bundle/static content).
- Modify: `src/App.tsx` (+ routes), `vercel.json` (already wildcarded), plus the backend/admin
  files above, `src/content/types.ts`.

## Acceptance criteria

- [ ] A post can be created + published in the admin CMS with blocker gating.
- [ ] `/2026/blog` lists published posts; `/2026/blog/:slug` renders one.
- [ ] Empty blog + bad slug degrade gracefully.
- [ ] Mobile reading layout is comfortable; no overflow.

## Inputs needed

None blocking (a seed post covers demo). Optionally, the first real posts.

/**
 * V1 asset pipeline — the visitor-facing half of ContentBundle.assets.
 *
 * Emitted bundles merge in at resolve time. The visitor read path stays a static
 * lookup. No CMS, no runtime fetch.
 *
 * Files live under `public/content-assets/` and are addressed only through this
 * table. An AssetRef.id with no row here is missing — render the empty well,
 * never a lorem or generated image.
 */
import { emittedAssetMap } from "./live";

export interface PublishedAsset {
  url: string;
  width?: number;
  height?: number;
}

export const publishedAssets: Record<string, PublishedAsset> = {
  // A3.1–A3.6: empty until Saathvik captures screenshots with AssetRef.alt.
};

export function resolveAsset(id: string): PublishedAsset | null {
  return emittedAssetMap[id] ?? publishedAssets[id] ?? null;
}

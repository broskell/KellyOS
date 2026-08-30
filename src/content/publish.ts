import type { ExternalLink } from "./types";

export const UNVERIFIED_LINKS_COPY =
  "Outbound links are not published until they have been verified.";

/** Visitor / prerender / Reader. Playground may still show unverified links. */
export function publishedExternalLinks(links: ExternalLink[]): ExternalLink[] {
  return links.filter((link) => link.verified === true && Boolean(link.verifiedAt));
}

export function assertVerifiedShape(link: ExternalLink): string | null {
  if (link.verified && !link.verifiedAt) {
    return `${link.label}: verified is true without verifiedAt`;
  }
  if (!link.verified && link.verifiedAt) {
    return `${link.label}: verifiedAt set while verified is false`;
  }
  return null;
}

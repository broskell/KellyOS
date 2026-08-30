import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OG_IMAGE_ALT, OS_PRODUCT, headForPath } from "./site";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const sel = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(sel);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function DocumentHead() {
  const { pathname } = useLocation();
  useEffect(() => {
    const head = headForPath(pathname);
    document.title = head.title;
    upsertMeta("name", "description", head.description);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", head.canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", OS_PRODUCT);
    upsertMeta("property", "og:title", head.title);
    upsertMeta("property", "og:description", head.description);
    upsertMeta("property", "og:url", head.canonical);
    upsertMeta("property", "og:image", head.ogImage);
    upsertMeta("property", "og:image:alt", OG_IMAGE_ALT);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", head.title);
    upsertMeta("name", "twitter:description", head.description);
    upsertMeta("name", "twitter:image", head.ogImage);
  }, [pathname]);
  return null;
}

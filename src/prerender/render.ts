import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { injectHead } from "../seo/headTags";
import { STATIC_PAGES } from "./pages";
import { StaticFallback } from "./StaticFallback";

export { injectHead };

export function prerenderPages() {
  return STATIC_PAGES.map((page) => ({
    path: page.path,
    title: page.title,
    description: page.description,
    markup: renderToStaticMarkup(createElement(StaticFallback, { page })),
  }));
}

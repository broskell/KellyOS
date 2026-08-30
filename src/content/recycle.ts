import { makeBlocks } from "./makeBlocks";

/** Phase 0 app-content.md §7. Thin and true; no invented abandonment reasons. */
export const recycleBlocks = makeBlocks([
  {
    id: "recycle_frame",
    type: "quote",
    text: "Not everything I built was meant to survive. These are projects I started, learned something from, and stopped. I'm keeping them here rather than deleting them, because a portfolio where everything succeeded isn't a portfolio, it's an advert.",
  },
  {
    id: "recycle_snippet",
    type: "heading",
    level: 2,
    text: "SnippetVault",
    anchor: "snippetvault",
  },
  {
    id: "recycle_snippet_p",
    type: "prose",
    text: "Personal code-snippet manager, built in Flutter. A productivity tool for an audience of one. I stopped maintaining it.",
  },
  {
    id: "recycle_rolex",
    type: "heading",
    level: 2,
    text: "Rolex Scrollytelling",
    anchor: "rolex-scrollytelling",
  },
  {
    id: "recycle_rolex_p",
    type: "prose",
    text: "Built to learn Three.js, GSAP and Lenis. It did that job. It was never going to be a product.",
  },
  {
    id: "recycle_f1",
    type: "heading",
    level: 2,
    text: "F1 Scrollytelling",
    anchor: "f1-scrollytelling",
  },
  {
    id: "recycle_f1_p",
    type: "prose",
    text: "Same again — another scroll-driven 3D experiment. Two of these taught me the technique; a third wasn't going to teach me more.",
  },
  {
    id: "recycle_rule",
    type: "callout",
    variant: "note",
    title: "Standing rule",
    text: "If a project doesn't have a real abandonment reason I can remember, it doesn't get an invented one. Thin and true beats rich and false.",
  },
]);

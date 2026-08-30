import { makeBlocks } from "./makeBlocks";

/** Phase 0 app-content.md §6. Suggested closing line omitted (VERIFY — keep only if true). */
export const contactBlocks = makeBlocks([
  {
    id: "contact_open",
    type: "prose",
    text: "Open to: jobs, freelance, collaboration, open-source work, and questions about anything on this site. No filter — if you have a reason to write, write.",
  },
  {
    id: "contact_kv",
    type: "keyValue",
    title: "Channels",
    rows: [
      { key: "Email", value: "[saathvik.kp@gmail.com](mailto:saathvik.kp@gmail.com)" },
      { key: "GitHub", value: "[github.com/broskell](https://github.com/broskell)" },
      {
        key: "LinkedIn",
        value: "[linkedin.com/in/kellampalli-saathvik](https://www.linkedin.com/in/kellampalli-saathvik/)",
      },
      { key: "X", value: "[@kellyyboi](https://x.com/kellyyboi)" },
    ],
  },
  {
    id: "contact_not",
    type: "callout",
    variant: "note",
    title: "Not published",
    text: "Phone number, Discord handle.",
  },
]);

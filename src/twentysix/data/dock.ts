import type { ReactNode } from "react";
import {
  IconHome,
  IconUser,
  IconWork,
  IconStack,
  IconTimeline,
  IconMail,
  IconResume,
} from "../components/icons";

/**
 * A dock entry. `to` is either an in-page section id (scroll target) or, when
 * `kind` is "link", an href opened in a new tab (e.g. the resume PDF).
 */
export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** section id (default) or href (kind: "link"). */
  to: string;
  kind?: "section" | "link";
}

/**
 * The persistent 26' dock. Section items drive the on-page scroll-spy; the
 * resume item opens the (existence-checked) PDF. Order mirrors the page.
 */
export const dockItems: DockItem[] = [
  { id: "home", label: "Home", icon: IconHome({}), to: "home" },
  { id: "about", label: "About", icon: IconUser({}), to: "about" },
  { id: "projects", label: "Projects", icon: IconWork({}), to: "projects" },
  { id: "techstack", label: "Tech Stack", icon: IconStack({}), to: "techstack" },
  { id: "timeline", label: "Timeline", icon: IconTimeline({}), to: "timeline" },
  { id: "contact", label: "Contact", icon: IconMail({}), to: "contact" },
  {
    id: "resume",
    label: "Resume",
    icon: IconResume({}),
    to: "/Saathvik_Kellampalli_Resume.pdf",
    kind: "link",
  },
];

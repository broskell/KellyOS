import type { ReactNode } from "react";
import {
  IconGithub,
  IconLinkedin,
  IconLeetcode,
  IconInstagram,
  IconGmail,
} from "../components/icons";

export interface SocialLink {
  id: string;
  label: string;
  /** Full text shown to screen readers / tooltips. */
  handle: string;
  url: string;
  icon: ReactNode;
}

export const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    handle: "broskell",
    url: "https://github.com/broskell",
    icon: IconGithub({}),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "kellampalli-saathvik",
    url: "https://www.linkedin.com/in/kellampalli-saathvik",
    icon: IconLinkedin({}),
  },
  {
    id: "leetcode",
    label: "LeetCode",
    handle: "kellysolves",
    url: "https://leetcode.com/u/kellysolves",
    icon: IconLeetcode({}),
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "saathvikkellampalli",
    url: "https://www.instagram.com/saathvikkellampalli",
    icon: IconInstagram({}),
  },
  {
    id: "gmail",
    label: "Email",
    handle: "saathvik.kp@gmail.com",
    url: "mailto:saathvik.kp@gmail.com",
    icon: IconGmail({}),
  },
];

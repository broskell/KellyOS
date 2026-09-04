# 26' Edition — Reference Image Manifest

These are the inspiration references Saathvik collected (mostly 21st.dev components and
motion studies) that drive the 2026 edition. Each row maps one reference to the phase it
informs and the filename to save it under **in this folder** so the phase docs render it.

## How to add the images

Save each attached screenshot here with the exact filename below. Every phase doc embeds
`![](../references/<file>)`, so once the file exists the blueprint pages show the reference
inline. Until then the docs still read fully — every reference is described in prose.

| # | Filename | Phase | What it is | How we use it |
|---|----------|-------|------------|---------------|
| 1 | `01-design-particle-text.png` | [P1 Hero](../phase-1-hero-dock.md) | Dot/particle "Design" wordmark that scatters | Hero right-side image-driven headline treatment |
| 2 | `02-macos-dock.png` | [P1 Dock](../phase-1-hero-dock.md) | macOS-style glass dock with app icons + a "How can I help you today?" pill | Persistent bottom navigation dock |
| 3 | `03-challenges-rotated-cards.png` | [P2 About](../phase-2-about-timeline.md) | Rotated blue/beige "CHALLENGES" cards | About-me rotated cards that scroll in from the right |
| 4 | `04-avatar-globe.png` | [P4 Tech stack](../phase-4-techstack-graphs.md) | Cluster of circular avatars arranged on a rotating sphere | Tech-stack globe of technology icons |
| 5 | `05-detail-modal.png` | [P4 Tech stack](../phase-4-techstack-graphs.md) | Centered image modal with close X, title, description | On-click tech detail (icon + skill range bar) |
| 6 | `06-expanding-slats.png` | [P3 Projects](../phase-3-projects.md) | Vertical accordion slats; the active one expands to a wide image with tag + title + "VIEW PROJECT" | Projects gallery; click expands / opens modal |
| 7 | `07-curved-timeline.png` | [P2 Timeline](../phase-2-about-timeline.md) | Curved vertical line with year nodes and captioned photos | Career/journey timeline (GSAP) |
| 8 | `08-hyperdrive-hero.png` | [P7 Contact](../phase-7-fx-contact-footer.md) | Centered headline + CTA button over a warp-speed starfield | Contact section composition + animated background |
| 9 | `09-ready-footer.png` | [P7 Footer](../phase-7-fx-contact-footer.md) | "Ready to begin?" with download buttons, top marquee, huge faint watermark word | Footer composition |
| 10 | `10-thin-line.png` | [P7 FX](../phase-7-fx-contact-footer.md) | A single thin curved hairline that draws across | Section-divider line accent |
| 11 | `11-flickering-text.png` | [P7 FX](../phase-7-fx-contact-footer.md) | Glowing text with per-letter flicker | Accent heading treatment |
| 12 | `12-flip-on-hinge.png` | [P7 FX](../phase-7-fx-contact-footer.md) | Text/panel that flips forward on a hinge | Reveal transition for a heading/panel |
| 13 | `13-infinite-ribbon.png` | [P7 FX](../phase-7-fx-contact-footer.md) | Crossed marquee ribbons of scrolling text | Infinite marquee band between sections |
| 14 | `14-aether-flow.png` | [P1 Hero / backgrounds](../phase-1-hero-dock.md) | Purple/mono particle network that reacts to the cursor | Ambient hero / section background field |
| 15 | `15-minimal-hover.png` | [P7 Footer](../phase-7-fx-contact-footer.md) | Faint "MINIMAL" word that resolves on hover | Bugatti-style minimal hover on the footer name |

## Notes

- References 10–15 are **effects**, not full sections — they are placed as accents across
  the page. Aether-flow (14) also serves as the hero background; minimal-hover (15) is
  specifically the footer name treatment.
- All references are color originals; in the 26' edition they are re-interpreted in the
  **monochrome grayscale system** (see [design-system.md](../design-system.md)). Treat them
  as composition/motion references, not palette references.
- Components marked "21st.dev" arrive as pasted code and drop into typed **slots** — see
  each phase's *Integration slots* section.

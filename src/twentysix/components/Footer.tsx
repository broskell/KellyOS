import { MinimalistTextEffect } from "@/components/ui/reveal-text";
import "../styles/footer.css";
import { socials } from "../data/socials";
import { smoothScrollTo } from "../motion/scroll";
import { Reveal } from "./primitives/Reveal";
import { Section } from "./primitives/Section";

const footerLinks = socials.filter((link) =>
  ["github", "linkedin", "gmail"].includes(link.id),
);

const columns = [
  {
    title: "Navigate",
    links: [
      ["Home", "home"],
      ["About", "about"],
      ["Projects", "projects"],
      ["Tech Stack", "techstack"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["Timeline", "timeline"],
      ["Contact", "contact"],
      ["Terminal", "terminal"],
      ["Resume", "/Saathvik_Kellampalli_Resume.pdf"],
    ],
  },
  {
    title: "Connect",
    links: footerLinks.map((link) => [link.label, link.url]),
  },
];

function scrollToTop() {
  const home = document.getElementById("home");
  smoothScrollTo(home ?? 0, { offset: 0 });
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target) smoothScrollTo(target, { offset: 0 });
}

export function Footer() {
  return (
    <Section as="footer" id="footer" label="Footer" className="t26-footer" container="none">
      <hr className="t26-hairline" />

      <Reveal className="t26-footer__inner" direction="up">
        <div className="t26-container t26-footer__top">
          {columns.map((column) => (
            <nav key={column.title} className="t26-footer__column" aria-label={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map(([label, to]) => {
                  const isUrl = to.startsWith("http") || to.startsWith("mailto:");
                  const isFile = to.startsWith("/");
                  if (isUrl || isFile) {
                    return (
                      <li key={to}>
                        <a
                          href={to}
                          {...(isUrl && !to.startsWith("mailto:")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {label}
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={to}>
                      <button type="button" onClick={() => scrollToSection(to)}>
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}

          <div className="t26-footer__language">
            <h2>Language</h2>
            <p>
              <span>English</span>
            </p>
          </div>
        </div>

        <div className="t26-container t26-footer__middle">
          <p>© {new Date().getFullYear()} Saathvik Kellampalli.</p>
          <div className="t26-footer__socials" aria-label="Social links">
            {footerLinks.map((link) => {
              const external = link.url.startsWith("http");
              return (
                <a
                  key={link.id}
                  href={link.url}
                  aria-label={link.label}
                  title={link.label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {link.icon}
                </a>
              );
            })}
          </div>
          <button type="button" onClick={scrollToTop}>
            ↑ Top
          </button>
        </div>

        <div className="t26-footer__name" aria-label="SAATHVIK">
          {/* viewBox width (767) = the wordmark's natural width at this weight/
              size, so it fills edge-to-edge with NO stretching. Height (150) is
              cropped under the cap height → a slight top/bottom bleed. The name
              box carries the matching aspect-ratio so `slice` fills exactly. */}
          <MinimalistTextEffect
            text="SAATHVIK"
            duration={0.28}
            viewBox="0 0 767 150"
            preserveAspectRatio="xMidYMid slice"
            fontSize={176}
            baseOpacity={0}
            revealOpacity={0.75}
            persistAfterHover
            maskRadius="42%"
            gradientStops={["#f4f4f4", "#6a6a6a", "#0f0f0f"]}
            x="50%"
            y="50%"
            textClassName="t26-footer__name-text"
          />
        </div>
      </Reveal>
    </Section>
  );
}

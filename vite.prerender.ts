import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { createServer, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export function kellosDirectoryIndex(): Plugin {
  return {
    name: "kellos-directory-index",
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const raw = req.url ?? "";
        const q = raw.indexOf("?");
        const pathOnly = q === -1 ? raw : raw.slice(0, q);
        const search = q === -1 ? "" : raw.slice(q);
        if (pathOnly && !path.extname(pathOnly) && !pathOnly.endsWith("/")) {
          req.url = `${pathOnly}/${search}`;
        }
        next();
      });
    },
  };
}

export function kellosPrerender(): Plugin {
  return {
    name: "kellos-prerender",
    apply: "build",
    async closeBundle() {
      const env = loadEnv("production", process.cwd(), "");
      if (env.KELLOS_SITE_URL) process.env.KELLOS_SITE_URL = env.KELLOS_SITE_URL;
      else if (env.VITE_SITE_URL) process.env.KELLOS_SITE_URL = env.VITE_SITE_URL;

      const dist = path.resolve("dist");
      const indexPath = path.join(dist, "index.html");
      const template = await readFile(indexPath, "utf8");

      const server = await createServer({
        configFile: false,
        root: process.cwd(),
        server: { middlewareMode: true },
        appType: "custom",
        plugins: [react(), tailwindcss()],
      });
      try {
        const mod = await server.ssrLoadModule("/src/prerender/render.ts");
        const pages = mod.prerenderPages() as {
          path: string;
          title: string;
          description: string;
          markup: string;
        }[];
        const injectHead = mod.injectHead as (
          html: string,
          page: { path: string; title: string; description: string },
        ) => string;
        const seo = await server.ssrLoadModule("/src/seo/site.ts");
        const siteOrigin = seo.siteOrigin as () => string;
        const sitemapPaths = seo.sitemapPaths as () => string[];

        for (const page of pages) {
          let html = template.replace(
            /<div id="root"><\/div>/,
            `<div id="root">${page.markup}</div>`,
          );
          html = injectHead(html, page);
          const out =
            page.path === "/"
              ? indexPath
              : path.join(dist, page.path.replace(/^\//, ""), "index.html");
          await mkdir(path.dirname(out), { recursive: true });
          await writeFile(out, html, "utf8");
        }

        const origin = siteOrigin();
        const urls = sitemapPaths()
          .map((p) => `  <url><loc>${p === "/" ? `${origin}/` : `${origin}${p}`}</loc></url>`)
          .join("\n");
        await writeFile(
          path.join(dist, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          "utf8",
        );
        await writeFile(
          path.join(dist, "robots.txt"),
          `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
          "utf8",
        );
      } finally {
        await server.close();
      }
    },
  };
}

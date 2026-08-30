import { Link } from "react-router-dom";
import { EmptyAssetWell } from "../blocks/BlockRenderer";
import { WindowFrame } from "../chrome/WindowFrame";
import { resolveAsset } from "../content/assets";
import { featuredCaseStudy, galleryRows, type GalleryRow } from "../content/live";
import { publishedExternalLinks } from "../content/publish";
import { ReaderMenu } from "./ReaderMenu";

function GalleryRowView({ row }: { row: GalleryRow }) {
  const shot = row.screenshot;
  const resolved = shot ? resolveAsset(shot.id) : null;
  const live = row.live ? publishedExternalLinks([row.live])[0] : undefined;

  return (
    <div className="os-sunken mb-1 bg-window-paper px-2 py-2 text-sm">
      <strong>{row.title}</strong> — {row.note}
      {shot ? (
        <div className="mt-2">
          {resolved ? (
            <img
              src={resolved.url}
              alt={shot.alt}
              width={resolved.width ?? shot.width}
              height={resolved.height ?? shot.height}
              className="block-image-inline"
            />
          ) : (
            <EmptyAssetWell alt={shot.alt} caption={shot.caption} />
          )}
        </div>
      ) : null}
      {live ? (
        <div className="mt-2">
          <a className="os-btn os-raised inline-block no-underline" href={live.url}>
            {live.label}
          </a>
        </div>
      ) : null}
    </div>
  );
}

export default function ProjectsWindow() {
  return (
    <WindowFrame
      title="Projects"
      status="1 case study  ·  gallery is a view, not a second app"
      menu={<ReaderMenu to="/read/projects" />}
      className="h-full min-h-0 w-full"
    >
      <div className="p-4 font-ui">
        <fieldset className="os-group os-sunken">
          <span className="os-group-label">Case study</span>
          <Link
            to={`/project/${featuredCaseStudy.slug}`}
            className="flex w-full flex-col gap-1 border-0 bg-window-paper p-3 text-left no-underline text-ink"
          >
            <span className="font-chrome text-chrome font-bold">{featuredCaseStudy.title}</span>
            <span className="text-sm text-muted">{featuredCaseStudy.tagline}</span>
            <span className="font-chrome text-chrome">{featuredCaseStudy.line}</span>
          </Link>
        </fieldset>
        <fieldset className="os-group os-sunken mt-6" data-os-gallery>
          <span className="os-group-label">Also shipped</span>
          <p className="mb-3 text-sm text-muted">
            Short factual rows. Not case studies. Layout holds with a short list and no
            screenshots. The 8–10 cut and captures were not in the tree — this is not a
            completed gallery.
          </p>
          {galleryRows.map((row) => (
            <GalleryRowView key={row.title} row={row} />
          ))}
        </fieldset>
      </div>
    </WindowFrame>
  );
}

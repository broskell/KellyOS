import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { documents, type DocId } from "../content/documents";
import { FEATURED_CASE_STUDY_SLUG } from "../registry/manifest";
import { FallbackDocument } from "./FallbackDocument";

const APP_DOCS: Record<string, DocId> = {
  about: "about",
  projects: "projects",
  skills: "skills",
  resume: "resume",
  contact: "contact",
  recycle: "recycle",
  now: "now",
  timeline: "timeline",
};

export function ReaderIndex() {
  return <Navigate to="/read/about" replace />;
}

export function ReaderAppPage() {
  const { app } = useParams();
  const id = APP_DOCS[app ?? "about"];
  if (!id) return <Navigate to="/read/about" replace />;
  return <ReaderDocument docId={id} backTo={`/${app === "about" ? "" : app}`} />;
}

export function ReaderProjectPage() {
  const { slug } = useParams();
  if (slug !== FEATURED_CASE_STUDY_SLUG) {
    return <ReaderDocument docId="caseStudy" backTo="/projects" missing />;
  }
  return <ReaderDocument docId="caseStudy" backTo={`/project/${slug}`} />;
}

function ReaderDocument({
  docId,
  backTo,
  missing,
}: {
  docId: DocId;
  backTo: string;
  missing?: boolean;
}) {
  const location = useLocation();
  const doc = documents[docId];
  const osPath = backTo === "/" || backTo === "" ? "/" : backTo;
  return (
    <div className="reader-shell h-full overflow-auto">
      <header className="border-b border-reader-rule px-4 py-3 font-ui text-sm text-reader-muted">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <span>KELL.OS · Reader Mode</span>
          <Link to={osPath} className="os-btn os-raised inline-block no-underline">
            Back to desktop
          </Link>
        </div>
      </header>
      <main>
        <article className="reader-doc">
        <p className="font-ui mb-8 text-sm tracking-wide text-reader-muted uppercase">
          Stripped of the OS. Same words. For a hurried recruiter and for a crawler.
        </p>
        {missing ? (
          <p className="font-body">No published case study at this URL.</p>
        ) : (
          <FallbackDocument doc={doc} />
        )}
        <p className="font-ui mt-10 text-sm text-reader-muted">{location.pathname}</p>
        </article>
      </main>
    </div>
  );
}

import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DocumentHead } from "./seo/DocumentHead";

const DesktopShell = lazy(() =>
  import("./shell/DesktopShell").then((m) => ({ default: m.DesktopShell })),
);
const ReaderIndex = lazy(() =>
  import("./reader/ReaderPage").then((m) => ({ default: m.ReaderIndex })),
);
const ReaderAppPage = lazy(() =>
  import("./reader/ReaderPage").then((m) => ({ default: m.ReaderAppPage })),
);
const ReaderProjectPage = lazy(() =>
  import("./reader/ReaderPage").then((m) => ({ default: m.ReaderProjectPage })),
);

function ShellFallback() {
  return <div className="h-full min-h-0 font-chrome">Kelly.OS</div>;
}

export function App() {
  return (
    <BrowserRouter>
      <DocumentHead />
      <div className="h-full min-h-0">
        <Suspense fallback={<ShellFallback />}>
          <Routes>
            <Route path="/read" element={<ReaderIndex />} />
            <Route path="/read/project/:slug" element={<ReaderProjectPage />} />
            <Route path="/read/:app" element={<ReaderAppPage />} />
            <Route element={<DesktopShell />}>
              <Route path="/" />
              <Route path="/about" />
              <Route path="/projects" />
              <Route path="/project/:slug" />
              <Route path="/skills" />
              <Route path="/resume" />
              <Route path="/contact" />
              <Route path="/recycle" />
            <Route path="/now" />
            <Route path="/timeline" />
            <Route path="/terminal" />
            <Route path="/settings" />
            <Route path="/os-update" />
            <Route path="/kell-ai" />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

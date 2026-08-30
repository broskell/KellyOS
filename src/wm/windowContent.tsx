import { Suspense } from "react";
import { appWindowLoader, CASE_STUDY_LOADER } from "../registry/loadWindow";
import { FEATURED_CASE_STUDY_SLUG } from "../registry/manifest";
import type { AppId } from "../registry/types";
import { FirstRunHelp } from "../surfaces/BootAndBrand";
import type { WmWindow } from "./core";

function AppPending() {
  return (
    <div className="os-window relative flex h-full min-h-0 flex-col">
      <div className="os-sunken os-well flex-1 p-5 font-chrome">Opening…</div>
    </div>
  );
}

export function WindowBody({ win, onDismissTip }: { win: WmWindow; onDismissTip: () => void }) {
  if (win.kind === "tip") return <FirstRunHelp onDismiss={onDismissTip} />;
  if (win.appId === "caseStudy") {
    const slug = win.route.replace("/project/", "") || FEATURED_CASE_STUDY_SLUG;
    const CaseStudy = CASE_STUDY_LOADER;
    return (
      <Suspense fallback={<AppPending />}>
        <CaseStudy slug={slug} />
      </Suspense>
    );
  }
  const Body = appWindowLoader(win.appId as AppId) ?? appWindowLoader("about");
  if (!Body) return null;
  return (
    <Suspense fallback={<AppPending />}>
      <Body />
    </Suspense>
  );
}

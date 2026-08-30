import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "../brand/marks";
import { WindowFrame } from "../chrome/WindowFrame";
import { prefersReducedMotion } from "../motion/duration";
import { ReaderMenu } from "./ReaderMenu";

function motionSnapshot() {
  return prefersReducedMotion();
}

function subscribeMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

export default function SettingsWindow() {
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);

  return (
    <WindowFrame
      title="Settings"
      status="Visitor settings that exist  ·  not OS Update"
      menu={<ReaderMenu to="/read/about" />}
      className="h-full min-h-0 w-full"
    >
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Wordmark size={14} />
          <p className="font-chrome m-0">KELL.OS 3.0 — newest for new visitors. Always.</p>
        </div>
        <p className="font-chrome m-0">
          Identity is the wordmark. There is no theme lab, wallpaper picker, or version
          switcher here. Those belong to later phases — not this window.
        </p>
        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">Motion</h2>
          <p className="font-chrome mt-1 m-0">
            Reduced motion is an OS/browser setting, not a fake toggle on this page. This
            visit: <strong>{reduced ? "reduce" : "no preference"}</strong>. If you asked
            Windows or your browser to reduce motion, boot and window tweens skip.
          </p>
        </section>
        <section>
          <h2 className="font-chrome m-0 text-[11px] font-bold">Keyboard</h2>
          <ul className="font-chrome mt-1 list-disc pl-5">
            <li>Ctrl+K — Search (registry)</li>
            <li>Alt+R — Reader Mode</li>
            <li>Alt+Shift+C — close window</li>
            <li>Alt+Shift+F — cycle windows</li>
            <li>Alt+Shift+arrows — nudge</li>
            <li>Escape — close Start and Search</li>
          </ul>
        </section>
        <p className="font-chrome m-0">
          The safety valve is{" "}
          <Link to="/read/about" className="underline">
            Reader Mode
          </Link>
          , not a setting buried here.
        </p>
      </div>
    </WindowFrame>
  );
}

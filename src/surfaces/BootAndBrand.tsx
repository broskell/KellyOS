import { BootMark, Wordmark } from "../brand/marks";
import { OsButton, WindowFrame } from "../chrome/WindowFrame";

export function BootScreen({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="os-desktop relative flex h-full flex-col items-center justify-center gap-6">
      <div className="os-raised bg-face p-6 text-center">
        <BootMark size={64} />
        <div className="mt-4 flex justify-center">
          <Wordmark size={18} />
        </div>
        <p className="font-chrome mt-3">Starting KELL.OS 3.0…</p>
        <p className="font-chrome text-muted mt-1">New visitors boot latest. Always.</p>
      </div>
      <button type="button" className="os-btn os-raised" onClick={onSkip}>
        Skip
      </button>
    </div>
  );
}

export function FirstRunHelp({ onDismiss }: { onDismiss: () => void }) {
  return (
    <WindowFrame title="Getting around" className="h-full min-h-0 w-full">
      <div className="space-y-3 p-3 font-chrome">
        <p>About Me is already open. This tip does not delay it.</p>
        <ul className="ml-4 list-disc">
          <li>Read the disclosure in About Me. Then Projects → the LangChain case study. You do not need to learn the window manager first.</li>
          <li>Start and the desktop only list apps that open. Read is on the taskbar and in Start.</li>
          <li>Alt+R opens Reader Mode. Ctrl+K opens Search. Alt+Shift+C closes a window. Alt+Shift+F switches windows. Alt+Shift+arrows move a window. Escape closes Start and Search.</li>
        </ul>
        <p>No mascot. No Shut Down hiring path.</p>
        <OsButton onClick={onDismiss}>Got it</OsButton>
      </div>
    </WindowFrame>
  );
}

export function TokensLab() {
  const swatches: [string, string][] = [
    ["desktop", "var(--kellos-desktop)"],
    ["face", "var(--kellos-face)"],
    ["title", "var(--kellos-title-active-from)"],
    ["title-to", "var(--kellos-title-active-to)"],
    ["paper", "var(--kellos-window-paper)"],
    ["disclosure", "var(--kellos-disclosure)"],
    ["caution", "var(--kellos-caution-face)"],
    ["reader", "var(--kellos-reader-bg)"],
    ["code", "var(--kellos-code-bg)"],
  ];
  return (
    <div className="os-desktop min-h-full p-4">
      <WindowFrame title="Token playground" className="max-w-4xl">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {swatches.map(([name, color]) => (
              <div key={name} className="os-raised p-2">
                <div className="mb-1 h-10" style={{ background: color }} />
                <span className="font-chrome">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="os-btn os-raised">
              Raised
            </button>
            <button type="button" className="os-btn os-raised" data-pressed="true">
              Pressed
            </button>
            <button type="button" className="os-btn os-raised" disabled>
              Disabled
            </button>
          </div>
          <p className="font-body text-body mt-4 max-w-prose leading-[1.62]">
            Body type is Source Serif 4. Chrome stays Tahoma / W95FA. Long-form reading is the
            product; the OS is the frame.
          </p>
          <p className="font-chrome mt-2">
            KELL.OS 1.0 chrome label: <strong>KELL.OS 1.0</strong> — era subtitle ORIGIN. Project
            ORIGIN is always shown as a project, never as a version.
          </p>
        </div>
      </WindowFrame>
    </div>
  );
}

export function WordmarkSheet() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-8 bg-desktop p-8">
      <div className="os-raised bg-face p-8">
        <Wordmark size={28} />
        <p className="font-chrome mt-4 text-muted">Wordmark — chrome and boot only</p>
      </div>
      <div className="os-titlebar w-80">
        <Wordmark size={14} invert />
        <span className="os-titlebar-label">on navy</span>
      </div>
      <div className="os-raised bg-face p-4">
        <BootMark size={48} />
        <p className="font-chrome mt-2">Boot mark / favicon parent</p>
      </div>
    </div>
  );
}

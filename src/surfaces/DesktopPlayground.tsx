import { PixelIcon, Wordmark } from "../brand/marks";
import { OsButton, WindowFrame } from "../chrome/WindowFrame";
import { BlockRenderer } from "../blocks/BlockRenderer";
import { aboutBlocks } from "../content/sample";

export function DesktopPlayground({
  onReader,
  onOpenCase,
  compact,
}: {
  onReader: () => void;
  onOpenCase: () => void;
  compact: boolean;
}) {
  const icons = [
    { name: "about" as const, label: "About Me" },
    { name: "projects" as const, label: "Projects" },
    { name: "skills" as const, label: "Skills" },
    { name: "resume" as const, label: "Résumé" },
    { name: "contact" as const, label: "Contact" },
    { name: "recycle" as const, label: "Recycle Bin" },
  ];

  return (
    <div className="os-desktop flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1">
        <div
          className={
            compact
              ? "grid grid-cols-4 gap-2 px-3 pt-3"
              : "absolute top-3 left-3 flex flex-col gap-3"
          }
          style={{ zIndex: "var(--kellos-z-icons)" }}
        >
          {icons.map((icon) => (
            <button
              key={icon.label}
              type="button"
              className="os-icon flex flex-col items-center gap-1 border-0 bg-transparent p-1"
              data-selected={icon.name === "about"}
            >
              <PixelIcon name={icon.name} />
              <span className="os-icon-label">{icon.label}</span>
            </button>
          ))}
        </div>

        <div
          className={
            compact
              ? "absolute inset-x-0 bottom-0 top-[7.5rem] overflow-auto px-2"
              : "absolute inset-0 p-6 pl-28 pr-6"
          }
        >
          <WindowFrame
            title="About Me — Saathvik Kellampalli"
            menu={
              <div className="os-menubar">
                <button type="button">File</button>
                <button type="button">Edit</button>
                <button type="button" onClick={onReader}>
                  Reader Mode
                </button>
              </div>
            }
            status="KELL.OS 3.0  ·  new visitors boot latest"
            className={compact ? "min-h-full" : "h-full max-w-3xl"}
          >
            <BlockRenderer blocks={aboutBlocks} gateExternalLinks={false} />
          </WindowFrame>
        </div>
      </div>

      <Taskbar onReader={onReader} onOpenCase={onOpenCase} compact={compact} />
    </div>
  );
}

function Taskbar({
  onReader,
  onOpenCase,
  compact,
}: {
  onReader: () => void;
  onOpenCase: () => void;
  compact: boolean;
}) {
  return (
    <footer className="os-taskbar os-raised relative z-[9000] shrink-0">
      <StartButton onOpenCase={onOpenCase} onReader={onReader} />
      <button type="button" className="os-task os-raised os-btn" data-active="true">
        About Me
      </button>
      {!compact ? (
        <button type="button" className="os-task os-raised os-btn" onClick={onOpenCase}>
          Case Study
        </button>
      ) : null}
      <div className="os-tray os-sunken font-chrome">
        <OsButton onClick={onReader}>Read</OsButton>
        <span aria-label="Clock">10:43</span>
      </div>
    </footer>
  );
}

function StartButton({
  onOpenCase,
  onReader,
}: {
  onOpenCase: () => void;
  onReader: () => void;
}) {
  return (
    <details className="relative">
      <summary className="os-start os-raised os-btn list-none [&::-webkit-details-marker]:hidden">
        <Wordmark size={12} />
        <span>Start</span>
      </summary>
      <div
        className="os-menu os-raised absolute bottom-full left-0 mb-1 flex w-56 flex-col"
        style={{ zIndex: "var(--kellos-z-start)" }}
      >
        <button type="button">About Me</button>
        <button type="button" onClick={onOpenCase}>
          Projects
        </button>
        <button type="button">Skills</button>
        <button type="button">Résumé</button>
        <button type="button">Contact</button>
        <button type="button">Recycle Bin</button>
        <hr className="block-divider my-1" />
        <button type="button" onClick={onReader}>
          Reader Mode
        </button>
      </div>
    </details>
  );
}

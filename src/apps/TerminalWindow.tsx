import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { WindowFrame } from "../chrome/WindowFrame";
import { launchTargetsOn, resolveOpenQuery } from "../registry/resolve";
import { useRegistryLaunch } from "../registry/useRegistryLaunch";

type Line = { kind: "in" | "out"; text: string };

function helpText(): string {
  const names = launchTargetsOn("terminalOpen")
    .map((t) => t.id)
    .join(", ");
  return [
    "This is not a shell on your machine. No network. No filesystem of anyone's life.",
    "Commands: help · ls · open <id|slug|title> · clear",
    `open resolves the App Registry (terminalOpen): ${names}`,
  ].join("\n");
}

export default function TerminalWindow() {
  const launch = useRegistryLaunch();
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([{ kind: "out", text: helpText() }]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight);
  }, [lines]);

  const print = (text: string) => setLines((prev) => [...prev, { kind: "out", text }]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    setLines((prev) => [...prev, { kind: "in", text: `> ${cmd || ""}` }]);
    if (!cmd) return;

    const [verb, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const name = verb.toLowerCase();

    if (name === "clear") {
      setLines([]);
      return;
    }
    if (name === "help") {
      print(helpText());
      return;
    }
    if (name === "ls") {
      print(
        launchTargetsOn("terminalOpen")
          .map((t) => `${t.id}\t${t.title}`)
          .join("\n"),
      );
      return;
    }
    if (name === "open") {
      const result = resolveOpenQuery(arg, "terminalOpen");
      if (result.ok) {
        print(`opening ${result.target.id}`);
        launch(result.target);
        return;
      }
      if (result.reason === "empty") {
        print("usage: open <id|slug|title>");
        return;
      }
      if (result.reason === "none") {
        print(`No launchable registry app matches “${arg}”.`);
        return;
      }
      print(`Ambiguous. Matches: ${result.matches.map((m) => m.id).join(", ")}`);
      return;
    }

    print(`Unknown command “${name}”. Try help.`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = draft;
    setDraft("");
    run(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "l" && e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <WindowFrame title="Terminal" status="open · ls · help  ·  registry only" className="h-full min-h-0 w-full">
      <div
        className="flex h-full min-h-0 flex-col font-mono text-[13px] leading-snug"
        onClick={() => inputRef.current?.focus()}
      >
        <div ref={scroller} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-2">
          {lines.map((line, i) => (
            <p key={`${i}-${line.kind}`} className="m-0">
              {line.text}
            </p>
          ))}
        </div>
        <form className="flex items-center gap-1 border-t border-[var(--kellos-bevel-shadow)] p-1" onSubmit={onSubmit}>
          <span aria-hidden="true">{">"}</span>
          <input
            ref={inputRef}
            id="os-terminal-input"
            aria-label="Command"
            className="font-mono min-w-0 flex-1 border-0 bg-transparent outline-none"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </form>
      </div>
    </WindowFrame>
  );
}

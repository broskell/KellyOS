import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { WindowFrame } from "../chrome/WindowFrame";
import { specForPath } from "../wm/specs";
import { useWmStore } from "../wm/store";
import { answerFor, type KellAnswer } from "./kellai/intents";

type Turn = { q: string; a: KellAnswer };

const INTRO: KellAnswer = {
  kind: "help",
  text: "I'm Kelly.AI — a deterministic assistant. Ask about the work and I'll route you to the real answer. No LLM, no invented facts. Try:",
  suggestions: ["projects", "skills", "experience", "contact", "what is he doing now"],
};

export default function KellAiWindow() {
  const navigate = useNavigate();
  const openWin = useWmStore((s) => s.open);
  const inputRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    scroller.current?.scrollTo(0, scroller.current.scrollHeight);
  }, [turns]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const openPath = (path: string) => {
    const spec = specForPath(path);
    if (spec) openWin(spec);
    navigate(path);
  };

  const ask = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    setTurns((prev) => [...prev, { q, a: answerFor(q) }]);
    setDraft("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(draft);
  };

  return (
    <WindowFrame
      title="Kelly.AI"
      status="Deterministic intent matching  ·  no LLM  ·  routes to real content"
      className="h-full min-h-0 w-full"
    >
      <div className="flex h-full min-h-0 flex-col" onClick={() => inputRef.current?.focus()}>
        <div ref={scroller} className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
          <AnswerCard a={INTRO} onSuggest={ask} onOpen={openPath} />
          {turns.map((t, i) => (
            <div key={i} className="space-y-2">
              <p className="font-chrome os-sunken os-well m-0 px-2 py-1">
                <span className="text-muted">You:</span> {t.q}
              </p>
              <AnswerCard a={t.a} onSuggest={ask} onOpen={openPath} />
            </div>
          ))}
        </div>
        <form
          className="flex items-center gap-1 border-t border-[var(--kellos-bevel-shadow)] p-1"
          onSubmit={onSubmit}
        >
          <span aria-hidden="true" className="font-chrome px-1">
            ✦
          </span>
          <input
            ref={inputRef}
            aria-label="Ask Kelly.AI"
            className="font-chrome min-w-0 flex-1 border-0 bg-transparent outline-none"
            placeholder="Ask about the work…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="os-btn os-raised">
            Ask
          </button>
        </form>
      </div>
    </WindowFrame>
  );
}

function AnswerCard({
  a,
  onSuggest,
  onOpen,
}: {
  a: KellAnswer;
  onSuggest: (q: string) => void;
  onOpen: (path: string) => void;
}) {
  return (
    <div className="os-raised bg-face p-2">
      <p className="font-chrome text-muted m-0 mb-1 text-[11px] font-bold">✦ Kelly.AI</p>
      <p className="font-chrome m-0 leading-snug">{a.text}</p>
      {a.source ? <p className="font-chrome text-muted mt-1 mb-0 text-[11px]">Source: {a.source}</p> : null}
      {(a.open || a.reader) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {a.open ? (
            <button type="button" className="os-btn os-raised" onClick={() => onOpen(a.open!.path)}>
              {a.open.label}
            </button>
          ) : null}
          {a.reader ? (
            <button type="button" className="os-btn os-raised" onClick={() => onOpen(a.reader!.path)}>
              {a.reader.label}
            </button>
          ) : null}
        </div>
      )}
      {a.suggestions?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {a.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="os-btn os-raised text-[11px]"
              onClick={() => onSuggest(s)}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

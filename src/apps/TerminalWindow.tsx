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
    "Kelly.OS [Version 3.0.1996] - MS-DOS Command Prompt Interface",
    "(C) Copyright 1996 Saathvik Kellampalli. All rights reserved.",
    "",
    "Commands: help · whoami · education · cgpa · sgpa · projects · skills · timeline · contact · aboutme · date · ls · open <app> · clear",
    `Launchable Apps (terminalOpen): ${names}`,
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
    setLines((prev) => [...prev, { kind: "in", text: `C:\\KELLOS> ${cmd || ""}` }]);
    if (!cmd) return;

    const [verb, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const name = verb.toLowerCase();

    if (name === "clear" || name === "cls") {
      setLines([]);
      return;
    }
    if (name === "help") {
      print(helpText());
      return;
    }
    if (name === "whoami") {
      print("Saathvik Kellampalli — UG @ IIT Jodhpur × LeapStart School of Technology, Hyderabad.");
      return;
    }
    if (name === "education") {
      print("IIT Jodhpur: BS in Applied AI & Data Science (2025-2029)\nLeapStart School of Technology: Experiential Dual Track (2025-2029)");
      return;
    }
    if (name === "cgpa") {
      print("Overall CGPA: 9.44 / 10.0 (IIT Jodhpur)");
      return;
    }
    if (name === "sgpa") {
      print("Semester 1 SGPA: 9.75\nSemester 2 SGPA: 9.25\nOverall CGPA: 9.44");
      return;
    }
    if (name === "date") {
      print(new Date().toString());
      return;
    }
    if (name === "projects") {
      print("1. Alimony.AI — AI Matrimonial & Family Law SaaS\n2. Ducati Desmosedici V4 — Scrollytelling Showcase\n3. LODESTAR — Autonomous Logistics Exception Agent\n4. PawSethu — Pet Digital-Identity Platform");
      return;
    }
    if (name === "skills") {
      print("Languages: Python, C++, TypeScript, JavaScript, SQL, HTML/CSS, PHP\nFrontend: React, Next.js, Framer Motion, GSAP, Tailwind CSS\nBackend: Node.js, Express, Fastify, PostgreSQL, MongoDB, Prisma, REST APIs, Firebase\nAI/Data: Gemini, Groq, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy");
      return;
    }
    if (name === "timeline") {
      print("2023-2024: Intermediate MPC & Freelance Data Processing\n2025: Pre-College Gap & IIT Jodhpur (Sem 1: 9.75)\n2026: IIT Jodhpur (Sem 2: 9.25, CGPA 9.44), Google BigCode Top 1500, GSSoC, LangChain Contributor");
      return;
    }
    if (name === "contact") {
      print("Email: saathvik.kp@gmail.com\nGitHub: github.com/broskell\nLinkedIn: linkedin.com/in/kellampalli-saathvik\nX: @kellyyboi");
      return;
    }
    if (name === "aboutme") {
      print("I'm Saathvik Kellampalli — second-year undergrad pursuing BS in Applied AI & Data Science at IIT Jodhpur × LeapStart School of Technology. I build products, work with AI tools, and ship web apps.");
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

    print(`Bad command or file name — “${name}”. Type help.`);
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
    <WindowFrame title="Terminal" status="C:\KELLOS> MS-DOS Prompt" className="h-full min-h-0 w-full">
      <div
        className="flex h-full min-h-0 flex-col font-mono text-[13px] leading-snug bg-black text-[#c0c0c0]"
        onClick={() => inputRef.current?.focus()}
      >
        <div ref={scroller} className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-3">
          {lines.map((line, i) => (
            <p key={`${i}-${line.kind}`} className="m-0 leading-normal">
              {line.text}
            </p>
          ))}
        </div>
        <form className="flex items-center gap-1 border-t border-[#404040] p-2 bg-[#000000]" onSubmit={onSubmit}>
          <span aria-hidden="true" className="text-[#00ff00]">C:\KELLOS&gt;</span>
          <input
            ref={inputRef}
            id="os-terminal-input"
            aria-label="Command"
            className="font-mono min-w-0 flex-1 border-0 bg-transparent text-[#ffffff] outline-none"
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

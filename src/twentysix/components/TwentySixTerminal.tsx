import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CrtBackground } from "../../shaders/crt/CrtBackground";
import { segment, type Segment } from "../../shaders/crt/crtRenderer";
import "../../shaders/threeui.css";
import { bio, role, education, achievements, quote } from "../data/about";
import { projects } from "../data/projects26";
import { timeline } from "../data/timeline26";

function isWebGlAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

interface CommandHistoryItem {
  command: string;
  output: string[];
}

function wrapLine(text: string, maxLen = 65): string[] {
  if (!text || text.length <= maxLen) return [text];
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + (current ? " " : "") + word).length <= maxLen) {
      current += (current ? " " : "") + word;
    } else {
      if (current) lines.push(current);
      if (word.length > maxLen) {
        let chunk = word;
        while (chunk.length > maxLen) {
          lines.push(chunk.slice(0, maxLen));
          chunk = chunk.slice(maxLen);
        }
        current = chunk;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapLines(lines: string[], maxLen = 65): string[] {
  return lines.flatMap((line) => wrapLine(line, maxLen));
}

const INITIAL_WELCOME: string[] = [
  "===========================================================",
  "              KELLOS CRT TERMINAL v2026.1                ",
  "      Type 'help' to see the list of available commands.  ",
  "===========================================================",
];

export function TwentySixTerminal() {
  const navigate = useNavigate();
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    { command: "system-init", output: INITIAL_WELCOME },
  ]);
  const [inputVal, setInputVal] = useState<string>("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [savedInput, setSavedInput] = useState<string>("");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalLogRef = useRef<HTMLDivElement>(null);

  // Check WebGL availability, mobile screen width, and media query for reduced motion
  useEffect(() => {
    setWebglSupported(isWebGlAvailable());

    const checkMobile = () => setIsMobileScreen(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handleMq = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handleMq);

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (mq.removeEventListener) mq.removeEventListener("change", handleMq);
    };
  }, []);

  // Keep DOM input focused
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Auto-scroll DOM log
  useEffect(() => {
    if (terminalLogRef.current) {
      terminalLogRef.current.scrollTop = terminalLogRef.current.scrollHeight;
    }
  }, [history, inputVal]);

  // Execute terminal command using real TwentySix data
  const executeCommand = useCallback(
    (cmdRaw: string) => {
      const trimmed = cmdRaw.trim();
      if (!trimmed) return;

      const args = trimmed.split(/\s+/);
      const cmd = args[0].toLowerCase();

      // Add to command history list
      setCmdHistory((prev) => (prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed]));
      setHistoryIndex(-1);
      setSavedInput("");

      if (cmd === "clear") {
        setHistory([]);
        setInputVal("");
        return;
      }

      if (cmd === "exit") {
        navigate("/2026");
        return;
      }

      let output: string[] = [];

      switch (cmd) {
        case "whoami":
          output = [
            "Saathvik Kellampalli",
            `Role: ${role}`,
            "Focus: Applied AI & Data Science, WebGL/Shader UI, Full Stack Web & Linux Systems",
            "Current Status: UG @ IIT Jodhpur × LeapStart School of Technology",
          ];
          break;

        case "education":
          output = education.flatMap((e) => {
            const res = [`• ${e.institution}`, `  Program: ${e.program}`, `  Duration: ${e.duration}`];
            if (e.rows) {
              e.rows.forEach((r) => res.push(`  ${r.label}: ${r.value}`));
            }
            return res;
          });
          break;

        case "cgpa":
          output = [
            "Overall CGPA: 9.44 / 10 (IIT Jodhpur)",
            "Dual Track Experiential Learning at LeapStart School of Technology, Hyderabad.",
          ];
          break;

        case "sgpa":
          output = [
            "Semester 1 SGPA: 9.75 (IIT Jodhpur)",
            "Semester 2 SGPA: 9.25 (IIT Jodhpur)",
            "Overall CGPA: 9.44 / 10",
            "Semester 3: Ongoing (2026)",
          ];
          break;

        case "date":
          output = [new Date().toString()];
          break;

        case "projects":
          output = projects.flatMap((p, i) => [
            `${i + 1}. ${p.title}`,
            `   Tagline: ${p.tagline}`,
            `   Stack: ${p.stack.slice(0, 5).join(", ")}`,
            p.links?.live ? `   Live: ${p.links.live}` : "",
          ]).filter(Boolean);
          output.push("", "Type 'cat [project-id]' (e.g. cat alimony-ai, cat lodestar) for details.");
          break;

        case "contact":
          output = [
            "Email: kellampalli.saathvik@gmail.com",
            "GitHub: https://github.com/broskell",
            "LinkedIn: https://linkedin.com/in/saathvikkellampalli",
            "Location: Hyderabad / Jodhpur, India",
          ];
          break;

        case "timeline":
          output = timeline.flatMap((t) => [
            `[${t.date}] ${t.title}${t.ongoing ? " (ONGOING ★)" : ""}`,
            t.subtitle ? `  Context: ${t.subtitle}` : "",
            ...t.groups.flatMap((g) => g.points.map((p) => `  ▹ ${p}`)),
            ""
          ]).filter(Boolean);
          break;

        case "skills":
          output = [
            "Languages: Python, C++, TypeScript, JavaScript, SQL, HTML5, CSS3, PHP",
            "Frontend: React 18, Vite, Framer Motion, GSAP, Tailwind CSS, Zustand, React Hook Form, Zod",
            "Backend: Node.js, Express, Fastify, PostgreSQL, MongoDB, Prisma, REST APIs, Firebase",
            "AI / ML: Google Gemini, Groq, TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy, Tableau",
            "Systems & DevOps: Linux (Ubuntu), Bash, SSH, Docker, Git, GitHub, Azure, Postman",
          ];
          break;

        case "aboutme":
          output = [...bio, "", `Quote: "${quote}"`];
          break;

        case "achievements":
          output = achievements.map((a) => `• ${a.highlight} — ${a.detail}`);
          break;

        case "help":
          output = [
            "Available commands:",
            "  whoami       — Display identity & role",
            "  education    — Degree & academic institution details",
            "  cgpa / sgpa  — Grade point averages",
            "  projects     — Selected portfolio work & applications",
            "  skills       — Technical skills & tools stack",
            "  timeline     — Milestone journey & achievements",
            "  contact      — Email & social links",
            "  aboutme      — Personal bio & philosophy",
            "  date         — Current system time",
            "  cat [file]   — View virtual file contents (e.g. cat bio.txt, cat alimony-ai)",
            "  matrix       — Run Matrix code rain pulse",
            "  sudo         — Request elevated privileges",
            "  clear        — Clear terminal output",
            "  exit         — Return to main site (/2026)",
          ];
          break;

        case "matrix":
          output = [
            "Wake up, Neo...",
            "The Matrix has you...",
            "Follow the white rabbit. 01001001 01001110 01001001 01010100",
            "01101000 01100001 01100011 01101011 01100101 01100100",
          ];
          break;

        case "sudo":
          output = [
            "Permission denied: user guest is not in the sudoers file.",
            "This incident will be reported to system administration.",
          ];
          break;

        case "cat":
          {
            const target = args[1]?.toLowerCase();
            if (!target) {
              output = ["Usage: cat <filename|project-id> (e.g. cat bio.txt, cat education.txt, cat alimony-ai, cat lodestar)"];
            } else if (target === "bio.txt" || target === "bio") {
              output = bio;
            } else if (target === "education.txt" || target === "education") {
              output = education.map((e) => `${e.institution}: ${e.program} (${e.duration})`);
            } else if (target === "achievements.txt" || target === "achievements") {
              output = achievements.map((a) => `${a.highlight}: ${a.detail}`);
            } else {
              const matchedProj = projects.find((p) => p.id === target || p.title.toLowerCase().includes(target));
              if (matchedProj) {
                output = [
                  `Project: ${matchedProj.title}`,
                  `Tagline: ${matchedProj.tagline}`,
                  `Stack: ${matchedProj.stack.join(", ")}`,
                  "",
                  ...matchedProj.description,
                  "",
                  ...(matchedProj.highlights ? matchedProj.highlights.map((h) => `• ${h}`) : []),
                ];
              } else {
                output = [`cat: ${args[1]}: No such file or directory`];
              }
            }
          }
          break;

        default:
          output = [
            `command not found: ${trimmed}`,
            "Type 'help' for a list of available commands.",
          ];
          break;
      }

      const wrappedOutput = wrapLines(output, 65);
      setHistory((prev) => [...prev, { command: trimmed, output: wrappedOutput }]);
      setInputVal("");
    },
    [navigate]
  );

  // Keyboard navigation & key handling
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;

      if (historyIndex === -1) {
        setSavedInput(inputVal);
        const nextIdx = cmdHistory.length - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;

      if (historyIndex < cmdHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      } else {
        setHistoryIndex(-1);
        setInputVal(savedInput);
      }
    } else if (e.key === "c" && e.ctrlKey) {
      setInputVal("");
    }
  };

  // Convert React history state to CrtRenderer Segment[][] format
  const getLogSegments = useCallback((): Segment[][] => {
    const lines: Segment[][] = [];

    // Header banner
    lines.push([
      segment("ZION / KELLOS TERMINAL v2026.1", "p"),
      segment("   (c) 2026 SAATHVIK KELLAMPALLI", "d"),
    ]);
    lines.push([segment("AUTHENTICATED SESSION: guest@kellos.os", "d")]);
    lines.push([]);

    // Command history
    for (const item of history) {
      if (item.command === "system-init") {
        for (const outLine of item.output) {
          lines.push([segment(outLine, "d")]);
        }
      } else {
        lines.push([
          segment("guest@kellos:~$ ", "a"),
          segment(item.command, "p"),
        ]);
        for (const outLine of item.output) {
          lines.push([segment(outLine, "p")]);
        }
      }
      lines.push([]);
    }

    // Active input line
    lines.push([
      segment("guest@kellos:~$ ", "a"),
      segment(inputVal, "p"),
      segment("█", "h"),
    ]);

    // Keep at most last 24 lines to clear buffer cleanly
    return lines.slice(-24);
  }, [history, inputVal]);

  if (isMobileScreen) {
    return (
      <div className="relative w-screen h-screen flex flex-col items-center justify-center bg-[#03100a] text-[#8df0b4] p-6 text-center font-mono select-none">
        <div className="max-w-md p-8 bg-black/60 backdrop-blur-md rounded-2xl border border-emerald-500/30 space-y-4 shadow-2xl">
          <div className="text-lg font-bold tracking-wider text-emerald-400 uppercase">
            DESKTOP ONLY FEATURE
          </div>
          <p className="text-sm text-emerald-200/80 leading-relaxed">
            The Interactive WebGL CRT Terminal is optimized exclusively for desktop and laptop displays.
          </p>
          <button
            type="button"
            onClick={() => navigate("/2026")}
            className="px-5 py-2 text.sm font-mono tracking-wide bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 rounded-full text-emerald-300 transition-all"
          >
            ← Return to TwentySix Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-[#03100a] text-[#8df0b4] font-mono select-none"
      onClick={focusInput}
    >
      {/* Visual CRT Background Layer */}
      {webglSupported ? (
        <div className="absolute inset-0 z-0">
          <CrtBackground
            variant="terminal"
            speed={prefersReducedMotion ? 0.0 : 1.0}
            typeSpeed={1.0}
            motion={prefersReducedMotion ? 0.0 : 1.0}
            hue={0}
            saturation={1.0}
            brightness={1.0}
            opacity={1.0}
            getLog={getLogSegments}
          />
        </div>
      ) : (
        /* DOM / CSS Fallback if WebGL unavailable */
        <div className="absolute inset-0 z-0 bg-[#03100a] p-6 overflow-y-auto font-mono text-[#8df0b4]">
          <div className="max-w-4xl mx-auto space-y-2">
            <div className="text-[#4f9a76] font-bold">ZION / KELLOS TERMINAL [DOM FALLBACK MODE]</div>
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                {item.command !== "system-init" && (
                  <div className="text-[#ffba5e]">guest@kellos:~$ {item.command}</div>
                )}
                {item.output.map((out, oIdx) => (
                  <div key={oIdx} className="text-[#8df0b4] pl-2">{out}</div>
                ))}
              </div>
            ))}
            <div className="flex items-center text-[#ffba5e]">
              <span>guest@kellos:~$ </span>
              <span className="text-[#8df0b4] ml-2">{inputVal}</span>
              <span className="animate-pulse bg-[#8df0b4] w-2 h-4 ml-1 inline-block" />
            </div>
          </div>
        </div>
      )}

      {/* Glass Header Bar with Exit / Title */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-emerald-900/30">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate("/2026")}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              title="Close Terminal (Exit)"
              aria-label="Exit Terminal"
            />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
          </div>
          <span className="text-xs uppercase tracking-widest text-emerald-400/80 font-mono">
            ZION_MAINFRAME // TERMINAL
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate("/2026")}
          className="px-3 py-1 text-xs font-mono tracking-wider border border-emerald-500/30 rounded-md text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center space-x-2"
        >
          <span>ESC [EXIT]</span>
        </button>
      </header>

      {/* Accessible DOM Output Log for Screen Readers */}
      <div
        ref={terminalLogRef}
        role="log"
        aria-live="polite"
        className="sr-only"
        aria-label="Terminal Log"
      >
        {history.map((item, idx) => (
          <div key={idx}>
            {item.command !== "system-init" && `> ${item.command}`}
            {item.output.join("\n")}
          </div>
        ))}
      </div>

      {/* Hidden Real DOM Input */}
      <div className="absolute opacity-0 pointer-events-none">
        <label htmlFor="terminal-real-input">Terminal Command Input</label>
        <input
          id="terminal-real-input"
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Terminal command input"
        />
      </div>
    </div>
  );
}

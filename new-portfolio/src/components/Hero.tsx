"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { skills, experiences, projects, publications } from "@/lib/data";
import { useLenisCtx } from "./SmoothScroll";

// ─── Interactive Terminal ───────────────────────────────────────────────────

interface TerminalLine {
  type: "input" | "output" | "error" | "success" | "ascii";
  content: string;
}

const TERMINAL_COMMANDS: Record<string, (args: string[]) => TerminalLine[]> = {
  help: () => [
    { type: "output", content: "Available commands:" },
    { type: "output", content: "" },
    { type: "success", content: "  about          Who is Pavan?" },
    { type: "success", content: "  skills         List skill categories" },
    { type: "success", content: "  skills <name>  Show skills in a category" },
    { type: "success", content: "  projects       List all projects" },
    { type: "success", content: "  experience     Work experience" },
    { type: "success", content: "  publications   Research papers" },
    { type: "success", content: "  contact        Get in touch" },
    { type: "success", content: "  resume [genai] Download resume (SWE+ML or Gen AI)" },
    { type: "success", content: "  goto <section> Navigate to a section" },
    { type: "success", content: "  clear          Clear terminal" },
    { type: "success", content: "  neofetch       System info" },
    { type: "output", content: "" },
    { type: "output", content: "  Try: sudo hire-me" },
  ],

  about: () => [
    { type: "output", content: `${siteConfig.name}` },
    { type: "output", content: "Software Engineer · Machine Learning" },
    { type: "output", content: "" },
    { type: "output", content: siteConfig.description },
    { type: "output", content: "" },
    { type: "output", content: `GitHub:   ${siteConfig.github}` },
    { type: "output", content: `LinkedIn: ${siteConfig.linkedin}` },
  ],

  skills: (args: string[]) => {
    if (args.length > 0) {
      const query = args.join(" ").toLowerCase();
      const category = skills.find((s) => s.title.toLowerCase().includes(query));
      if (category) {
        return [
          { type: "success", content: `[${category.title}]` },
          { type: "output", content: category.items.join(", ") },
        ];
      }
      return [{ type: "error", content: `Category "${args.join(" ")}" not found. Try: skills` }];
    }
    return skills.map((s) => ({
      type: "output" as const,
      content: `  ${s.title.padEnd(16)} ${s.items.slice(0, 4).join(", ")}...`,
    }));
  },

  projects: () => {
    const lines: TerminalLine[] = [];
    projects.forEach((p) => {
      const status = p.ongoing ? " [active]" : "";
      lines.push({
        type: p.ongoing ? "success" : "output",
        content: `  ${p.number}. ${p.title}${status}  -  ${p.date}`,
      });
    });
    return lines;
  },

  experience: () => {
    return experiences.map((e) => ({
      type: "output" as const,
      content: `  ${e.title} @ ${e.org}  -  ${e.date}`,
    }));
  },

  publications: () => {
    return publications.map((p) => ({
      type: "output" as const,
      content: `  ${p.title}${p.venue ? ` (${p.venue})` : ""}`,
    }));
  },

  contact: () => [
    { type: "output", content: `Email:    ${siteConfig.email}` },
    { type: "output", content: `GitHub:   ${siteConfig.github}` },
    { type: "output", content: `LinkedIn: ${siteConfig.linkedin}` },
    { type: "success", content: "Or scroll down to the contact section!" },
  ],

  neofetch: () => [
    { type: "ascii", content: "   ____  ____  ____  " },
    { type: "ascii", content: "  |  _ \\/ ___||  _ \\ " },
    { type: "ascii", content: "  | |_) \\___ \\| |_) |" },
    { type: "ascii", content: "  |  __/ ___) |  _ < " },
    { type: "ascii", content: "  |_|   |____/|_| \\_\\" },
    { type: "output", content: "" },
    { type: "success", content: "  OS:      Next.js 16 / React 19" },
    { type: "success", content: "  Shell:   TypeScript 5" },
    { type: "success", content: "  Theme:   Dark Editorial" },
    { type: "success", content: "  UI:      Tailwind CSS 4 + Framer Motion" },
    { type: "success", content: "  AI:      Claude Haiku (streaming)" },
    { type: "success", content: `  Uptime:  Since Oct 2020` },
    { type: "success", content: `  Projects: ${projects.length}+` },
    { type: "success", content: `  Papers:  ${publications.length}` },
  ],

  resume: (args: string[]) => {
    const variant = args[0]?.toLowerCase();
    const file =
      variant === "genai"
        ? "/resume/Pavan_Pendry_GenAI_Resume.pdf"
        : "/resume/Pavan_Pendry_Resume.pdf";
    if (typeof window !== "undefined") {
      window.open(file, "_blank");
    }
    return [
      { type: "success", content: variant === "genai" ? "Opening Gen AI resume..." : "Opening resume (SWE + ML)..." },
      { type: "output", content: 'Variants: "resume" (SWE + ML) | "resume genai"' },
    ];
  },

  goto: (args: string[]) => {
    const section = args[0]?.toLowerCase();
    const valid = ["home", "about", "skills", "experience", "projects", "research", "contact"];
    if (!section || !valid.includes(section)) {
      return [
        { type: "error", content: `Usage: goto <section>` },
        { type: "output", content: `Sections: ${valid.join(", ")}` },
      ];
    }
    if (typeof window !== "undefined") {
      const target = section === "research" ? "publications" : section;
      // Dispatch custom event for Lenis-powered scroll with userData
      window.dispatchEvent(new CustomEvent("lenis-scroll-to", {
        detail: { target: `#${target}`, userData: { source: "terminal", command: `goto ${section}` } },
      }));
    }
    return [{ type: "success", content: `Navigating to ${section}...` }];
  },

  sudo: (args: string[]) => {
    const cmd = args.join(" ").toLowerCase();
    if (cmd === "hire-me") {
      return [
        { type: "success", content: "Permission granted." },
        { type: "output", content: "" },
        { type: "success", content: "Initiating hire sequence..." },
        { type: "success", content: "Compiling 6+ projects, 3 publications, 4 roles..." },
        { type: "success", content: "Deploying Pavan to your team... Done!" },
        { type: "output", content: "" },
        { type: "output", content: `Reach out → ${siteConfig.email}` },
      ];
    }
    if (cmd.startsWith("rm")) {
      return [{ type: "error", content: "Nice try. This portfolio is immutable." }];
    }
    return [{ type: "error", content: `sudo: ${args.join(" ")}: command not found` }];
  },

  whoami: () => [{ type: "output", content: "visitor@pavansaipendry.dev" }],

  pwd: () => [{ type: "output", content: "/home/pavan/portfolio" }],

  ls: () => [
    { type: "output", content: "about/  skills/  experience/  projects/  publications/  contact/" },
  ],

  echo: (args: string[]) => [{ type: "output", content: args.join(" ") }],

  date: () => [{ type: "output", content: new Date().toString() }],
};

// Natural phrases people type instead of commands
const PHRASE_ALIASES: Record<string, string> = {
  "get in touch": "contact",
  "reach out": "contact",
  "email": "contact",
  "socials": "contact",
  "hire": "sudo hire-me",
  "hire me": "sudo hire-me",
  "who are you": "about",
  "cv": "resume",
  "exit": "clear",
};

export function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: 'Welcome to pavan.sh - type "help" for commands' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const { lenis } = useLenisCtx();

  // ── Drag-to-resize from the window borders ──
  // The whole drag lives on window-level listeners installed at pointerdown
  // and torn down at pointerup/pointercancel - the handle elements only ever
  // start a drag, so a missed pointerup can never leave a "stuck" drag that
  // resizes on hover. Sizes are derived from the container's LIVE rect each
  // frame (not drag-start deltas), so layout reflow can't cause drift or
  // oscillation: the edge simply converges onto the pointer.
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastGrabRef = useRef(0);

  const startResize = useCallback((e: React.PointerEvent, dir: string) => {
    if (e.button !== 0 || draggingRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;

    // Manual double-tap detection (preventDefault suppresses native dblclick):
    // two clean grabs within 350ms with no drag movement = reset to default
    const now = performance.now();
    if (now - lastGrabRef.current < 350 && !movedRef.current) {
      lastGrabRef.current = 0;
      setSize(null);
      return;
    }
    lastGrabRef.current = now;

    draggingRef.current = true;
    movedRef.current = false;
    document.body.style.userSelect = "none";
    const downX = e.clientX;
    const downY = e.clientY;

    const onMove = (ev: PointerEvent) => {
      // Dead-man switch: if the button is no longer held, end the drag
      if (ev.buttons === 0) return finish();
      if (Math.abs(ev.clientX - downX) + Math.abs(ev.clientY - downY) > 3) {
        movedRef.current = true;
      }
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      let w = rect.width;
      let h = rect.height;
      // Centered container: width follows the pointer symmetrically around cx
      if (dir.includes("e")) w = (ev.clientX - cx) * 2;
      if (dir.includes("w")) w = (cx - ev.clientX) * 2;
      if (dir.includes("s")) h = ev.clientY - rect.top;
      setSize({
        w: Math.round(Math.min(Math.max(340, w), window.innerWidth - 32)),
        h: Math.round(Math.min(Math.max(220, h), window.innerHeight - 120)),
      });
    };

    const finish = () => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
      window.removeEventListener("blur", finish);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    window.addEventListener("blur", finish);
  }, []);

  const handleProps = (dir: string) => ({
    onPointerDown: (e: React.PointerEvent) => startResize(e, dir),
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Expanded mode: freeze page scroll, focus input, Esc collapses
  useEffect(() => {
    if (!expanded) return;
    if (lenis) lenis.stop();
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (lenis) lenis.start();
    };
  }, [expanded, lenis]);

  const execute = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const newLine: TerminalLine = { type: "input", content: trimmed };
      // Map natural phrases ("get in touch") onto real commands first
      const effective = PHRASE_ALIASES[trimmed.toLowerCase()] ?? trimmed;
      const parts = effective.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      if (cmd === "clear") {
        setLines([]);
        return;
      }

      const handler = TERMINAL_COMMANDS[cmd];
      if (handler) {
        const output = handler(args);
        setLines((prev) => [...prev, newLine, ...output]);
      } else {
        const names = Object.keys(TERMINAL_COMMANDS);
        const close =
          names.find((c) => c.startsWith(cmd.slice(0, 3))) ??
          names.find((c) => cmd.length > 3 && c.includes(cmd.slice(0, 3)));
        setLines((prev) => [
          ...prev,
          newLine,
          {
            type: "error",
            content: `command not found: ${cmd}.${close ? ` Did you mean "${close}"?` : ""} Type "help" for available commands.`,
          },
        ]);
      }
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const partial = input.toLowerCase();
      if (!partial) return;
      const cmds = Object.keys(TERMINAL_COMMANDS);
      const match = cmds.find((c) => c.startsWith(partial));
      if (match) setInput(match);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <>
      {/* Backdrop when expanded - click to collapse */}
      {expanded && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        />
      )}

      <div
        ref={containerRef}
        className={
          expanded
            ? "fixed inset-x-4 top-[7vh] bottom-[7vh] z-[81] mx-auto flex w-auto max-w-4xl flex-col rounded-lg border border-card-border bg-code-bg overflow-hidden text-left shadow-2xl shadow-black/50"
            : "relative mx-auto flex w-full max-w-xl flex-col rounded-lg border border-card-border bg-code-bg overflow-hidden text-left shadow-2xl shadow-black/20"
        }
        style={
          !expanded && size
            ? { width: size.w, height: size.h, maxWidth: "none" }
            : undefined
        }
        onClick={() => inputRef.current?.focus()}
      >
        {/* Title bar - the dots are real window controls */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-card-border bg-card-bg">
          <div className="group flex items-center gap-1.5">
            <button
              aria-label="Clear terminal"
              title="Clear"
              onClick={(e) => { e.stopPropagation(); setLines([]); }}
              className="h-2.5 w-2.5 rounded-full bg-red-500/80 transition-transform duration-200 hover:scale-125"
            />
            <button
              aria-label="Collapse terminal"
              title="Collapse"
              onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
              className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 transition-transform duration-200 hover:scale-125"
            />
            <button
              aria-label="Expand terminal"
              title="Expand"
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              className="h-2.5 w-2.5 rounded-full bg-green-500/80 transition-transform duration-200 hover:scale-125"
            />
          </div>
          <span className="flex-1 text-center text-[11px] text-dimmed font-mono">pavan.sh</span>
          <button
            aria-label="Toggle terminal size"
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            className="font-mono text-[10px] text-dimmed transition-colors hover:text-heading"
          >
            {expanded ? "esc ⤡" : "⤢"}
          </button>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          data-lenis-prevent
          className={`${expanded || size ? "flex-1" : "h-48"} overflow-y-auto px-4 py-3 font-mono text-xs sm:text-sm leading-relaxed cursor-text`}
        >
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.25rem]">
            {line.type === "input" ? (
              <span>
                <span className="text-accent">▲</span>{" "}
                <span className="text-muted">~</span>{" "}
                <span className="text-foreground">{line.content}</span>
              </span>
            ) : line.type === "error" ? (
              <span className="text-red-400">{line.content}</span>
            ) : line.type === "success" ? (
              <span className="text-accent">{line.content}</span>
            ) : line.type === "ascii" ? (
              <span className="text-accent/70">{line.content}</span>
            ) : (
              <span className="text-muted">{line.content}</span>
            )}
          </div>
        ))}

        {/* Active input line */}
        <div className="flex items-center min-h-[1.25rem]">
          <span className="text-accent">▲</span>{" "}
          <span className="text-muted ml-1">~</span>{" "}
          <div className="relative flex-1 ml-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="w-full bg-transparent text-foreground outline-none caret-transparent font-mono text-xs sm:text-sm"
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
            />
            {/* Custom blinking cursor */}
            <span
              className="pointer-events-none absolute top-0 left-0 text-foreground font-mono text-xs sm:text-sm"
              aria-hidden
            >
              <span className="invisible">{input}</span>
              <motion.span
                animate={{ opacity: focused ? [1, 0] : 0 }}
                transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-1.5 h-3.5 sm:h-4 bg-accent align-text-bottom ml-px"
              />
            </span>
          </div>
        </div>
        </div>

        {/* ── Resize handles - drag the borders like a real window ── */}
        {!expanded && (
          <>
            <div
              {...handleProps("e")}
              aria-hidden
              className="absolute -right-1 top-0 z-10 h-full w-2.5 touch-none"
              style={{ cursor: "ew-resize" }}
            />
            <div
              {...handleProps("w")}
              aria-hidden
              className="absolute -left-1 top-0 z-10 h-full w-2.5 touch-none"
              style={{ cursor: "ew-resize" }}
            />
            <div
              {...handleProps("s")}
              aria-hidden
              className="absolute -bottom-1 left-0 z-10 h-2.5 w-full touch-none"
              style={{ cursor: "ns-resize" }}
            />
            <div
              {...handleProps("se")}
              aria-hidden
              title="Drag to resize · double-click to reset"
              className="absolute -bottom-0.5 -right-0.5 z-20 flex h-4 w-4 items-end justify-end touch-none"
              style={{ cursor: "nwse-resize" }}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" className="m-0.5 opacity-40">
                <path d="M8 1L1 8M8 5L5 8" stroke="currentColor" strokeWidth="1" />
              </svg>
            </div>
          </>
        )}
      </div>
    </>
  );
}


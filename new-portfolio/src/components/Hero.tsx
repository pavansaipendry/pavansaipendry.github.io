"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { HeroGrid } from "./HeroGrid";
import { skills, experiences, projects, publications } from "@/lib/data";

const stats = [
  { value: 6, suffix: "+", label: "Projects" },
  { value: 3, suffix: "", label: "Publications" },
  { value: 9500, suffix: "+", label: "Docs Served" },
  { value: 82, suffix: "%", label: "BabyJay Approval" },
];

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(containerRef, { once: true });
  const motionVal = useSpring(0, { duration: 2000, bounce: 0 });
  const formatted = useTransform(motionVal, (v) => {
    const n = Math.floor(v);
    return `${n >= 1000 ? n.toLocaleString() : n}${suffix}`;
  });

  useEffect(() => {
    if (inView) motionVal.set(value);
  }, [inView, value, motionVal]);

  useEffect(() => {
    return formatted.on("change", (v) => {
      if (displayRef.current) displayRef.current.textContent = v;
    });
  }, [formatted]);

  return (
    <div ref={containerRef} className="flex flex-col items-center gap-1 rounded-lg border border-card-border bg-card-bg px-5 py-4">
      <span ref={displayRef} className="text-2xl font-bold text-heading sm:text-3xl">
        0{suffix}
      </span>
      <span className="text-xs text-dimmed">{label}</span>
    </div>
  );
}

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
    { type: "success", content: "  resume         Download resume" },
    { type: "success", content: "  goto <section> Navigate to a section" },
    { type: "success", content: "  clear          Clear terminal" },
    { type: "success", content: "  neofetch       System info" },
    { type: "output", content: "" },
    { type: "output", content: "  Try: sudo hire-me" },
  ],

  about: () => [
    { type: "output", content: `${siteConfig.name}` },
    { type: "output", content: "Software Engineer & AI/ML Engineer" },
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
        content: `  ${p.number}. ${p.title}${status}  —  ${p.date}`,
      });
    });
    return lines;
  },

  experience: () => {
    return experiences.map((e) => ({
      type: "output" as const,
      content: `  ${e.title} @ ${e.org}  —  ${e.date}`,
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

  resume: () => {
    if (typeof window !== "undefined") {
      window.open("/resume.pdf", "_blank");
    }
    return [{ type: "success", content: "Opening resume..." }];
  },

  goto: (args: string[]) => {
    const section = args[0]?.toLowerCase();
    const valid = ["home", "about", "skills", "experience", "projects", "architecture", "research", "contact"];
    if (!section || !valid.includes(section)) {
      return [
        { type: "error", content: `Usage: goto <section>` },
        { type: "output", content: `Sections: ${valid.join(", ")}` },
      ];
    }
    if (typeof window !== "undefined") {
      const target = section === "research" ? "publications" : section;
      document.querySelector(`#${target}`)?.scrollIntoView({ behavior: "smooth" });
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

function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: 'Welcome to pavan.sh — type "help" for commands' },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const execute = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;

      const newLine: TerminalLine = { type: "input", content: trimmed };
      const parts = trimmed.split(/\s+/);
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
        setLines((prev) => [
          ...prev,
          newLine,
          { type: "error", content: `command not found: ${cmd}. Type "help" for available commands.` },
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
    <div
      className="w-full max-w-xl mx-auto rounded-lg border border-card-border bg-code-bg overflow-hidden text-left shadow-2xl shadow-black/20"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-card-border bg-card-bg">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        </div>
        <span className="flex-1 text-center text-[11px] text-dimmed font-mono">pavan.sh</span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="h-48 overflow-y-auto px-4 py-3 font-mono text-xs sm:text-sm leading-relaxed cursor-text"
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
    </div>
  );
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function Hero() {
  const words = ["Pavan", "Sai", "Reddy", "Pendry"];

  return (
    <section id="home" className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-24 pt-32">
      {/* Next.js-style grid background */}
      <HeroGrid />

      {/* Radial glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-gradient-to-b from-purple-500/[0.08] via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Title — reduced sizes */}
        <h1 className="mb-6">
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {words.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${
                  word === "Pendry"
                    ? "bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent"
                    : "text-heading"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mb-8 max-w-2xl text-base text-muted leading-relaxed sm:text-lg"
        >
          {siteConfig.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-btn-primary-bg px-7 py-3 text-sm font-medium text-btn-primary-text transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:opacity-90"
          >
            View Projects
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-btn-secondary-border bg-btn-secondary-bg px-7 py-3 text-sm font-medium text-btn-secondary-text backdrop-blur-sm transition-all duration-300 hover:border-card-border-hover hover:text-heading"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-btn-secondary-border bg-btn-secondary-bg px-7 py-3 text-sm font-medium text-btn-secondary-text backdrop-blur-sm transition-all duration-300 hover:border-card-border-hover hover:text-heading"
          >
            LinkedIn
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </motion.div>

        {/* Interactive Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-8"
        >
          <InteractiveTerminal />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <span className="text-xs tracking-widest text-dimmed uppercase">Scroll</span>
          <motion.div
            animate={{ height: [16, 32, 16] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px bg-gradient-to-b from-dimmed to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

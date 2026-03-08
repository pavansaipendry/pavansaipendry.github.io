"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { siteConfig } from "@/lib/data";

interface Command {
  id: string;
  label: string;
  section: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const paletteVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15 },
  },
};

// Icons
const NavIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12h18M3 6h18M3 18h18" />
  </svg>
);
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const ThemeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
  </svg>
);
const ArrowUpIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const scrollToSection = useCallback((id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  const commands: Command[] = [
    // Navigation
    { id: "about", label: "About", section: "Navigate", icon: <NavIcon />, action: () => scrollToSection("#about"), keywords: "about me" },
    { id: "skills", label: "Skills & Tools", section: "Navigate", icon: <NavIcon />, action: () => scrollToSection("#skills"), keywords: "skills tools tech stack" },
    { id: "experience", label: "Experience", section: "Navigate", icon: <NavIcon />, action: () => scrollToSection("#experience"), keywords: "experience work job" },
    { id: "projects", label: "Projects", section: "Navigate", icon: <NavIcon />, action: () => scrollToSection("#projects"), keywords: "projects portfolio" },
    { id: "research", label: "Research & Publications", section: "Navigate", icon: <NavIcon />, action: () => scrollToSection("#publications"), keywords: "research publications papers" },
    { id: "contact", label: "Contact", section: "Navigate", icon: <NavIcon />, action: () => scrollToSection("#contact"), keywords: "contact email reach" },
    // External
    { id: "github", label: "GitHub", section: "Links", icon: <LinkIcon />, action: () => { setOpen(false); window.open(siteConfig.github, "_blank"); }, keywords: "github code" },
    { id: "linkedin", label: "LinkedIn", section: "Links", icon: <LinkIcon />, action: () => { setOpen(false); window.open(siteConfig.linkedin, "_blank"); }, keywords: "linkedin profile" },
    { id: "email", label: "Email", section: "Links", icon: <LinkIcon />, action: () => { setOpen(false); window.open(`mailto:${siteConfig.email}`, "_blank"); }, keywords: "email mail" },
    { id: "babyjay", label: "BabyJay", section: "Links", icon: <LinkIcon />, action: () => { setOpen(false); window.open("https://babyjay.bot", "_blank"); }, keywords: "babyjay bot assistant" },
    // Actions
    { id: "theme", label: "Toggle Theme", section: "Actions", icon: <ThemeIcon />, action: () => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); }, keywords: "theme dark light mode toggle" },
    { id: "top", label: "Scroll to Top", section: "Actions", icon: <ArrowUpIcon />, action: () => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }, keywords: "scroll top home" },
    { id: "resume", label: "Download Resume", section: "Actions", icon: <DownloadIcon />, action: () => { setOpen(false); }, keywords: "resume download cv" },
  ];

  const filtered = query
    ? commands.filter((c) => {
        const search = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(search) ||
          c.section.toLowerCase().includes(search) ||
          (c.keywords && c.keywords.toLowerCase().includes(search))
        );
      })
    : commands;

  // Group by section
  const sections = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.section]) acc[cmd.section] = [];
    acc[cmd.section].push(cmd);
    return acc;
  }, {});

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIndex]?.action();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[9998] flex items-start justify-center pt-[20vh]"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Palette */}
          <motion.div
            variants={paletteVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-card-border bg-code-bg/95 shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            {/* Search */}
            <div className="flex items-center gap-3 border-b border-card-border px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-dimmed">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-heading placeholder:text-dimmed focus:outline-none"
              />
              <kbd className="hidden rounded border border-card-border bg-card-bg px-1.5 py-0.5 font-mono text-[10px] text-dimmed sm:inline-block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-8 text-center text-sm text-dimmed">
                  No results found.
                </div>
              ) : (
                Object.entries(sections).map(([section, cmds]) => (
                  <div key={section}>
                    <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-dimmed">
                      {section}
                    </div>
                    {cmds.map((cmd) => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <button
                          key={cmd.id}
                          data-index={idx}
                          onClick={() => cmd.action()}
                          onMouseEnter={() => setActiveIndex(idx)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            activeIndex === idx
                              ? "bg-accent-soft text-heading"
                              : "text-muted hover:text-heading"
                          }`}
                        >
                          <span className={activeIndex === idx ? "text-accent" : "text-dimmed"}>
                            {cmd.icon}
                          </span>
                          <span className="flex-1">{cmd.label}</span>
                          {activeIndex === idx && (
                            <kbd className="rounded border border-card-border bg-card-bg px-1.5 py-0.5 font-mono text-[10px] text-dimmed">
                              Enter
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-card-border px-4 py-2">
              <div className="flex items-center gap-2 text-[11px] text-dimmed">
                <kbd className="rounded border border-card-border bg-card-bg px-1 py-0.5 font-mono text-[10px]">↑↓</kbd>
                <span>Navigate</span>
                <kbd className="ml-2 rounded border border-card-border bg-card-bg px-1 py-0.5 font-mono text-[10px]">↵</kbd>
                <span>Select</span>
              </div>
              <div className="text-[11px] text-dimmed">
                <kbd className="rounded border border-card-border bg-card-bg px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

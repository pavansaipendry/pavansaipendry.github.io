"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHeader } from "./SectionHeader";
import { projects } from "@/lib/data";

const filters = ["all", "ai", "fullstack", "data"] as const;
const filterLabels: Record<string, string> = {
  all: "All",
  ai: "AI/ML",
  fullstack: "Full-Stack",
  data: "Data Pipelines",
};

export function Projects() {
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? projects
    : projects.filter((p) => p.category.includes(active));

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="04" title="Projects" />
        </FadeIn>

        <FadeIn className="mb-10">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                  active === f
                    ? "bg-btn-primary-bg text-btn-primary-text font-medium"
                    : "border border-card-border bg-card-bg text-muted hover:border-card-border-hover hover:text-heading"
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </FadeIn>

        <motion.div layout className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.title}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <SpotlightCard className="flex h-full flex-col p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-dimmed">{project.number}</span>
                    {project.ongoing && (
                      <span className="flex items-center gap-1.5 text-xs text-green-500">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                        </span>
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mb-1 text-lg font-semibold text-heading">{project.title}</h3>
                  <span className="mb-3 text-xs text-dimmed">{project.date}</span>
                  <p className="mb-5 flex-1 text-sm text-muted leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((t) => (
                      <span key={t} className="rounded border border-pill-border bg-pill-bg px-2 py-0.5 text-[11px] text-dimmed">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-heading"
                      >
                        GitHub
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    )}
                    {"live" in project && project.live && (
                      <a
                        href={project.live as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-heading"
                      >
                        Live
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

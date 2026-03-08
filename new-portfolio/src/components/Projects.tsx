"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
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
          <div className="mb-16 flex items-center gap-4">
            <span className="font-mono text-sm text-purple-400">04</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Projects</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn className="mb-10">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                  active === f
                    ? "bg-white text-black font-medium"
                    : "border border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.15] hover:text-white"
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
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
                    <span className="font-mono text-xs text-zinc-600">{project.number}</span>
                    {project.ongoing && (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                        </span>
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="mb-1 text-lg font-semibold text-white">{project.title}</h3>
                  <span className="mb-3 text-xs text-zinc-500">{project.date}</span>
                  <p className="mb-5 flex-1 text-sm text-zinc-400 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tags.map((t) => (
                      <span key={t} className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] text-zinc-500">
                        {t}
                      </span>
                    ))}
                  </div>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      View on GitHub
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </a>
                  )}
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

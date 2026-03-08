"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { experiences } from "@/lib/data";

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-400">
      {children}
    </span>
  );
}

export function Experience() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const featured = experiences.find((e) => e.type === "featured")!;

  return (
    <section id="experience" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <span className="font-mono text-sm text-purple-400">03</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Experience</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
          </div>
        </FadeIn>

        <StaggerContainer className="space-y-6">
          {experiences.map((exp, idx) => {
            if (exp.type === "startup") {
              return (
                <FadeInChild key={idx}>
                  <SpotlightCard className="relative overflow-hidden p-6 sm:p-8">
                    {/* Startup accent gradient */}
                    <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-blue-500/[0.08] to-transparent" />
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                        <p className="text-sm text-zinc-400">
                          <a
                            href={exp.orgLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 transition-colors hover:text-purple-300"
                          >
                            {exp.org} ↗
                          </a>
                        </p>
                      </div>
                      <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
                        {exp.date}
                      </span>
                    </div>
                    <ul className="mb-5 space-y-2">
                      {exp.bullets!.map((b, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-400">
                          <span className="mt-1 text-purple-400 shrink-0">→</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>
                  </SpotlightCard>
                </FadeInChild>
              );
            }

            if (exp.type === "featured") {
              return (
                <FadeInChild key={idx}>
                  <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-500/[0.04] to-transparent p-6 sm:p-8">
                    {/* Featured glow */}
                    <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-[600px] rounded-full bg-purple-500/[0.08] blur-3xl" />

                    <div className="relative">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                          ★ Featured Project
                        </span>
                        <span className="flex items-center gap-2 text-xs text-zinc-500">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                          </span>
                          {exp.statusText}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                          <p className="text-sm text-zinc-400">{exp.org}</p>
                          <span className="text-xs text-zinc-500">{exp.date}</span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={exp.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/[0.15] hover:text-white"
                          >
                            Live Demo
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                          <a
                            href={exp.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/[0.15] hover:text-white"
                          >
                            GitHub
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      <p className="mb-6 text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description! }} />

                      {/* Metrics grid */}
                      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {exp.highlights!.map((h, i) => (
                          <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-lg font-bold text-purple-300">{h.metric}</div>
                            <div className="mt-1 text-xs text-zinc-500 leading-snug">{h.desc}</div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setDrawerOpen(true)}
                        className="group inline-flex items-center gap-2 text-sm text-purple-400 transition-colors hover:text-purple-300"
                      >
                        Read Case Study
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                      </div>
                    </div>
                  </div>
                </FadeInChild>
              );
            }

            // Regular experience cards
            return (
              <FadeInChild key={idx}>
                <SpotlightCard className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                      <p className="text-sm text-zinc-400">{exp.org}</p>
                    </div>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs text-zinc-500">
                      {exp.date}
                    </span>
                  </div>
                  <ul className="mb-5 space-y-2">
                    {exp.bullets!.map((b, i) => (
                      <li key={i} className="text-sm text-zinc-400 leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-zinc-600">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                  </div>
                </SpotlightCard>
              </FadeInChild>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Case Study Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto border-l border-white/[0.06] bg-[#0d0d14] p-8"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:text-white hover:bg-white/[0.06]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-300">
                Case Study
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white">{featured.caseStudy!.title}</h2>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed">{featured.caseStudy!.desc}</p>
              <ul className="mt-6 space-y-4">
                {featured.caseStudy!.points.map((p, i) => (
                  <li key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-zinc-300 leading-relaxed">
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

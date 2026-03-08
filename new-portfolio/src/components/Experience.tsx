"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHeader } from "./SectionHeader";
import { experiences } from "@/lib/data";

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-pill-border bg-pill-bg px-2.5 py-1 text-xs text-muted">
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
          <SectionHeader number="03" title="Experience" />
        </FadeIn>

        <StaggerContainer className="space-y-6">
          {experiences.map((exp, idx) => {
            if (exp.type === "startup") {
              return (
                <FadeInChild key={idx}>
                  <SpotlightCard className="relative overflow-hidden p-6 sm:p-8">
                    <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 bg-gradient-to-bl from-blue-500/[0.08] to-transparent" />
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-heading">{exp.title}</h3>
                        <p className="text-sm text-muted">
                          <a
                            href={exp.orgLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent transition-colors hover:text-accent/80"
                          >
                            {exp.org} ↗
                          </a>
                        </p>
                      </div>
                      <span className="rounded-full border border-card-border bg-card-bg px-3 py-1 text-xs text-dimmed">
                        {exp.date}
                      </span>
                    </div>
                    <ul className="mb-5 space-y-2">
                      {exp.bullets!.map((b, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted">
                          <span className="mt-1 text-accent shrink-0">→</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                    </div>

                    {/* PiqJob Chrome Extension product card */}
                    {exp.product && (
                      <div className="mt-6 rounded-lg border border-accent/15 bg-gradient-to-br from-accent/[0.03] to-transparent p-5 sm:p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <h4 className="text-base font-semibold text-heading">{exp.product.title}</h4>
                        </div>
                        <p className="mb-4 text-sm text-muted leading-relaxed">{exp.product.oneLiner}</p>
                        <ul className="mb-4 space-y-2">
                          {exp.product.highlights.map((h, i) => (
                            <li key={i} className="flex gap-2 text-xs text-muted leading-relaxed">
                              <span className="mt-0.5 text-accent shrink-0">▸</span>
                              {h}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-1.5">
                          {exp.product.tags.map((t) => (
                            <span key={t} className="rounded border border-accent/15 bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </SpotlightCard>
                </FadeInChild>
              );
            }

            if (exp.type === "featured") {
              return (
                <FadeInChild key={idx}>
                  <div className="relative overflow-hidden rounded-xl border border-accent/20 bg-gradient-to-b from-accent/[0.04] to-transparent p-6 sm:p-8">
                    <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-[600px] rounded-full bg-accent/[0.08] blur-3xl" />

                    <div className="relative">
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                          ★ Featured Project
                        </span>
                        <span className="flex items-center gap-2 text-xs text-dimmed">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                          </span>
                          {exp.statusText}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                        <div>
                          <h3 className="text-xl font-semibold text-heading">{exp.title}</h3>
                          <p className="text-sm text-muted">{exp.org}</p>
                          <span className="text-xs text-dimmed">{exp.date}</span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={exp.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card-bg px-3 py-1.5 text-xs text-muted transition-colors hover:border-card-border-hover hover:text-heading"
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
                            className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card-bg px-3 py-1.5 text-xs text-muted transition-colors hover:border-card-border-hover hover:text-heading"
                          >
                            GitHub
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      <p className="mb-6 text-sm text-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.description! }} />

                      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {exp.highlights!.map((h, i) => (
                          <div key={i} className="rounded-lg border border-card-border bg-card-bg p-3 text-center">
                            <div className="text-lg font-bold text-accent">{h.metric}</div>
                            <div className="mt-1 text-xs text-dimmed leading-snug">{h.desc}</div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setDrawerOpen(true)}
                        className="group inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent/80"
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

            return (
              <FadeInChild key={idx}>
                <SpotlightCard className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-heading">{exp.title}</h3>
                      <p className="text-sm text-muted">{exp.org}</p>
                    </div>
                    <span className="rounded-full border border-card-border bg-card-bg px-3 py-1 text-xs text-dimmed">
                      {exp.date}
                    </span>
                  </div>
                  <ul className="mb-5 space-y-2">
                    {exp.bullets!.map((b, i) => (
                      <li key={i} className="text-sm text-muted leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-dimmed">
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
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto border-l border-card-border bg-background p-8"
            >
              <button
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:text-heading hover:bg-card-bg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                Case Study
              </span>
              <h2 className="mt-4 text-2xl font-bold text-heading">{featured.caseStudy!.title}</h2>
              <p className="mt-3 text-sm text-muted leading-relaxed">{featured.caseStudy!.desc}</p>
              <ul className="mt-6 space-y-4">
                {featured.caseStudy!.points.map((p, i) => (
                  <li key={i} className="rounded-lg border border-card-border bg-card-bg p-4 text-sm text-foreground leading-relaxed">
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

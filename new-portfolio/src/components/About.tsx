"use client";

import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { education } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <span className="font-mono text-sm text-purple-400">01</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              About Me
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
          </div>
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <p className="mb-6 text-xl font-medium leading-relaxed text-zinc-200">
              I am a full-stack developer with strong AI/ML experience, building scalable
              autonomous systems from research to deployment at production scale.
            </p>
            <p className="text-base leading-relaxed text-zinc-400">
              Currently pursuing my M.S. in Computer Science at the University of Kansas,
              I have a proven track record of creating impactful applications, from an
              AI-powered campus assistant to real-time market data services. My focus is
              on backend engineering and AI integration within high-growth teams.
            </p>
          </FadeIn>

          <StaggerContainer className="space-y-4 lg:col-span-2">
            {education.map((edu) => (
              <FadeInChild key={edu.school}>
                <SpotlightCard className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path d="M12 14v7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{edu.school}</h4>
                      <p className="text-sm text-zinc-400">{edu.degree}</p>
                      <span className="mt-1 inline-block text-xs text-zinc-500">{edu.date}</span>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeInChild>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}

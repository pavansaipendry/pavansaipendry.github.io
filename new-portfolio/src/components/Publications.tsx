"use client";

import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { publications } from "@/lib/data";

export function Publications() {
  return (
    <section id="publications" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-16 flex items-center gap-4">
            <span className="font-mono text-sm text-purple-400">06</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Research & Publications
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
          </div>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {publications.map((pub) => {
            const Wrapper = pub.url ? "a" : "div";
            const wrapperProps = pub.url
              ? { href: pub.url, target: "_blank" as const, rel: "noopener noreferrer" }
              : {};

            return (
              <FadeInChild key={pub.title}>
                <Wrapper
                  {...wrapperProps}
                  className={`group flex items-center gap-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 ${
                    pub.url
                      ? "hover:border-white/[0.12] hover:bg-white/[0.04] cursor-pointer"
                      : ""
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white">{pub.title}</h4>
                    <p className="mt-0.5 text-sm text-zinc-400">{pub.description}</p>
                    {pub.venue && (
                      <span className="mt-1.5 inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-zinc-500">
                        {pub.venue}
                      </span>
                    )}
                  </div>
                  {pub.url && (
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="shrink-0 text-zinc-600 transition-all group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  )}
                </Wrapper>
              </FadeInChild>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

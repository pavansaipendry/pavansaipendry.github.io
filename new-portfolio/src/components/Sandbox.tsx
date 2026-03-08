"use client";

import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { sandboxItems } from "@/lib/data";

export function Sandbox() {
  return (
    <section id="sandbox" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <div className="mb-6 flex items-center gap-4">
            <span className="font-mono text-sm text-purple-400">05</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">The Sandbox</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
          </div>
        </FadeIn>
        <FadeIn>
          <p className="mb-10 text-sm text-zinc-500">
            Experimental architectures, works-in-progress, and concepts currently in the incubator.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {sandboxItems.map((item) => (
            <FadeInChild key={item.title}>
              <SpotlightCard className="p-6">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium mb-3 ${
                  item.status === "WIP"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  {item.status}
                </span>
                <h4 className="mb-2 text-base font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </SpotlightCard>
            </FadeInChild>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

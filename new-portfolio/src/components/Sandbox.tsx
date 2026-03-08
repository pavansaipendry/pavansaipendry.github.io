"use client";

import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHeader } from "./SectionHeader";
import { sandboxItems } from "@/lib/data";

export function Sandbox() {
  return (
    <section id="sandbox" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="06" title="The Sandbox" />
        </FadeIn>
        <FadeIn>
          <p className="mb-10 text-sm text-dimmed">
            Experimental architectures, works-in-progress, and concepts currently in the incubator.
          </p>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {sandboxItems.map((item) => (
            <FadeInChild key={item.title}>
              <SpotlightCard className="p-6">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium mb-3 ${
                  item.status === "WIP"
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                }`}>
                  {item.status}
                </span>
                <h4 className="mb-2 text-base font-semibold text-heading">{item.title}</h4>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </SpotlightCard>
            </FadeInChild>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

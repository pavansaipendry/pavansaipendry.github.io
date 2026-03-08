"use client";

import { useRef, useEffect } from "react";
import { motion, useSpring, useInView, useMotionValue, useTransform } from "framer-motion";
import { FadeIn, StaggerContainer, FadeInChild } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHeader } from "./SectionHeader";
import { TextReveal } from "./TextReveal";
import { education } from "@/lib/data";

// ─── Stats data ─────────────────────────────────────────────────────────────
const stats = [
  { value: 9500, suffix: "+", label: "Knowledge Docs" },
  { value: 82, suffix: "%", label: "User Approval" },
  { value: 35, suffix: "x", label: "Query Speedup" },
  { value: 26453, suffix: "", label: "Records Processed" },
];

function StatCounter({ value, suffix, label, started }: {
  value: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const motionVal = useSpring(0, { duration: 2000, bounce: 0 });
  const rounded = useTransform(motionVal, (v) => `${Math.floor(v).toLocaleString()}${suffix}`);
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (started) motionVal.set(value);
  }, [started, value, motionVal]);

  // Update DOM directly — no React re-renders
  useEffect(() => {
    return rounded.on("change", (v) => {
      if (displayRef.current) displayRef.current.textContent = v;
    });
  }, [rounded]);

  return (
    <div className="flex flex-col items-center gap-1">
      <span ref={displayRef} className="text-2xl font-bold text-heading tabular-nums tracking-tight">
        0{suffix}
      </span>
      <span className="text-xs text-dimmed">{label}</span>
    </div>
  );
}

export function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section id="about" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="01" title="About Me" />
        </FadeIn>

        <div className="grid gap-12 lg:grid-cols-5">
          <FadeIn className="lg:col-span-3">
            <TextReveal
              text="I build things that think. From an AI campus assistant handling 9,500+ knowledge docs to autonomous city simulations where agents develop corruption on their own — I'm drawn to the intersection of systems engineering and intelligence."
              className="mb-6"
            />
            <p className="text-base leading-relaxed text-muted">
              Currently doing my M.S. in Computer Science at the University of Kansas,
              I&apos;ve shipped production code across startups, research labs, and open-source.
              My work spans backend systems, AI pipelines, and full-stack applications —
              always with a bias toward building things that actually get used.
            </p>
          </FadeIn>

          <StaggerContainer className="space-y-4 lg:col-span-2">
            {education.map((edu) => (
              <FadeInChild key={edu.school}>
                <SpotlightCard className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path d="M12 14v7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-heading">{edu.school}</h4>
                      <p className="text-sm text-muted">{edu.degree}</p>
                      <span className="mt-1 inline-block text-xs text-dimmed">{edu.date}</span>
                    </div>
                  </div>
                </SpotlightCard>
              </FadeInChild>
            ))}
          </StaggerContainer>
        </div>

        {/* ─── Counting stats bar ─── */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-card-border bg-card-bg p-6 sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-card-border"
        >
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} started={statsInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

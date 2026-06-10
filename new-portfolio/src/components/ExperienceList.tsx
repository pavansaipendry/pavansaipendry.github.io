"use client";

import { experiences } from "@/lib/data";
import { AppearTitle } from "./AppearTitle";

/**
 * ExperienceList - editorial index rows: date / role+org / tags.
 * Hover sweeps a tint down the row and nudges it right (.ed-row in globals).
 */

function rowSummary(exp: (typeof experiences)[number]): string {
  return exp.description;
}

export function ExperienceList() {
  return (
    <section id="experience" className="scene px-6 lg:px-10" style={{ padding: "16vh clamp(24px, 3vw, 40px)" }}>
      <span className="meta-label mb-6 block">04 - Experience</span>
      <AppearTitle tag="h2" className="display mb-[8vh]" stagger={90}>
        <span style={{ fontSize: "clamp(3rem, 9vw, 10rem)", display: "block" }}>
          Experience
        </span>
      </AppearTitle>

      <div className="border-b border-card-border">
        {experiences.map((exp) => {
          const link =
            ("liveUrl" in exp ? exp.liveUrl : undefined) ??
            ("githubUrl" in exp ? exp.githubUrl : undefined);

          const Row = (
            <div className="ed-row">
              <span className="meta-label pt-1">{exp.date}</span>

              <div className="min-w-0">
                <h3
                  className="display"
                  style={{ fontSize: "clamp(1.6rem, 3.4vw, 3.4rem)", lineHeight: 1 }}
                >
                  {exp.title}
                </h3>
                <p className="mt-1">
                  <span className="serif-accent text-accent" style={{ fontSize: "clamp(1rem, 1.6vw, 1.4rem)" }}>
                    {exp.org}
                  </span>
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                  {rowSummary(exp)}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {exp.tags.slice(0, 6).map((t) => (
                    <span key={t} className="meta-label !tracking-[0.12em]">{t}</span>
                  ))}
                </div>
              </div>

              <span className="hidden text-2xl text-dimmed transition-transform duration-500 sm:block">
                {link ? "↗" : "-"}
              </span>
            </div>
          );

          return link ? (
            <a key={exp.title + exp.org} href={link} target="_blank" rel="noopener noreferrer" className="block">
              {Row}
            </a>
          ) : (
            <div key={exp.title + exp.org}>{Row}</div>
          );
        })}
      </div>
    </section>
  );
}

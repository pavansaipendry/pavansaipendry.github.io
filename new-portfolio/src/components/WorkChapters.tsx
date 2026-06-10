"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { projects } from "@/lib/data";
import { useScrub } from "./SmoothScroll";
import { AppearTitle } from "./AppearTitle";

/* Live in-browser demos rendered inside a chapter's frame instead of an image */
const PagedAttentionDemo = dynamic(() => import("./demos/PagedAttentionDemo").then((m) => ({ default: m.PagedAttentionDemo })));
const SparseAttentionDemo = dynamic(() => import("./demos/SparseAttentionDemo").then((m) => ({ default: m.SparseAttentionDemo })));
const TrainingRunDemo = dynamic(() => import("./demos/TrainingRunDemo").then((m) => ({ default: m.TrainingRunDemo })));
const HighwayDemo = dynamic(() => import("./demos/HighwayDemo").then((m) => ({ default: m.HighwayDemo })));
const OnAirDemo = dynamic(() => import("./demos/OnAirDemo").then((m) => ({ default: m.OnAirDemo })));
const DocAgentDemo = dynamic(() => import("./demos/DocAgentDemo").then((m) => ({ default: m.DocAgentDemo })));

const LIVE_DEMOS: Record<string, ComponentType> = {
  "mini-vLLM": PagedAttentionDemo,
  "NSA-mini": SparseAttentionDemo,
  "Reasoning SLM": TrainingRunDemo,
  "Highway RL Agent": HighwayDemo,
  AttentionFM: OnAirDemo,
  FinDocAgent: DocAgentDemo,
};

/**
 * WorkChapters - projects as full-bleed editorial chapters.
 *
 * Each chapter: a giant outlined numeral parallaxing behind, a display title
 * overlapping a full-bleed image, and a meta column. The image reveals via a
 * scrubbed clip-path and its inner layer de-scales continuously with scroll -
 * the whole chapter is alive for its entire time on screen.
 */

function FrameLink({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className="block">{children}</div>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="view" className="block">
      {children}
    </a>
  );
}

function Chapter({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const flip = index % 2 === 1;
  const Demo = LIVE_DEMOS[project.title];

  const ref = useScrub<HTMLDivElement>((p, el) => {
    // Reveal phase: 0 → 0.35 of the chapter's journey
    const reveal = Math.min(1, p / 0.35);
    // Drift phase: continuous for the whole journey
    const drift = (p - 0.5) * 2; // -1 … 1

    const frame = el.querySelector<HTMLElement>("[data-ch-frame]");
    const img = el.querySelector<HTMLElement>("[data-ch-img]");
    const num = el.querySelector<HTMLElement>("[data-ch-num]");
    const title = el.querySelector<HTMLElement>("[data-ch-title]");

    if (frame) {
      const inset = (1 - reveal) * 14;
      frame.style.clipPath = `inset(${inset}% ${inset * 0.6}% ${inset}% ${inset * 0.6}%)`;
    }
    if (img && !Demo) {
      img.style.transform = `translate3d(0, ${drift * -4}%, 0) scale(${1.22 - reveal * 0.12})`;
    }
    if (num) {
      // Numerals settle into full view early (p≈0.35) and travel a touch
      // faster, so the whole number is readable while the chapter is on screen
      num.style.transform = `translate3d(0, ${(p - 0.35) * -2.4 * 14}vh, 0)`;
    }
    if (title) {
      title.style.transform = `translate3d(${drift * (flip ? 3 : -3)}vw, 0, 0)`;
    }
  });

  const live = "live" in project ? (project.live as string) : undefined;
  const github = "github" in project ? (project.github as string) : undefined;
  const href = live ?? github;

  return (
    <div ref={ref} className="scene" style={{ padding: "14vh 0" }}>
      {/* Giant numeral behind everything */}
      <span
        data-ch-num
        aria-hidden
        className={`chapter-index absolute top-[2vh] will-change-transform ${
          flip ? "left-[-3vw]" : "right-[-3vw]"
        }`}
        style={{ fontSize: "26vw" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className={`relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-0 ${flip ? "lg:flex-row-reverse" : ""}`}>
        {/* ── Image / live demo ── */}
        <div className={`w-full lg:w-[64vw] ${flip ? "lg:pl-0" : "lg:pr-0"}`}>
          <FrameLink href={Demo ? undefined : href}>
            <div
              data-ch-frame
              className="relative overflow-hidden will-change-[clip-path]"
              style={{ aspectRatio: "16 / 10" }}
            >
              <div data-ch-img className={`absolute inset-0 ${Demo ? "" : "will-change-transform"}`}>
                {Demo ? (
                  <Demo />
                ) : project.images.length > 0 ? (
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 64vw, 100vw"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${project.accent}26 0%, ${project.accent}0a 50%, ${project.accent}1f 100%)`,
                    }}
                  />
                )}
              </div>
              {/* Soft bottom shade for title overlap */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.45), transparent)" }}
              />
              {project.ongoing && !Demo && (
                <span className="meta-label absolute top-4 z-10 flex items-center gap-2 !text-white/80" style={{ [flip ? "right" : "left"]: "16px" } as React.CSSProperties}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                  </span>
                  Active
                </span>
              )}
            </div>
          </FrameLink>

          {/* Title overlapping the image edge */}
          <h3
            data-ch-title
            className={`display relative z-10 will-change-transform ${flip ? "lg:text-right" : ""}`}
            style={{
              fontSize: "clamp(2.6rem, 7vw, 8rem)",
              marginTop: "-0.55em",
              paddingLeft: flip ? undefined : "clamp(8px, 2vw, 40px)",
              paddingRight: flip ? "clamp(8px, 2vw, 40px)" : undefined,
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* ── Meta column ── */}
        <div className={`flex w-full flex-col gap-5 px-6 pb-2 lg:w-[36vw] lg:px-10 ${flip ? "lg:items-end lg:text-right" : ""}`}>
          <span className="meta-label">
            {String(index + 1).padStart(2, "0")} / {project.date}
          </span>
          <p className="max-w-sm text-sm leading-relaxed text-muted lg:text-base">
            {project.description.length > 220
              ? project.description.slice(0, project.description.lastIndexOf(" ", 220)) + "…"
              : project.description}
          </p>
          <div className={`flex max-w-sm flex-wrap gap-x-4 gap-y-1 ${flip ? "lg:justify-end" : ""}`}>
            {project.tags.slice(0, 6).map((t) => (
              <span key={t} className="meta-label !tracking-[0.12em]">{t}</span>
            ))}
          </div>
          <div className={`mt-1 flex items-center gap-6 ${flip ? "lg:justify-end" : ""}`}>
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" className="link-draw meta-label !text-heading">
                GitHub ↗
              </a>
            )}
            {live && (
              <a href={live} target="_blank" rel="noopener noreferrer" className="link-draw meta-label" style={{ color: project.accent }}>
                Live ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkChapters() {
  return (
    <section id="projects" className="relative">
      {/* Section opener */}
      <div className="px-6 pt-[18vh] lg:px-10">
        <span className="meta-label mb-6 block">02 - Selected Work</span>
        <AppearTitle
          tag="h2"
          className="display"
          stagger={90}
        >
          <span style={{ fontSize: "clamp(3.5rem, 11vw, 12rem)", display: "block" }}>
            Selected Work
          </span>
        </AppearTitle>
      </div>

      {projects.map((p, i) => (
        <Chapter key={p.title} project={p} index={i} />
      ))}
    </section>
  );
}

"use client";

import { skills, education } from "@/lib/data";
import { useScrub } from "./SmoothScroll";

/**
 * AboutChapter - the inverted scene. Hard-coded light palette on purpose:
 * a paper-white chapter inside a near-black site reads as a deliberate
 * editorial spread, independent of the theme toggle.
 */

const INK = "#101014";
const INK_SOFT = "rgba(16, 16, 20, 0.55)";
const PAPER = "#eceae6";

const BIO: { text: string; accent?: boolean }[] = [
  { text: "Grad" }, { text: "student" }, { text: "by" }, { text: "day," },
  { text: "systems", accent: true }, { text: "builder", accent: true },
  { text: "by" }, { text: "night." }, { text: "I" }, { text: "took" },
  { text: "an" }, { text: "AI" }, { text: "campus" }, { text: "assistant" },
  { text: "from" }, { text: "idea" }, { text: "to" },
  { text: "7,300+", accent: true }, { text: "courses", accent: true },
  { text: "served," }, { text: "published" }, { text: "research" },
  { text: "along" }, { text: "the" }, { text: "way," }, { text: "and" },
  { text: "I'm" }, { text: "now" }, { text: "building" },
  { text: "my" }, { text: "own" }, { text: "startup.", accent: true },
];

const STATS = [
  { value: "10+", label: "Projects shipped" },
  { value: "02", label: "Peer-reviewed papers" },
  { value: "7.3K", label: "Courses served" },
  { value: "82%", label: "User approval" },
];

// Three marquee rows from the skill data
const ROWS = [
  skills[0].items.concat(skills[4].items),      // languages + databases
  skills[1].items,                              // frameworks
  skills[2].items.concat(skills[3].items),      // cloud + ai/ml
];

export function AboutChapter() {
  const ref = useScrub<HTMLElement>((p, el) => {
    const words = el.querySelectorAll<HTMLElement>("[data-aword]");
    const n = words.length;
    // Words complete between 15% and 55% of the scene's journey
    const sp = Math.min(1, Math.max(0, (p - 0.15) / 0.4)) * n;
    words.forEach((w, i) => {
      const t = Math.min(1, Math.max(0, sp - i));
      w.style.opacity = `${0.14 + t * 0.86}`;
    });
  });

  return (
    <section
      ref={ref}
      id="about"
      className="scene"
      style={{ background: PAPER, color: INK, padding: "16vh 0 0" }}
    >
      <div className="px-6 lg:px-10">
        <span className="meta-label mb-10 block" style={{ color: INK_SOFT }}>
          03 - About
        </span>

        {/* Editorial bio - words illuminate on scrub */}
        <p
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontWeight: 700,
            fontStretch: "110%",
            fontSize: "clamp(1.8rem, 4.6vw, 5rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            maxWidth: "20ch",
          }}
        >
          {BIO.map((chunk, i) => (
            <span
              key={i}
              data-aword
              className={chunk.accent ? "serif-accent" : ""}
              style={{
                opacity: 0.14,
                marginRight: "0.26em",
                display: "inline-block",
              }}
            >
              {chunk.text}
            </span>
          ))}
        </p>

        {/* Stats - huge numerals */}
        <div className="mt-[10vh] grid grid-cols-2 gap-y-10 border-t pt-10 lg:grid-cols-4" style={{ borderColor: "rgba(16,16,20,0.15)" }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <span
                className="display block"
                style={{ fontSize: "clamp(3rem, 7vw, 7.5rem)", color: INK }}
              >
                {s.value}
              </span>
              <span className="meta-label mt-2 block" style={{ color: INK_SOFT }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Education line */}
        <div className="mt-[8vh] flex flex-wrap items-baseline justify-between gap-4 border-t pt-8 pb-[6vh]" style={{ borderColor: "rgba(16,16,20,0.15)" }}>
          {education.map((e) => (
            <div key={e.school} className="flex flex-col gap-1">
              <span className="text-sm font-semibold" style={{ color: INK }}>{e.school}</span>
              <span className="text-sm" style={{ color: INK_SOFT }}>{e.degree} · {e.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills as outlined marquee rows, edge to edge */}
      <div id="skills" className="pb-[12vh] pt-[2vh]">
        {ROWS.map((row, ri) => (
          <div key={ri} className="overflow-hidden whitespace-nowrap" aria-hidden={ri > 0}>
            <div className="inline-flex">
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  className="display inline-block pr-4"
                  style={{
                    fontSize: "clamp(2.4rem, 5.5vw, 6rem)",
                    color: "transparent",
                    WebkitTextStroke: `1.2px rgba(16,16,20,${ri === 1 ? 0.85 : 0.3})`,
                    animation: `marquee ${36 + ri * 10}s linear infinite${ri % 2 === 1 ? " reverse" : ""}`,
                    willChange: "transform",
                  }}
                >
                  {row.join(" · ")} ·{" "}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

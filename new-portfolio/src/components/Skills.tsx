"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHeader } from "./SectionHeader";
import { skills } from "@/lib/data";

// ─── Icons ──────────────────────────────────────────────────────────────────
const icons: Record<string, React.ReactNode> = {
  Languages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Frameworks: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  "Cloud & DevOps": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  "AI / ML": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    </svg>
  ),
  Databases: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Tools: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

// ─── Next.js-style beam colors (2-stop gradient per beam) ───────────────────
const BEAM_COLORS = [
  ["#FF4A81", "#DF6CF7"],   // pink → purple
  ["#2EB9DF", "#61DAFB"],   // cyan → blue
  ["#FF7432", "#F7CC4B"],   // orange → yellow
  ["#7c5cfc", "#a78bfa"],   // purple → violet
  ["#34d399", "#6ee7b7"],   // green → emerald
  ["#3b82f6", "#93c5fd"],   // blue → sky
];

// ─── Types ──────────────────────────────────────────────────────────────────
interface TracePath {
  d: string;            // SVG path d attribute
  beamGradientIndex: number;
  beamDuration: number; // seconds
  beamDelay: number;    // seconds
  beamLength: number;   // px length of the beam rect
  startDot: { x: number; y: number };
  endDot: { x: number; y: number };
}

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRef = useRef<HTMLDivElement>(null);
  const [traces, setTraces] = useState<TracePath[]>([]);
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const topSkills = skills.slice(0, 3);
  const bottomSkills = skills.slice(3, 6);

  const getRelPos = useCallback((el: HTMLElement, container: HTMLElement) => {
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      cx: er.left - cr.left + er.width / 2,
      top: er.top - cr.top,
      bottom: er.top - cr.top + er.height,
    };
  }, []);

  // ─── Build SVG paths ────────────────────────────────────────────────────
  const buildPaths = useCallback(() => {
    const container = containerRef.current;
    const chip = chipRef.current;
    if (!container || !chip) return;

    const cr = container.getBoundingClientRect();
    setSvgSize({ w: cr.width, h: cr.height });

    const chipPos = getRelPos(chip, container);
    const newTraces: TracePath[] = [];

    // Top cards → chip (sharp 90° corners)
    topRefs.current.forEach((block, i) => {
      if (!block) return;
      const bp = getRelPos(block, container);
      const sx = bp.cx + (i - 1) * 12;
      const sy = bp.bottom;
      const ex = chipPos.cx + (i - 1) * 16;
      const ey = chipPos.top;
      const midY = sy + (ey - sy) * 0.45;

      let d: string;
      if (Math.abs(ex - sx) < 2) {
        d = `M ${sx} ${sy} L ${sx} ${ey}`;
      } else {
        d = `M ${sx} ${sy} L ${sx} ${midY} L ${ex} ${midY} L ${ex} ${ey}`;
      }

      newTraces.push({
        d,
        beamGradientIndex: i,
        beamDuration: 2.5 + i * 0.4,
        beamDelay: i * 0.8,
        beamLength: 60 + i * 10,
        startDot: { x: sx, y: sy },
        endDot: { x: ex, y: ey },
      });
    });

    // Bottom cards → chip (beams travel upward, sharp 90° corners)
    bottomRefs.current.forEach((block, i) => {
      if (!block) return;
      const bp = getRelPos(block, container);
      const sx = bp.cx + (i - 1) * 12;
      const sy = bp.top;
      const ex = chipPos.cx + (i - 1) * 16;
      const ey = chipPos.bottom;
      const midY = ey + (sy - ey) * 0.45;

      let d: string;
      if (Math.abs(ex - sx) < 2) {
        d = `M ${sx} ${sy} L ${sx} ${ey}`;
      } else {
        d = `M ${sx} ${sy} L ${sx} ${midY} L ${ex} ${midY} L ${ex} ${ey}`;
      }

      newTraces.push({
        d,
        beamGradientIndex: i + 3,
        beamDuration: 2.5 + i * 0.4,
        beamDelay: 1.5 + i * 0.8,
        beamLength: 60 + i * 10,
        startDot: { x: sx, y: sy },
        endDot: { x: ex, y: ey },
      });
    });

    setTraces(newTraces);

  }, [getRelPos]);

  // ─── Set stroke-dasharray on beam paths after render ────────────────────
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || traces.length === 0) return;

    // Animate beams with Web Animations API (real numeric values, smooth through corners)
    svg.querySelectorAll<SVGPathElement>(".skills-beam-head").forEach((path) => {
      const totalLength = path.getTotalLength();
      const beamLength = totalLength * 0.18;
      path.style.strokeDasharray = `${beamLength} ${totalLength}`;

      const startOffset = totalLength + beamLength;
      const dur = parseFloat(path.style.getPropertyValue("--beam-duration")) * 1000 || 3000;
      const del = parseFloat(path.style.getPropertyValue("--beam-delay")) * 1000 || 0;

      path.getAnimations().forEach((a) => a.cancel());
      path.animate(
        [
          { strokeDashoffset: `${startOffset}`, opacity: 0 },
          { strokeDashoffset: `${startOffset}`, opacity: 1, offset: 0.05 },
          { strokeDashoffset: "0", opacity: 1, offset: 0.85 },
          { strokeDashoffset: "0", opacity: 0 },
        ],
        {
          duration: dur,
          delay: del,
          iterations: Infinity,
          easing: "linear",
          fill: "forwards",
        }
      );
    });
  }, [traces]);

  // ─── Observer + resize ────────────────────────────────────────────────
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            buildPaths();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    const onResize = () => buildPaths();
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [buildPaths]);

  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="02" title="Skills & Tools" />
        </FadeIn>

        {/* Circuit board layout */}
        <div ref={containerRef} className="relative">

          {/* ═══ SVG Overlay ═══ */}
          {svgSize.w > 0 && (
            <svg
              ref={svgRef}
              width={svgSize.w}
              height={svgSize.h}
              viewBox={`0 0 ${svgSize.w} ${svgSize.h}`}
              className="pointer-events-none absolute inset-0 hidden md:block"
              fill="none"
            >
              <defs>
                {traces.map((trace, i) => {
                  const colors = BEAM_COLORS[trace.beamGradientIndex % BEAM_COLORS.length];
                  return (
                    <linearGradient key={`tg-${i}`} id={`trace-beam-${i}`} gradientUnits="userSpaceOnUse"
                      x1={trace.startDot.x} y1={trace.startDot.y}
                      x2={trace.endDot.x} y2={trace.endDot.y}
                    >
                      <stop offset="0%" stopColor={colors[0]} />
                      <stop offset="100%" stopColor={colors[1]} />
                    </linearGradient>
                  );
                })}
              </defs>

              {/* ── Main connection traces ─────────────────────────────── */}
              {traces.map((trace, i) => {
                const colors = BEAM_COLORS[trace.beamGradientIndex % BEAM_COLORS.length];
                return (
                  <g key={`trace-${i}`}>
                    {/* Static trace line */}
                    <path d={trace.d} stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" className="text-foreground" />
                    {/* Start dot */}
                    <circle cx={trace.startDot.x} cy={trace.startDot.y} r="4" fill="var(--background)" />
                    <circle cx={trace.startDot.x} cy={trace.startDot.y} r="3.5" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" fill="none" className="text-foreground" />
                    {/* End dot */}
                    <circle cx={trace.endDot.x} cy={trace.endDot.y} r="4" fill="var(--background)" />
                    <circle cx={trace.endDot.x} cy={trace.endDot.y} r="3.5" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" fill="none" className="text-foreground" />

                    {/* Animated beam */}
                    <path
                      d={trace.d}
                      stroke={`url(#trace-beam-${i})`}
                      strokeWidth="2"
                      strokeLinecap="butt"
                      fill="none"
                      className="skills-beam-path skills-beam-head"
                      style={{
                        "--beam-duration": `${trace.beamDuration}s`,
                        "--beam-delay": `${trace.beamDelay}s`,
                      } as React.CSSProperties}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* ═══ Top Row: 3 skill cards ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-3 mb-16 md:mb-24"
          >
            {topSkills.map((group, i) => {
              const beamColors = BEAM_COLORS[i % BEAM_COLORS.length];
              return (
                <div key={group.title} ref={(el) => { topRefs.current[i] = el; }}>
                  <SpotlightCard className="p-5 h-full relative overflow-hidden">
                    {/* Bottom edge glow — where the trace exits */}
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px]"
                      style={{
                        background: `linear-gradient(90deg, transparent 20%, ${beamColors[0]} 40%, ${beamColors[1]} 60%, transparent 80%)`,
                        opacity: 0.5,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-8"
                      style={{
                        background: `linear-gradient(to top, ${beamColors[0]}08, transparent)`,
                      }}
                    />
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        {icons[group.title]}
                      </div>
                      <h3 className="font-semibold text-heading text-sm">{group.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-pill-border bg-pill-bg px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent/30 hover:text-accent"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>
              );
            })}
          </motion.div>

          {/* ═══ Central Chip ═══ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-16 md:mb-24"
          >
            <div ref={chipRef} className="relative group">
              {/* Top connectors */}
              <div className="flex justify-center gap-[5px] mb-[1px]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={`tp-${i}`}
                    className="block h-[14px] w-[3px] rounded-t-[1px]"
                    style={{
                      background: "linear-gradient(180deg, var(--card-border) 0%, var(--card-border-hover) 50%, var(--card-border) 100%)",
                    }}
                  />
                ))}
              </div>

              {/* Chip body */}
              <div className="relative overflow-hidden rounded-[6px] border border-card-border px-10 py-5"
                style={{
                  background: "linear-gradient(180deg, var(--card-bg), transparent)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* Left connectors */}
                <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 flex flex-col gap-[5px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={`lp-${i}`}
                      className="block h-[3px] w-[14px] rounded-l-[1px]"
                      style={{
                        background: "linear-gradient(90deg, var(--card-border) 0%, var(--card-border-hover) 50%, var(--card-border) 100%)",
                      }}
                    />
                  ))}
                </div>
                {/* Right connectors */}
                <div className="absolute -right-[14px] top-1/2 -translate-y-1/2 flex flex-col gap-[5px]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={`rp-${i}`}
                      className="block h-[3px] w-[14px] rounded-r-[1px]"
                      style={{
                        background: "linear-gradient(90deg, var(--card-border) 0%, var(--card-border-hover) 50%, var(--card-border) 100%)",
                      }}
                    />
                  ))}
                </div>

                {/* Pin-1 marker */}
                <div className="absolute top-[6px] left-[6px] h-[5px] w-[5px] rounded-full border border-card-border" />

                {/* Chip shine effect — nextjs.org style */}
                <div
                  data-cpu-shine
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                  style={{
                    background: "linear-gradient(90deg, transparent 20%, transparent 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 70%)",
                    backgroundSize: "200%",
                    animation: "shine 5s infinite",
                    transform: "scale(2.2) rotate(-30deg)",
                    mixBlendMode: "plus-lighter",
                  }}
                />

                {/* Content */}
                <div className="relative flex items-center gap-3">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                    <rect x="5" y="5" width="14" height="14" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="12" y1="5" x2="12" y2="2" />
                    <line x1="12" y1="22" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="2" y2="12" />
                    <line x1="22" y1="12" x2="19" y2="12" />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-heading tracking-wide">My Stack</span>
                    <span className="text-[9px] text-dimmed font-mono tracking-widest mt-0.5">PSR–2026</span>
                  </div>
                </div>
              </div>

              {/* Bottom connectors */}
              <div className="flex justify-center gap-[5px] mt-[1px]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span
                    key={`bp-${i}`}
                    className="block h-[14px] w-[3px] rounded-b-[1px]"
                    style={{
                      background: "linear-gradient(180deg, var(--card-border-hover) 0%, var(--card-border) 50%, transparent 100%)",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ═══ Bottom Row: 3 skill cards ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {bottomSkills.map((group, i) => {
              const beamColors = BEAM_COLORS[(i + 3) % BEAM_COLORS.length];
              return (
                <div key={group.title} ref={(el) => { bottomRefs.current[i] = el; }}>
                  <SpotlightCard className="p-5 h-full relative overflow-hidden">
                    {/* Top edge glow — where the trace enters */}
                    <div
                      className="pointer-events-none absolute top-0 left-0 right-0 h-[1px]"
                      style={{
                        background: `linear-gradient(90deg, transparent 20%, ${beamColors[0]} 40%, ${beamColors[1]} 60%, transparent 80%)`,
                        opacity: 0.5,
                      }}
                    />
                    <div
                      className="pointer-events-none absolute top-0 left-0 right-0 h-8"
                      style={{
                        background: `linear-gradient(to bottom, ${beamColors[0]}08, transparent)`,
                      }}
                    />
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                        {icons[group.title]}
                      </div>
                      <h3 className="font-semibold text-heading text-sm">{group.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-pill-border bg-pill-bg px-2 py-0.5 text-xs text-muted transition-colors hover:border-accent/30 hover:text-accent"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </SpotlightCard>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

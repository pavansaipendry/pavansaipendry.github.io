"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./AnimatedSection";
import { SpotlightCard } from "./SpotlightCard";
import { SectionHeader } from "./SectionHeader";
import { skills } from "@/lib/data";

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

const lineColors = [
  { r: 124, g: 92, b: 252 },   // purple
  { r: 59, g: 130, b: 246 },   // blue
  { r: 0, g: 200, b: 255 },    // cyan
  { r: 168, g: 85, b: 247 },   // violet
  { r: 34, g: 197, b: 94 },    // green
  { r: 251, g: 146, b: 60 },   // orange
];

interface LineData {
  waypoints: { x: number; y: number }[];
  colorIndex: number;
  progress: number;
  speed: number;
}

export function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<LineData[]>([]);
  const runningRef = useRef(false);
  const animIdRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  const topSkills = skills.slice(0, 3);
  const bottomSkills = skills.slice(3, 6);

  const getRelPos = useCallback((el: HTMLElement, container: HTMLElement) => {
    const cr = container.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return {
      x: er.left - cr.left + er.width / 2,
      y: er.top - cr.top + er.height / 2,
      top: er.top - cr.top,
      bottom: er.top - cr.top + er.height,
    };
  }, []);

  const buildPaths = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const chip = chipRef.current;
    if (!container || !canvas || !chip) return;

    const cr = container.getBoundingClientRect();
    canvas.width = cr.width;
    canvas.height = cr.height;

    const chipPos = getRelPos(chip, container);
    const lines: LineData[] = [];

    // Top blocks connect downward to chip
    topRefs.current.forEach((block, i) => {
      if (!block) return;
      const bp = getRelPos(block, container);
      const midY = bp.bottom + (chipPos.y - bp.bottom) * 0.5;
      lines.push({
        waypoints: [
          { x: bp.x, y: bp.bottom },
          { x: bp.x, y: midY },
          { x: chipPos.x, y: midY },
          { x: chipPos.x, y: chipPos.y - 35 },
        ],
        colorIndex: i,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.003,
      });
    });

    // Bottom blocks connect upward from chip
    bottomRefs.current.forEach((block, i) => {
      if (!block) return;
      const bp = getRelPos(block, container);
      const midY = chipPos.y + (bp.top - chipPos.y) * 0.5;
      lines.push({
        waypoints: [
          { x: chipPos.x, y: chipPos.y + 35 },
          { x: chipPos.x, y: midY },
          { x: bp.x, y: midY },
          { x: bp.x, y: bp.top },
        ],
        colorIndex: i + 3,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.003,
      });
    });

    linesRef.current = lines;
  }, [getRelPos]);

  const lerpPath = useCallback((waypoints: { x: number; y: number }[], t: number) => {
    let totalLen = 0;
    const segments: number[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const dx = waypoints[i + 1].x - waypoints[i].x;
      const dy = waypoints[i + 1].y - waypoints[i].y;
      segments.push(Math.sqrt(dx * dx + dy * dy));
      totalLen += segments[i];
    }
    let targetDist = t * totalLen;
    for (let i = 0; i < segments.length; i++) {
      if (targetDist <= segments[i]) {
        const frac = segments[i] > 0 ? targetDist / segments[i] : 0;
        return {
          x: waypoints[i].x + (waypoints[i + 1].x - waypoints[i].x) * frac,
          y: waypoints[i].y + (waypoints[i + 1].y - waypoints[i].y) * frac,
        };
      }
      targetDist -= segments[i];
    }
    return waypoints[waypoints.length - 1];
  }, []);

  const draw = useCallback(() => {
    if (!runningRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    linesRef.current.forEach((line) => {
      const c = lineColors[line.colorIndex % lineColors.length];

      // Static path (circuit trace)
      ctx.beginPath();
      ctx.moveTo(line.waypoints[0].x, line.waypoints[0].y);
      for (let i = 1; i < line.waypoints.length; i++) {
        ctx.lineTo(line.waypoints[i].x, line.waypoints[i].y);
      }
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.12)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Corner nodes
      line.waypoints.forEach((wp, i) => {
        if (i > 0 && i < line.waypoints.length - 1) {
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.25)`;
          ctx.fill();
        }
      });

      // Animated pulse along the line
      line.progress += line.speed;
      if (line.progress > 1) line.progress = 0;

      const segLen = 0.15;
      const t1 = line.progress;
      const t2 = Math.min(1, t1 + segLen);
      const steps = 20;

      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const t = t1 + (t2 - t1) * (s / steps);
        const pos = lerpPath(line.waypoints, t);
        if (s === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      }
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Glow head
      const headPos = lerpPath(line.waypoints, t2);
      const glow = ctx.createRadialGradient(headPos.x, headPos.y, 0, headPos.x, headPos.y, 12);
      glow.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.5)`);
      glow.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.beginPath();
      ctx.arc(headPos.x, headPos.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Head dot
      ctx.beginPath();
      ctx.arc(headPos.x, headPos.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
      ctx.fill();
    });

    animIdRef.current = requestAnimationFrame(draw);
  }, [lerpPath]);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            buildPaths();
            runningRef.current = true;
            draw();
          } else {
            runningRef.current = false;
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(section);

    const onResize = () => {
      if (runningRef.current) buildPaths();
    };
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      runningRef.current = false;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [buildPaths, draw]);

  return (
    <section id="skills" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="02" title="Skills & Tools" />
        </FadeIn>

        {/* Circuit board layout */}
        <div ref={containerRef} className="relative">
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 hidden md:block"
          />

          {/* Top row: 3 skill cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid gap-4 sm:grid-cols-3 mb-16 md:mb-24"
          >
            {topSkills.map((group, i) => (
              <div key={group.title} ref={(el) => { topRefs.current[i] = el; }}>
                <SpotlightCard className="p-5 h-full">
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
            ))}
          </motion.div>

          {/* Central chip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center mb-16 md:mb-24"
          >
            <div ref={chipRef} className="relative">
              {/* Top pins */}
              <div className="flex justify-center gap-2 mb-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={`tp-${i}`} className="block h-3 w-1.5 rounded-t-sm bg-card-border" />
                ))}
              </div>

              {/* Chip body */}
              <div className="relative flex items-center gap-3 rounded-lg border border-card-border-hover bg-code-bg px-8 py-4 shadow-lg shadow-accent/[0.05]">
                {/* Left pins */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span key={`lp-${i}`} className="block h-1.5 w-3 rounded-l-sm bg-card-border" />
                  ))}
                </div>
                {/* Right pins */}
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span key={`rp-${i}`} className="block h-1.5 w-3 rounded-r-sm bg-card-border" />
                  ))}
                </div>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
                <span className="text-sm font-semibold text-heading">My Stack</span>

                {/* Accent glow */}
                <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-accent/[0.05] via-transparent to-accent/[0.05]" />
              </div>

              {/* Bottom pins */}
              <div className="flex justify-center gap-2 mt-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={`bp-${i}`} className="block h-3 w-1.5 rounded-b-sm bg-card-border" />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bottom row: 3 skill cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {bottomSkills.map((group, i) => (
              <div key={group.title} ref={(el) => { bottomRefs.current[i] = el; }}>
                <SpotlightCard className="p-5 h-full">
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
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

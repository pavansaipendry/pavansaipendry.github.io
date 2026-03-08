"use client";

import { motion } from "framer-motion";

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, delay, ease: "easeInOut" as const },
      opacity: { duration: 0.3, delay },
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.8, delay },
  }),
};

export function HeroGrid() {
  // Grid config
  const cols = 6;
  const rows = 5;
  const cellW = 200;
  const cellH = 160;
  const r = 12; // corner radius
  const w = cols * cellW;
  const h = rows * cellH;

  // Build vertical lines with rounded corners at intersections
  const verticalLines: string[] = [];
  for (let c = 0; c <= cols; c++) {
    const x = c * cellW;
    verticalLines.push(`M ${x} 0 L ${x} ${h}`);
  }

  // Build horizontal lines
  const horizontalLines: string[] = [];
  for (let rw = 0; rw <= rows; rw++) {
    const y = rw * cellH;
    horizontalLines.push(`M 0 ${y} L ${w} ${y}`);
  }

  // Corner arcs at select intersections for that Next.js look
  const corners = [
    // top-left area
    { x: 1 * cellW, y: 1 * cellH, quadrant: "tl" },
    { x: 5 * cellW, y: 1 * cellH, quadrant: "tr" },
    { x: 1 * cellW, y: 4 * cellH, quadrant: "bl" },
    { x: 5 * cellW, y: 4 * cellH, quadrant: "br" },
    // inner
    { x: 2 * cellW, y: 2 * cellH, quadrant: "tl" },
    { x: 4 * cellW, y: 2 * cellH, quadrant: "tr" },
    { x: 2 * cellW, y: 3 * cellH, quadrant: "bl" },
    { x: 4 * cellW, y: 3 * cellH, quadrant: "br" },
  ];

  function arcPath(cx: number, cy: number, quadrant: string, radius: number) {
    switch (quadrant) {
      case "tl": return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`;
      case "tr": return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
      case "bl": return `M ${cx} ${cy + radius} A ${radius} ${radius} 0 0 1 ${cx - radius} ${cy}`;
      case "br": return `M ${cx + radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy + radius}`;
      default: return "";
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <motion.svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="absolute"
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        initial="hidden"
        animate="visible"
      >
        {/* Vertical lines */}
        {verticalLines.map((d, i) => (
          <motion.path
            key={`v-${i}`}
            d={d}
            stroke="var(--card-border)"
            strokeWidth="1"
            fill="none"
            variants={draw}
            custom={i * 0.08}
          />
        ))}

        {/* Horizontal lines */}
        {horizontalLines.map((d, i) => (
          <motion.path
            key={`h-${i}`}
            d={d}
            stroke="var(--card-border)"
            strokeWidth="1"
            fill="none"
            variants={draw}
            custom={0.3 + i * 0.08}
          />
        ))}

        {/* Corner arcs */}
        {corners.map((c, i) => (
          <motion.path
            key={`c-${i}`}
            d={arcPath(c.x, c.y, c.quadrant, r * 3)}
            stroke="var(--card-border-hover)"
            strokeWidth="1"
            fill="none"
            variants={draw}
            custom={0.8 + i * 0.1}
          />
        ))}

        {/* Small filled circles at key intersections */}
        {[
          { x: 2 * cellW, y: 1 * cellH },
          { x: 4 * cellW, y: 1 * cellH },
          { x: 3 * cellW, y: 2 * cellH },
          { x: 3 * cellW, y: 3 * cellH },
          { x: 2 * cellW, y: 4 * cellH },
          { x: 4 * cellW, y: 4 * cellH },
        ].map((p, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={2}
            fill="var(--dimmed)"
            variants={fadeIn}
            custom={1.2 + i * 0.1}
          />
        ))}
      </motion.svg>

      {/* Fade edges so it blends into background */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
}

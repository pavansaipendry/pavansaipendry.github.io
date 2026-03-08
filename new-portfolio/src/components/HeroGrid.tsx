"use client";

import { motion } from "framer-motion";

export function HeroGrid() {
  const cellSize = 80;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ── Dashed grid via SVG pattern ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Bloom/glow layer — wider, blurred strokes for soft halo */}
            <filter id="grid-glow">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <pattern
              id="dashed-grid-glow"
              width={cellSize}
              height={cellSize}
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0" y1={cellSize} x2={cellSize} y2={cellSize}
                stroke="currentColor" strokeOpacity="0.06" strokeWidth="3"
                strokeDasharray="3 3"
              />
              <line
                x1={cellSize} y1="0" x2={cellSize} y2={cellSize}
                stroke="currentColor" strokeOpacity="0.06" strokeWidth="3"
                strokeDasharray="3 3"
              />
            </pattern>
            {/* Crisp line layer */}
            <pattern
              id="dashed-grid"
              width={cellSize}
              height={cellSize}
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0" y1={cellSize} x2={cellSize} y2={cellSize}
                stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"
                strokeDasharray="3 3"
              />
              <line
                x1={cellSize} y1="0" x2={cellSize} y2={cellSize}
                stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"
                strokeDasharray="3 3"
              />
            </pattern>
          </defs>
          {/* Soft glow behind */}
          <rect width="100%" height="100%" fill="url(#dashed-grid-glow)" filter="url(#grid-glow)" className="text-foreground" />
          {/* Crisp lines on top */}
          <rect width="100%" height="100%" fill="url(#dashed-grid)" className="text-foreground" />
        </svg>
      </motion.div>

      {/* ── Architectural details: corner arcs + dots + accent beams ── */}
      <motion.svg
        viewBox="0 0 1200 800"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        fill="none"
      >
        {/* Corner arcs at intersections — nextjs.org style */}
        {[
          { x: 200, y: 160, q: "tl" },
          { x: 1000, y: 160, q: "tr" },
          { x: 200, y: 640, q: "bl" },
          { x: 1000, y: 640, q: "br" },
          { x: 400, y: 320, q: "tl" },
          { x: 800, y: 320, q: "tr" },
          { x: 400, y: 480, q: "bl" },
          { x: 800, y: 480, q: "br" },
        ].map(({ x, y, q }, i) => {
          const r = 36;
          let d = "";
          switch (q) {
            case "tl": d = `M ${x - r} ${y} A ${r} ${r} 0 0 1 ${x} ${y - r}`; break;
            case "tr": d = `M ${x} ${y - r} A ${r} ${r} 0 0 1 ${x + r} ${y}`; break;
            case "bl": d = `M ${x} ${y + r} A ${r} ${r} 0 0 1 ${x - r} ${y}`; break;
            case "br": d = `M ${x + r} ${y} A ${r} ${r} 0 0 1 ${x} ${y + r}`; break;
          }
          return (
            <path
              key={`arc-${i}`}
              d={d}
              stroke="currentColor"
              strokeOpacity="0.12"
              strokeWidth="1"
              strokeDasharray="3 3"
              fill="none"
              className="text-foreground"
            />
          );
        })}

        {/* Endpoint dots */}
        {[
          { x: 400, y: 160 },
          { x: 600, y: 160 },
          { x: 800, y: 160 },
          { x: 200, y: 400 },
          { x: 600, y: 400 },
          { x: 1000, y: 400 },
          { x: 400, y: 640 },
          { x: 800, y: 640 },
        ].map((p, i) => (
          <g key={`dot-${i}`}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="var(--background)" />
            <circle cx={p.x} cy={p.y} r="3" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" fill="none" className="text-foreground" />
          </g>
        ))}

        {/* Colored accent beams */}
        <defs>
          <linearGradient id="hero-beam-1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF4A81" />
            <stop offset="22%" stopColor="#DF6CF7" />
            <stop offset="100%" stopColor="#0196FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-beam-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF7432" />
            <stop offset="22%" stopColor="#F7CC4B" />
            <stop offset="100%" stopColor="#F7CC4B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-beam-3" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#2EB9DF" />
            <stop offset="22%" stopColor="#61DAFB" />
            <stop offset="100%" stopColor="#61DAFB" stopOpacity="0" />
          </linearGradient>
        </defs>

        <motion.rect x="599" y="80" width="2" height="60" rx="1" fill="url(#hero-beam-3)"
          initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }} style={{ transformOrigin: "600px 110px" }}
        />
        <motion.rect x="680" y="399" width="80" height="2" rx="1" fill="url(#hero-beam-2)"
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }} style={{ transformOrigin: "720px 400px" }}
        />
        <motion.rect x="399" y="240" width="2" height="50" rx="1" fill="url(#hero-beam-1)"
          initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }} style={{ transformOrigin: "400px 265px" }}
        />
      </motion.svg>

      {/* ── Edge fades ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
}

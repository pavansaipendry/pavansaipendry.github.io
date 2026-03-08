"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { HeroGrid } from "./HeroGrid";

const stats = [
  { value: 6, suffix: "+", label: "Projects" },
  { value: 3, suffix: "", label: "Publications" },
  { value: 9500, suffix: "+", label: "Docs Served" },
  { value: 82, suffix: "%", label: "BabyJay Approval" },
];

function formatNumber(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString();
  }
  return n.toString();
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1] as const,
      onUpdate(v) {
        setDisplay(formatNumber(Math.round(v)));
      },
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <div className="flex flex-col items-center gap-1 rounded-lg border border-card-border bg-card-bg px-5 py-4">
      <span ref={ref} className="text-2xl font-bold text-heading sm:text-3xl">
        {display}{suffix}
      </span>
      <span className="text-xs text-dimmed">{label}</span>
    </div>
  );
}

const wordVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay: 0.3 + i * 0.12,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function Hero() {
  const words = ["Pavan", "Sai", "Reddy", "Pendry"];

  return (
    <section id="home" className="relative flex min-h-screen items-end justify-center overflow-hidden px-6 pb-24 pt-32">
      {/* Next.js-style grid background */}
      <HeroGrid />

      {/* Radial glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-gradient-to-b from-purple-500/[0.08] via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Title — reduced sizes */}
        <h1 className="mb-6">
          <span className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {words.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={`text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${
                  word === "Pendry"
                    ? "bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent"
                    : "text-heading"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mx-auto mb-8 max-w-2xl text-base text-muted leading-relaxed sm:text-lg"
        >
          {siteConfig.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-2 rounded-full bg-btn-primary-bg px-7 py-3 text-sm font-medium text-btn-primary-text transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:opacity-90"
          >
            View Projects
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-btn-secondary-border bg-btn-secondary-bg px-7 py-3 text-sm font-medium text-btn-secondary-text backdrop-blur-sm transition-all duration-300 hover:border-card-border-hover hover:text-heading"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-btn-secondary-border bg-btn-secondary-bg px-7 py-3 text-sm font-medium text-btn-secondary-text backdrop-blur-sm transition-all duration-300 hover:border-card-border-hover hover:text-heading"
          >
            LinkedIn
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </motion.div>

        {/* Terminal-style command */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-card-border bg-code-bg px-5 py-2.5 font-mono text-sm text-dimmed"
        >
          <span className="text-accent">▲</span>
          <span className="text-muted">~</span>
          <span className="text-foreground">npx create-pavan-portfolio@latest</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="inline-block w-2 h-4 bg-accent/60 ml-1"
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 flex flex-col items-center gap-3"
        >
          <span className="text-xs tracking-widest text-dimmed uppercase">Scroll</span>
          <motion.div
            animate={{ height: [16, 32, 16] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px bg-gradient-to-b from-dimmed to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

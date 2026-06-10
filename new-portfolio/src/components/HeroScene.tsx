"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { useLenisScrollTo, useScrub } from "./SmoothScroll";

/**
 * HeroScene - full-bleed typographic hero.
 *
 * Three display lines at ~14vw stacked edge-to-edge, each emerging from an
 * overflow mask in sync with the loader wipe. On scroll the lines scrub
 * apart horizontally at different rates and the scene fades - continuous
 * motion tied to scroll position, not a one-shot entrance.
 */

// Loader exit wipe starts ~1.8s, finishes ~2.8s - lines emerge during it.
const LOADER_OFFSET = 2.45;

const lineVariants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      duration: 1.2,
      delay: LOADER_OFFSET + i * 0.12,
      ease: [0.19, 1, 0.22, 1] as const,
    },
  }),
};

const fadeVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: LOADER_OFFSET + d, ease: [0.19, 1, 0.22, 1] as const },
  }),
};

// Per-line horizontal scrub direction multipliers (vw units)
const LINE_DRIFT = [-7, 9, -5];

export function HeroScene() {
  const scrollTo = useLenisScrollTo();

  // Global listener for terminal "goto" commands and command palette
  useEffect(() => {
    function handleScrollTo(e: Event) {
      const { target, userData } = (e as CustomEvent).detail;
      scrollTo(target, { offset: -64, lock: true, userData });
    }
    window.addEventListener("lenis-scroll-to", handleScrollTo);
    return () => window.removeEventListener("lenis-scroll-to", handleScrollTo);
  }, [scrollTo]);

  // Scrub: lines drift apart, content fades as the scene leaves
  const sceneRef = useScrub<HTMLElement>((p) => {
    const el = sceneRef.current;
    if (!el) return;
    // Scene occupies the first viewport: progress past 0.5 = scrolling away
    const out = Math.min(1, Math.max(0, (p - 0.5) * 2));
    const lines = el.querySelectorAll<HTMLElement>("[data-hero-line]");
    lines.forEach((line, i) => {
      line.style.transform = `translate3d(${out * LINE_DRIFT[i % LINE_DRIFT.length]}vw, 0, 0)`;
    });
    const fade = el.querySelector<HTMLElement>("[data-hero-fade]");
    if (fade) fade.style.opacity = `${1 - out * 1.15}`;
  });

  return (
    <section
      ref={sceneRef}
      id="home"
      className="scene flex min-h-screen flex-col justify-between"
      style={{ paddingTop: "64px" }}
    >
      {/* Ambient gradient blobs */}
      <div className="hero-blob hero-blob--a" aria-hidden />
      <div className="hero-blob hero-blob--b" aria-hidden />

      <div data-hero-fade className="relative z-10 flex flex-1 flex-col justify-between will-change-[opacity]">
        {/* ── Meta row ── */}
        <div className="flex items-center justify-between px-6 pt-6 lg:px-10">
          <motion.span custom={1.0} variants={fadeVariants} initial="hidden" animate="visible" className="meta-label">
            Irving, TX
          </motion.span>
        </div>

        {/* ── Name lockup - edge to edge ── */}
        <div className="flex flex-col px-3 lg:px-6" style={{ gap: "0.5vw" }}>
          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block will-change-transform">
              <motion.span
                custom={0}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="display block"
                style={{ fontSize: "clamp(4rem, 14.5vw, 15rem)" }}
              >
                Pavan
              </motion.span>
            </span>
          </span>

          <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <span data-hero-line className="block will-change-transform">
              <motion.span
                custom={1}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="display display-outline block text-right"
                style={{ fontSize: "clamp(4rem, 14.5vw, 15rem)" }}
              >
                Sai&nbsp;Reddy
              </motion.span>
            </span>
          </span>

          <span className="block overflow-hidden pb-[0.12em] -mb-[0.08em]">
            <span data-hero-line className="block will-change-transform">
              <motion.span
                custom={2}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="display flex flex-wrap items-baseline"
                style={{ fontSize: "clamp(4rem, 14.5vw, 15rem)", gap: "0 3vw" }}
              >
                Pendry
                <span
                  className="serif-accent text-muted"
                  style={{ fontSize: "clamp(1.1rem, 2.4vw, 2.5rem)", lineHeight: 1.1 }}
                >
                  software engineer × ai/ml
                </span>
              </motion.span>
            </span>
          </span>
        </div>

        {/* ── Bottom row ── */}
        <div className="flex flex-wrap items-end justify-between gap-6 px-6 pb-10 lg:px-10">
          <motion.div custom={1.2} variants={fadeVariants} initial="hidden" animate="visible" className="flex items-center gap-3">
            <span className="meta-label">Scroll</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="block h-6 w-px bg-gradient-to-b from-dimmed to-transparent"
            />
          </motion.div>

          <motion.p
            custom={1.3}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xs text-sm leading-relaxed text-muted"
          >
            {siteConfig.description}
          </motion.p>

          <motion.div custom={1.4} variants={fadeVariants} initial="hidden" animate="visible" className="flex items-center gap-6">
            <a
              href="#projects"
              data-magnetic
              onClick={(e) => { e.preventDefault(); scrollTo("#projects", { offset: -64 }); }}
              className="link-draw meta-label !text-heading"
            >
              View work
            </a>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="link-draw meta-label">
              GitHub
            </a>
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="link-draw meta-label">
              LinkedIn
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

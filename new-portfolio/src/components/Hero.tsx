"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/data";

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
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Radial spotlight */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[900px] bg-gradient-to-b from-purple-500/[0.08] via-transparent to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2 text-sm text-zinc-400 backdrop-blur-sm"
        >
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-purple-400" />
          Computer Science · AI/ML · Full-Stack
        </motion.div>

        {/* Title */}
        <h1 className="mb-8">
          <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {words.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className={`text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl ${
                  word === "Pendry"
                    ? "bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent"
                    : "text-white"
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
          className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 leading-relaxed sm:text-xl"
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
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
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
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-7 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white"
          >
            GitHub
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-7 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white"
          >
            LinkedIn
          </a>
        </motion.div>

        {/* Code editor card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-lg"
        >
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d0d14] shadow-2xl shadow-purple-500/[0.03]">
            {/* Tab bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="rounded bg-white/[0.06] px-3 py-1 text-xs text-zinc-400">portfolio.tsx</span>
              <span className="px-3 py-1 text-xs text-zinc-600">config.ts</span>
            </div>
            {/* Code */}
            <div className="p-5 font-mono text-sm leading-7">
              <div><span className="text-zinc-600 mr-4">1</span><span className="text-purple-400">const</span> <span className="text-blue-300">dev</span> <span className="text-zinc-500">=</span> <span className="text-zinc-400">{"{"}</span></div>
              <div><span className="text-zinc-600 mr-4">2</span>  <span className="text-zinc-300">name</span><span className="text-zinc-500">:</span> <span className="text-green-300">&quot;Pavan Sai&quot;</span><span className="text-zinc-500">,</span></div>
              <div><span className="text-zinc-600 mr-4">3</span>  <span className="text-zinc-300">role</span><span className="text-zinc-500">:</span> <span className="text-green-300">&quot;Software Engineer&quot;</span><span className="text-zinc-500">,</span></div>
              <div><span className="text-zinc-600 mr-4">4</span>  <span className="text-zinc-300">stack</span><span className="text-zinc-500">:</span> <span className="text-zinc-400">[</span><span className="text-green-300">&quot;React&quot;</span><span className="text-zinc-500">,</span> <span className="text-green-300">&quot;Python&quot;</span><span className="text-zinc-500">,</span> <span className="text-green-300">&quot;AI/ML&quot;</span><span className="text-zinc-400">]</span><span className="text-zinc-500">,</span></div>
              <div><span className="text-zinc-600 mr-4">5</span>  <span className="text-zinc-300">focus</span><span className="text-zinc-500">:</span> <span className="text-green-300">&quot;autonomous systems&quot;</span><span className="text-zinc-500">,</span></div>
              <div><span className="text-zinc-600 mr-4">6</span>  <span className="text-zinc-300">status</span><span className="text-zinc-500">:</span> <span className="text-green-300">&quot;building&quot;</span><span className="text-zinc-500">,</span></div>
              <div><span className="text-zinc-600 mr-4">7</span><span className="text-zinc-400">{"}"}</span><span className="text-zinc-500">;</span></div>
            </div>
            {/* Status bar */}
            <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-1.5 text-xs text-zinc-600">
              <span>TypeScript</span>
              <span>UTF-8</span>
              <span>Ln 7, Col 3</span>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <span className="text-xs tracking-widest text-zinc-600 uppercase">Scroll</span>
          <motion.div
            animate={{ height: [16, 32, 16] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px bg-gradient-to-b from-zinc-600 to-transparent"
          />
        </motion.div>
      </div>
    </section>
  );
}

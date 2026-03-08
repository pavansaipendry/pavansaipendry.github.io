"use client";

import { siteConfig } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <span className="text-lg font-semibold text-white">
              pavan<span className="text-purple-400">.</span>
            </span>
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">
              Software Engineer & AI/ML — building scalable autonomous systems.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-zinc-300">Navigation</h4>
            <div className="flex flex-col gap-2">
              {["About", "Skills", "Experience", "Projects"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-zinc-500 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-zinc-300">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-zinc-500 transition-colors hover:text-white">
                Email
              </a>
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors hover:text-white">
                LinkedIn
              </a>
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors hover:text-white">
                GitHub
              </a>
              <a href="https://babyjay.bot" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-500 transition-colors hover:text-white">
                BabyJay
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
          <p className="text-xs text-zinc-600">
            &copy; 2026 Pavan Sai Reddy Pendry. Built with Next.js & Tailwind CSS.
          </p>
          <p className="text-xs text-zinc-600">Lawrence, Kansas</p>
        </div>
      </div>
    </footer>
  );
}

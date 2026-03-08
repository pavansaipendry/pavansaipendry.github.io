"use client";

import { siteConfig } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-card-border px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 sm:grid-cols-3">
          <div>
            <span className="text-lg font-semibold text-heading">
              pavan<span className="text-accent">.</span>
            </span>
            <p className="mt-3 text-sm text-dimmed leading-relaxed">
              Software Engineer & AI/ML — building scalable autonomous systems.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Navigation</h4>
            <div className="flex flex-col gap-2">
              {["About", "Skills", "Experience", "Projects"].map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="text-sm text-dimmed transition-colors hover:text-heading"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">Connect</h4>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${siteConfig.email}`} className="text-sm text-dimmed transition-colors hover:text-heading">
                Email
              </a>
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-dimmed transition-colors hover:text-heading">
                LinkedIn
              </a>
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="text-sm text-dimmed transition-colors hover:text-heading">
                GitHub
              </a>
              <a href="https://babyjay.bot" target="_blank" rel="noopener noreferrer" className="text-sm text-dimmed transition-colors hover:text-heading">
                BabyJay
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-card-border pt-8">
          <p className="text-xs text-dimmed">
            &copy; 2026 Pavan Sai Reddy Pendry. Built with Next.js & Tailwind CSS.
          </p>
          <p className="text-xs text-dimmed">Lawrence, Kansas</p>
        </div>
      </div>
    </footer>
  );
}

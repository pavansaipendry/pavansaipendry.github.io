"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/data";
import { useLenisScrollTo } from "./SmoothScroll";

/**
 * Footer - curtain reveal.
 *
 * The outer wrapper has clip-path: inset(0), which makes it the containing
 * block for the fixed inner panel. The panel sits pinned to the viewport
 * bottom, so the page content scrolls up and *uncovers* it. Wrapper height
 * is measured from the content via ResizeObserver.
 */
export function Footer() {
  const scrollTo = useLenisScrollTo();
  const contentRef = useRef<HTMLDivElement>(null);
  const [panelH, setPanelH] = useState<number | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setPanelH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function handleNavClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    scrollTo(href, { offset: -64 });
  }

  return (
    <footer
      className="relative"
      style={{ height: panelH ?? "auto", clipPath: "inset(0 0 0 0)" }}
    >
      <div
        ref={contentRef}
        className={panelH ? "fixed bottom-0 left-0 w-full" : ""}
        style={{ background: "var(--background-alt)" }}
      >
        <div
          className="px-6 lg:px-10"
          style={{ paddingTop: "clamp(64px, 10vh, 120px)", paddingBottom: "40px" }}
        >
          {/* ── Oversized lockup ── */}
          <p className="meta-label mb-4">Have an idea?</p>
          <h2 className="display" style={{ fontSize: "clamp(3rem, 10.5vw, 11rem)" }}>
            Let&rsquo;s work
            <span className="serif-accent block text-accent" style={{ fontSize: "0.85em" }}>
              together.
            </span>
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            data-magnetic
            className="link-draw mt-8 inline-block text-lg text-muted transition-colors hover:text-heading"
          >
            {siteConfig.email}
          </a>

          {/* ── Nav + connect columns ── */}
          <div className="mt-16 grid gap-12 border-t border-card-border pt-12 sm:grid-cols-3">
            <div>
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, "#home")}
                className="text-lg font-semibold text-heading transition-opacity hover:opacity-80 cursor-pointer"
              >
                pavan<span className="text-accent">.</span>
              </a>
              <p className="mt-3 text-sm text-dimmed leading-relaxed">
                Software Engineer & AI/ML - building AI systems from paper to production.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-foreground">Navigation</h4>
              <div className="flex flex-col items-start gap-2">
                {["About", "Skills", "Experience", "Projects"].map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, `#${link.toLowerCase()}`)}
                    className="link-draw text-sm text-dimmed transition-colors hover:text-heading cursor-pointer"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-foreground">Connect</h4>
              <div className="flex flex-col items-start gap-2">
                <a href={`mailto:${siteConfig.email}`} className="link-draw text-sm text-dimmed transition-colors hover:text-heading">
                  Email
                </a>
                <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-dimmed transition-colors hover:text-heading">
                  LinkedIn
                </a>
                <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-dimmed transition-colors hover:text-heading">
                  GitHub
                </a>
                <a href="https://babyjay.bot" target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-dimmed transition-colors hover:text-heading">
                  BabyJay
                </a>
                <a href="/resume/Pavan_Pendry_Resume.pdf" target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-dimmed transition-colors hover:text-heading">
                  Resume - SWE + ML
                </a>
                <a href="/resume/Pavan_Pendry_GenAI_Resume.pdf" target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-dimmed transition-colors hover:text-heading">
                  Resume - Gen AI
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-card-border pt-8">
            <p className="text-xs text-dimmed">
              &copy; 2026 Pavan Sai Reddy Pendry. Built with Next.js & Tailwind CSS.
            </p>
            <button
              data-magnetic
              onClick={() => scrollTo("top", {
                duration: 2.5,
                lock: true,
                easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out quart
              })}
              className="group flex items-center gap-2 text-xs text-dimmed transition-colors hover:text-heading"
            >
              Back to top
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="transition-transform group-hover:-translate-y-1"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

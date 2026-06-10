"use client";

import { useEffect, useRef, ReactNode } from "react";

/**
 * AppearTitle - Lenis-style line-by-line staggered text reveal.
 * Splits children text into lines via a hidden measuring pass,
 * then reveals each line with a staggered slide-up on intersection.
 * Desktop only - on mobile, text just fades in normally.
 */

interface AppearTitleProps {
  children: ReactNode;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  className?: string;
  /** Stagger delay per line in ms (default 80) */
  stagger?: number;
  /** IntersectionObserver threshold (default 0.2) */
  threshold?: number;
}

export function AppearTitle({
  children,
  tag: Tag = "h2",
  className = "",
  stagger = 80,
  threshold = 0.2,
}: AppearTitleProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hasRevealedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Skip on mobile (< 1024px) or reduced motion - just show normally
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (window.innerWidth < 1024 || reducedMotion) {
      container.style.opacity = "1";
      return;
    }

    // ── Step 1: Split text into lines ──
    // Get all text content, put each word in a span, then measure
    // which words share the same offsetTop to determine line breaks.
    const text = container.textContent || "";
    const words = text.split(/\s+/).filter(Boolean);

    // Clear container and insert word spans for measurement
    container.innerHTML = "";
    container.style.opacity = "1"; // make visible for measurement
    container.style.visibility = "hidden"; // but not seen

    const wordSpans: HTMLSpanElement[] = [];
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.style.display = "inline";
      span.style.whiteSpace = "nowrap";
      span.textContent = word + (i < words.length - 1 ? "\u00A0" : "");
      container.appendChild(span);
      wordSpans.push(span);
    });

    // Group words by their offsetTop → lines
    const lines: string[][] = [];
    let currentTop = -1;
    let currentLine: string[] = [];

    wordSpans.forEach((span, i) => {
      const top = span.offsetTop;
      if (top !== currentTop) {
        if (currentLine.length > 0) lines.push(currentLine);
        currentLine = [];
        currentTop = top;
      }
      currentLine.push(words[i]);
    });
    if (currentLine.length > 0) lines.push(currentLine);

    // ── Step 2: Rebuild with line wrappers ──
    container.innerHTML = "";
    container.style.visibility = "";

    const lineEls: HTMLDivElement[] = [];
    lines.forEach((lineWords, i) => {
      // Outer clip wrapper - padding/negative-margin keeps descenders
      // (g, j, y) from being shaved off by the overflow clip at rest
      const clipDiv = document.createElement("div");
      clipDiv.style.overflow = "hidden";
      clipDiv.style.display = "block";
      clipDiv.style.paddingBottom = "0.12em";
      clipDiv.style.marginBottom = "-0.12em";

      // Inner animated line - pure mask slide, no opacity fade
      const lineDiv = document.createElement("div");
      lineDiv.style.transform = "translateY(115%)";
      lineDiv.style.transition = `transform 0.9s cubic-bezier(0.19, 1, 0.22, 1) ${i * stagger}ms`;
      lineDiv.textContent = lineWords.join(" ");

      clipDiv.appendChild(lineDiv);
      container.appendChild(clipDiv);
      lineEls.push(lineDiv);
    });

    // ── Step 3: Intersection Observer triggers reveal ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRevealedRef.current) {
            hasRevealedRef.current = true;
            lineEls.forEach((el) => {
              el.style.transform = "translateY(0)";
            });
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [stagger, threshold]);

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      className={className}
      style={{ opacity: 0 }}
      role={Tag === "h1" || Tag === "h2" || Tag === "h3" ? "heading" : undefined}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useScrub } from "./SmoothScroll";

/**
 * Manifesto - scroll-driven horizontal statement.
 *
 * The scene pins for ~3 viewports while one huge single-line sentence travels
 * right-to-left, its position scrubbed 1:1 to scroll progress. Enters from
 * off-screen right at the top of the pin, fully exits left at the bottom.
 */

const SEGMENTS: { text: string; accent?: boolean }[] = [
  { text: "I build " },
  { text: "AI systems", accent: true },
  { text: " that retrieve, reason, and ship - from " },
  { text: "paper", accent: true },
  { text: " to " },
  { text: "production.", accent: true },
];

export function Manifesto() {
  const trackRef = useRef<HTMLDivElement>(null);
  const widthRef = useRef(0);

  // Cache the track width - reading scrollWidth every scroll frame would
  // force a layout each tick
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      widthRef.current = el.scrollWidth;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const wrapRef = useScrub<HTMLDivElement>((p) => {
    const track = trackRef.current;
    if (!track) return;
    const vw = window.innerWidth;
    const w = widthRef.current || track.scrollWidth;
    // p=0: left edge just inside the right viewport edge.
    // p=1: right edge fully past the left viewport edge.
    const startX = vw * 0.85;
    const tx = startX - p * (startX + w);
    track.style.transform = `translate3d(${tx}px, 0, 0)`;
  }, "pin");

  return (
    <div ref={wrapRef} className="relative" style={{ height: "300vh" }}>
      {/* NOT .scene here - .scene sets position:relative which would override sticky */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <span className="meta-label absolute left-6 top-28 lg:left-10">
          01 - Manifesto
        </span>

        <div
          ref={trackRef}
          className="display whitespace-nowrap will-change-transform"
          style={{
            fontSize: "clamp(4.5rem, 13vw, 15rem)",
            lineHeight: 1,
            textTransform: "none",
            letterSpacing: "-0.02em",
            transform: "translate3d(100vw, 0, 0)",
          }}
        >
          {SEGMENTS.map((seg, i) => (
            <span key={i} className={seg.accent ? "serif-accent text-accent" : undefined}>
              {seg.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

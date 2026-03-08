"use client";

import { useRef, useState, useEffect } from "react";

interface SectionHeaderProps {
  number: string;
  title: string;
}

export function SectionHeader({ number, title }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: "-65px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // One-shot reveal for the line
  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [revealed]);

  return (
    <>
      <div ref={ref} className="h-0 w-full" />
      <div
        className={`sticky top-16 z-30 mb-16 flex items-center gap-4 py-4 transition-all duration-300 ${
          stuck
            ? "bg-background/80 backdrop-blur-xl border-b border-card-border -mx-6 px-6"
            : ""
        }`}
      >
        <span className="font-mono text-sm text-accent">{number}</span>
        <h2 className="text-3xl font-bold tracking-tight text-heading sm:text-4xl">
          {title}
        </h2>
        <div className="flex-1 overflow-hidden">
          <div
            className="h-px origin-left bg-gradient-to-r from-accent/40 via-card-border to-transparent transition-transform duration-700 ease-out"
            style={{
              transform: revealed ? "scaleX(1)" : "scaleX(0)",
              transitionDelay: revealed ? "0.3s" : "0s",
            }}
          />
        </div>
      </div>
    </>
  );
}

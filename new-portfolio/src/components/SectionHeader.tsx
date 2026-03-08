"use client";

import { useRef, useState, useEffect } from "react";

interface SectionHeaderProps {
  number: string;
  title: string;
}

export function SectionHeader({ number, title }: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is not intersecting, the header is stuck
        setStuck(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: "-65px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel element to detect when header becomes sticky */}
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
        <div className="h-px flex-1 bg-gradient-to-r from-card-border to-transparent" />
      </div>
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useLenisCtx } from "./SmoothScroll";

export function GridBackground() {
  const { lenis } = useLenisCtx();
  const topGlowRef = useRef<HTMLDivElement>(null);
  const bottomGlowRef = useRef<HTMLDivElement>(null);

  // Parallax the background glows - direct DOM, no setState
  useEffect(() => {
    if (!lenis) return;

    function onScroll() {
      const scroll = lenis!.animatedScroll;
      if (topGlowRef.current) {
        topGlowRef.current.style.transform = `translate3d(-50%, ${scroll * 0.08}px, 0)`;
      }
      if (bottomGlowRef.current) {
        bottomGlowRef.current.style.transform = `translate3d(0, ${scroll * -0.04}px, 0)`;
      }
    }

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--dimmed) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Top radial glow - parallax */}
      <div
        ref={topGlowRef}
        className="absolute -top-[40%] left-1/2 w-[80vw] h-[80vw] rounded-full bg-gradient-to-b from-purple-500/[0.07] via-transparent to-transparent blur-3xl will-change-transform"
      />
      {/* Bottom accent glow - parallax */}
      <div
        ref={bottomGlowRef}
        className="absolute -bottom-[20%] right-0 w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-blue-500/[0.05] via-transparent to-transparent blur-3xl will-change-transform"
      />
    </div>
  );
}

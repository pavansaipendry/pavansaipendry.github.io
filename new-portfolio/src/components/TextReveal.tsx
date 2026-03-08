"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: import("framer-motion").MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const color = useTransform(
    opacity,
    [0.15, 1],
    ["var(--dimmed)", "var(--heading)"]
  );

  return (
    <motion.span style={{ color, opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export function TextReveal({ text, className = "" }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.4"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={className}>
      <p className="text-xl font-medium leading-relaxed flex flex-wrap">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = (i + 1) / words.length;
          return (
            <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          );
        })}
      </p>
    </div>
  );
}

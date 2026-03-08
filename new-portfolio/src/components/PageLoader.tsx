"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PageLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
        >
          <svg
            width="120"
            height="48"
            viewBox="0 0 120 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* P */}
            <motion.path
              d="M4 44V4h12a10 10 0 0 1 0 20H4"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
            {/* S */}
            <motion.path
              d="M58 12a8 8 0 0 0-8-8h-4a8 8 0 0 0 0 16h4a8 8 0 0 1 0 16h-4a8 8 0 0 1-8-8"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            />
            {/* R */}
            <motion.path
              d="M72 44V4h12a10 10 0 0 1 0 20H72l14 20"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.6, ease: "easeInOut" }}
            />
          </svg>

          {/* Subtle pulsing dot below */}
          <motion.div
            className="absolute bottom-1/3 h-1 w-1 rounded-full bg-accent"
            animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

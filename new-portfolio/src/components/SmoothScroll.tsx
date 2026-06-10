"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import Lenis from "lenis";

import "lenis/dist/lenis.css";

// ─── Lenis Context ──────────────────────────────────────────────────────────
// Only stores the lenis instance (stable ref). Scroll data is NOT stored in
// React state - components that need scroll data subscribe directly via
// lenis.on("scroll") and mutate the DOM, avoiding full-tree re-renders.

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export function useLenisCtx() {
  return useContext(LenisContext);
}

// ─── Provider ───────────────────────────────────────────────────────────────

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const ctxRef = useRef<LenisContextValue>({ lenis: null });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Under reduced motion, keep Lenis (scroll-driven sections depend on its
    // events) but kill all smoothing/inertia - scroll becomes 1:1.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      autoRaf: true,
      ...(reducedMotion ? { lerp: 1, smoothWheel: false } : {}),
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: true,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.5,
      wheelMultiplier: 1.2,
      anchors: {
        offset: -64,
        duration: 1.0,
      },
      prevent: (node: HTMLElement) =>
        node.closest("[data-lenis-prevent]") !== null,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      overscroll: false,
    });

    lenisRef.current = lenis;
    ctxRef.current = { lenis };

    // Force a re-render once so context consumers get the lenis instance
    // We do this via a minimal state update in the parent - but only ONCE.
    setLenisState({ lenis });

    const root = document.documentElement;

    // ── Scroll handler - direct DOM mutations only, no React setState ──
    lenis.on("scroll", (e: Lenis) => {
      // CSS custom properties
      root.style.setProperty("--lenis-scroll", `${e.scroll}`);
      root.style.setProperty("--lenis-progress", `${e.progress}`);
      root.style.setProperty("--lenis-velocity", `${e.velocity}`);
      root.style.setProperty("--lenis-direction", `${e.direction}`);

      // Velocity classes
      const absVel = Math.abs(e.velocity);
      root.classList.toggle("is-scrolling", !!e.isScrolling);
      root.classList.toggle("scroll-fast", absVel > 2);
      root.classList.toggle("scroll-slow", absVel > 0.3 && absVel <= 2);

      // Progress bar - direct DOM, no state
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${e.progress})`;
      }
      if (progressWrapRef.current) {
        const show = e.progress > 0.005 && e.progress < 0.995;
        progressWrapRef.current.style.opacity = show ? "1" : "0";
        const h = 2 + Math.min(absVel, 5) * 1.5;
        progressWrapRef.current.style.height = `${h}px`;
      }
    });

    // ── Overscroll rubber-band feedback ──
    lenis.on(
      "virtual-scroll",
      (e: { deltaX: number; deltaY: number; event: Event }) => {
        if (lenis.scroll <= 0 && e.deltaY < 0) {
          root.classList.add("overscroll-top");
          setTimeout(() => root.classList.remove("overscroll-top"), 400);
        }
        if (lenis.scroll >= lenis.limit - 1 && e.deltaY > 0) {
          root.classList.add("overscroll-bottom");
          setTimeout(() => root.classList.remove("overscroll-bottom"), 400);
        }
      }
    );

    return () => {
      root.classList.remove(
        "is-scrolling",
        "scroll-fast",
        "scroll-slow",
        "is-snapping",
        "overscroll-top",
        "overscroll-bottom"
      );
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Single state update - only fires once when lenis initializes
  const [lenisState, setLenisState] = React.useState<LenisContextValue>({
    lenis: null,
  });

  return (
    <LenisContext.Provider value={lenisState}>
      {children}
      {/* Progress bar - fully DOM-driven, no re-renders */}
      <div
        ref={progressWrapRef}
        className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
        style={{
          height: "2px",
          opacity: 0,
          transition: "opacity 0.4s ease, height 0.15s ease",
        }}
      >
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-accent via-purple-400 to-blue-400 origin-left will-change-transform"
        />
      </div>
    </LenisContext.Provider>
  );
}

// Need React for useState
import React from "react";

// ─── scrollTo with full options ─────────────────────────────────────────────

export function useLenisScrollTo() {
  const { lenis } = useLenisCtx();

  return useCallback(
    (
      target: string | HTMLElement | number,
      options?: {
        offset?: number;
        duration?: number;
        immediate?: boolean;
        lock?: boolean;
        force?: boolean;
        easing?: (t: number) => number;
        onComplete?: () => void;
        userData?: Record<string, unknown>;
      }
    ) => {
      if (!lenis) {
        if (typeof target === "string") {
          document
            .querySelector(target)
            ?.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      lenis.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.0,
        immediate: options?.immediate ?? false,
        lock: options?.lock ?? false,
        force: options?.force ?? false,
        easing: options?.easing,
        onComplete: options?.onComplete,
        userData: options?.userData,
      });
    },
    [lenis]
  );
}

// ─── Parallax hook (direct DOM mutation, no React re-renders) ────────────────
// Returns { ref, offset } for backwards compat. The ref'd element gets its
// transform updated directly via DOM on every Lenis tick - no setState.
// `offset` is a ref object (.current) for components that need the raw value.

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const { lenis } = useLenisCtx();

  useEffect(() => {
    if (!lenis) return;

    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      const distance = elCenter - viewportCenter;
      const offset = distance * speed * -0.15;
      offsetRef.current = offset;
      // Use a CSS custom property so it doesn't clobber other transforms
      el.style.setProperty("--parallax-y", `${offset}px`);
    }

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, speed]);

  // offset=0 for compat - actual movement is via direct DOM
  return { ref, offset: 0 };
}

// ─── Scrub hook - continuous scroll-driven progress, GSAP-ScrollTrigger style ─
// Calls `onProgress(p, el)` on every Lenis tick with p in [0,1].
//   mode "view": p=0 when the element's top enters the viewport bottom,
//                p=1 when its bottom leaves the viewport top. For free scenes.
//   mode "pin":  p=0 when the element's top reaches the viewport top,
//                p=1 when its bottom reaches the viewport bottom. For tall
//                wrappers with a sticky child (pinned scenes).
// The callback must mutate the DOM directly - no React state.

export function useScrub<T extends HTMLElement = HTMLDivElement>(
  onProgress: (progress: number, el: T) => void,
  mode: "view" | "pin" = "view"
) {
  const ref = useRef<T>(null);
  const { lenis } = useLenisCtx();
  const cbRef = useRef(onProgress);
  cbRef.current = onProgress;

  useEffect(() => {
    if (!lenis) return;
    const el = ref.current;
    if (!el) return;

    function onScroll() {
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight;
      let p: number;
      if (mode === "pin") {
        const total = rect.height - vh;
        p = total > 0 ? -rect.top / total : 0;
      } else {
        p = (vh - rect.top) / (rect.height + vh);
      }
      cbRef.current(Math.min(1, Math.max(0, p)), el!);
    }

    lenis.on("scroll", onScroll);
    onScroll();
    return () => lenis.off("scroll", onScroll);
  }, [lenis, mode]);

  return ref;
}

// ─── Scroll velocity hook ───────────────────────────────────────────────────

export function useScrollVelocity() {
  const { lenis } = useLenisCtx();
  const data = useRef({ velocity: 0, direction: 1, isScrolling: false });

  useEffect(() => {
    if (!lenis) return;
    function onScroll(e: Lenis) {
      data.current.velocity = e.velocity;
      data.current.direction = e.direction;
      data.current.isScrolling = !!e.isScrolling;
    }
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return data;
}

// ─── Direction-aware hook ───────────────────────────────────────────────────

export function useScrollDirection(onUp?: () => void, onDown?: () => void) {
  const { lenis } = useLenisCtx();
  const prevDir = useRef(1);

  useEffect(() => {
    if (!lenis) return;

    function onScroll(e: Lenis) {
      if (e.direction !== prevDir.current) {
        prevDir.current = e.direction;
        if (e.direction === -1) onUp?.();
        if (e.direction === 1) onDown?.();
      }
    }

    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis, onUp, onDown]);
}

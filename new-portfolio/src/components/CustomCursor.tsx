"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor - dot + trailing ring.
 *
 * - Dot tracks the pointer 1:1; ring lerps behind and stretches with velocity.
 * - Hover states via event delegation: links/buttons grow the ring,
 *   [data-cursor="view"] morphs it into a filled "View" badge.
 * - [data-magnetic] elements lean toward the cursor while hovered.
 * - Desktop fine-pointer only; disabled entirely under prefers-reduced-motion.
 *
 * All per-frame work is direct DOM mutation - no React state in the loop.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let visible = false;
    let rafId = 0;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        ringX = mouseX;
        ringY = mouseY;
        root.classList.add("cc-visible");
      }
    }

    function onMouseLeave(e: MouseEvent) {
      // Only when actually leaving the window
      if (!e.relatedTarget) {
        visible = false;
        root.classList.remove("cc-visible");
      }
    }

    function onMouseDown() {
      root.classList.add("cc-press");
    }
    function onMouseUp() {
      root.classList.remove("cc-press");
    }

    // ── Hover mode via delegation ──
    function onMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) {
        root.classList.add("cc-view");
        root.classList.remove("cc-hover");
      } else if (target.closest('a, button, [role="button"], [data-cursor="hover"]')) {
        root.classList.add("cc-hover");
        root.classList.remove("cc-view");
      } else {
        root.classList.remove("cc-hover", "cc-view");
      }
    }

    // ── Magnetic pull ──
    let magnetEl: HTMLElement | null = null;

    function onMagnetOver(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
      if (target && target !== magnetEl) {
        if (magnetEl) releaseMagnet(magnetEl);
        magnetEl = target;
        magnetEl.style.transition = "transform 0.2s ease-out";
      } else if (!target && magnetEl) {
        releaseMagnet(magnetEl);
        magnetEl = null;
      }
    }

    function releaseMagnet(el: HTMLElement) {
      el.style.transition = "transform 0.55s cubic-bezier(.19,1,.22,1)";
      el.style.transform = "translate3d(0,0,0)";
    }

    function pullMagnet() {
      if (!magnetEl) return;
      const rect = magnetEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (mouseX - cx) * 0.25;
      const dy = (mouseY - cy) * 0.25;
      magnetEl.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }

    // ── RAF loop - dot snaps, ring lerps + stretches ──
    function frame() {
      const prevX = ringX;
      const prevY = ringY;
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      const vx = ringX - prevX;
      const vy = ringY - prevY;
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed * 0.012, 0.35);
      const angle = Math.atan2(vy, vx);

      dot!.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;

      const w = ring!.offsetWidth;
      const h = ring!.offsetHeight;
      ring!.style.transform =
        `translate3d(${ringX - w / 2}px, ${ringY - h / 2}px, 0) ` +
        `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch}) rotate(${-angle}rad)`;

      pullMagnet();
      rafId = requestAnimationFrame(frame);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseover", onMagnetOver, { passive: true });
    document.addEventListener("mouseout", onMouseLeave);
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseover", onMagnetOver);
      document.removeEventListener("mouseout", onMouseLeave);
      root.classList.remove(
        "has-custom-cursor", "cc-visible", "cc-hover", "cc-view", "cc-press"
      );
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cc-ring" aria-hidden>
        <span className="cc-label">View</span>
      </div>
      <div ref={dotRef} className="cc-dot" aria-hidden />
    </>
  );
}

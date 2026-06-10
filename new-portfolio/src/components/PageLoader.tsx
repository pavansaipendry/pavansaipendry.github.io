"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PageLoader - Clean & Confident
 *
 * 1. "PSR" fades in - thin, elegant
 * 2. Glitch text cycles underneath: Software Engineer → AI/ML → Full-Stack → ...
 * 3. Everything fades out with a gentle upward drift
 * 4. Circular clip-path iris closes to reveal hero
 */
export function PageLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Reduced motion: skip the loader entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const maybeContainer = containerRef.current;
    const maybeCanvas = canvasRef.current;
    if (!maybeContainer || !maybeCanvas) return;
    const container: HTMLDivElement = maybeContainer;
    const canvas: HTMLCanvasElement = maybeCanvas;

    // Explicit type so hoisted draw functions see a non-null ctx -
    // narrowing from a plain null-check doesn't reach function declarations
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx: CanvasRenderingContext2D = maybeCtx;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;

    let phase: "intro" | "hold" | "exit" | "done" = "intro";
    let phaseStart = 0;
    let startTime = 0;
    let animId = 0;

    // ── Glitch text ──
    const titles = [
      "SOFTWARE ENGINEER",
      "AI / ML ENGINEER",
      "FULL-STACK DEV",
      "SYSTEM ARCHITECT",
      "SOFTWARE ENGINEER",
    ];
    const glitchChars = "!@#$%^&*_+-=|;:<>?/~01";
    let titleIdx = 0;
    let glitchProgress = 0;
    let lastSwitch = 0;
    const titleDur = 550;

    function glitchedText(target: string, progress: number): string {
      return target
        .split("")
        .map((ch, i) => {
          if (ch === " " || ch === "/") return ch;
          const t = (i / target.length) * 0.7;
          return progress > t ? ch : glitchChars[Math.floor(Math.random() * glitchChars.length)];
        })
        .join("");
    }

    // ── Render helpers ──
    function drawPSR(alpha: number, yOffset: number = 0) {
      const size = Math.min(w * 0.14, 96);
      const spacing = size * 0.4;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = "#ffffff";
      ctx.font = `200 ${size}px -apple-system, "Helvetica Neue", Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = "PSR";
      const chars = text.split("");
      const totalW = chars.reduce((s, ch) => s + ctx.measureText(ch).width + spacing, -spacing);
      let curX = cx - totalW / 2;
      for (const ch of chars) {
        const cw = ctx.measureText(ch).width;
        ctx.fillText(ch, curX + cw / 2, cy - 14 + yOffset);
        curX += cw + spacing;
      }
      ctx.restore();
    }

    function drawGlitchSub(elapsed: number, alpha: number, yOffset: number = 0) {
      if (alpha <= 0) return;

      if (elapsed - lastSwitch > titleDur) {
        lastSwitch = elapsed;
        titleIdx = (titleIdx + 1) % titles.length;
        glitchProgress = 0;
      }
      glitchProgress = Math.min(glitchProgress + 0.045, 1);

      const text = glitchedText(titles[titleIdx], glitchProgress);
      const size = Math.min(w * 0.0105, 10.5);
      const yPos = cy + Math.min(w * 0.14, 96) * 0.45 + yOffset;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `400 ${size}px ui-monospace, "SF Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.25em";

      // Glitch: random chromatic split
      const isGlitching = Math.random() > 0.82 && glitchProgress < 0.75;
      if (isGlitching) {
        const off = (Math.random() - 0.5) * 3;
        ctx.fillStyle = "rgba(255, 60, 60, 0.5)";
        ctx.fillText(text, cx + off, yPos);
        ctx.fillStyle = "rgba(60, 60, 255, 0.5)";
        ctx.fillText(text, cx - off, yPos);
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fillText(text, cx, yPos);

      // Occasional scanline
      if (Math.random() > 0.92) {
        ctx.fillStyle = "rgba(124, 92, 252, 0.06)";
        ctx.fillRect(cx - 90, yPos - 5 + Math.random() * 10, 180, 1);
      }

      ctx.restore();
    }

    function drawLine(alpha: number, yOffset: number = 0) {
      const yPos = cy + Math.min(w * 0.14, 96) * 0.45 + yOffset;
      const lineW = 25;
      const textW = 85;
      ctx.save();
      ctx.globalAlpha = alpha * 0.2;
      ctx.strokeStyle = "#7c5cfc";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - textW - 10, yPos);
      ctx.lineTo(cx - textW - 10 - lineW, yPos);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + textW + 10, yPos);
      ctx.lineTo(cx + textW + 10 + lineW, yPos);
      ctx.stroke();
      ctx.restore();
    }

    // Counter runs through intro + hold (1800ms), pinned at 100 during exit
    const COUNT_DUR = 1800;

    function drawCounter(pct: number, alpha: number, yOffset: number = 0) {
      const size = Math.min(w * 0.05, 52);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = `300 ${size}px ui-monospace, "SF Mono", monospace`;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(String(Math.floor(pct)).padStart(3, "0"), 28, h - 32 + yOffset);

      ctx.fillStyle = "rgba(124, 92, 252, 0.9)";
      ctx.fillRect(0, h - 2 + yOffset, (pct / 100) * w, 2);
      ctx.restore();
    }

    function drawCorners(alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#7c5cfc";
      ctx.lineWidth = 1;
      const s = 20, m = 24;
      ctx.beginPath(); ctx.moveTo(m + s, m); ctx.lineTo(m, m); ctx.lineTo(m, m + s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - m - s, m); ctx.lineTo(w - m, m); ctx.lineTo(w - m, m + s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(m, h - m - s); ctx.lineTo(m, h - m); ctx.lineTo(m + s, h - m); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w - m, h - m - s); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m - s, h - m); ctx.stroke();
      ctx.restore();
    }

    // ── Phase management ──
    function go(p: typeof phase, now: number) { phase = p; phaseStart = now; }

    // ── Main loop ──
    function frame(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const pt = now - phaseStart;

      ctx.clearRect(0, 0, w, h);

      const countPct = Math.min(elapsed / COUNT_DUR, 1) * 100;

      // ── INTRO: fade in PSR + glitch text (0-1.4s) ──
      if (phase === "intro") {
        if (!phaseStart) phaseStart = now;
        const fadeIn = Math.min(pt / 500, 1);
        const subFade = Math.max(0, Math.min((pt - 250) / 400, 1));

        drawPSR(fadeIn);
        drawGlitchSub(elapsed, subFade * 0.9);
        drawLine(subFade);
        drawCounter(countPct, fadeIn);

        if (pt > 1400) go("hold", now);
      }

      // ── HOLD: everything visible, glitch keeps cycling (0.4s) ──
      if (phase === "hold") {
        drawPSR(1);
        drawGlitchSub(elapsed, 0.9);
        drawLine(1);
        drawCounter(countPct, 1);

        if (pt > 400) go("exit", now);
      }

      // ── EXIT: everything slides up, hero revealed from bottom ──
      if (phase === "exit") {
        // Ease-in-out cubic
        const rawT = Math.min(pt / 1000, 1);
        const eased = rawT < 0.5
          ? 4 * rawT * rawT * rawT
          : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        // Slide the container background up
        const slideY = -eased * h;
        container.style.transform = `translateY(${slideY}px)`;

        // Draw canvas content sliding up at the same rate
        // (canvas stays in viewport, we offset the drawing)
        const contentY = slideY;
        ctx.save();
        ctx.translate(0, contentY);
        drawPSR(1);
        drawGlitchSub(elapsed, 0.9);
        drawLine(1);
        drawCounter(100, 1);
        drawCorners(0.35 * (1 - rawT));
        ctx.restore();

        if (rawT >= 1) {
          ctx.clearRect(0, 0, w, h);
          canvas.style.display = "none";
          container.style.display = "none";
          document.documentElement.style.overflow = "";
          setGone(true);
          return;
        }
      }

      // Corners (not during exit - handled there with translate)
      if (phase !== "done" && phase !== "exit") {
        const ca = phase === "intro"
          ? Math.min(elapsed / 1000, 0.35)
          : 0.35;
        drawCorners(ca);
      }

      if (phase !== "done") animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    const removeTimer = setTimeout(() => {
      document.documentElement.style.overflow = "";
      setGone(true);
    }, 3200);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(removeTimer);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 99999, pointerEvents: "none" }}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0f",
          pointerEvents: "auto",
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

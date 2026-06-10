"use client";

import { useEffect, useRef } from "react";

/**
 * DocAgentDemo - FinDocAgent's loop visualized: a scanner sweeps a 10-K
 * filing, evidence lines light up, and a cited answer assembles on the
 * right. Loops forever; pauses offscreen.
 */
export function DocAgentDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let t = 0;

    // Deterministic doc layout: line widths + which lines are evidence
    const LINES = 22;
    const widths = Array.from({ length: LINES }, (_, i) =>
      0.55 + (Math.abs(Math.sin(i * 7.13)) % 1) * 0.4
    );
    const evidence = [4, 9, 15];

    function frame() {
      if (!running) return;
      t += 1 / 60;
      const cycle = (t % 18) / 18; // 18s loop: slow scan, then the answer assembles

      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (canvas!.width !== w * dpr) {
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      const pad = Math.max(16, w * 0.045);
      ctx!.font = "600 10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(45,212,191,0.9)";
      ctx!.fillText("LIVE - PARSER / RETRIEVER / ANALYZER", pad, pad + 4);

      // Document panel (left)
      const docX = pad;
      const docY = pad + 24;
      const docW = w * 0.46;
      const docH = h - docY - 34;
      ctx!.strokeStyle = "rgba(255,255,255,0.1)";
      ctx!.strokeRect(docX + 0.5, docY + 0.5, docW, docH);
      ctx!.font = "8px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.fillText("FORM 10-K", docX + 8, docY + 14);

      const lineTop = docY + 24;
      const lineGap = (docH - 34) / LINES;
      const scanLine = Math.min(1, cycle / 0.55) * LINES;

      for (let i = 0; i < LINES; i++) {
        const y = lineTop + i * lineGap;
        const isEv = evidence.includes(i);
        const scanned = i < scanLine;
        if (isEv && scanned) {
          ctx!.fillStyle = "rgba(45,212,191,0.55)";
          ctx!.fillRect(docX + 8, y, (docW - 20) * widths[i], Math.max(2, lineGap * 0.4));
        } else {
          ctx!.fillStyle = scanned ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.07)";
          ctx!.fillRect(docX + 8, y, (docW - 20) * widths[i], Math.max(2, lineGap * 0.35));
        }
      }
      // Scanner beam
      if (cycle < 0.55) {
        const sy = lineTop + scanLine * lineGap;
        ctx!.fillStyle = "rgba(45,212,191,0.18)";
        ctx!.fillRect(docX + 1, sy - 6, docW - 2, 12);
      }

      // Answer panel (right)
      const ansX = docX + docW + pad;
      const ansW = w - ansX - pad;
      ctx!.font = "9px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      ctx!.fillText('Q: "What drove revenue growth?"', ansX, docY + 8);

      // Answer lines assemble after scan
      const build = Math.max(0, Math.min(1, (cycle - 0.58) / 0.3));
      const ansLines = 5;
      const shown = Math.floor(build * ansLines);
      for (let i = 0; i < shown; i++) {
        const y = docY + 26 + i * 16;
        const lw = (ansW - 30) * (0.6 + (Math.abs(Math.sin((i + 3) * 5.7)) % 1) * 0.4);
        ctx!.fillStyle = "rgba(255,255,255,0.22)";
        ctx!.fillRect(ansX, y, lw, 5);
        // citation chips on some lines
        if (i === 1 || i === 3) {
          ctx!.fillStyle = "rgba(45,212,191,0.8)";
          ctx!.fillRect(ansX + lw + 6, y - 2, 18, 10);
          ctx!.fillStyle = "rgba(13,13,20,0.95)";
          ctx!.font = "7px ui-monospace, monospace";
          ctx!.fillText(`[${i === 1 ? 1 : 2}]`, ansX + lw + 9, y + 6);
          ctx!.font = "9px ui-monospace, monospace";
        }
      }
      if (build >= 1) {
        ctx!.fillStyle = "rgba(45,212,191,0.9)";
        ctx!.fillText("✓ answer with 2 citations - 92% routing acc", ansX, docY + 26 + ansLines * 16 + 8);
      }

      // Footer
      ctx!.font = "10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      ctx!.fillText("distilbert router -> langgraph agents -> rag over pgvector", pad, h - 16);

      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ background: "#0d0d14" }}
      aria-label="FinDocAgent document analysis visualization"
    />
  );
}

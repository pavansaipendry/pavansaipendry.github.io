"use client";

import { useEffect, useRef } from "react";

/**
 * TrainingRunDemo - a replay of the Reasoning SLM training pipeline:
 * stage strip (data -> dedup -> tokenizer -> pretrain), an animating loss
 * curve, and live counters. Loops forever; pauses offscreen.
 */
export function TrainingRunDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let step = 0;
    let last = 0;
    let acc = 0;
    const TOTAL = 900;
    const STEP_MS = 68; // ~60s for a full run, then a short hold before looping
    const losses: number[] = [];

    function lossAt(s: number) {
      const t = s / TOTAL;
      return 9.2 * Math.exp(-3.1 * t) + 1.6 + (Math.random() - 0.5) * 0.25 * (1 - t * 0.6);
    }

    function draw() {
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

      // Header
      ctx!.font = "600 10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(163,230,53,0.9)";
      ctx!.fillText("LIVE - TRAINING RUN (REPLAY)", pad, pad + 4);

      // Stage strip
      const stages = ["DATA 189M tok", "MINHASH+LSH DEDUP", "BPE 32K", "PRETRAIN 118M"];
      const active = step < 80 ? 0 : step < 160 ? 1 : step < 240 ? 2 : 3;
      let sx = pad;
      const sy = pad + 26;
      ctx!.font = "9px ui-monospace, monospace";
      for (let i = 0; i < stages.length; i++) {
        const on = i === active;
        const tw = ctx!.measureText(stages[i]).width + 16;
        ctx!.fillStyle = on ? "rgba(163,230,53,0.16)" : "rgba(255,255,255,0.04)";
        ctx!.fillRect(sx, sy - 11, tw, 18);
        ctx!.fillStyle = on ? "rgba(163,230,53,0.95)" : "rgba(255,255,255,0.35)";
        ctx!.fillText(stages[i], sx + 8, sy + 1);
        sx += tw + 8;
      }

      // Loss curve area
      const top = sy + 24;
      const bh = h - top - 52;
      ctx!.strokeStyle = "rgba(255,255,255,0.08)";
      ctx!.strokeRect(pad + 0.5, top + 0.5, w - pad * 2, bh);
      // Curve
      if (losses.length > 1) {
        ctx!.beginPath();
        for (let i = 0; i < losses.length; i++) {
          const x = pad + (i / TOTAL) * (w - pad * 2);
          const y = top + bh - ((Math.min(losses[i], 10) - 1) / 9) * bh;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.strokeStyle = "rgba(163,230,53,0.9)";
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        ctx!.lineWidth = 1;
      }
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.font = "9px ui-monospace, monospace";
      ctx!.fillText("loss", pad + 6, top + 12);

      // Counters
      const toks = Math.min(step / TOTAL, 1) * 189;
      const fy = h - 26;
      ctx!.font = "10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.55)";
      const cur = losses.length ? losses[losses.length - 1].toFixed(2) : "-";
      ctx!.fillText(
        `step ${Math.min(step, TOTAL)}/${TOTAL}   loss ${cur}   ${toks.toFixed(0)}M tokens   ~146K tok/s   33% MFU   1x A100`,
        pad,
        fy
      );
      ctx!.fillStyle = "rgba(255,255,255,0.08)";
      ctx!.fillRect(pad, fy + 10, w - pad * 2, 3);
      ctx!.fillStyle = "rgba(163,230,53,0.85)";
      ctx!.fillRect(pad, fy + 10, (w - pad * 2) * Math.min(step / TOTAL, 1), 3);
    }

    function frame(now: number) {
      if (!running) return;
      if (!last) last = now;
      acc += now - last;
      last = now;
      while (acc >= STEP_MS) {
        acc -= STEP_MS;
        step += 1;
        if (step <= TOTAL) losses.push(lossAt(step));
      }
      if (step > TOTAL + 80) {
        step = 0;
        losses.length = 0;
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) {
        running = true;
        last = 0;
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
      aria-label="Reasoning SLM training pipeline replay"
    />
  );
}

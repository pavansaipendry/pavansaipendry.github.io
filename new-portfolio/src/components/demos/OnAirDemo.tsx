"use client";

import { useEffect, useRef } from "react";

/**
 * OnAirDemo - AttentionFM's studio: two AI hosts trading the mic,
 * live waveform, show clock. Pure canvas, loops forever.
 */

const TOPICS = [
  "attention mechanisms, explained badly",
  "do robots dream of lower perplexity?",
  "this week in GPU shortages",
  "the KV cache appreciation hour",
  "ship it friday: vibes vs evals",
];

export function OnAirDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let t = 0;

    function frame() {
      if (!running) return;
      t += 1 / 60;

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

      // ON AIR
      const blink = Math.sin(t * 3) > -0.6;
      ctx!.font = "600 10px ui-monospace, monospace";
      if (blink) {
        ctx!.fillStyle = "rgba(251,113,133,0.95)";
        ctx!.fillRect(pad, pad - 6, 8, 8);
      }
      ctx!.fillStyle = "rgba(251,113,133,0.95)";
      ctx!.fillText("ON AIR - ATTENTION.FM", pad + 14, pad + 2);
      // Clock
      const secs = Math.floor(t);
      const clock = `${String(Math.floor(secs / 3600) + 31).padStart(2, "0")}:${String(Math.floor(secs / 60) % 60).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
      ctx!.textAlign = "right";
      ctx!.fillStyle = "rgba(255,255,255,0.4)";
      ctx!.fillText(`uptime ${clock}`, w - pad, pad + 2);
      ctx!.textAlign = "left";

      // Which host is talking (switch every ~4s)
      const turn = Math.floor(t / 4) % 2;
      const hosts = ["HOST A - claude-sonnet", "HOST B - claude-haiku"];
      ctx!.font = "10px ui-monospace, monospace";
      for (let i = 0; i < 2; i++) {
        ctx!.fillStyle = i === turn ? "rgba(251,113,133,0.9)" : "rgba(255,255,255,0.3)";
        ctx!.fillText(`${i === turn ? "●" : "○"} ${hosts[i]}`, pad, pad + 28 + i * 16);
      }

      // Topic ticker
      const topic = TOPICS[Math.floor(t / 8) % TOPICS.length];
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      ctx!.fillText(`now: "${topic}"`, pad, pad + 66);

      // Waveform
      const mid = h * 0.62;
      const bars = Math.floor((w - pad * 2) / 7);
      for (let i = 0; i < bars; i++) {
        const x = pad + i * 7;
        const phase = t * 7 + i * 0.55 + turn * 12;
        const talkEnv = 0.45 + 0.55 * Math.abs(Math.sin(t * 1.8 + i * 0.05));
        const amp =
          (Math.sin(phase) * 0.5 + Math.sin(phase * 1.7) * 0.3 + Math.sin(phase * 0.6) * 0.2) *
          talkEnv;
        const bh = Math.abs(amp) * h * 0.22 + 2;
        ctx!.fillStyle = `rgba(251,113,133,${0.25 + Math.abs(amp) * 0.65})`;
        ctx!.fillRect(x, mid - bh, 4, bh * 2);
      }

      // Footer
      ctx!.font = "10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      ctx!.fillText("24/7 stream   websocket x base64 audio   runpod gpu", pad, h - 18);

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
      aria-label="AttentionFM on-air studio visualization"
    />
  );
}

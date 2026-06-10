"use client";

import { useEffect, useRef } from "react";

/**
 * SparseAttentionDemo - interactive visualization of NSA's three-branch
 * attention pattern on a causal matrix, live in the browser.
 *
 * For the current query row: sliding window (recent tokens), compressed
 * blocks (coarse summary of all history), and top-n selected blocks
 * (fine-grained attention where scores are highest). The query scans
 * automatically; move your pointer over the grid to drive it yourself.
 */

const N = 56; // tokens
const BLOCK = 8; // tokens per block
const WINDOW = 10; // sliding window width
const TOP_N = 2; // selected blocks

export function SparseAttentionDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let hoverQ: number | null = null;
    let t = 0;

    // Deterministic pseudo "attention score" for block selection
    function score(q: number, block: number) {
      return Math.abs(Math.sin(q * 12.9898 + block * 78.233) * 43758.5453) % 1;
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

      const pad = Math.max(14, w * 0.04);
      const top = pad + 24;
      const size = Math.min(w - pad * 2, h - top - 54);
      const cell = size / N;
      const ox = (w - size) / 2;

      t += 0.0045;
      const autoQ = Math.floor(
        WINDOW + ((Math.sin(t) + 1) / 2) * (N - 1 - WINDOW)
      );
      const q = hoverQ ?? autoQ;
      const qBlock = Math.floor(q / BLOCK);

      // Selected blocks: top-n by score among full blocks before the window
      const candidates: { b: number; s: number }[] = [];
      for (let b = 0; b < qBlock; b++) candidates.push({ b, s: score(q, b) });
      candidates.sort((a, b2) => b2.s - a.s);
      const selected = new Set(candidates.slice(0, TOP_N).map((c) => c.b));

      // Header
      ctx!.font = "600 10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(124,92,252,0.9)";
      ctx!.fillText("LIVE - NATIVE SPARSE ATTENTION", pad, pad + 4);
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.textAlign = "right";
      ctx!.fillText("hover = move query", w - pad, pad + 4);
      ctx!.textAlign = "left";

      // Causal triangle, dim
      ctx!.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < N; i++) {
        ctx!.fillRect(ox, top + i * cell, (i + 1) * cell, Math.max(1, cell - 1));
      }

      // Query row: three branches
      const y = top + q * cell;
      const rowH = Math.max(2, cell - 1);
      for (let j = 0; j <= q; j++) {
        const jb = Math.floor(j / BLOCK);
        let color: string | null = null;
        if (j > q - WINDOW) color = "rgba(124,92,252,0.95)"; // sliding window
        else if (selected.has(jb)) color = "rgba(56,189,248,0.9)"; // top-n selected
        else color = "rgba(255,255,255,0.16)"; // compressed (coarse)
        ctx!.fillStyle = color;
        ctx!.fillRect(ox + j * cell, y, Math.max(1, cell - 0.5), rowH);
      }

      // Query marker
      ctx!.fillStyle = "rgba(250,250,250,0.9)";
      ctx!.fillRect(ox + q * cell, y, Math.max(2, cell), rowH);

      // Block grid lines
      ctx!.strokeStyle = "rgba(255,255,255,0.06)";
      ctx!.lineWidth = 1;
      for (let b = 0; b <= N / BLOCK; b++) {
        const x = ox + b * BLOCK * cell;
        ctx!.beginPath();
        ctx!.moveTo(x, top);
        ctx!.lineTo(x, top + size);
        ctx!.stroke();
      }

      // Legend + sparsity
      const dense = q + 1;
      const attended =
        Math.min(WINDOW, q + 1) + selected.size * BLOCK + qBlock; // window + selected + 1 compressed cell per block
      const saved = Math.max(0, Math.round((1 - attended / dense) * 100));
      const ly = top + size + 18;
      ctx!.font = "10px ui-monospace, monospace";
      const items: [string, string][] = [
        ["rgba(124,92,252,0.95)", "window"],
        ["rgba(56,189,248,0.9)", `top-${TOP_N} blocks`],
        ["rgba(255,255,255,0.25)", "compressed"],
      ];
      let lx = ox;
      for (const [c, label] of items) {
        ctx!.fillStyle = c;
        ctx!.fillRect(lx, ly - 7, 8, 8);
        ctx!.fillStyle = "rgba(255,255,255,0.55)";
        ctx!.fillText(label, lx + 12, ly);
        lx += ctx!.measureText(label).width + 34;
      }
      ctx!.textAlign = "right";
      ctx!.fillStyle = "rgba(255,255,255,0.55)";
      ctx!.fillText(`q=${q}  ~${saved}% skipped`, ox + size, ly);
      ctx!.textAlign = "left";
    }

    function frame() {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      const pad = Math.max(14, rect.width * 0.04);
      const top = pad + 24;
      const size = Math.min(rect.width - pad * 2, rect.height - top - 54);
      const yy = e.clientY - rect.top - top;
      if (yy < 0 || yy > size) {
        hoverQ = null;
        return;
      }
      hoverQ = Math.min(N - 1, Math.max(WINDOW, Math.floor((yy / size) * N)));
    }
    function onLeave() {
      hoverQ = null;
    }
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const io = new IntersectionObserver(([entry]) => {
      const vis = entry.isIntersecting;
      if (vis && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!vis && running) {
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
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ background: "#0d0d14" }}
      aria-label="Interactive Native Sparse Attention pattern visualization"
    />
  );
}

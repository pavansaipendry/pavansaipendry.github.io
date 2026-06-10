"use client";

import { useEffect, useRef } from "react";

/**
 * PagedAttentionDemo - a live, real-algorithm simulation of mini-vLLM's
 * serving core, running in the visitor's browser.
 *
 * Block-pooled KV cache (64 blocks x 16 tokens), iteration-level continuous
 * batching: requests arrive, the scheduler admits while blocks are free,
 * every decode step appends one token per running sequence, sequences
 * allocate a new block at each block boundary and release everything on
 * completion. Click injects a request burst. Pauses offscreen.
 */

const NUM_BLOCKS = 64;
const COLS = 16;
const STEP_MS = 230;
const MAX_ACTIVE = 9;

interface Seq {
  id: number;
  hue: number;
  tokens: number;
  target: number;
  blocks: number[];
}

export function PagedAttentionDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let last = 0;
    let acc = 0;
    let nextArrival = 600;
    let seqCounter = 0;
    let tokensServed = 0;
    let tokWindow: number[] = [];

    const free: number[] = Array.from({ length: NUM_BLOCKS }, (_, i) => i);
    const seqs: Seq[] = [];
    const queue: Seq[] = [];

    function makeSeq(): Seq {
      seqCounter++;
      return {
        id: seqCounter,
        hue: (seqCounter * 67) % 360,
        tokens: 0,
        target: 24 + Math.floor(Math.random() * 72),
        blocks: [],
      };
    }

    function blocksNeeded(tokens: number) {
      return Math.ceil(Math.max(tokens, 1) / 16);
    }

    function step() {
      // Admit from queue while a first block is available
      while (queue.length && seqs.length < MAX_ACTIVE && free.length > 0) {
        const s = queue.shift()!;
        s.blocks.push(free.pop()!);
        seqs.push(s);
      }
      // Decode: one token per running sequence per iteration
      for (let i = seqs.length - 1; i >= 0; i--) {
        const s = seqs[i];
        if (blocksNeeded(s.tokens + 1) > s.blocks.length) {
          if (free.length === 0) continue; // preempted this step - waits for a block
          s.blocks.push(free.pop()!);
        }
        s.tokens++;
        tokensServed++;
        if (s.tokens >= s.target) {
          free.push(...s.blocks); // recycle all blocks
          seqs.splice(i, 1);
        }
      }
      tokWindow.push(seqs.length);
      if (tokWindow.length > 14) tokWindow.shift();
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
      const top = pad + 26;
      const gridW = w - pad * 2;
      const cell = Math.min(gridW / COLS, (h - top - 58) / (NUM_BLOCKS / COLS));
      const gap = Math.max(2, cell * 0.12);

      // Owner lookup
      const owner = new Map<number, Seq>();
      for (const s of seqs) for (const b of s.blocks) owner.set(b, s);

      // Header
      ctx!.font = "600 10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(124,92,252,0.9)";
      ctx!.fillText("LIVE - PAGED KV CACHE", pad, pad + 4);
      ctx!.fillStyle = "rgba(255,255,255,0.35)";
      ctx!.textAlign = "right";
      ctx!.fillText("click = burst", w - pad, pad + 4);
      ctx!.textAlign = "left";

      // Blocks
      for (let i = 0; i < NUM_BLOCKS; i++) {
        const x = pad + (i % COLS) * cell + gap / 2;
        const y = top + Math.floor(i / COLS) * cell + gap / 2;
        const s = cell - gap;
        const sq = owner.get(i);
        if (sq) {
          const isTail = sq.blocks[sq.blocks.length - 1] === i;
          const pulse = isTail ? 0.55 + 0.35 * Math.sin(performance.now() / 180) : 0.85;
          ctx!.fillStyle = `hsla(${sq.hue}, 70%, 62%, ${pulse})`;
          ctx!.fillRect(x, y, s, s);
        } else {
          ctx!.strokeStyle = "rgba(255,255,255,0.13)";
          ctx!.lineWidth = 1;
          ctx!.strokeRect(x + 0.5, y + 0.5, s - 1, s - 1);
        }
      }

      // Footer stats
      const used = NUM_BLOCKS - free.length;
      const avgActive = tokWindow.length
        ? tokWindow.reduce((a, b) => a + b, 0) / tokWindow.length
        : 0;
      const tps = Math.round(avgActive * (1000 / STEP_MS));
      const fy = top + (NUM_BLOCKS / COLS) * cell + 20;
      ctx!.font = "10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.55)";
      ctx!.fillText(
        `blocks ${used}/${NUM_BLOCKS}   seqs ${seqs.length} run / ${queue.length} queued   ~${tps} tok/s   ${tokensServed} served`,
        pad,
        fy
      );
      // Utilization bar
      ctx!.fillStyle = "rgba(255,255,255,0.08)";
      ctx!.fillRect(pad, fy + 10, gridW, 3);
      ctx!.fillStyle = "rgba(124,92,252,0.85)";
      ctx!.fillRect(pad, fy + 10, gridW * (used / NUM_BLOCKS), 3);
    }

    function frame(now: number) {
      if (!running) return;
      if (!last) last = now;
      const dt = now - last;
      last = now;
      acc += dt;
      nextArrival -= dt;
      if (nextArrival <= 0) {
        queue.push(makeSeq());
        nextArrival = 700 + Math.random() * 1800;
      }
      while (acc >= STEP_MS) {
        acc -= STEP_MS;
        step();
      }
      draw();
      raf = requestAnimationFrame(frame);
    }

    function onClick() {
      for (let i = 0; i < 3; i++) queue.push(makeSeq());
    }
    canvas.addEventListener("click", onClick);

    // Pause offscreen
    const io = new IntersectionObserver(([entry]) => {
      const vis = entry.isIntersecting;
      if (vis && !running) {
        running = true;
        last = 0;
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
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ background: "#0d0d14", cursor: "pointer" }}
      aria-label="Live PagedAttention and continuous batching simulation"
    />
  );
}

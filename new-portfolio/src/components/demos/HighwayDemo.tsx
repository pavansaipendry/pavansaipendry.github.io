"use client";

import { useEffect, useRef } from "react";

/**
 * HighwayDemo - a live miniature of the highway-env task: the agent car
 * (accent) holds ~80 km/h and changes lanes to avoid slower traffic.
 * Simple kinematics + a defensive lane-choice policy, running in-browser.
 */

const LANES = 3;

interface Car {
  lane: number;
  y: number; // visual lane offset for smooth lane changes
  x: number;
  speed: number;
}

export function HighwayDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let dist = 0;
    let dashes = 0;
    let spawnIn = 0;

    const agent: Car = { lane: 1, y: 1, x: 0.22, speed: 80 };
    let traffic: Car[] = [];

    function laneFree(lane: number, fromX: number, toX: number) {
      return !traffic.some((c) => c.lane === lane && c.x > fromX && c.x < toX);
    }

    function policy() {
      // Car ahead in my lane within lookahead?
      const ahead = traffic
        .filter((c) => c.lane === agent.lane && c.x > agent.x && c.x - agent.x < 0.22)
        .sort((a, b) => a.x - b.x)[0];
      if (!ahead) {
        agent.speed = Math.min(82, agent.speed + 0.3);
        return;
      }
      // Try a lane change, prefer the freer side
      const options = [agent.lane - 1, agent.lane + 1].filter(
        (l) => l >= 0 && l < LANES && laneFree(l, agent.x - 0.08, agent.x + 0.3)
      );
      if (options.length) {
        agent.lane = options[Math.floor(Math.random() * options.length)];
      } else {
        agent.speed = Math.max(ahead.speed - 2, 40); // fall back: keep distance
      }
    }

    function frame() {
      if (!running) return;

      // Physics
      policy();
      agent.y += (agent.lane - agent.y) * 0.12;
      dist += agent.speed / 3600;
      dashes = (dashes + agent.speed * 0.004) % 1;
      for (const c of traffic) c.x -= (agent.speed - c.speed) * 0.00012;
      traffic = traffic.filter((c) => c.x > -0.2 && c.x < 1.6);
      spawnIn--;
      if (spawnIn <= 0 && traffic.length < 7) {
        const lane = Math.floor(Math.random() * LANES);
        if (laneFree(lane, 1.0, 1.5)) {
          traffic.push({ lane, y: lane, x: 1.25, speed: 45 + Math.random() * 25 });
        }
        spawnIn = 40 + Math.random() * 80;
      }

      // Render
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
      ctx!.fillStyle = "rgba(250,204,21,0.9)";
      ctx!.fillText("LIVE - HIGHWAY POLICY SIM", pad, pad + 4);

      const roadTop = pad + 26;
      const roadH = h - roadTop - 46;
      const laneH = roadH / LANES;

      // Road
      ctx!.fillStyle = "rgba(255,255,255,0.03)";
      ctx!.fillRect(0, roadTop, w, roadH);
      ctx!.strokeStyle = "rgba(255,255,255,0.25)";
      ctx!.beginPath();
      ctx!.moveTo(0, roadTop + 0.5);
      ctx!.lineTo(w, roadTop + 0.5);
      ctx!.moveTo(0, roadTop + roadH - 0.5);
      ctx!.lineTo(w, roadTop + roadH - 0.5);
      ctx!.stroke();
      // Lane dashes (scrolling)
      ctx!.strokeStyle = "rgba(255,255,255,0.14)";
      for (let l = 1; l < LANES; l++) {
        const y = roadTop + l * laneH;
        for (let x = -dashes * 64; x < w; x += 64) {
          ctx!.beginPath();
          ctx!.moveTo(x, y);
          ctx!.lineTo(x + 30, y);
          ctx!.stroke();
        }
      }

      const carW = Math.max(34, w * 0.045);
      const carH = Math.min(laneH * 0.42, 18);
      const carY = (c: Car) => roadTop + (c.y + 0.5) * laneH - carH / 2;

      // Traffic
      for (const c of traffic) {
        c.y += (c.lane - c.y) * 0.1;
        ctx!.fillStyle = "rgba(255,255,255,0.32)";
        ctx!.fillRect(c.x * w, carY(c), carW, carH);
      }
      // Agent
      ctx!.fillStyle = "rgba(250,204,21,0.95)";
      ctx!.fillRect(agent.x * w, carY(agent), carW, carH);
      ctx!.fillStyle = "rgba(13,13,20,0.9)";
      ctx!.font = "8px ui-monospace, monospace";
      ctx!.fillText("PPO", agent.x * w + 6, carY(agent) + carH / 2 + 3);

      // HUD
      ctx!.font = "10px ui-monospace, monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.55)";
      ctx!.fillText(
        `${Math.round(agent.speed)} km/h   ${dist.toFixed(2)} km   collisions 0`,
        pad,
        h - 18
      );

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
      aria-label="Highway driving policy simulation"
    />
  );
}

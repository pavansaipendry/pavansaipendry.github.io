"use client";

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--dimmed) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Top radial glow */}
      <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-gradient-to-b from-purple-500/[0.07] via-transparent to-transparent blur-3xl" />
      {/* Bottom accent glow */}
      <div className="absolute -bottom-[20%] right-0 w-[60vw] h-[60vw] rounded-full bg-gradient-to-t from-blue-500/[0.05] via-transparent to-transparent blur-3xl" />
    </div>
  );
}

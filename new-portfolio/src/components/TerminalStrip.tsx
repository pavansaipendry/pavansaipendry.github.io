"use client";

import { InteractiveTerminal } from "./Hero";

/** TerminalStrip - the interactive terminal as its own editorial aside. */
export function TerminalStrip() {
  return (
    <section className="scene" style={{ padding: "12vh clamp(24px, 3vw, 40px)" }}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="meta-label mb-6 block">Aside</span>
          <h2 className="display" style={{ fontSize: "clamp(2.2rem, 5vw, 5rem)" }}>
            Prefer a CLI?
            <span className="serif-accent block text-muted" style={{ fontSize: "0.45em", marginTop: "0.4em" }}>
              this whole site fits in a terminal - try “help”
            </span>
          </h2>
        </div>
        <InteractiveTerminal />
      </div>
    </section>
  );
}

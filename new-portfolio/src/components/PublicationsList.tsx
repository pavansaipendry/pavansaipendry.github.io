"use client";

import { publications } from "@/lib/data";
import { AppearTitle } from "./AppearTitle";

/** PublicationsList - research as editorial index rows. */
export function PublicationsList() {
  return (
    <section id="publications" className="scene" style={{ padding: "16vh clamp(24px, 3vw, 40px)" }}>
      <span className="meta-label mb-6 block">05 - Research</span>
      <AppearTitle tag="h2" className="display mb-[8vh]" stagger={90}>
        <span style={{ fontSize: "clamp(3rem, 9vw, 10rem)", display: "block" }}>
          Research
        </span>
      </AppearTitle>

      <div className="border-b border-card-border">
        {publications.map((pub) => {
          const Row = (
            <div className="ed-row">
              <span className="meta-label pt-1">
                {pub.venue ? `${pub.venue} · ` : ""}{pub.year}
              </span>

              <div className="min-w-0">
                <h3
                  className="display"
                  style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.8rem)", lineHeight: 1.05, textTransform: "none" }}
                >
                  {pub.shortTitle}
                  <span className="serif-accent text-muted" style={{ fontSize: "0.55em", marginLeft: "0.6em" }}>
                    {pub.description}
                  </span>
                </h3>
                {pub.abstract && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{pub.abstract}</p>
                )}
                {pub.highlights && (
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    {pub.highlights.map((h) => (
                      <span key={h.label} className="meta-label !tracking-[0.12em]">
                        {h.label}: <span className="!text-foreground">{h.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span className="hidden text-2xl text-dimmed sm:block">{pub.url ? "↗" : "-"}</span>
            </div>
          );

          return pub.url ? (
            <a key={pub.shortTitle} href={pub.url} target="_blank" rel="noopener noreferrer" className="block">
              {Row}
            </a>
          ) : (
            <div key={pub.shortTitle}>{Row}</div>
          );
        })}
      </div>
    </section>
  );
}

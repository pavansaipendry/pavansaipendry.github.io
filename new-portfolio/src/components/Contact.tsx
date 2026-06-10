"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "./SpotlightCard";
import { siteConfig } from "@/lib/data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "walk me through babyjay",
  "what would you build with unlimited resources?",
  "what's your most underrated project?",
  "discuss opportunities",
];

const contactCards = [
  {
    label: "Email",
    detail: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    mono: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    detail: "Let's connect professionally",
    href: siteConfig.linkedin,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
    external: true,
  },
  {
    label: "GitHub",
    detail: "See what I'm building",
    href: siteConfig.github,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    external: true,
  },
];

/* ── Markdown renderer ── */
function RenderMarkdown({ text }: { text: string }) {
  return (
    <span>
      {text.split("\n").map((line, li) => {
        if (line.startsWith("- ") || line.startsWith("• ")) {
          const parts = line.slice(2).split(/(\*\*.*?\*\*)/g);
          return (
            <span key={li} className="flex gap-1.5 mt-1">
              <span className="text-accent shrink-0">&#x2022;</span>
              <span>
                {parts.map((p, pi) =>
                  p.startsWith("**") && p.endsWith("**")
                    ? <strong key={pi} className="font-semibold text-accent">{p.slice(2, -2)}</strong>
                    : <span key={pi}>{p}</span>
                )}
              </span>
            </span>
          );
        }
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <span key={li}>
            {li > 0 && line === "" ? <br /> : null}
            {parts.map((p, pi) =>
              p.startsWith("**") && p.endsWith("**")
                ? <strong key={pi} className="font-semibold text-accent">{p.slice(2, -2)}</strong>
                : <span key={pi}>{p}</span>
            )}
            {li < text.split("\n").length - 1 && line !== "" ? " " : null}
          </span>
        );
      })}
    </span>
  );
}

/* ── Heading component ── */

/* ══════════════════════════════════════════════════════════════════════════ */

export function Contact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Chat border glow when active
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.style.transition = "border-color 0.6s ease, box-shadow 0.6s ease";
    if (loading) {
      chatRef.current.style.borderColor = "rgba(124, 92, 252, 0.25)";
      chatRef.current.style.boxShadow = "0 0 40px -10px rgba(124, 92, 252, 0.15)";
    } else if (messages.length > 0) {
      chatRef.current.style.borderColor = "rgba(124, 92, 252, 0.1)";
      chatRef.current.style.boxShadow = "0 0 30px -10px rgba(124, 92, 252, 0.08)";
    } else {
      chatRef.current.style.borderColor = "";
      chatRef.current.style.boxShadow = "";
    }
  }, [loading, messages.length]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const currentHistory = [...messages];
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history: currentHistory }),
        });

        if (!res.ok || !res.body) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: "Something went wrong. Try again!" };
            return updated;
          });
          setLoading(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const cleaned = line.replace(/^data: /, "");
            if (cleaned === "[DONE]") break;
            try {
              const parsed = JSON.parse(cleaned);
              if (parsed.error) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: "Something went wrong." };
                  return updated;
                });
                setLoading(false);
                return;
              }
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = { ...last, content: last.content + parsed.text };
                  return updated;
                });
              }
            } catch { /* skip */ }
          }
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: "Couldn't connect. Try again!" };
          return updated;
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  return (
    <section
      id="contact"
      className="relative px-6 section-alt"
      style={{ paddingTop: "var(--section-py)", paddingBottom: "var(--section-py)" }}
    >
      <div className="mx-auto max-w-3xl">

        {/* ── Editorial heading ── */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="font-bold text-heading"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            Let&apos;s build
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.12, ease: [0.19, 1, 0.22, 1] }}
            className="font-bold"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #7c5cfc, #a78bfa, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            something.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="mt-6 text-muted"
            style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.1rem)", lineHeight: 1.7, maxWidth: "36ch" }}
          >
            Got a project, a role, or just want to geek out about AI? I&apos;m all ears.
          </motion.p>
        </div>

        {/* ── Contact cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
          className="mt-14 grid gap-4 sm:grid-cols-3"
        >
          {contactCards.map((card, i) => (
            <motion.a
              key={card.label}
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noopener noreferrer" : undefined}
              className="block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.19, 1, 0.22, 1] }}
            >
              <SpotlightCard className="group relative overflow-hidden rounded-xl border border-card-border bg-card-bg p-5 transition-all duration-500 hover:border-accent/20">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/8 text-accent transition-all duration-500 group-hover:bg-accent/15 group-hover:scale-110">
                    {card.icon}
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className="text-dimmed/0 transition-all duration-500 group-hover:text-dimmed group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-heading">{card.label}</span>
                  <p className={`mt-1 text-xs text-dimmed ${card.mono ? "font-mono" : ""}`}>{card.detail}</p>
                </div>
                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ transitionTimingFunction: "var(--ease-out-expo)" }} />
              </SpotlightCard>
            </motion.a>
          ))}
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 mb-12 flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-card-border to-transparent" />
          <span className="text-[10px] font-mono text-dimmed tracking-[0.3em] uppercase">or talk to me live</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-card-border to-transparent" />
        </motion.div>

        {/* ── Terminal chat ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="relative"
        >
          {/* Traveling border beam - sharp corners, squared dash ends */}
          <svg
            className="pointer-events-none absolute -inset-px z-20 h-[calc(100%+2px)] w-[calc(100%+2px)]"
            fill="none"
            aria-hidden
          >
            <rect
              x="1.5"
              y="1.5"
              width="calc(100% - 3px)"
              height="calc(100% - 3px)"
              rx="12"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeOpacity="0.8"
              strokeLinecap="butt"
              pathLength={100}
              className="border-beam"
            />
          </svg>

          <div
            id="live-chat"
            ref={chatRef}
            className="relative overflow-hidden rounded-xl border border-card-border bg-code-bg"
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-card-border">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="flex-1 text-center text-[10px] text-dimmed/60 font-mono tracking-wider">pavan.sh</span>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                <span className="text-[9px] text-green-500/70 font-mono">live</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} data-lenis-prevent className="h-80 sm:h-96 overflow-y-auto px-5 py-5 font-mono text-[13px] leading-relaxed">
              {/* Empty state */}
              <AnimatePresence>
                {messages.length === 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    className="space-y-5"
                  >
                    <div className="text-dimmed/60 text-xs leading-relaxed">
                      <span className="text-accent">~</span> hey - i&apos;m pavan. this is a live AI chat trained on my experience.
                      <br />
                      <span className="text-accent">~</span> ask me anything, or try one of these:
                    </div>
                    <div className="space-y-0.5">
                      {STARTERS.map((s, i) => (
                        <motion.button
                          key={s}
                          onClick={() => send(s)}
                          className="group flex items-center gap-3 text-left w-full py-1.5 px-2 -mx-2 rounded-md text-dimmed transition-all duration-300 hover:text-heading hover:bg-white/[0.02]"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.19, 1, 0.22, 1] }}
                        >
                          <span className="text-accent/40 group-hover:text-accent transition-colors duration-300 text-xs">&gt;</span>
                          <span className="text-xs">{s}</span>
                          <svg
                            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-300"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages */}
              {messages.map((msg, i) => {
                if (msg.role === "assistant" && msg.content === "" && loading) return null;
                const isStreaming = loading && i === messages.length - 1 && msg.role === "assistant";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="mt-4 first:mt-0"
                  >
                    {msg.role === "user" ? (
                      <div className="text-muted">
                        <span className="text-dimmed/50">&gt; </span>
                        {msg.content}
                      </div>
                    ) : (
                      <div className="mt-2 text-foreground/90 pl-4 border-l border-accent/20">
                        <RenderMarkdown text={msg.content} />
                        {isStreaming && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-1.5 h-3.5 bg-accent ml-0.5 align-text-bottom"
                          />
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {loading && messages.length > 0 && messages[messages.length - 1].content === "" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pl-4 border-l border-accent/20"
                >
                  <motion.span
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-accent text-xs"
                  >
                    thinking...
                  </motion.span>
                </motion.div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-3 border-t border-card-border px-5 py-3.5"
            >
              <span className="text-accent/60 font-mono text-sm shrink-0">&gt;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ask me anything..."
                maxLength={500}
                className="flex-1 bg-transparent text-[13px] text-heading font-mono placeholder:text-dimmed/30 outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-7 items-center gap-1.5 rounded-md bg-accent/10 px-3 text-[10px] font-mono text-accent transition-all duration-300 hover:bg-accent/20 disabled:opacity-20 disabled:hover:bg-accent/10"
              >
                send
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            {/* Corner accents - ties to PageLoader design language */}
            <div className="pointer-events-none absolute top-2 left-2 w-3 h-3 border-l border-t border-accent/15 rounded-tl-sm" />
            <div className="pointer-events-none absolute top-2 right-2 w-3 h-3 border-r border-t border-accent/15 rounded-tr-sm" />
            <div className="pointer-events-none absolute bottom-2 left-2 w-3 h-3 border-l border-b border-accent/15 rounded-bl-sm" />
            <div className="pointer-events-none absolute bottom-2 right-2 w-3 h-3 border-r border-b border-accent/15 rounded-br-sm" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

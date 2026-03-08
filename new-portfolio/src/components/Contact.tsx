"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./AnimatedSection";
import { SectionHeader } from "./SectionHeader";
import { siteConfig } from "@/lib/data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "Hey! Tell me about yourself",
  "Are you open to opportunities?",
  "What's the best way to reach you?",
];

const contactLinks = [
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: siteConfig.linkedin,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
      </svg>
    ),
    external: true,
  },
  {
    label: "GitHub",
    href: siteConfig.github,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    external: true,
  },
];

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

export function Contact() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formSending, setFormSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

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
          body: JSON.stringify({
            message: trimmed,
            history: currentHistory,
          }),
        });

        if (!res.ok || !res.body) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: "Something went wrong on my end. Try again in a bit!",
            };
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
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: "Something went wrong.",
                  };
                  return updated;
                });
                setLoading(false);
                return;
              }
              if (parsed.text) {
                setMessages((prev) => {
                  const updated = [...prev];
                  const last = updated[updated.length - 1];
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + parsed.text,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Couldn't connect. Try again!",
          };
          return updated;
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, messages]
  );

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <SectionHeader number="09" title="Let's Connect" />
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-xl border border-card-border bg-code-bg">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-card-border px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-semibold">
                    P
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400 border-2 border-code-bg" />
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-heading">Pavan Sai Reddy</span>
                  <p className="text-[10px] text-dimmed">AI-powered — usually replies instantly</p>
                </div>
              </div>
              <span className="text-xs text-green-500">online</span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} data-lenis-prevent className="h-96 overflow-y-auto p-5 space-y-4">
              {/* Empty state with starters */}
              {messages.length === 0 && !loading && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent text-2xl font-bold">
                    P
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">Hey, I&apos;m Pavan!</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      Chat with me — ask about my work, projects, or just say hi.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="group flex items-center gap-2 rounded-xl border border-card-border bg-card-bg px-4 py-2.5 text-xs text-muted text-left transition-all hover:border-accent/30 hover:text-heading hover:bg-accent/5"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-dimmed group-hover:text-accent shrink-0 transition-colors">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                if (msg.role === "assistant" && msg.content === "" && loading) return null;
                const isStreaming = loading && i === messages.length - 1 && msg.role === "assistant";
                return (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-semibold mt-0.5">
                        P
                      </div>
                    )}
                    <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : ""}`}>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground">Pavan</span>
                          <span className="text-[10px] text-dimmed">now</span>
                        </div>
                      )}
                      <p className={`rounded-lg px-3 py-2 text-sm leading-relaxed inline-block ${
                        msg.role === "user"
                          ? "bg-accent text-white rounded-br-sm"
                          : "bg-card-bg text-foreground border border-card-border rounded-bl-sm"
                      }`}>
                        {msg.role === "user" ? msg.content : <RenderMarkdown text={msg.content} />}
                        {isStreaming && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 align-text-bottom"
                          />
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Loading dots */}
              {loading && messages.length > 0 && messages[messages.length - 1].content === "" && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-semibold">
                    P
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg rounded-bl-sm border border-card-border bg-card-bg px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-dimmed animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-dimmed animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-dimmed animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 border-t border-card-border px-5 py-3">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-card-bg px-3 py-1.5 text-xs text-muted transition-colors hover:border-card-border-hover hover:text-heading"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>

            {/* Leave a message form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-card-border"
                >
                  {formSent ? (
                    <div className="px-5 py-4 text-center">
                      <p className="text-sm text-heading font-medium">Message sent!</p>
                      <p className="text-xs text-muted mt-1">I&apos;ll get back to you soon.</p>
                    </div>
                  ) : (
                    <form
                      action={`https://formsubmit.co/${siteConfig.email}`}
                      method="POST"
                      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
                        e.preventDefault();
                        setFormSending(true);
                        const form = e.currentTarget;
                        try {
                          const res = await fetch(form.action, {
                            method: "POST",
                            body: new FormData(form),
                            headers: { Accept: "application/json" },
                          });
                          if (res.ok) {
                            setFormSent(true);
                            setMessages((prev) => [
                              ...prev,
                              { role: "assistant", content: "Got your message! I'll get back to you via email soon." },
                            ]);
                          }
                        } catch { /* silent */ }
                        setFormSending(false);
                      }}
                      className="px-5 py-3 space-y-2"
                    >
                      <input type="hidden" name="_subject" value="New message from portfolio" />
                      <input type="hidden" name="_captcha" value="false" />
                      <input type="hidden" name="_template" value="table" />
                      <input type="text" name="_honey" style={{ display: "none" }} />
                      <div className="flex gap-2">
                        <input
                          type="text" name="name" placeholder="Your name" required autoComplete="name"
                          className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-heading placeholder:text-dimmed focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20"
                        />
                        <input
                          type="email" name="email" placeholder="Your email" required autoComplete="email"
                          className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-heading placeholder:text-dimmed focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20"
                        />
                      </div>
                      <textarea
                        name="message" placeholder="Your message..." required rows={3}
                        className="w-full rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-heading placeholder:text-dimmed focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 resize-none"
                      />
                      <button
                        type="submit" disabled={formSending}
                        className="w-full rounded-lg bg-accent py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {formSending ? "Sending..." : "Send message"}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input bar */}
            <div className="flex items-center gap-2 border-t border-card-border px-4 py-3">
              <button
                type="button"
                onClick={() => { setShowForm(!showForm); setFormSent(false); }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  showForm ? "bg-accent/20 text-accent" : "text-dimmed hover:text-muted hover:bg-card-bg"
                }`}
                title="Leave a message via email"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex flex-1 items-center gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Say something..."
                  maxLength={500}
                  className="flex-1 bg-transparent text-sm text-heading placeholder:text-dimmed outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent/80 disabled:opacity-30"
                  aria-label="Send"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

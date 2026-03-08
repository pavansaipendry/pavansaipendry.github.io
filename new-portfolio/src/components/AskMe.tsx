"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What's Pavan's strongest project?",
  "What tech stack does he use?",
  "Tell me about BabyJay",
];

export function AskMe() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: Message = { role: "user", content: trimmed };
      const currentHistory = [...messages];
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      // Add an empty assistant message that we'll stream into
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
              content: "Sorry, I'm having trouble right now. Try again later!",
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
                    content: "Sorry, something went wrong.",
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
            content: "Couldn't connect. Please try again.",
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
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/25 transition-transform hover:scale-105 active:scale-95"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ask about Pavan"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-6 z-50 flex w-[360px] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-card-border bg-background shadow-2xl shadow-black/20"
            style={{ height: "min(480px, calc(100vh - 8rem))" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-card-border px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-heading">Ask about Pavan</h3>
                <p className="text-[11px] text-dimmed">AI-powered — built with Claude</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && !loading && (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="text-3xl">&#x1F44B;</div>
                  <p className="text-sm text-muted">
                    Ask me anything about Pavan&apos;s work, skills, or projects.
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-lg border border-card-border bg-card-bg px-3 py-2 text-xs text-muted text-left transition-colors hover:border-card-border-hover hover:text-heading"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => {
                // Hide the empty assistant message while loading dots are showing
                if (msg.role === "assistant" && msg.content === "" && loading) return null;
                const isStreaming = loading && i === messages.length - 1 && msg.role === "assistant";
                return (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-accent text-white rounded-br-md"
                          : "border border-card-border bg-card-bg text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.role === "user" ? msg.content : (
                        <span>
                          {msg.content.split("\n").map((line, li) => {
                            if (line.startsWith("- ") || line.startsWith("• ")) {
                              const parts = line.slice(2).split(/(\*\*.*?\*\*)/g);
                              return (
                                <span key={li} className="flex gap-1.5 mt-1">
                                  <span className="text-accent shrink-0">&#x2022;</span>
                                  <span>{parts.map((p, pi) =>
                                    p.startsWith("**") && p.endsWith("**")
                                      ? <strong key={pi} className="font-semibold text-accent">{p.slice(2, -2)}</strong>
                                      : <span key={pi}>{p}</span>
                                  )}</span>
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
                                {li < msg.content.split("\n").length - 1 && line !== "" ? " " : null}
                              </span>
                            );
                          })}
                        </span>
                      )}
                      {isStreaming && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                          className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 align-text-bottom"
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && messages.length > 0 && messages[messages.length - 1].content === "" && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-card-border bg-card-bg px-4 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-dimmed animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-dimmed animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-dimmed animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-card-border px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                maxLength={500}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-dimmed outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-opacity disabled:opacity-30"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

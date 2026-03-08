"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "./AnimatedSection";
import { SectionHeader } from "./SectionHeader";

// ─── Simple markdown renderer for the streamed response ─────────────────────
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ## Heading
    if (line.startsWith("## ")) {
      const content = line.slice(3);
      // Match score gets special treatment
      if (content.startsWith("Match Score:")) {
        const scoreMatch = content.match(/(\d+)\/10/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
        elements.push(
          <div key={i} className="flex items-center gap-3 mb-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl font-bold text-xl ${
              score >= 8 ? "bg-emerald-500/10 text-emerald-400" :
              score >= 6 ? "bg-amber-500/10 text-amber-400" :
              "bg-red-500/10 text-red-400"
            }`}>
              {score}
            </div>
            <div>
              <p className="text-xs text-dimmed uppercase tracking-wider">Match Score</p>
              <div className="mt-1 h-1.5 w-32 rounded-full bg-card-border overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score * 10}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${
                    score >= 8 ? "bg-emerald-400" : score >= 6 ? "bg-amber-400" : "bg-red-400"
                  }`}
                />
              </div>
            </div>
          </div>
        );
      } else {
        elements.push(
          <h3 key={i} className="text-base font-semibold text-heading mt-5 mb-2">{content}</h3>
        );
      }
      continue;
    }

    // **Bold text** within a line
    if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="text-sm font-semibold text-heading mt-3 mb-1">
          {line.replace(/\*\*/g, "")}
        </p>
      );
      continue;
    }

    // Bullet points
    if (line.startsWith("- ")) {
      const content = line.slice(2);
      // Bold parts within bullets
      const parts = content.split(/(\*\*.*?\*\*)/g);
      elements.push(
        <div key={i} className="flex gap-2 text-sm text-muted leading-relaxed ml-1 mb-1">
          <span className="text-accent mt-0.5 shrink-0">&#x2022;</span>
          <span>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**") ? (
                <strong key={j} className="text-heading font-medium">{part.slice(2, -2)}</strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </span>
        </div>
      );
      continue;
    }

    // Empty line
    if (line.trim() === "" || line.trim() === "---") {
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Regular text
    const parts = line.split(/(\*\*.*?\*\*)/g);
    elements.push(
      <p key={i} className="text-sm text-muted leading-relaxed mb-1">
        {parts.map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="text-heading font-medium">{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
      </p>
    );
  }

  return elements;
}

// ─── Example JDs for quick demo ─────────────────────────────────────────────
const EXAMPLES = [
  {
    label: "SWE at a startup",
    jd: "We're looking for a Full-Stack Software Engineer to join our early-stage team. You'll build and ship product features end-to-end using React, Python, and PostgreSQL. Experience with APIs, cloud infrastructure (AWS), and CI/CD pipelines required. Bonus: AI/ML experience, startup mindset.",
  },
  {
    label: "ML Engineer",
    jd: "Seeking an ML Engineer to build and deploy machine learning models at scale. Requirements: Python, PyTorch/TensorFlow, NLP, LLMs, RAG pipelines, vector databases. Experience with AWS, Docker, and real-time inference systems. Published research is a plus.",
  },
  {
    label: "Backend Engineer",
    jd: "Backend Engineer needed for high-throughput data systems. Must have experience with Python, FastAPI or Flask, PostgreSQL, Redis, Kafka, Docker/Kubernetes. Real-time streaming pipelines, ETL processes, and API design experience required.",
  },
];

export function ResumeTailor() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const analyze = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setResult("");
    setHasResult(false);
    setLoading(true);

    try {
      const res = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: trimmed }),
      });

      if (!res.ok || !res.body) {
        setResult("Something went wrong. Please try again.");
        setLoading(false);
        setHasResult(true);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

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
            if (parsed.text) {
              accumulated += parsed.text;
              setResult(accumulated);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
      setHasResult(true);
    } catch {
      setResult("Couldn't connect. Please try again.");
      setHasResult(true);
    } finally {
      setLoading(false);
      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [loading]);

  return (
    <section id="tailor" className="relative py-32 px-6">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <SectionHeader number="08" title="Resume Tailor" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl border border-card-border bg-card-bg p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-heading">AI-Powered Job Match</h3>
              </div>
              <p className="text-sm text-muted">
                Paste a job description and get an instant AI analysis of how Pavan&apos;s experience aligns with the role.
              </p>
            </div>

            {/* Quick examples */}
            <div className="flex flex-wrap gap-2 mb-4">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => {
                    setJd(ex.jd);
                    setResult("");
                    setHasResult(false);
                  }}
                  className="rounded-lg border border-card-border bg-pill-bg px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/30 hover:text-accent"
                >
                  Try: {ex.label}
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste a job description here..."
              maxLength={5000}
              rows={6}
              className="w-full rounded-xl border border-input-border bg-input-bg px-4 py-3 text-sm text-foreground placeholder:text-dimmed focus:outline-none focus:border-accent/40 transition-colors resize-none"
            />

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-dimmed">
                {jd.length}/5000
              </span>
              <button
                onClick={() => analyze(jd)}
                disabled={loading || !jd.trim()}
                className="flex items-center gap-2 rounded-lg bg-btn-primary-bg px-5 py-2.5 text-sm font-medium text-btn-primary-text transition-opacity hover:opacity-90 disabled:opacity-30"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Analyze Fit
                  </>
                )}
              </button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {(result || loading) && (
                <motion.div
                  ref={resultRef}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 rounded-xl border border-card-border bg-background p-5 sm:p-6">
                    {/* Streaming cursor */}
                    {loading && !result && (
                      <div className="flex items-center gap-2 text-sm text-dimmed">
                        <svg className="animate-spin h-4 w-4 text-accent" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Reading the job description...
                      </div>
                    )}

                    {result && (
                      <div>
                        {renderMarkdown(result)}
                        {loading && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                            className="inline-block w-0.5 h-3.5 bg-accent ml-0.5 align-text-bottom"
                          />
                        )}
                      </div>
                    )}

                    {/* Actions after completion */}
                    {hasResult && !loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-5 flex items-center gap-3 pt-4 border-t border-card-border"
                      >
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(result);
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-btn-secondary-border bg-btn-secondary-bg px-3 py-1.5 text-xs text-btn-secondary-text transition-colors hover:text-heading"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                          Copy
                        </button>
                        <button
                          onClick={() => {
                            setResult("");
                            setHasResult(false);
                            setJd("");
                          }}
                          className="flex items-center gap-1.5 rounded-lg border border-btn-secondary-border bg-btn-secondary-bg px-3 py-1.5 text-xs text-btn-secondary-text transition-colors hover:text-heading"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="1 4 1 10 7 10" />
                            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                          </svg>
                          Try another
                        </button>
                        <span className="ml-auto text-[11px] text-dimmed">
                          Powered by Claude
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

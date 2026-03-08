"use client";

import { useState, FormEvent } from "react";
import { FadeIn } from "./AnimatedSection";
import { SectionHeader } from "./SectionHeader";
import { siteConfig } from "@/lib/data";

interface Message {
  from: "user" | "bot";
  name: string;
  text: string;
}

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
  {
    label: "Resume",
    href: "#contact",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export function Contact() {
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", name: "Pavan", text: "Hey! Thanks for visiting my portfolio." },
    { from: "bot", name: "Pavan", text: "I'm currently open to software engineering and AI/ML opportunities. Feel free to reach out!" },
  ]);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const message = formData.get("message") as string;
    if (!name || !message) return;

    setMessages((prev) => [...prev, { from: "user", name, text: message }]);
    setSending(true);

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          name: "Pavan",
          text: res.ok
            ? "Thanks for reaching out! I'll get back to you soon."
            : "Something went wrong. Please try emailing me directly.",
        },
      ]);
      if (res.ok) form.reset();
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", name: "Pavan", text: "Something went wrong. Please try emailing me directly." },
      ]);
    }
    setSending(false);
  }

  return (
    <section id="contact" className="relative py-32 px-6">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <SectionHeader number="08" title="Let's Connect" />
        </FadeIn>

        <FadeIn>
          <div className="overflow-hidden rounded-xl border border-card-border bg-code-bg">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-card-border px-5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
                <span className="text-sm font-medium text-heading">Pavan Sai Reddy</span>
              </div>
              <span className="text-xs text-green-500">online</span>
            </div>

            {/* Messages */}
            <div className="max-h-80 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    msg.from === "bot"
                      ? "bg-accent-soft text-accent"
                      : "bg-card-bg text-muted border border-card-border"
                  }`}>
                    {msg.from === "bot" ? "P" : msg.name[0]?.toUpperCase()}
                  </div>
                  <div className={`max-w-[75%] ${msg.from === "user" ? "text-right" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">{msg.from === "bot" ? "Pavan" : msg.name}</span>
                      <span className="text-[10px] text-dimmed">now</span>
                    </div>
                    <p className={`rounded-lg px-3 py-2 text-sm leading-relaxed inline-block ${
                      msg.from === "user"
                        ? "bg-accent-soft text-accent"
                        : "bg-card-bg text-foreground border border-card-border"
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
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

            {/* Compose */}
            <form
              action={`https://formsubmit.co/${siteConfig.email}`}
              method="POST"
              onSubmit={handleSubmit}
              className="border-t border-card-border p-4"
            >
              <input type="hidden" name="_subject" value="New message from portfolio" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="text" name="_honey" style={{ display: "none" }} />

              <div className="mb-3 flex gap-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-heading placeholder:text-dimmed focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  autoComplete="email"
                  className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-heading placeholder:text-dimmed focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="message"
                  placeholder="Type a message..."
                  required
                  autoComplete="off"
                  className="flex-1 rounded-lg border border-input-border bg-input-bg px-3 py-2 text-sm text-heading placeholder:text-dimmed focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
                <button
                  type="submit"
                  disabled={sending}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-colors hover:bg-accent/80 disabled:opacity-50"
                  aria-label="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

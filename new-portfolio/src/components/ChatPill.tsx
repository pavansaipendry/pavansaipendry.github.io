"use client";

import { useEffect, useState } from "react";
import { useLenisScrollTo } from "./SmoothScroll";

/**
 * ChatPill - floating "chat with me" affordance. Appears once the visitor
 * scrolls past the hero, hides again when the live chat itself is on screen.
 * Click scrolls to the chat and focuses its input.
 */
export function ChatPill() {
  const [visible, setVisible] = useState(false);
  const scrollTo = useLenisScrollTo();

  useEffect(() => {
    function onScroll() {
      const pastHero = window.scrollY > window.innerHeight * 1.2;
      const chat = document.getElementById("live-chat");
      const chatNear = chat
        ? chat.getBoundingClientRect().top < window.innerHeight
        : false;
      setVisible(pastHero && !chatNear);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openChat() {
    scrollTo("#live-chat", { offset: -90 });
    setTimeout(() => {
      document.querySelector<HTMLInputElement>("#live-chat input")?.focus();
    }, 1300);
  }

  return (
    <button
      onClick={openChat}
      data-magnetic
      aria-label="Chat with Pavan"
      className="meta-label fixed bottom-6 right-6 z-[70] flex items-center gap-2.5 rounded-full border border-accent/40 bg-code-bg/90 px-4 py-2.5 !text-accent backdrop-blur-md transition-all duration-500 hover:bg-accent/10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        pointerEvents: visible ? "auto" : "none",
        transitionTimingFunction: "var(--ease-out-expo)",
      }}
    >
      <span className="flex items-center gap-[3px]" aria-hidden>
        <span className="chat-dot" />
        <span className="chat-dot" style={{ animationDelay: "0.18s" }} />
        <span className="chat-dot" style={{ animationDelay: "0.36s" }} />
      </span>
      Chat with me
    </button>
  );
}

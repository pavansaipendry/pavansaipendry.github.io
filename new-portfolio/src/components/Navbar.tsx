"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/lib/data";
import { useLenisCtx, useLenisScrollTo, useScrollDirection } from "./SmoothScroll";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const { lenis } = useLenisCtx();
  const scrollTo = useLenisScrollTo();

  // Track scroll position for background blur
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide nav on scroll down, show on scroll up (direction-aware via Lenis)
  useScrollDirection(
    () => setNavVisible(true),  // scroll up → show
    () => {
      if (window.scrollY > 300) setNavVisible(false); // scroll down → hide (after 300px)
    }
  );

  // Stop/start Lenis when mobile nav opens/closes
  useEffect(() => {
    if (!lenis) return;
    if (mobileOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => { lenis.start(); };
  }, [mobileOpen, lenis]);

  function handleNavClick(href: string) {
    setMobileOpen(false);
    // lock: true prevents user from interrupting the scroll animation
    setTimeout(
      () => scrollTo(href, { offset: -64, lock: true }),
      mobileOpen ? 150 : 0
    );
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-nav-bg backdrop-blur-xl border-b border-card-border shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
        style={{
          transform: navVisible || mobileOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <nav className="flex h-16 items-center justify-between px-6 lg:px-10">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick("#home"); }}
            className="text-lg font-semibold tracking-tight text-heading transition-opacity hover:opacity-80"
          >
            pavan<span className="text-accent">.</span>
          </a>

          {/* Desktop links - rolling letter-swap on hover */}
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-heading hover:bg-card-bg"
                >
                  <span className="roll">
                    <span className="roll__inner">
                      <span>{link.label}</span>
                      <span aria-hidden>{link.label}</span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg text-muted transition-colors hover:text-heading md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className={`block h-px w-5 bg-current transition-all duration-300 ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`block h-px w-5 bg-current transition-all duration-300 ${mobileOpen ? "-translate-y-[2.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
              className="flex h-full flex-col items-center justify-center gap-8"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  className="text-2xl font-medium text-muted transition-colors hover:text-heading"
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

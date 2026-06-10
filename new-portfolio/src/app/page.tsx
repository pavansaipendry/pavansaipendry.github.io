"use client";

import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { HeroScene } from "@/components/HeroScene";
import { SmoothScrollProvider } from "@/components/SmoothScroll";
import { PageLoader } from "@/components/PageLoader";
import { CustomCursor } from "@/components/CustomCursor";

/* ── Lazy-loaded scenes (below the fold) ───────────────────────────────── */
const Manifesto = dynamic(() => import("@/components/Manifesto").then((m) => ({ default: m.Manifesto })));
const WorkChapters = dynamic(() => import("@/components/WorkChapters").then((m) => ({ default: m.WorkChapters })));
const AboutChapter = dynamic(() => import("@/components/AboutChapter").then((m) => ({ default: m.AboutChapter })));
const ExperienceList = dynamic(() => import("@/components/ExperienceList").then((m) => ({ default: m.ExperienceList })));
const PublicationsList = dynamic(() => import("@/components/PublicationsList").then((m) => ({ default: m.PublicationsList })));
const TerminalStrip = dynamic(() => import("@/components/TerminalStrip").then((m) => ({ default: m.TerminalStrip })));
const Contact = dynamic(() => import("@/components/Contact").then((m) => ({ default: m.Contact })));
const Footer = dynamic(() => import("@/components/Footer").then((m) => ({ default: m.Footer })));
const CommandPalette = dynamic(() => import("@/components/CommandPalette").then((m) => ({ default: m.CommandPalette })));

export default function Home() {
  return (
    <>
      <PageLoader />
      <CustomCursor />
      <div className="grain" aria-hidden />
      <SmoothScrollProvider>
        <CommandPalette />
        <Navbar />
        <main className="relative z-10">
          <HeroScene />
          <Manifesto />
          <WorkChapters />
          <AboutChapter />
          <ExperienceList />
          <PublicationsList />
          <TerminalStrip />
          <Contact />
        </main>
        <Footer />
      </SmoothScrollProvider>
    </>
  );
}

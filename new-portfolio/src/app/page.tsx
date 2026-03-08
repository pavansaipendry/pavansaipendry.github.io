import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Architecture } from "@/components/Architecture";
import { Sandbox } from "@/components/Sandbox";
import { Publications } from "@/components/Publications";
import { ResumeTailor } from "@/components/ResumeTailor";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CommandPalette } from "@/components/CommandPalette";
import { PageLoader } from "@/components/PageLoader";
export default function Home() {
  return (
    <>
      <PageLoader />
      <SmoothScroll />
      <CommandPalette />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Architecture />
        <Sandbox />
        <Publications />
        <ResumeTailor />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

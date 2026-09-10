"use client";

import { useRef } from "react";
import { SiteNav } from "@/components/SiteNav";
import { MobileSiteNav } from "@/components/MobileSiteNav";
import { Footer } from "@/components/Footer";
import { Fold1Hero } from "@/components/folds/Fold1Hero";
import { Fold1HeroMobile } from "@/components/folds/Fold1HeroMobile";
import { Fold2Intro } from "@/components/folds/Fold2Intro";
import { Fold2IntroMobile } from "@/components/folds/Fold2IntroMobile";
import { ProgressionSection } from "@/components/folds/ProgressionSection";
import { ProgressionSectionMobile } from "@/components/folds/ProgressionSectionMobile";
import { Fold6Cta } from "@/components/folds/Fold6Cta";
import { Fold6CtaMobile } from "@/components/folds/Fold6CtaMobile";
import { PartnersStrip } from "@/components/folds/PartnersStrip";
import { Fold8Belief } from "@/components/folds/Fold8Belief";
import { Fold8BeliefMobile } from "@/components/folds/Fold8BeliefMobile";
import { FooterMobile } from "@/components/folds/FooterMobile";
import { withBasePath } from "@/lib/basePath";
import { useIsDesktop } from "@/lib/useIsDesktop";

const progressionSteps = [
  {
    number: "01",
    title: "Built to Build",
    body: "We have six labs for rapid prototyping, industrial design, mechanical and electrical engineering, metrology, and new product introduction. Space to build intelligent systems that sense, decide, and act like they belong in the world.",
    image: withBasePath("/images/fold-3.png"),
  },
  {
    number: "02",
    title: "Hands-On Experts",
    body: "You get structured working sessions with frog, Synapse, and Capgemini Experience Engineering experts, across strategy, design, hardware, AI, simulation, and embedded software. People who build alongside you, not just advice from the sidelines.",
    image: withBasePath("/images/fold-4.png"),
  },
  {
    number: "03",
    title: "A Straight Line to Enterprise",
    body: "We work with 85% of the 200 largest public companies on the Forbes Global 2000 list. We bring real world applications for what you build here.",
    image: withBasePath("/images/fold-5.png"),
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const progressionRef = useRef<HTMLDivElement>(null);
  const progressionRefMobile = useRef<HTMLDivElement>(null);
  const partnersStripRef = useRef<HTMLDivElement>(null);
  const partnersStripRefMobile = useRef<HTMLDivElement>(null);

  // Resolves to null until the first client-side check runs, then stays
  // true/false for the session. Rendering nothing until it resolves keeps
  // the desktop tree (GSAP ScrollTrigger, the scroll-scrubbed video) from
  // ever mounting on a mobile viewport, and vice versa — the two layouts
  // never coexist in the DOM, so neither can bleed into the other.
  const isDesktop = useIsDesktop();

  if (isDesktop === null) return null;

  if (!isDesktop) {
    return (
      <>
        <MobileSiteNav heroRef={heroRef} darkSectionRefs={[partnersStripRefMobile, progressionRefMobile]} />
        <Fold1HeroMobile heroRef={heroRef} />
        <PartnersStrip sectionRef={partnersStripRefMobile} />
        <Fold2IntroMobile />
        <ProgressionSectionMobile steps={progressionSteps} sectionRef={progressionRefMobile} />
        <Fold6CtaMobile />
        <Fold8BeliefMobile />
        <FooterMobile />
      </>
    );
  }

  return (
    <>
      <SiteNav heroRef={heroRef} darkSectionRefs={[partnersStripRef, progressionRef]} />
      <Fold1Hero heroRef={heroRef} />
      {/* Everything after the hero needs its own stacking context — the
          hero video canvas is `fixed`, and positioned elements always
          paint above later static-flow siblings regardless of DOM order
          or z-index value, so without this the video bleeds through. */}
      <div className="relative z-10">
        <PartnersStrip sectionRef={partnersStripRef} />
        <Fold2Intro />
        <ProgressionSection steps={progressionSteps} sectionRef={progressionRef} />
        <Fold6Cta />
        <Fold8Belief />
        <Footer />
      </div>
    </>
  );
}

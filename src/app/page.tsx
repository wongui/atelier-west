"use client";

import { useRef } from "react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { Fold1Hero } from "@/components/folds/Fold1Hero";
import { Fold2Intro } from "@/components/folds/Fold2Intro";
import { ProgressionSection } from "@/components/folds/ProgressionSection";
import { Fold6Cta } from "@/components/folds/Fold6Cta";
import { Fold7Partners } from "@/components/folds/Fold7Partners";
import { Fold8Belief } from "@/components/folds/Fold8Belief";
import { withBasePath } from "@/lib/basePath";

const progressionSteps = [
  {
    number: "01",
    title: "Built to Build",
    body: "We have six labs for rapid prototyping, industrial design, mechanical and electrical engineering, metrology, and new product introduction. Space to build intelligent systems that sense, decide, and act like they belong in the world.",
    image: withBasePath("/images/fold-3.jpg"),
  },
  {
    number: "02",
    title: "Hands-On Experts",
    body: "You get structured working sessions with frog, Synapse, and Capgemini Experience Engineering experts, across strategy, design, hardware, AI, simulation, and embedded software. People who build alongside you, not just advice from the sidelines.",
    image: withBasePath("/images/fold-4.jpg"),
  },
  {
    number: "03",
    title: "A Straight Line to Enterprise",
    body: "We work with 85% of the 200 largest public companies on the Forbes Global 2000 list. We bring real world applications for what you build here.",
    image: withBasePath("/images/fold-5.jpg"),
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const progressionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <SiteNav heroRef={heroRef} darkSectionRef={progressionRef} />
      <Fold1Hero heroRef={heroRef} />
      {/* Everything after the hero needs its own stacking context — the
          hero video canvas is `fixed`, and positioned elements always
          paint above later static-flow siblings regardless of DOM order
          or z-index value, so without this the video bleeds through. */}
      <div className="relative z-10">
        <Fold2Intro />
        <ProgressionSection steps={progressionSteps} sectionRef={progressionRef} />
        <Fold6Cta />
        <Fold7Partners />
        <Fold8Belief />
        <Footer />
      </div>
    </>
  );
}

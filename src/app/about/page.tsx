"use client";

import { useMemo, useRef } from "react";
import { SiteNav } from "@/components/SiteNav";
import { MobileSiteNav } from "@/components/MobileSiteNav";
import { Footer } from "@/components/Footer";
import { FooterMobile } from "@/components/folds/FooterMobile";
import { ImageTextFold } from "@/components/folds/about/ImageTextFold";
import { ImageTextFoldMobile } from "@/components/folds/about/ImageTextFoldMobile";
import { ProgressionSection } from "@/components/folds/ProgressionSection";
import { ProgressionSectionMobile } from "@/components/folds/ProgressionSectionMobile";
import { LabFacilitiesGrid } from "@/components/folds/about/LabFacilitiesGrid";
import { MentorshipGrid } from "@/components/folds/about/MentorshipGrid";
import { AboutClosingCta } from "@/components/folds/about/AboutClosingCta";
import { withBasePath } from "@/lib/basePath";
import { useIsDesktop } from "@/lib/useIsDesktop";

const programSteps = [
  {
    number: "Weeks 0-1",
    title: "Onboarding & Lab Training",
    body: "Get access to your lab space, meet your expert mentors, and get trained on the equipment you'll be using.",
    image: withBasePath("/images/about-program-1.png"),
  },
  {
    number: "Weeks 2-11",
    title: "Build",
    body: "Utilize the space to push your solution forward together with experts. There will also be a handful of cohort events built around your specific problem set.",
    image: withBasePath("/images/about-program-2.png"),
  },
  {
    number: "Week 12",
    title: "Demo Day",
    body: "Show what you built to enterprise partners and investors",
    image: withBasePath("/images/about-program-3.png"),
  },
];

const labs = [
  {
    title: "Rapid Prototyping",
    body: "3D printers, laser cutters, and cleaning/cutting/sewing stations, for turning ideas into physical prototypes quickly.",
    image: "/images/about-lab-rapid-prototyping.jpg",
  },
  {
    title: "Industrial Design",
    body: "Precision woodworking and hand tools, for shaping how a product looks and feels.",
    image: "/images/about-lab-industrial-design.jpg",
  },
  {
    title: "Mechanical Engineering",
    body: "CNC machine, lathe, drill press, welding equipment, for fabricating and modifying structural parts.",
    image: "/images/about-lab-mechanical-engineering.jpg",
  },
  {
    title: "Electrical Engineering",
    body: "Solder stations, oscilloscopes, and microelectronics test rigs, for building and testing electronic subsystems.",
    image: "/images/about-lab-electrical-engineering.jpg",
  },
  {
    title: "Metrology Lab",
    body: "Digital microscope, tensile tester, climate chamber, for stress-testing prototypes and validating tolerances.",
    image: "/images/about-lab-metrology.jpg",
  },
];

const mentors = Array.from({ length: 6 }, () => ({
  name: "Antonello Crimi",
  role: "UX/UI Design",
  image: "/placeholder-photo.svg",
}));

export default function AboutPage() {
  const costCommitmentRef = useRef<HTMLDivElement>(null);
  const progressionRef = useRef<HTMLDivElement>(null);
  const labFacilitiesRef = useRef<HTMLDivElement>(null);
  const partnerBenefitsRef = useRef<HTMLDivElement>(null);

  // Refs are stable across renders, so this array's identity is too —
  // keeps SiteNav's watcher effect from tearing down/recreating its
  // ScrollTriggers on every re-render (e.g. each isOverDark toggle).
  const darkSectionRefs = useMemo(
    () => [costCommitmentRef, progressionRef, labFacilitiesRef, partnerBenefitsRef],
    []
  );

  // Resolves to null until the first client-side check runs, then stays
  // true/false for the session — same technique as the home page, keeping
  // the desktop tree (GSAP ScrollTrigger pins) from ever mounting on a
  // mobile viewport, and vice versa.
  const isDesktop = useIsDesktop();

  if (isDesktop === null) return null;

  if (!isDesktop) {
    return (
      <>
        <MobileSiteNav darkSectionRefs={darkSectionRefs} />

        <div aria-hidden className="h-16" />

        <ImageTextFoldMobile
          id="about-intro"
          bg="light"
          image={withBasePath("/images/about-intro.png")}
          shape="blob-a"
          heading="Atelier West is a 12-week, cash- and equity-free residency program for committed, ambitious Physical AI startups."
          body="Cohort companies work out of our San Francisco Mission Rock labs, get structured time to work directly with experts in design, strategy, hardware, and AI, and close the program with a demo day in front of enterprise partners and investors."
        />

        <ImageTextFoldMobile
          id="cost-commitment"
          bg="dark"
          sectionRef={costCommitmentRef}
          image={withBasePath("/images/about-cost-commitment.png")}
          shape="blob-b"
          heading="Cost & Commitment"
          body={[
            "The program is free for participants - no equity, no cash. You will be asked for a refundable deposit tied to lab access.",
            "We are sponsoring this program in order to provide the environment and expertise needed to jointly turn promising technology into real-world impact.",
            "The only commitment we ask from participants is to partner with us on joint case studies, reference architectures, pilot projects, and/or thought leadership.",
          ]}
        />

        <ProgressionSectionMobile steps={programSteps} sectionRef={progressionRef} />

        <LabFacilitiesGrid
          heading="Lab & Facilities Access"
          intro="Access to six labs at Mission Rock. All participants will be required to complete training for equipment used and follow all required safety procedures."
          labs={labs}
          sectionRef={labFacilitiesRef}
        />

        <MentorshipGrid
          heading="Expert Mentorship"
          intro="Scheduled office hours with experts from frog, Synapse, and Capgemini Experience Engineering across strategy, design, hardware, AI, simulation, and embedded software. We start with an intake process to understand what you need, technical or strategic, then match you with a shortlist of relevant experts. You self-schedule time with them for the rest of the program."
          mentors={mentors}
        />

        <ImageTextFoldMobile
          id="events-enterprise"
          bg="light"
          image={withBasePath("/images/about-events-enterprise.png")}
          shape="blob-a"
          heading="Events & Enterprise Access"
          body="Beyond 1:1 mentorship, you'll join a handful of group workshops throughout the program, built around your cohort's needs and connecting you with relevant enterprise companies. The program closes with a demo day in front of enterprise partners and investors."
        />

        <ImageTextFoldMobile
          id="partner-benefits"
          bg="dark"
          sectionRef={partnerBenefitsRef}
          image={withBasePath("/images/about-partner-benefits.png")}
          shape="blob-b"
          heading="Partner Benefits"
          body="Cohort participants will also be prioritized to join NVIDIA's Inception Program. Companies in this program get access to the latest developer tools and training, preferred pricing on NVIDIA hardware and software, exclusive offers from partners, and exposure to a global ecosystem of investors. Participants will need to submit a separate, short application for Inception, which will be linked to from our Application form."
        />

        <AboutClosingCta
          heading="We're looking for committed teams building in Physical AI and solving a clear, named problem."
          body={[
            "Physical AI refers to artificial intelligence systems that are embodied in or directly interact with the physical world, perceiving the environment through sensors, making context-aware decisions, and taking actions autonomously. This could include robotics, autonomous machines, computer vision systems, agent-first or edge AI devices.",
            "See Application page for all eligibility details.",
          ]}
        />

        <FooterMobile />
      </>
    );
  }

  return (
    <>
      <SiteNav activeAbout darkSectionRefs={darkSectionRefs} />

      {/* No hero on this page — the nav is still fixed/overlaid per Figma,
          so this spacer keeps the intro heading clear of it instead of
          sitting directly underneath. */}
      <div aria-hidden className="h-16" />

      <ImageTextFold
        id="about-intro"
        bg="light"
        image={withBasePath("/images/about-intro.png")}
        shape="blob-a"
        heading="Atelier West is a 12-week, cash- and equity-free residency program for committed, ambitious Physical AI startups."
        body="Cohort companies work out of our San Francisco Mission Rock labs, get structured time to work directly with experts in design, strategy, hardware, and AI, and close the program with a demo day in front of enterprise partners and investors."
      />

      <ImageTextFold
        id="cost-commitment"
        bg="dark"
        sectionRef={costCommitmentRef}
        image={withBasePath("/images/about-cost-commitment.png")}
        shape="blob-b"
        heading="Cost & Commitment"
        body={[
          "The program is free for participants - no equity, no cash. You will be asked for a refundable deposit tied to lab access.",
          "We are sponsoring this program in order to provide the environment and expertise needed to jointly turn promising technology into real-world impact.",
          "The only commitment we ask from participants is to partner with us on joint case studies, reference architectures, pilot projects, and/or thought leadership.",
        ]}
      />

      <ProgressionSection steps={programSteps} sectionRef={progressionRef} />

      <LabFacilitiesGrid
        heading="Lab & Facilities Access"
        intro="Access to six labs at Mission Rock. All participants will be required to complete training for equipment used and follow all required safety procedures."
        labs={labs}
        sectionRef={labFacilitiesRef}
      />

      <MentorshipGrid
        heading="Expert Mentorship"
        intro="Scheduled office hours with experts from frog, Synapse, and Capgemini Experience Engineering across strategy, design, hardware, AI, simulation, and embedded software. We start with an intake process to understand what you need, technical or strategic, then match you with a shortlist of relevant experts. You self-schedule time with them for the rest of the program."
        mentors={mentors}
      />

      <ImageTextFold
        id="events-enterprise"
        bg="light"
        image={withBasePath("/images/about-events-enterprise.png")}
        shape="blob-a"
        heading="Events & Enterprise Access"
        body="Beyond 1:1 mentorship, you'll join a handful of group workshops throughout the program, built around your cohort's needs and connecting you with relevant enterprise companies. The program closes with a demo day in front of enterprise partners and investors."
      />

      <ImageTextFold
        id="partner-benefits"
        bg="dark"
        sectionRef={partnerBenefitsRef}
        image={withBasePath("/images/about-partner-benefits.png")}
        shape="blob-b"
        heading="Partner Benefits"
        body="Cohort participants will also be prioritized to join NVIDIA's Inception Program. Companies in this program get access to the latest developer tools and training, preferred pricing on NVIDIA hardware and software, exclusive offers from partners, and exposure to a global ecosystem of investors. Participants will need to submit a separate, short application for Inception, which will be linked to from our Application form."
      />

      <AboutClosingCta
        heading="We're looking for committed teams building in Physical AI and solving a clear, named problem."
        body={[
          "Physical AI refers to artificial intelligence systems that are embodied in or directly interact with the physical world, perceiving the environment through sensors, making context-aware decisions, and taking actions autonomously. This could include robotics, autonomous machines, computer vision systems, agent-first or edge AI devices.",
          "See Application page for all eligibility details.",
        ]}
      />

      <Footer />
    </>
  );
}

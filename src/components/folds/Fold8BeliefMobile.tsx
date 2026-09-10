"use client";

import { TextLink } from "@/components/TextLink";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

/**
 * Mobile Fold8 — Belief. Desktop centers the brain render as a full-bleed
 * background with text at col6-8; mobile instead caps the image at the top
 * 70% of the section, blending into the solid coral bg behind the text
 * below it — same treatment as the mobile hero's image-to-bg blend.
 */
export function Fold8BeliefMobile() {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-surface-accent px-(--spacing-page) pb-16 pt-24">
      <img
        src={withBasePath("/images/fold-8-mobile.png")}
        alt=""
        className="absolute inset-x-0 top-0 h-[70%] w-full object-cover"
      />
      {/* Blends the image's bottom edge into the solid coral bg behind the
          text, same technique as Fold1HeroMobile's image-to-bg blend. */}
      <div className="absolute inset-x-0 top-[calc(70%-8rem)] h-32 bg-gradient-to-b from-surface-accent/0 to-surface-accent" />

      <div ref={text.ref} className={`relative flex flex-col items-start gap-6 ${text.revealClassName}`}>
        <h2 className="font-display text-[30px] leading-[1.1] text-text-on-light">
          We believe that the future of AI is physical
        </h2>
        <p className="font-body text-body text-text-on-light">
          Atelier West is a 12-week, cash- and equity-free, cohort-based
          residency based in San Francisco Mission Rock for Physical AI
          startups with lab access, expert mentorship, and enterprise
          partners, designed to give your technology a place to prove
          itself and scale.
        </p>
        <TextLink href="#">
          Learn more about our commitment to Physical AI
        </TextLink>
      </div>
    </div>
  );
}

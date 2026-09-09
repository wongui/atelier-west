import type { RefObject } from "react";

interface Step {
  number: string;
  title: string;
  body: string;
  image: string;
}

interface ProgressionSectionMobileProps {
  steps: Step[];
  /** Exposes the section's wrapper so MobileSiteNav can watch it and swap
   * to its cream treatment while it's under the fixed nav — same purpose
   * as ProgressionSection's sectionRef, kept independent. */
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Mobile Folds 3-5 — per Figma's mobile frame, this drops the desktop
 * pinned/crossfade mechanic (ScrollTrigger + snap) entirely and just
 * stacks each step as its own full-height section with its own
 * background photo. Simpler and avoids fighting GSAP pinning at small
 * viewport sizes.
 */
export function ProgressionSectionMobile({ steps, sectionRef }: ProgressionSectionMobileProps) {
  return (
    <div ref={sectionRef} className="flex flex-col">
      {steps.map((step) => (
        <section
          key={step.number}
          className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-surface-dark px-(--spacing-page) py-24 text-text-on-dark"
        >
          <img
            src={step.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />

          <div className="relative flex flex-col gap-2">
            <span className="font-display text-[30px] leading-none">{step.number}</span>
            <span className="font-display text-[30px] leading-none">{step.title}</span>
          </div>
          <div className="relative mt-6 h-px w-full bg-text-on-dark/50" />
          <p className="relative mt-6 font-body text-body leading-[28px]">{step.body}</p>
        </section>
      ))}
    </div>
  );
}

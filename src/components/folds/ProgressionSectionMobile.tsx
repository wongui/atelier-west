"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StepProgress } from "@/components/StepProgress";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

// Extra scroll distance at the very start, held on step 1 with the
// progress bar at 0% — gives a beat to read step 1 before anything
// starts advancing, instead of the bar (and eventually the crossfade)
// moving from the instant the section is reached.
const READING_BUFFER_VH = 60;

interface Step {
  number: string;
  title: string;
  body: string;
  image: string;
}

interface ProgressionSectionMobileProps {
  steps: Step[];
  /** Exposes the section's wrapper so MobileSiteNav can watch it and swap
   * to its cream treatment while it's under the fixed nav. */
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Mobile Folds 3-5 — mirrors desktop ProgressionSection's pin + crossfade
 * + continuous progress-bar interaction (per explicit request: same feel
 * as desktop, own component, desktop's file untouched), laid out as a
 * single stacked column instead of the 8-col grid.
 */
export function ProgressionSectionMobile({ steps, sectionRef }: ProgressionSectionMobileProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const number = useReveal<HTMLDivElement>();
  const title = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const totalVh = steps.length * 100 + READING_BUFFER_VH;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        // Raw progress covers the whole pin range including the leading
        // buffer; re-map so effective progress sits at 0 for that entire
        // buffer, then behaves exactly like before across the steps.
        const rawVh = self.progress * totalVh;
        const effective = Math.min(1, Math.max(0, (rawVh - READING_BUFFER_VH) / (steps.length * 100)));
        if (fillRef.current) {
          fillRef.current.style.width = `${effective * 100}%`;
        }
        const next = Math.min(steps.length - 1, Math.floor(effective * steps.length));
        setActiveStep((prev) => (prev === next ? prev : next));
      },
    });

    return () => trigger.kill();
  }, [steps.length]);

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node;
        if (sectionRef) sectionRef.current = node;
      }}
      className="relative"
      style={{ height: `${steps.length * 100 + READING_BUFFER_VH}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-surface-dark text-text-on-dark">
        {steps.map((step, i) => (
          <img
            key={step.number}
            src={step.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: i === activeStep ? 1 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative flex h-full flex-col justify-center gap-4 px-(--spacing-page)">
          <div ref={number.ref} className={`relative ${number.revealClassName}`}>
            {steps.map((step, i) => (
              <span
                key={step.number}
                className="absolute inset-x-0 top-0 font-display text-[30px] leading-none transition-opacity duration-500"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              >
                {step.number}
              </span>
            ))}
            <span className="font-display text-[30px] leading-none opacity-0" aria-hidden>
              {steps[0].number}
            </span>
          </div>

          <div ref={title.ref} className={`relative ${title.revealClassName}`}>
            {steps.map((step, i) => (
              <h3
                key={step.number}
                className="absolute inset-x-0 top-0 font-display text-[30px] leading-none transition-opacity duration-500"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              >
                {step.title}
              </h3>
            ))}
            <h3 className="font-display text-[30px] leading-none opacity-0" aria-hidden>
              {steps.reduce((longest, s) => (s.title.length > longest.length ? s.title : longest), "")}
            </h3>
          </div>

          <StepProgress
            fillRef={fillRef}
            totalSteps={steps.length}
            className="-mx-(--spacing-page)"
          />

          <div ref={body.ref} className={`relative ${body.revealClassName}`}>
            {steps.map((step, i) => (
              <p
                key={step.number}
                className="absolute inset-x-0 top-0 font-body text-body leading-[28px] transition-opacity duration-500"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              >
                {step.body}
              </p>
            ))}
            <p className="font-body text-body leading-[28px] opacity-0" aria-hidden>
              {steps.reduce((longest, s) => (s.body.length > longest.length ? s.body : longest), "")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StepProgress } from "@/components/StepProgress";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  title: string;
  body: string;
  image: string;
}

interface ProgressionSectionProps {
  steps: Step[];
  /** Exposes the section's wrapper so SiteNav can watch it and swap the
   * nav to its cream/beige treatment while it's the pinned backdrop. */
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Folds 3-5 — Floema-style pinned "How it works" progression. Content
 * (image/number/title/body) changes discretely between the 3 steps —
 * activeStep only updates on an actual threshold crossing, so each step
 * holds fully static while pinned, with a quick crossfade to the next —
 * but the scroll position itself is NOT snapped (no ScrollTrigger
 * `snap`): the progress-bar fill and the user's actual scroll stay 1:1,
 * so a small scroll gesture only moves the bar a little instead of
 * jumping the page to the next step. Each step gets exactly one full
 * viewport height of scroll. Column layout matches Figma exactly:
 * number+title in col1, a full-bleed divider between them, body copy in
 * col4.
 */
export function ProgressionSection({ steps, sectionRef }: ProgressionSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const number = useReveal<HTMLDivElement>();
  const title = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (fillRef.current) {
          fillRef.current.style.width = `${self.progress * 100}%`;
        }
        const next = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
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
      style={{ height: `${steps.length * 100}vh` }}
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

        <FoldGrid className="absolute inset-0 content-start pt-24 pb-16">
          <div
            ref={number.ref}
            className={`relative col-start-1 col-span-2 row-start-1 mt-[26vh] ${number.revealClassName}`}
          >
            {steps.map((step, i) => (
              <span
                key={step.number}
                className="absolute inset-x-0 top-0 font-display text-h1 text-text-on-dark transition-opacity duration-500"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              >
                {step.number}
              </span>
            ))}
            <span className="font-display text-h1 opacity-0" aria-hidden>
              {steps[0].number}
            </span>
          </div>

          {/* The divider-with-fill sits between the number and the title, per Figma — not a separate progress UI at the bottom. Fill tracks continuous scroll position, not the discrete step. */}
          <StepProgress
            fillRef={fillRef}
            className="col-start-1 col-span-8 row-start-1 mt-[calc(26vh+4.375rem)] -mx-(--spacing-page) text-text-on-dark"
          />

          <div
            ref={title.ref}
            className={`relative col-start-1 col-span-3 row-start-1 mt-[calc(26vh+4.375rem+0.5rem)] ${title.revealClassName}`}
          >
            {steps.map((step, i) => (
              <h3
                key={step.number}
                className="absolute inset-x-0 top-0 font-display text-h1 text-text-on-dark transition-opacity duration-500"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              >
                {step.title}
              </h3>
            ))}
            {/* Sizing spacer sized to the longest title (may wrap to 2 lines) so the absolutely-positioned crossfade above always has room. */}
            <h3 className="font-display text-h1 opacity-0" aria-hidden>
              {steps.reduce((longest, s) => (s.title.length > longest.length ? s.title : longest), "")}
            </h3>
          </div>

          <div
            ref={body.ref}
            className={`relative col-start-4 col-span-2 row-start-1 mt-[calc(26vh+4.375rem+0.5rem)] ${body.revealClassName}`}
          >
            {steps.map((step, i) => (
              <p
                key={step.number}
                className="absolute inset-x-0 top-0 font-body text-body text-text-on-dark transition-opacity duration-500"
                style={{ opacity: i === activeStep ? 1 : 0 }}
              >
                {step.body}
              </p>
            ))}
            <p className="font-body text-body opacity-0" aria-hidden>
              {steps[0].body}
            </p>
          </div>
        </FoldGrid>
      </div>
    </div>
  );
}

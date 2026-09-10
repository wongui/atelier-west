"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StepProgress } from "@/components/StepProgress";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

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
  /** "dark" (default) matches Home's charcoal/cream treatment. "light"
   * flips to the beige/charcoal (surface-light/text-on-light) pairing —
   * About's own request, kept independent of Home's styling. */
  bg?: "dark" | "light";
}

// Extra scroll distance, ahead of AND behind the steps.length x 100vh
// needed for the horizontal traversal itself, spent fully static on step
// 1 / step N — see desktop ProgressionSection's HOLD_VH for the full
// reasoning (same mechanic, mirrored here).
const HOLD_VH = 50;

/**
 * Mobile Folds 3-5 — same pinned horizontal-scroll-track mechanic as
 * desktop's ProgressionSection (steps side by side in one wide track,
 * translateX driven 1:1 by scroll while pinned, leading/trailing static
 * holds, continuous progress bar), laid out as a single stacked column
 * per step instead of desktop's 8-col grid: progress bar, then
 * number/title, then body copy, then the photo filling whatever vertical
 * space is left down to the bottom margin.
 */
export function ProgressionSectionMobile({ steps, sectionRef, bg = "dark" }: ProgressionSectionMobileProps) {
  const bgClassName = bg === "light" ? "bg-surface-light text-text-on-light" : "bg-surface-dark text-text-on-dark";
  const progressTextClassName = bg === "light" ? "text-text-on-light" : "text-text-on-dark";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  // The text block (title + body) needs the SAME reserved height on
  // every panel so all 3 images start at the same point regardless of
  // how much a given step's copy wraps — sized to the longest title and
  // longest body across all steps (independently, since the longest of
  // each may come from different steps) via an invisible sizing spacer,
  // same technique the pre-redesign version of this component used.
  const longestTitle = steps.reduce((longest, s) => (s.title.length > longest.length ? s.title : longest), "");
  const longestBody = steps.reduce((longest, s) => (s.body.length > longest.length ? s.body : longest), "");
  // Watches the sticky inner div (fixed 100vh), not the outer pinned
  // wrapper — see desktop ProgressionSection for why (IntersectionObserver
  // ratio shrinks as the wrapper grows with the hold zones, and can drop
  // under the reveal's threshold before ever firing).
  const sectionReveal = useReveal<HTMLDivElement>();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const traversalVh = steps.length * 100;
    // Actual scrubbed range while pinned is (wrapper height - one
    // viewport) — see desktop ProgressionSection's pinDurationVh comment.
    const pinDurationVh = traversalVh + HOLD_VH * 2;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const scrolledVh = self.progress * pinDurationVh;
        const traversalScrolled = Math.min(traversalVh, Math.max(0, scrolledVh - HOLD_VH));
        const traversalProgress = traversalScrolled / traversalVh;

        if (fillRef.current) {
          fillRef.current.style.width = `${traversalProgress * 100}%`;
        }
        const xPercent = -(traversalProgress * (steps.length - 1) * 100) / steps.length;
        track.style.transform = `translateX(${xPercent}%)`;
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
      style={{ height: `${steps.length * 100 + HOLD_VH * 2 + 100}vh` }}
    >
      <div
        ref={sectionReveal.ref}
        className={`sticky top-0 h-screen overflow-hidden ${bgClassName}`}
      >
        {/* Same 2rem (32px) rhythm as desktop, repeated below the fixed
            MobileSiteNav (bottom ~59px): nav→progress (this offset),
            progress→text (pt-[124px] below == this + ~1px bar + 2rem),
            text→image (mt-8 on the image block). */}
        <StepProgress fillRef={fillRef} className={`absolute inset-x-0 top-[91px] mx-(--spacing-page) ${progressTextClassName}`} />

        <div
          ref={trackRef}
          className={`flex h-full ${sectionReveal.revealClassName}`}
          style={{ width: `${steps.length * 100}%`, willChange: "transform" }}
        >
          {steps.map((step) => (
            <div key={step.number} className="flex h-full shrink-0 flex-col px-(--spacing-page) pt-[124px] pb-8" style={{ width: `${100 / steps.length}%` }}>
              <div className="relative shrink-0">
                {/* Invisible spacer reserving the worst-case height (see
                    longestTitle/longestBody above) — real content is the
                    absolutely-positioned block below it. */}
                <div aria-hidden className="invisible">
                  <span className="font-display text-[30px] leading-none">{step.number}</span>
                  <h3 className="mt-2 font-display text-[30px] leading-none">{longestTitle}</h3>
                  <p className="mt-3 font-body text-body leading-[28px]">{longestBody}</p>
                </div>
                <div className="absolute inset-0">
                  <span className="font-display text-[30px] leading-none">{step.number}</span>
                  <h3 className="mt-2 font-display text-[30px] leading-none">{step.title}</h3>
                  <p className="mt-3 font-body text-body leading-[28px]">{step.body}</p>
                </div>
              </div>
              {/* min-h-0 overrides flex's automatic minimum size — without
                  it, the <img>'s intrinsic aspect ratio inflates this
                  flex-1 area past the space actually available. */}
              <div className="relative mt-8 min-h-0 flex-1">
                <img src={step.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

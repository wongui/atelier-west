"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORDMARK_TEXT = "Atelier West";
// Fraction of the viewport width the tracked-out wordmark should span —
// "at least half" per request. Solved for below rather than a fixed
// tracking value, so it holds proportionally across phone sizes instead
// of being tuned to one device.
const WORDMARK_WIDTH_FRACTION = 0.5;

interface MobileSiteNavProps {
  /** Optional dark/photo section (mobile Folds 3-5) to watch — while it's
   * under the fixed nav, the wordmark/About switch to the cream treatment
   * so they stay visible over the dark imagery. Same idea as SiteNav's
   * darkSectionRef, kept independent so this component never touches
   * desktop SiteNav's own state or DOM. */
  darkSectionRef?: RefObject<HTMLElement | null>;
}

/**
 * Mobile nav — a plain fixed compact bar, no scroll-linked morph (the
 * desktop hero-to-compact size/tracking animation only exists because the
 * desktop hero has a huge resting wordmark; the mobile hero's wordmark is
 * already compact-sized per Figma, so there's nothing to morph from).
 */
export function MobileSiteNav({ darkSectionRef }: MobileSiteNavProps) {
  const [isOverDark, setIsOverDark] = useState(false);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const darkSection = darkSectionRef?.current;
    if (!darkSection) return;

    const trigger = ScrollTrigger.create({
      trigger: darkSection,
      start: "top top",
      end: "bottom top",
      onToggle: (self) => setIsOverDark(self.isActive),
    });

    return () => trigger.kill();
  }, [darkSectionRef]);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const measure = measureRef.current;
    if (!wordmark || !measure) return;

    // Same technique as desktop SiteNav's hero-state tracking: a hidden
    // 0-tracking clone gives the wordmark's natural width at this
    // font-size, then letter-spacing is solved so the tracked-out text
    // fills the target width exactly, at any viewport size — a fixed px
    // tracking value only looks "at least half the screen" on the one
    // phone width it was tuned against.
    const recompute = () => {
      const target = window.innerWidth * WORDMARK_WIDTH_FRACTION;
      const natural = measure.getBoundingClientRect().width;
      const tracking = Math.max(0, (target - natural) / (WORDMARK_TEXT.length - 1));
      wordmark.style.letterSpacing = `${tracking}px`;
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  const textClassName = isOverDark ? "text-text-on-dark" : "text-text-on-light";

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-(--spacing-page) py-4">
      {/* Same font-size as "About" (text-body) — letter-spacing is what
          gives it presence as a lockup, solved above to hit
          WORDMARK_WIDTH_FRACTION of the viewport rather than a fixed px
          value tuned to one device. */}
      <Link
        ref={wordmarkRef}
        href="/"
        className={`shrink-0 font-display text-body uppercase whitespace-nowrap ${textClassName}`}
      >
        {WORDMARK_TEXT}
      </Link>
      {/* Hidden 0-tracking clone used only to measure natural width. */}
      <span
        ref={measureRef}
        aria-hidden
        className="fixed top-0 left-[-9999px] font-display text-body uppercase whitespace-nowrap"
        style={{ letterSpacing: 0 }}
      >
        {WORDMARK_TEXT}
      </span>
      <Link href="/about" className={`shrink-0 font-body text-body ${textClassName}`}>
        About
      </Link>
    </div>
  );
}

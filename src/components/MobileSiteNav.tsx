"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

  const textClassName = isOverDark ? "text-text-on-dark" : "text-text-on-light";
  // No background fill (per request — transparent like desktop's nav).
  // A soft drop-shadow keeps the labels legible over whatever's
  // scrolling underneath without reading as a solid bar.
  const shadowStyle = { filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))" };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-(--spacing-page) py-4">
      {/* Same size as "About" (text-body) rather than desktop's compact
          nav lockup (25.4px/10.16px tracking — tuned for a much wider
          desktop grid column and looked small/cramped next to About at
          mobile width); tracking pushed out further since a serif
          wordmark at body size needs more room to read as a lockup. */}
      <Link
        href="/"
        style={shadowStyle}
        className={`shrink-0 font-display text-body uppercase tracking-[3px] whitespace-nowrap max-w-[60vw] overflow-hidden text-ellipsis ${textClassName}`}
      >
        Atelier West
      </Link>
      <Link href="/about" style={shadowStyle} className={`shrink-0 font-body text-body ${textClassName}`}>
        About
      </Link>
    </div>
  );
}

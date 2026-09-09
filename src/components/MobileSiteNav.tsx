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
  // A scrim behind the nav row — unlike desktop, where the nav's own
  // wordmark/About/Apply are choreographed to the hero's scroll (so
  // they're never near the top edge while hero copy is also there),
  // mobile's hero content scrolls past underneath this plain fixed bar
  // on its way offscreen. Without a background, that copy visually
  // collides with the nav labels for a moment; the scrim keeps the nav
  // legible through every fold instead of only fixing one collision.
  const bgClassName = isOverDark ? "bg-surface-dark/70" : "bg-surface-light/80";

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-(--spacing-page) py-4 backdrop-blur-sm transition-colors ${bgClassName}`}
    >
      {/* Sized (not the desktop compact nav's fixed 25.4px/10.16px-tracking
          lockup — that's tuned for a much wider desktop grid column and
          overflows a phone width) so the wordmark tops out around half the
          viewport, always leaving room for "About" on the right. */}
      <Link
        href="/"
        className={`shrink-0 font-display uppercase text-[15px] tracking-[1.5px] whitespace-nowrap max-w-[55vw] overflow-hidden text-ellipsis ${textClassName}`}
      >
        Atelier West
      </Link>
      <Link href="/about" className={`shrink-0 font-body text-body ${textClassName}`}>
        About
      </Link>
    </div>
  );
}

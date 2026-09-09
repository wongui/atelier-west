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

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-(--spacing-page) py-4">
      <Link
        href="/"
        className={`font-display uppercase text-[24px] tracking-[19px] whitespace-nowrap ${textClassName}`}
      >
        Atelier West
      </Link>
      <Link href="/about" className={`font-body text-body ${textClassName}`}>
        About
      </Link>
    </div>
  );
}

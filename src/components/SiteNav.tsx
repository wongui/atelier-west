"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./Button";
import { FoldGrid } from "./FoldGrid";

gsap.registerPlugin(ScrollTrigger);

const WORDMARK_TEXT = "Atelier West";

interface SiteNavProps {
  /** The page's hero section (Fold1), if it has one — while any part of
   * it is still on screen the nav stays hidden, only fading in once the
   * hero has fully scrolled past. Omit on pages with no hero (About,
   * Apply): the nav then renders visible immediately, as before. */
  heroRef?: RefObject<HTMLElement | null>;
  /** Single dark/photo section to watch — back-compat with the
   * one-section home page usage. See `darkSectionRefs` for the general
   * form. */
  darkSectionRef?: RefObject<HTMLElement | null>;
  /** Any number of dark/photo sections to watch — while any of them is
   * under the fixed nav, the wordmark/About/Apply switch to the cream
   * (--color-text-on-dark / beige #fbfae4) treatment so they stay
   * visible over the dark imagery instead of blending into it. Used on
   * interior pages (About) that have several dark folds, not just one. */
  darkSectionRefs?: RefObject<HTMLElement | null>[];
  /** Underlines "About" to mark it as the current page. */
  activeAbout?: boolean;
  /** Hides the "Apply" pill — used on the Apply page itself, which
   * already has its own larger in-content CTAs, so the nav's Apply
   * button would just be a redundant, smaller duplicate of them. */
  hideApply?: boolean;
}

/**
 * Persistent site nav — fixed at the top, one compact form (wordmark +
 * About + Apply pill), identical on every page. On pages with a hero
 * (heroRef passed), it stays hidden until the hero has fully scrolled
 * past — Fold1 now carries its own large wordmark (see Fold1Hero), so
 * this compact one would otherwise double up with it on screen at the
 * same time. Pages with no hero (About, Apply) render it visible from
 * the start, as before. The on-dark color swap via `darkSectionRefs` is
 * independent of this and still applies whenever it's visible.
 */
export function SiteNav({ heroRef, darkSectionRef, darkSectionRefs, activeAbout = false, hideApply = false }: SiteNavProps) {
  const [isOverDark, setIsOverDark] = useState(false);
  const [isVisible, setIsVisible] = useState(!heroRef);

  useEffect(() => {
    const hero = heroRef?.current;
    if (!hero) return;

    // "bottom top" — fires exactly when the hero's own bottom edge
    // passes the viewport's top edge, i.e. once the hero has fully
    // scrolled out of view. onLeaveBack re-hides the nav if the user
    // scrolls back up into the hero.
    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "bottom top",
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    });

    return () => trigger.kill();
  }, [heroRef]);

  useEffect(() => {
    const sections = [darkSectionRef, ...(darkSectionRefs ?? [])].filter(
      (ref): ref is RefObject<HTMLElement | null> => Boolean(ref?.current)
    );
    if (sections.length === 0) return;

    // Active for the entire time ANY watched dark section occupies the top
    // of the viewport (from its top reaching the nav down to its bottom
    // leaving), not just a single crossing point — matches how long the
    // nav actually sits on top of dark imagery, across possibly several
    // dark folds on a page (About has more than one).
    const activeFlags = sections.map(() => false);
    const triggers = sections.map((section, i) =>
      ScrollTrigger.create({
        trigger: section.current!,
        start: "top top",
        end: "bottom top",
        onToggle: (self) => {
          activeFlags[i] = self.isActive;
          setIsOverDark(activeFlags.some(Boolean));
        },
      })
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  }, [darkSectionRef, darkSectionRefs]);

  return (
    <FoldGrid
      // Nav's own vertical offset from the viewport top, independent of
      // --spacing-page (that token is the page's horizontal content
      // margin — widening it for v2 shouldn't also push the nav further
      // down the page).
      className={`fixed inset-x-0 top-0 z-50 pt-4 pb-4 transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      gridClassName="items-start"
    >
      <Link
        id="site-nav-wordmark"
        href="/"
        className={`col-start-1 col-span-3 font-display uppercase whitespace-nowrap text-wordmark-nav tracking-wordmark-nav ${
          isOverDark ? "text-text-on-dark" : "text-text-on-light"
        }`}
      >
        {WORDMARK_TEXT}
      </Link>
      {/* About and Apply are grouped as one right-justified cluster,
          per Figma (About and Apply sit ~38px apart, both flush to the
          frame's right margin), not spread across separate grid columns.
          On the Apply page (hideApply), About is the cluster's only
          child, so justify-end naturally lands it at the far right where
          Apply would otherwise be — no separate positioning needed. */}
      <div className="col-start-4 col-span-5 flex items-center justify-end gap-9">
        <Link
          id="site-nav-about"
          href="/about"
          className={`font-body text-body ${activeAbout ? "underline underline-offset-2" : ""} ${
            isOverDark ? "text-text-on-dark" : "text-text-on-light"
          }`}
        >
          About
        </Link>
        {!hideApply && (
          <div id="site-nav-apply">
            <Button variant="nav" href="/apply" invert={isOverDark}>
              Apply
            </Button>
          </div>
        )}
      </div>
    </FoldGrid>
  );
}

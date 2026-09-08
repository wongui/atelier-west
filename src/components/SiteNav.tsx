"use client";

import { useEffect, useState, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./Button";
import { FoldGrid } from "./FoldGrid";

gsap.registerPlugin(ScrollTrigger);

const WORDMARK_TEXT = "Atelier West";
const WORDMARK_HERO_SIZE = 42.4;
const WORDMARK_NAV_SIZE = 25.408;
const WORDMARK_NAV_TRACKING = 10.16;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface SiteNavProps {
  heroRef: RefObject<HTMLElement | null>;
  /** Optional dark/photo section (Folds 3-5) to watch — while it's under
   * the fixed nav, the wordmark/About/Apply switch to the cream
   * (--color-text-on-dark / beige #fbfae4) treatment so they stay
   * visible over the dark imagery instead of blending into it. */
  darkSectionRef?: RefObject<HTMLElement | null>;
}

/**
 * Persistent site nav — always fixed at the top, but over the hero its
 * wordmark/About/Apply visually start in the Fold1 "resting" position
 * (huge tracked-out wordmark, About+Apply near the bottom of the first
 * viewport) and morph into the compact top-bar state as the hero scrolls
 * past, per the Figma "Scrolled nav" frames. The wordmark's morph is
 * driven off the same scroll distance as About/Apply's translateY (see
 * `stickyDistance`), so it finishes exactly when they finish sticking to
 * the top rather than over a separately-timed full viewport of scroll —
 * scrolling in lockstep with the content, then staying locked in its
 * compact state for the remainder of the page. Scroll-linear (scrub),
 * not eased independently, since it must track 1:1.
 *
 * The hero-state letter-spacing is computed, not fixed — a hidden
 * measuring span (0 tracking) gives the wordmark's natural width, and
 * tracking is solved so the tracked-out text exactly fills the grid's
 * content width at any viewport size (a fixed px value only fit the
 * 1732px Figma reference frame and overflowed narrower/wider viewports,
 * causing horizontal scroll). The compact nav-bar size stays fixed
 * (confirmed via Figma to be a genuinely different, non-scaling size).
 */
export function SiteNav({ heroRef, darkSectionRef }: SiteNavProps) {
  const [isOverDark, setIsOverDark] = useState(false);

  useEffect(() => {
    const darkSection = darkSectionRef?.current;
    if (!darkSection) return;

    // Active for the entire time the dark section occupies the top of the
    // viewport (from its top reaching the nav down to its bottom leaving),
    // not just a single crossing point — matches how long the nav actually
    // sits on top of the dark imagery.
    const trigger = ScrollTrigger.create({
      trigger: darkSection,
      start: "top top",
      end: "bottom top",
      onToggle: (self) => setIsOverDark(self.isActive),
    });

    return () => trigger.kill();
  }, [darkSectionRef]);

  useEffect(() => {
    const hero = heroRef.current;
    const wordmark = document.getElementById("site-nav-wordmark");
    const measure = document.getElementById("site-nav-wordmark-measure");
    const about = document.getElementById("site-nav-about");
    const apply = document.getElementById("site-nav-apply");
    if (!hero || !wordmark || !measure || !about || !apply) return;

    let heroTracking = 0;
    const recomputeHeroTracking = () => {
      const availableWidth = window.innerWidth - 48; // 2x --spacing-page (24px)
      const naturalWidth = measure.getBoundingClientRect().width;
      // Divide by (length - 1), not length: letter-spacing adds a trailing
      // gap after the LAST character too, which doesn't count as a visible
      // "edge-to-edge" gap — dividing by the full length left a stray extra
      // gap's worth of blank space past the final "T", breaking the
      // 24px-both-sides symmetry with the left margin.
      heroTracking = Math.max(
        0,
        (availableWidth - naturalWidth) / (WORDMARK_TEXT.length - 1)
      );
    };

    // Rest-state translateY for each element, solved from its own natural
    // (untransformed) height so About (plain text) and Apply (a taller
    // pill button) land on the SAME bottom edge — 24px above the viewport
    // bottom, matching Fold1Hero's "Scroll to learn more" — rather than
    // sharing one offset, which only aligned their tops.
    let aboutRestY = 0;
    let applyRestY = 0;
    // How much raw scroll it takes for About/Apply to finish sticking to
    // the top (the slower of the two, i.e. whichever started further from
    // its rest position) — the wordmark's morph is driven off this same
    // distance below, so it finishes exactly when they do instead of
    // dragging on for a full extra viewport of scroll.
    let stickyDistance = 1;
    const recomputeRestOffsets = () => {
      about.style.transform = "";
      apply.style.transform = "";
      const targetBottom = window.innerHeight - 24;
      aboutRestY = targetBottom - about.getBoundingClientRect().bottom;
      applyRestY = targetBottom - apply.getBoundingClientRect().bottom;
      stickyDistance = Math.max(aboutRestY, applyRestY, 1);
    };

    // About/Apply move at exactly the scroll rate (1px per 1px scrolled —
    // the same rate as normal in-flow content, e.g. Fold1Hero's "Scroll to
    // learn more") rather than an eased/normalized progress fraction:
    // driving translateY off raw scroll distance, clamped at 0, is what
    // keeps them moving in lockstep with the page instead of drifting
    // out of sync, then "sticking" the instant each reaches its target.
    const applyScroll = (scrolled: number) => {
      const t = Math.min(1, Math.max(0, scrolled / stickyDistance));
      wordmark.style.fontSize = `${lerp(WORDMARK_HERO_SIZE, WORDMARK_NAV_SIZE, t)}px`;
      wordmark.style.letterSpacing = `${lerp(heroTracking, WORDMARK_NAV_TRACKING, t)}px`;
      about.style.transform = `translateY(${Math.max(0, aboutRestY - scrolled)}px)`;
      apply.style.transform = `translateY(${Math.max(0, applyRestY - scrolled)}px)`;
    };

    recomputeHeroTracking();
    recomputeRestOffsets();

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: () => `+=${window.innerHeight}`,
      scrub: true,
      onUpdate: (self) => applyScroll(self.scroll() - self.start),
    });
    applyScroll(trigger.scroll() - trigger.start);

    const handleResize = () => {
      recomputeHeroTracking();
      recomputeRestOffsets();
      applyScroll(trigger.scroll() - trigger.start);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
    };
  }, [heroRef]);

  return (
    <FoldGrid className="fixed inset-x-0 top-0 z-50 items-start pt-(--spacing-page) pb-4">
      <Link
        id="site-nav-wordmark"
        href="/"
        className={`col-start-1 col-span-3 font-display uppercase whitespace-nowrap ${
          isOverDark ? "text-text-on-dark" : "text-text-on-light"
        }`}
        style={{ fontSize: WORDMARK_HERO_SIZE }}
      >
        {WORDMARK_TEXT}
      </Link>
      {/* Hidden 0-tracking clone used only to measure the wordmark's natural width. */}
      <span
        id="site-nav-wordmark-measure"
        aria-hidden
        className="fixed top-0 left-[-9999px] font-display uppercase whitespace-nowrap"
        style={{ fontSize: WORDMARK_HERO_SIZE, letterSpacing: 0 }}
      >
        {WORDMARK_TEXT}
      </span>
      <Link
        id="site-nav-about"
        href="/about"
        className={`col-start-4 font-body text-body ${
          isOverDark ? "text-text-on-dark" : "text-text-on-light"
        }`}
      >
        About
      </Link>
      <div id="site-nav-apply" className="col-start-8 justify-self-end">
        <Button variant="nav" invert={isOverDark}>
          Apply now
        </Button>
      </div>
    </FoldGrid>
  );
}

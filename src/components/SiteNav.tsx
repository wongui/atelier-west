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
  /**
   * Hero element to morph the wordmark/About/Apply over. Omit on pages
   * with no hero (About, Apply) — the nav then skips the morph animation
   * entirely and renders permanently in its compact "scrolled" resting
   * state instead of starting tracked-out and shrinking on scroll.
   */
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
 * Persistent site nav — always fixed at the top. About/Apply visually
 * start in the Fold1 "resting" position (near the bottom of the first
 * viewport) and slide up into the compact top-bar position as the hero
 * scrolls past, per the Figma "Scrolled nav" frames — driven 1:1 off
 * scroll distance (`stickyDistance`), not eased independently, since it
 * must track the content exactly.
 *
 * The wordmark itself is NOT part of this morph: the large hero wordmark
 * lives in Fold1Hero's normal document flow and scrolls away like any
 * other hero content. The compact nav wordmark instead fades in once
 * Fold1Hero's "Scroll to learn more" hint has fully scrolled past the top
 * of the viewport (#fold1-scroll-hint) — timed off that element rather
 * than the About/Apply sticky distance so the two never overlap — and
 * fades back out if the user scrolls back above that point.
 *
 * On pages with no hero (About, Apply), pass no `heroRef`: the nav then
 * renders directly in its compact resting state from the start, wordmark
 * included — just the fixed nav, still switching to the on-dark
 * treatment via `darkSectionRefs` as the page's own dark folds scroll
 * under it.
 */
export function SiteNav({ heroRef, darkSectionRef, darkSectionRefs, activeAbout = false, hideApply = false }: SiteNavProps) {
  const [isOverDark, setIsOverDark] = useState(false);
  // Only relevant when heroRef is set — before the hero's wordmark finishes
  // scrolling away and About/Apply finish sticking, the compact nav
  // wordmark stays hidden so it doesn't double up with the hero's own.
  const [isWordmarkVisible, setIsWordmarkVisible] = useState(!heroRef);

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

  useEffect(() => {
    // No hero to morph over (About/Apply) — nav stays in its compact
    // resting state, set directly via className below, nothing to animate.
    if (!heroRef) return;

    const hero = heroRef.current;
    const about = document.getElementById("site-nav-about");
    const apply = document.getElementById("site-nav-apply");
    if (!hero || !about || !apply) return;

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
      about.style.transform = `translateY(${Math.max(0, aboutRestY - scrolled)}px)`;
      apply.style.transform = `translateY(${Math.max(0, applyRestY - scrolled)}px)`;
    };

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
      recomputeRestOffsets();
      applyScroll(trigger.scroll() - trigger.start);
    };
    window.addEventListener("resize", handleResize);

    // The compact wordmark shows only once Fold1Hero's "Scroll to learn
    // more" hint has fully scrolled past the top of the viewport, so the
    // two never overlap — independent of the About/Apply sticky distance
    // above, which can finish sooner. onLeaveBack un-hides it if the user
    // scrolls back up past that point, so it's reversible either way.
    const hint = document.getElementById("fold1-scroll-hint");
    const hintTrigger = hint
      ? ScrollTrigger.create({
          trigger: hint,
          start: "bottom top",
          onEnter: () => setIsWordmarkVisible(true),
          onLeaveBack: () => setIsWordmarkVisible(false),
        })
      : undefined;

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
      hintTrigger?.kill();
    };
  }, [heroRef]);

  return (
    <FoldGrid className="fixed inset-x-0 top-0 z-50 items-start pt-(--spacing-page) pb-4">
      <Link
        id="site-nav-wordmark"
        href="/"
        aria-hidden={!isWordmarkVisible}
        className={`col-start-1 col-span-3 font-display uppercase whitespace-nowrap text-wordmark-nav tracking-wordmark-nav transition-opacity duration-300 ease-out ${
          isOverDark ? "text-text-on-dark" : "text-text-on-light"
        } ${isWordmarkVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        {WORDMARK_TEXT}
      </Link>
      <Link
        id="site-nav-about"
        href="/about"
        className={`col-start-4 font-body text-body ${activeAbout ? "underline underline-offset-2" : ""} ${
          isOverDark ? "text-text-on-dark" : "text-text-on-light"
        }`}
      >
        About
      </Link>
      {!hideApply && (
        <div id="site-nav-apply" className="col-start-8 justify-self-end">
          <Button variant="nav" href="/apply" invert={isOverDark}>
            Apply
          </Button>
        </div>
      )}
    </FoldGrid>
  );
}

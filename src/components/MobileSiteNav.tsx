"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./Button";

gsap.registerPlugin(ScrollTrigger);

const WORDMARK_TEXT = "Atelier West";
// Fraction of the viewport width the tracked-out wordmark should span —
// "at least half" per request. Solved for below rather than a fixed
// tracking value, so it holds proportionally across phone sizes instead
// of being tuned to one device.
const WORDMARK_WIDTH_FRACTION = 0.5;
// Gap between the wordmark and the About/Apply cluster (matches gap-4),
// and between About and Apply within that cluster — read as a constant
// here since the fit check below needs it in px, not just as a class.
const GAP_PX = 16;

interface MobileSiteNavProps {
  /** The page's hero section (Fold1HeroMobile), if it has one — while
   * any part of it is still on screen this nav stays hidden, only
   * fading in once the hero has fully scrolled past, same idea as
   * SiteNav's heroRef. Fold1HeroMobile carries its own full-width
   * wordmark (see Fold1HeroMobile), so this fixed nav would otherwise
   * double up with it on screen at the same time. Omit on pages with no
   * hero (About, Apply): the nav then renders visible immediately, as
   * before. */
  heroRef?: RefObject<HTMLElement | null>;
  /** Optional dark/photo section (mobile Folds 3-5) to watch — while it's
   * under the fixed nav, the wordmark/About switch to the cream treatment
   * so they stay visible over the dark imagery. Same idea as SiteNav's
   * darkSectionRef, kept independent so this component never touches
   * desktop SiteNav's own state or DOM. */
  darkSectionRef?: RefObject<HTMLElement | null>;
  /** Any number of dark/photo sections to watch — same general form as
   * SiteNav's darkSectionRefs, for interior pages (About) with several
   * dark folds rather than just one. */
  darkSectionRefs?: RefObject<HTMLElement | null>[];
  /** Underlines "About" to mark it as the current page — same idea as
   * SiteNav's activeAbout, kept independent so this component never
   * touches desktop SiteNav's own state or DOM. */
  activeAbout?: boolean;
  /** Hides the "Apply" pill — used on the Apply page itself, which
   * already has its own larger in-content CTAs. Same reasoning as
   * SiteNav's hideApply. */
  hideApply?: boolean;
}

/**
 * Mobile nav — a plain fixed compact bar, no scroll-linked morph (the
 * desktop hero-to-compact size/tracking animation only exists because the
 * desktop hero has a huge resting wordmark; the mobile hero's wordmark is
 * already compact-sized per Figma, so there's nothing to morph from).
 *
 * Below a certain viewport width, the wordmark (tracked out to
 * WORDMARK_WIDTH_FRACTION of the screen) and the About/Apply cluster no
 * longer both fit on one line — rather than tuning a fixed breakpoint to
 * one device, the fit is measured directly against the actual rendered
 * widths of About/Apply (see recompute()), and the layout switches to a
 * stacked form: wordmark alone on its own full-width row, About/Apply on
 * a second row spread to the row's edges.
 */
export function MobileSiteNav({
  heroRef,
  darkSectionRef,
  darkSectionRefs,
  activeAbout = false,
  hideApply = false,
}: MobileSiteNavProps) {
  const [isOverDark, setIsOverDark] = useState(false);
  const [isVisible, setIsVisible] = useState(!heroRef);
  const [isStacked, setIsStacked] = useState(false);
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const aboutRef = useRef<HTMLAnchorElement>(null);
  const applyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef?.current;
    if (!hero) return;

    // Same "bottom top" / onLeaveBack mechanism as desktop SiteNav's own
    // heroRef effect — see that component for why.
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
    // of the viewport, not just a single crossing point — same reasoning
    // as desktop SiteNav's multi-section handling.
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
    const wordmark = wordmarkRef.current;
    const measure = measureRef.current;
    if (!wordmark || !measure) return;

    // Same technique as desktop SiteNav's hero-state tracking: a hidden
    // 0-tracking clone gives the wordmark's natural width at this
    // font-size, then letter-spacing is solved so the tracked-out text
    // fills the target width exactly, at any viewport size — a fixed px
    // tracking value only looks "at least half the screen" on the one
    // phone width it was tuned against.
    //
    // Whether the row fits at all is measured too: About's and Apply's
    // own rendered widths never change with layout (neither ever
    // stretches), so comparing them against the viewport tells us
    // whether the single-row layout can hold them alongside the
    // wordmark at its smallest (natural, untracked) width — if not, the
    // nav switches to a stacked two-row layout instead of letting things
    // overlap.
    const recompute = () => {
      // Read the live --spacing-page value (mobile overrides it to 16px
      // below the 1024px breakpoint — see globals.css), same technique
      // as FooterMobile's edge-to-edge wordmark, so the stacked target
      // below matches this row's actual inner width (window.innerWidth
      // minus its own horizontal px-(--spacing-page)) instead of
      // overflowing past it.
      const spacingPage =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-page")) *
        parseFloat(getComputedStyle(document.documentElement).fontSize);
      const availableWidth = window.innerWidth - spacingPage * 2;

      const naturalWidth = measure.getBoundingClientRect().width;
      const aboutWidth = aboutRef.current?.getBoundingClientRect().width ?? 0;
      const applyWidth = hideApply ? 0 : applyRef.current?.getBoundingClientRect().width ?? 0;
      const clusterWidth = aboutWidth + (hideApply ? 0 : GAP_PX + applyWidth);

      const stacked = naturalWidth + GAP_PX + clusterWidth > availableWidth;
      setIsStacked(stacked);

      const target = stacked ? availableWidth : window.innerWidth * WORDMARK_WIDTH_FRACTION;
      const tracking = Math.max(0, (target - naturalWidth) / (WORDMARK_TEXT.length - 1));
      wordmark.style.letterSpacing = `${tracking}px`;
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [hideApply]);

  const textClassName = isOverDark ? "text-text-on-dark" : "text-text-on-light";

  // Rendered once, reused by both the single-row and stacked layouts
  // below — only the wrapping container's classes differ between them.
  const aboutAndApply = (
    <>
      <Link
        ref={aboutRef}
        href="/about"
        className={`shrink-0 font-body text-body ${
          activeAbout ? "underline underline-offset-2" : ""
        } ${textClassName}`}
      >
        About
      </Link>
      {!hideApply && (
        <div ref={applyRef}>
          <Button variant="nav" size="navMobile" href="/apply" invert={isOverDark}>
            Apply
          </Button>
        </div>
      )}
    </>
  );

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 flex flex-col gap-2 px-(--spacing-page) py-4 transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className={`flex items-center gap-4 ${isStacked ? "" : "justify-between"}`}>
        {/* Same font-size as "About" (text-body) — letter-spacing is what
            gives it presence as a lockup, solved above to hit
            WORDMARK_WIDTH_FRACTION of the viewport (or the full viewport
            once stacked) rather than a fixed px value tuned to one
            device. */}
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
        {!isStacked && (
          <div className="flex min-w-0 shrink items-center justify-end gap-4">
            {aboutAndApply}
          </div>
        )}
      </div>
      {isStacked && (
        <div className="flex items-center justify-between gap-4">{aboutAndApply}</div>
      )}
    </div>
  );
}

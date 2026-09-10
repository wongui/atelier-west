"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { ScrollVideo } from "@/components/ScrollVideo";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useRevealOnMount } from "@/lib/useReveal";

interface Fold1HeroProps {
  heroRef: RefObject<HTMLDivElement | null>;
}

const WORDMARK_TEXT = "Atelier West";
const WORDMARK_HERO_SIZE = 42.4;

/**
 * Down arrow next to "Scroll to learn more" — real path data from the
 * Figma "ArrowDown" node (617:361, node 620:576), reproduced inline as a
 * generic universal glyph rather than a committed image asset, same
 * convention as TextLink's own arrow icon. `currentColor` fill so it
 * inherits the surrounding text color instead of hardcoding Figma's charcoal hex.
 */
function ArrowDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.2806 14.0306L12.5306 20.7806C12.461 20.8504 12.3783 20.9057 12.2872 20.9434C12.1962 20.9812 12.0986 21.0006 12 21.0006C11.9014 21.0006 11.8038 20.9812 11.7128 20.9434C11.6217 20.9057 11.539 20.8504 11.4694 20.7806L4.71938 14.0306C4.57864 13.8899 4.49958 13.699 4.49958 13.5C4.49958 13.301 4.57864 13.1101 4.71938 12.9694C4.86011 12.8286 5.05098 12.7496 5.25 12.7496C5.44902 12.7496 5.63989 12.8286 5.78063 12.9694L11.25 18.4397V3.75C11.25 3.55109 11.329 3.36032 11.4697 3.21967C11.6103 3.07902 11.8011 3 12 3C12.1989 3 12.3897 3.07902 12.5303 3.21967C12.671 3.36032 12.75 3.55109 12.75 3.75V18.4397L18.2194 12.9694C18.3601 12.8286 18.551 12.7496 18.75 12.7496C18.949 12.7496 19.1399 12.8286 19.2806 12.9694C19.4214 13.1101 19.5004 13.301 19.5004 13.5C19.5004 13.699 19.4214 13.8899 19.2806 14.0306Z" />
    </svg>
  );
}

/**
 * Fold1 — the video-scrub hero. The wordmark, headline/eyebrow/scroll-hint
 * are all in normal flow here, so they scroll away naturally with the rest
 * of the hero; only the compact nav wordmark that appears once About/Apply
 * stick to the top is owned by SiteNav (see its own comment — it's a plain
 * appear, not a scale-up of this one). Content positions (column + vh
 * offset) match the Figma Fold1 frame exactly.
 */
export function Fold1Hero({ heroRef }: Fold1HeroProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [heroTracking, setHeroTracking] = useState(0);
  const wordmark = useRevealOnMount<HTMLAnchorElement>();
  const eyebrow = useRevealOnMount<HTMLParagraphElement>();
  const headline = useRevealOnMount<HTMLDivElement>();
  const scrollHint = useRevealOnMount<HTMLButtonElement>();

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;

    // Same technique as the compact nav wordmark used to use: a hidden
    // 0-tracking clone gives the natural width at this font-size, then
    // letter-spacing is solved so the tracked-out text exactly fills the
    // grid's content width at any viewport size.
    //
    // useLayoutEffect (not useEffect) so this runs before the browser
    // paints — otherwise the wordmark visibly paints at 0 tracking first,
    // then jumps to the real value, and since it shares the reveal's
    // transition-all, that jump animates too (reads as the letter-spacing
    // "growing" on load) instead of the reveal being the only visible
    // animation.
    const recompute = () => {
      const availableWidth = window.innerWidth - 48; // 2x --spacing-page (24px)
      const naturalWidth = measure.getBoundingClientRect().width;
      // Divide by (length - 1), not length: letter-spacing adds a trailing
      // gap after the LAST character too, which doesn't count as a visible
      // "edge-to-edge" gap.
      setHeroTracking(Math.max(0, (availableWidth - naturalWidth) / (WORDMARK_TEXT.length - 1)));
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  const scrollToFold2 = () => {
    document.getElementById("fold-2")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={heroRef} className="relative h-[200vh] overflow-x-hidden bg-surface-light">
      <ScrollVideo framesPath={withBasePath("/frames/octopus")} frameCount={96} scrollContainerRef={heroRef} />

      <FoldGrid className="absolute inset-x-0 top-0 h-screen pt-(--spacing-page)">
        <Link
          ref={wordmark.ref}
          href="/"
          // Its own explicit transition-property list (opacity/filter/
          // transform only), NOT revealClassName's `transition-all` — this
          // element also carries a dynamically-computed letterSpacing, and
          // transition-all made any correction to that value (e.g. a resize,
          // or the measurement settling) visibly animate over 700ms, which
          // read as the letter-spacing "growing"/stretching on load instead
          // of being instant like a normal layout property.
          className={`col-start-1 col-span-3 row-start-1 font-display uppercase whitespace-nowrap text-text-on-light transition-[opacity,filter,transform] duration-700 ease-out ${
            wordmark.isVisible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-md translate-y-6"
          }`}
          style={{ fontSize: WORDMARK_HERO_SIZE, letterSpacing: heroTracking }}
        >
          {WORDMARK_TEXT}
        </Link>
        {/* Hidden 0-tracking clone used only to measure the wordmark's
            natural width, to solve the tracking above. */}
        <span
          ref={measureRef}
          aria-hidden
          className="fixed top-0 left-[-9999px] font-display uppercase whitespace-nowrap"
          style={{ fontSize: WORDMARK_HERO_SIZE, letterSpacing: 0 }}
        >
          {WORDMARK_TEXT}
        </span>

        {/* Eyebrow + headline share the same top offset so they align to
            each other, not to independently-tuned vh guesses. The extra
            pt nudges the eyebrow's small-font line box down to visually
            match the headline's much taller cap-height — sharing the
            exact same top offset otherwise makes the eyebrow look like
            it's floating above the headline instead of level with it. */}
        <p
          ref={eyebrow.ref}
          style={{ transitionDelay: "80ms" }}
          className={`col-start-1 col-span-2 row-start-1 mt-[73vh] pt-3 font-body text-body text-text-on-light ${eyebrow.revealClassName}`}
        >
          A 12-week equity-free residency for Physical AI founders
        </p>

        {/* Sized off its own grid-column width (container query units), not
            the viewport — the column's right edge already sits exactly
            --spacing-page (24px) inside the viewport edge via FoldGrid's
            padding, so tying font-size to *that* box (rather than a raw
            vw guess) keeps the 24px margin intact at every width instead
            of the text creeping past it as the column narrows. The query
            container has to be a *wrapper*, not the h1 itself — a size
            container querying its own inline-size is a self-reference
            browsers resolve as invalid, silently falling back to the
            clamp's max and ignoring the fluid middle term entirely. */}
        <div
          ref={headline.ref}
          style={{ transitionDelay: "160ms" }}
          className={`col-start-4 col-span-5 row-start-1 mt-[73vh] [container-type:inline-size] ${headline.revealClassName}`}
        >
          <h1 className="font-display leading-none text-[clamp(4rem,11.77cqw,6.875rem)] text-text-on-light whitespace-nowrap">
            Where AI takes shape
          </h1>
        </div>

        {/* Bottom-anchored (self-end + mb-6/24px) rather than a vh guess,
            so its bottom edge matches SiteNav's About/Apply bottom edge.
            A real button (not a styled <p>) since it now scrolls to Fold2. */}
        <button
          ref={scrollHint.ref}
          id="fold1-scroll-hint"
          type="button"
          onClick={scrollToFold2}
          style={{ transitionDelay: "240ms" }}
          className={`col-start-1 row-start-1 self-end mb-6 flex w-fit cursor-pointer items-center justify-start gap-2 whitespace-nowrap font-body text-body text-text-on-light ${scrollHint.revealClassName}`}
        >
          Scroll to learn more
          <ArrowDownIcon className="size-[18px] animate-bob" />
        </button>
      </FoldGrid>
    </div>
  );
}

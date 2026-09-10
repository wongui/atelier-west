"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
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
 * Fold1 — the video-scrub hero, redesigned to the centered "alt hero"
 * wireframe (Figma node 739:687): headline/eyebrow/CTA/scroll-cue are a
 * single centered column over the video instead of desktop's old
 * left/right split — closer in spirit to the mobile hero's centered
 * composition, but built with desktop's own mechanics (scroll-scrubbed
 * video, row-start-1 overlap + vh offsets, reveal-on-mount), not copied
 * from Fold1HeroMobile.
 *
 * Brought back from v1: the large in-flow wordmark at the top of the
 * hero (scrolls away with the rest of the hero content, not
 * pinned/fixed). SiteNav now stays hidden until this fold has fully
 * scrolled past (see SiteNav's heroRef prop), so the two never show at
 * the same time.
 */
export function Fold1Hero({ heroRef }: Fold1HeroProps) {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [heroTracking, setHeroTracking] = useState(0);
  const wordmark = useRevealOnMount<HTMLAnchorElement>();
  const cluster = useRevealOnMount<HTMLDivElement>();
  const scrollHint = useRevealOnMount<HTMLButtonElement>();

  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;

    // A hidden 0-tracking clone gives the wordmark's natural width at
    // this font-size, then letter-spacing is solved so the tracked-out
    // text exactly fills the grid's content width at any viewport size.
    // useLayoutEffect (not useEffect) so this runs before paint —
    // otherwise the wordmark visibly paints at 0 tracking first, then
    // jumps to the real value.
    const recompute = () => {
      // The wordmark gets its own fixed 24px margin (top + sides),
      // independent of --spacing-page (the page's general content
      // margin, 64px in v2 — same reasoning as SiteNav's own independent
      // top offset) — so this computes against a 24px-inset, 1392px-capped
      // lane (matching the wrapper's own inset-6/max-w-[1392px] below),
      // not FoldGrid's page-wide padding.
      const availableWidth = Math.min(window.innerWidth, 1440) - 48; // 2x 24px
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

      {/* Own fixed 24px inset (top + sides) — independent of FoldGrid's
          page-wide --spacing-page margin (64px), same reasoning as
          SiteNav's own independent top offset — capped at 1392px
          (1440 - 2x24) and centered, so it still respects the site's
          overall content-width ceiling on ultra-wide screens. */}
      <div className="absolute inset-x-6 top-6 h-screen">
        <div className="mx-auto max-w-[1392px]">
          <Link
            ref={wordmark.ref}
            href="/"
            // Its own explicit transition-property list (opacity/filter/
            // transform only), NOT revealClassName's `transition-all` —
            // this element also carries a dynamically-computed
            // letterSpacing, and transition-all made any correction to
            // that value (e.g. a resize, or the measurement settling)
            // visibly animate over 700ms instead of applying instantly.
            className={`block font-display uppercase whitespace-nowrap text-text-on-light transition-[opacity,filter,transform] duration-700 ease-out ${
              wordmark.isVisible ? "opacity-100 blur-none translate-y-0" : "opacity-0 blur-md translate-y-6"
            }`}
            style={{ fontSize: WORDMARK_HERO_SIZE, letterSpacing: heroTracking }}
          >
            {WORDMARK_TEXT}
          </Link>
        </div>
      </div>
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

      <FoldGrid className="absolute inset-x-0 top-0 h-screen pt-(--spacing-page)">
        {/* Full-height flex column, not a vh-based mt guess — the
            headline group fills the space above the scroll-hint
            (flex-1, content pinned to the bottom of that space via
            justify-end, approximating Figma's ~67vh-down position at any
            viewport height) and the hint is a separate sibling below it,
            so it always lands at the very bottom of the screen and can
            never be pushed off-screen or overlapped, on any screen size. */}
        <div className="col-start-1 col-span-8 row-start-1 flex h-full flex-col items-center text-center">
          <div
            ref={cluster.ref}
            style={{ transitionDelay: "80ms" }}
            // w-full: without it, this flex child (its parent uses
            // items-center, not stretch) shrinks to its own fit-content
            // width instead of the full grid column — which the h1's
            // container-query font-size is sized against, so it silently
            // shrank the headline's available width and made it wrap.
            className={`flex min-h-0 w-full flex-1 flex-col items-center justify-end gap-6 ${cluster.revealClassName}`}
          >
            {/* Sized off its own wrapper's width (container query units),
                not the viewport — the wrapper's own edges already sit
                exactly --spacing-page inside FoldGrid's capped content
                column via FoldGrid's padding, so tying font-size to
                *that* box (rather than a raw vw guess) keeps the margin
                intact at every width, and pins the headline at its max
                size once the column itself stops growing past 1440px.
                The query container has to be a *wrapper*, not the h1
                itself — a size container querying its own inline-size is
                a self-reference browsers resolve as invalid, silently
                falling back to the clamp's max and ignoring the fluid
                middle term entirely. */}
            <div className="w-full shrink-0 [container-type:inline-size]">
              <h1 className="font-display leading-none text-[clamp(4rem,7.9cqw,6.875rem)] text-text-on-light">
                Where AI Takes Shape
              </h1>
            </div>
            <p className="max-w-(--max-width-content) shrink-0 font-body text-body text-text-on-light">
              A 12-week equity-free residency for Physical AI founders
            </p>
            <Button variant="cta" size="md" href="/apply">
              Apply Now
            </Button>
          </div>

          {/* Fixed-height sibling of the flex-1 headline group above, not
              part of its flow — guarantees this always sits at the
              bottom of the viewport (h-full column), unreachable/hidden
              on no screen size. Icon-only per the alt-hero wireframe (no
              "Scroll to learn more" label) — the label stays for screen
              readers. */}
          <button
            ref={scrollHint.ref}
            id="fold1-scroll-hint"
            type="button"
            onClick={scrollToFold2}
            style={{ transitionDelay: "240ms" }}
            className={`mt-6 mb-6 flex w-fit shrink-0 cursor-pointer items-center justify-center text-text-on-light ${scrollHint.revealClassName}`}
          >
            <span className="sr-only">Scroll to learn more</span>
            <img src={withBasePath("/images/CaretDown.svg")} alt="" className="size-8 animate-bob" />
          </button>
        </div>
      </FoldGrid>
    </div>
  );
}

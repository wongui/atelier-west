"use client";

import type { RefObject } from "react";
import { ScrollVideo } from "@/components/ScrollVideo";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

interface Fold1HeroProps {
  heroRef: RefObject<HTMLDivElement | null>;
}

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
 * Fold1 — the video-scrub hero. Only the headline/eyebrow/scroll-hint are
 * in normal flow (so they scroll away naturally); the wordmark and
 * About/Apply are owned by SiteNav, which is mounted once at the page
 * level and morphs over this section's scroll range. Content positions
 * (column + vh offset) match the Figma Fold1 frame exactly.
 */
export function Fold1Hero({ heroRef }: Fold1HeroProps) {
  const scrollToFold2 = () => {
    document.getElementById("fold-2")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={heroRef} className="relative h-[200vh] overflow-x-hidden bg-surface-light">
      <ScrollVideo framesPath={withBasePath("/frames/octopus")} frameCount={96} scrollContainerRef={heroRef} />

      <FoldGrid className="absolute inset-x-0 top-0 h-screen">
        {/* Eyebrow + headline share the same top offset so they align to
            each other, not to independently-tuned vh guesses. The extra
            pt nudges the eyebrow's small-font line box down to visually
            match the headline's much taller cap-height — sharing the
            exact same top offset otherwise makes the eyebrow look like
            it's floating above the headline instead of level with it. */}
        <p className="col-start-1 col-span-2 row-start-1 mt-[73vh] pt-3 font-body text-body text-text-on-light">
          A 12-week equity-free residency for Physical AI founders
        </p>

        <h1 className="col-start-4 col-span-5 row-start-1 mt-[73vh] font-display text-hero text-text-on-light whitespace-nowrap">
          Where AI takes shape
        </h1>

        {/* Bottom-anchored (self-end + mb-6/24px) rather than a vh guess,
            so its bottom edge matches SiteNav's About/Apply bottom edge.
            A real button (not a styled <p>) since it now scrolls to Fold2. */}
        <button
          type="button"
          onClick={scrollToFold2}
          className="col-start-1 row-start-1 self-end mb-6 flex w-fit cursor-pointer items-center justify-start gap-2 whitespace-nowrap font-body text-body text-text-on-light"
        >
          Scroll to learn more
          <ArrowDownIcon className="size-[18px] animate-bob" />
        </button>
      </FoldGrid>
    </div>
  );
}

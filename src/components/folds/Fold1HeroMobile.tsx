"use client";

import { useRef } from "react";
import { Button } from "@/components/Button";
import { ScrollVideoMobile } from "@/components/ScrollVideoMobile";
import { withBasePath } from "@/lib/basePath";

function ArrowDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.2806 14.0306L12.5306 20.7806C12.461 20.8504 12.3783 20.9057 12.2872 20.9434C12.1962 20.9812 12.0986 21.0006 12 21.0006C11.9014 21.0006 11.8038 20.9812 11.7128 20.9434C11.6217 20.9057 11.539 20.8504 11.4694 20.7806L4.71938 14.0306C4.57864 13.8899 4.49958 13.699 4.49958 13.5C4.49958 13.301 4.57864 13.1101 4.71938 12.9694C4.86011 12.8286 5.05098 12.7496 5.25 12.7496C5.44902 12.7496 5.63989 12.8286 5.78063 12.9694L11.25 18.4397V3.75C11.25 3.55109 11.329 3.36032 11.4697 3.21967C11.6103 3.07902 11.8011 3 12 3C12.1989 3 12.3897 3.07902 12.5303 3.21967C12.671 3.36032 12.75 3.55109 12.75 3.75V18.4397L18.2194 12.9694C18.3601 12.8286 18.551 12.7496 18.75 12.7496C18.949 12.7496 19.1399 12.8286 19.2806 12.9694C19.4214 13.1101 19.5004 13.301 19.5004 13.5C19.5004 13.699 19.4214 13.8899 19.2806 14.0306Z" />
    </svg>
  );
}

/**
 * Mobile Fold1 — a shorter scroll runway than desktop's 200vh (mobile
 * has no nav-morph to sync against, and a long dead-scroll before Fold2
 * feels worse on a phone), just enough for the octopus sequence to
 * visibly scrub while the sticky video block is pinned. The video only
 * occupies the top 65vh (per design: 50-75%, top-aligned) rather than
 * the full screen — headline/eyebrow/CTA/scroll-cue sit in the
 * remaining space below it, inside the same pinned block, so they're
 * visible together with the video from the start instead of overlaid on
 * top of it like desktop.
 */
export function Fold1HeroMobile() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToFold2 = () => {
    document.getElementById("fold-2-mobile")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={scrollRef} className="relative h-[175vh]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden bg-[#c9c7c7]">
        <div
          className="relative w-full shrink-0"
          // min(65vh, 100vh - 300px): caps the video at 65% of viewport on
          // typical/tall phones, but backs off on short viewports (e.g.
          // iPhone SE) so the text panel below always keeps its ~300px of
          // minimum room instead of the headline/button/scroll-cue
          // overflowing off the bottom of the screen.
          style={{ height: "min(65vh, calc(100vh - 300px))" }}
        >
          <ScrollVideoMobile
            framesPath={withBasePath("/frames/octopus")}
            frameCount={96}
            scrollContainerRef={scrollRef}
          />
          {/* Fades into the nav above and the text panel below, matching
              the gradient rectangles in Figma's mobile Fold1 frame. */}
          <div className="absolute inset-x-0 top-0 h-[100px] bg-gradient-to-b from-[#c9c7c7]/0 via-[#c8c5c6] to-[#c9c7c7]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-[#c9c7c7]/0 to-[#e8e8e8]" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-between gap-4 bg-[#e8e8e8] px-(--spacing-page) pb-4 pt-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <h1 className="font-display text-[38px] leading-[42px] text-text-on-light">
              Where AI
              <br />
              Takes Shape
            </h1>
            <p className="max-w-[286px] font-body text-body text-text-on-light">
              A 12-week equity-free residency for Physical AI founders
            </p>
            <Button variant="cta" size="md" onClick={scrollToFold2}>
              Apply
            </Button>
          </div>

          <button
            type="button"
            onClick={scrollToFold2}
            className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-body text-body text-text-on-light"
          >
            Scroll to learn more
            <ArrowDownIcon className="size-[18px] animate-bob" />
          </button>
        </div>
      </div>
    </div>
  );
}

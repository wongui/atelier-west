"use client";

import { useRef } from "react";
import { Button } from "@/components/Button";
import { ScrollVideoMobile } from "@/components/ScrollVideoMobile";
import { withBasePath } from "@/lib/basePath";

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
    // dvh (not svh) on both the scroll runway and the sticky child: svh is
    // pinned to the *smallest* possible viewport and doesn't grow back when
    // Safari's chrome collapses mid-scroll, so the pinned block fell short
    // of the real (bigger) viewport and Fold2's cream showed through the
    // gap underneath it. dvh tracks the actual current viewport instead.
    // bg-[#c9c7c7] on this outer wrapper matches the sticky child's own
    // resting bg, so if a sliver is ever revealed below the pinned block
    // it still reads as hero background, not a flash of Fold2's cream.
    <div ref={scrollRef} className="relative h-[175dvh] bg-[#c9c7c7]">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden bg-[#c9c7c7]">
        <div
          className="relative w-full shrink-0"
          // min(65dvh, 100dvh - 260px): 260px is close to the text panel's
          // real minimum content height, so typical/tall phones get the
          // full 65% and only genuinely short viewports (e.g. iPhone SE)
          // back off from it.
          style={{ height: "min(65dvh, calc(100dvh - 260px))" }}
        >
          <ScrollVideoMobile
            framesPath={withBasePath("/frames/octopus")}
            frameCount={96}
            scrollContainerRef={scrollRef}
          />
          {/* Video runs edge-to-edge to the top of the device (under the
              transparent nav) — no fade here, only a short blend into the
              text panel below. */}
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-[#c9c7c7]/0 to-[#e8e8e8]" />
        </div>

        <div
          className="relative z-10 flex flex-1 flex-col items-center justify-between gap-4 bg-[#e8e8e8] px-(--spacing-page) pt-4 text-center"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
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
            className="flex cursor-pointer items-center justify-center"
          >
            <span className="sr-only">Scroll to learn more</span>
            <img
              src={withBasePath("/images/CaretDown.svg")}
              alt=""
              className="size-8 animate-bob"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

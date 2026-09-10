"use client";

import { useEffect, useRef, type RefObject } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ScrollVideoMobile } from "@/components/ScrollVideoMobile";
import { withBasePath } from "@/lib/basePath";

const WORDMARK_TEXT = "Atelier West";

interface Fold1HeroMobileProps {
  /** Also used as the scroll container ref for the video scrub below —
   * the "hero" MobileSiteNav watches to know when it's fully scrolled
   * past (see MobileSiteNav's own heroRef) is the same outer element
   * ScrollVideoMobile scrubs against, so one ref serves both. */
  heroRef: RefObject<HTMLDivElement | null>;
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
 *
 * Carries its own full-width wordmark overlaid on the video, in-flow
 * (not fixed) so it scrolls away with the rest of the hero — same idea
 * as desktop Fold1Hero's large wordmark. MobileSiteNav's fixed compact
 * bar stays hidden until this fold has fully scrolled past (via the
 * shared heroRef), so the two never show at the same time.
 */
export function Fold1HeroMobile({ heroRef }: Fold1HeroMobileProps) {
  const wordmarkRef = useRef<HTMLAnchorElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wordmark = wordmarkRef.current;
    const measure = measureRef.current;
    if (!wordmark || !measure) return;

    // Same edge-to-edge tracking technique as FooterMobile's wordmark —
    // reads the live --spacing-page value rather than a hardcoded
    // figure, so this stays correct if that token ever changes.
    const recompute = () => {
      const spacingPage =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-page")) *
        parseFloat(getComputedStyle(document.documentElement).fontSize);
      const availableWidth = window.innerWidth - spacingPage * 2;
      const naturalWidth = measure.getBoundingClientRect().width;
      const tracking = Math.max(0, (availableWidth - naturalWidth) / (WORDMARK_TEXT.length - 1));
      wordmark.style.letterSpacing = `${tracking}px`;
    };
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  useEffect(() => {
    // iOS Safari's `dvh` unit is wrong on first paint — it computes
    // against a stale viewport height and only self-corrects once the
    // user scrolls (which is why the caret below only showed up after
    // the first scroll: the sticky block above it was sized too tall on
    // load, and overflow-hidden clipped the caret off the bottom).
    // window.innerHeight itself is accurate immediately, so we mirror it
    // into a CSS var and use that instead of `dvh` for this fold's
    // load-bearing heights; it's kept live the same way dvh normally
    // would be, via resize (fires when Safari's chrome collapses/expands
    // the layout viewport).
    const setVh = () => {
      document.documentElement.style.setProperty("--dvh", `${window.innerHeight / 100}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    window.visualViewport?.addEventListener("resize", setVh);
    return () => {
      window.removeEventListener("resize", setVh);
      window.visualViewport?.removeEventListener("resize", setVh);
    };
  }, []);

  const scrollToFold2 = () => {
    document.getElementById("fold-2-mobile")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Heights below use calc(var(--dvh) * N) rather than Ndvh — see the
    // --dvh effect above for why. bg-[#c9c7c7] on this outer wrapper
    // matches the sticky child's own resting bg, so if a sliver is ever
    // revealed below the pinned block it still reads as hero background,
    // not a flash of Fold2's cream.
    <div
      ref={heroRef}
      className="relative bg-[#c9c7c7]"
      style={{ height: "calc(var(--dvh, 1dvh) * 175)" }}
    >
      <div
        className="sticky top-0 flex flex-col overflow-hidden bg-[#c9c7c7]"
        style={{ height: "calc(var(--dvh, 1dvh) * 100)" }}
      >
        <div
          className="relative w-full shrink-0"
          // min(65%, 100% - 260px): 260px is close to the text panel's
          // real minimum content height, so typical/tall phones get the
          // full 65% and only genuinely short viewports (e.g. iPhone SE)
          // back off from it.
          style={{
            height:
              "min(calc(var(--dvh, 1dvh) * 65), calc(var(--dvh, 1dvh) * 100 - 260px))",
          }}
        >
          <ScrollVideoMobile
            framesPath={withBasePath("/frames/octopus")}
            frameCount={96}
            scrollContainerRef={heroRef}
          />
          {/* Full-width wordmark, overlaid on the video at the same
              inset/offset MobileSiteNav's fixed bar uses (px-(--spacing-page),
              py-4), so the handoff between the two reads as one continuous
              element rather than a jump. */}
          <div className="absolute inset-x-0 top-0 px-(--spacing-page) py-4">
            <Link
              ref={wordmarkRef}
              href="/"
              // Half --text-wordmark (not the full lockup size) — the
              // headline below is the dominant element on this fold, per
              // desktop's hero where the wordmark reads as a small
              // signature above a much larger headline.
              className="font-display text-[length:calc(var(--text-wordmark)/2)] uppercase whitespace-nowrap text-text-on-light"
            >
              {WORDMARK_TEXT}
            </Link>
            {/* Hidden 0-tracking clone used only to measure natural width. */}
            <span
              ref={measureRef}
              aria-hidden
              className="fixed top-0 left-[-9999px] font-display text-[length:calc(var(--text-wordmark)/2)] uppercase whitespace-nowrap"
              style={{ letterSpacing: 0 }}
            >
              {WORDMARK_TEXT}
            </span>
          </div>
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
            <h1 className="font-display text-[48px] leading-[52px] text-text-on-light">
              Where AI
              <br />
              Takes Shape.
            </h1>
            <p className="max-w-[286px] font-body text-body text-text-on-light">
              A 12-week equity-free residency for Physical AI founders.
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

"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StepProgress } from "@/components/StepProgress";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  number: string;
  title: string;
  body: string;
  image: string;
}

interface ProgressionSectionProps {
  steps: Step[];
  /** Exposes the section's wrapper so SiteNav can watch it and swap the
   * nav to its cream/beige treatment while it's the pinned backdrop. */
  sectionRef?: RefObject<HTMLDivElement | null>;
  /** "dark" (default) matches Home's charcoal/cream treatment. "light"
   * flips to the beige/charcoal (surface-light/text-on-light) pairing —
   * About's own request, kept independent of Home's styling. */
  bg?: "dark" | "light";
}

// Extra scroll distance, ahead of AND behind the steps.length x 100vh
// needed for the horizontal traversal itself, spent fully static on step
// 1 / step N — a reading pause right as the pin engages (before the
// first rightward move) and another right as the last panel finishes
// arriving (before the pin releases into normal vertical scroll), so the
// hand-off never reads as still-sliding.
const HOLD_VH = 50;

/**
 * Folds 3-5 — pinned horizontal-scroll progression (Figma frame 748:884 /
 * 748:1127): the 3 steps sit side by side in one wide track, each its own
 * full-width panel with its own photo, and vertical scroll while the
 * section is pinned drives the track's translateX 1:1 (scrubbed, not
 * snapped — same "small scroll only moves things a little" feel the old
 * crossfade version deliberately used, just applied to horizontal
 * position instead of opacity). A HOLD_VH-tall dead zone at each end of
 * the pin holds fully static (on step 1, then on step N) so there's a
 * beat to read before the first move and a beat to settle after the
 * last one; in between, steps.length x 100vh maps 1:1 to the horizontal
 * traversal. Only once the trailing hold finishes does the pin release
 * and normal vertical scroll continue to the next fold.
 */
export function ProgressionSection({ steps, sectionRef, bg = "dark" }: ProgressionSectionProps) {
  const bgClassName = bg === "light" ? "bg-surface-light text-text-on-light" : "bg-surface-dark text-text-on-dark";
  const progressTextClassName = bg === "light" ? "text-text-on-light" : "text-text-on-dark";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  // Gates the entrance reveal below on the section actually having
  // scrolled into view. Deliberately watches the STICKY INNER div (a
  // fixed 100vh), not the outer pinned wrapper — IntersectionObserver's
  // ratio is relative to the target's OWN height, and the wrapper here
  // spans several screens (hold + traversal + hold), so as that grows
  // the visible fraction keeps shrinking and can drop under the
  // observer's threshold before it ever fires, leaving the reveal (and
  // the whole track, which carries its opacity/blur classes) stuck
  // hidden. The inner div's height never changes, so this stays reliable
  // regardless of how long the pin ends up being.
  const sectionReveal = useReveal<HTMLDivElement>();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const traversalVh = steps.length * 100;
    // The actual scrubbed range while pinned is (wrapper height - one
    // viewport) — the sticky child only holds for as long as the
    // wrapper still has a viewport's worth of extra height above it to
    // "spend" — not the wrapper's full height. pinDurationVh is exactly
    // that scrubbed range, and the wrapper below is sized to match
    // (pinDurationVh + 100vh) so self.progress covers hold + traversal +
    // hold precisely, with the trailing hold actually finishing before
    // the pin releases instead of getting cut short.
    const pinDurationVh = traversalVh + HOLD_VH * 2;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const scrolledVh = self.progress * pinDurationVh;
        const traversalScrolled = Math.min(traversalVh, Math.max(0, scrolledVh - HOLD_VH));
        const traversalProgress = traversalScrolled / traversalVh;

        if (fillRef.current) {
          fillRef.current.style.width = `${traversalProgress * 100}%`;
        }
        // Track is steps.length x the panel width, so to land the last
        // panel flush against the right edge, translate by
        // -(steps.length-1)/steps.length of the TRACK's own width.
        const xPercent = -(traversalProgress * (steps.length - 1) * 100) / steps.length;
        track.style.transform = `translateX(${xPercent}%)`;
      },
    });

    return () => trigger.kill();
  }, [steps.length]);

  return (
    <div
      ref={(node) => {
        wrapperRef.current = node;
        if (sectionRef) sectionRef.current = node;
      }}
      className="relative"
      style={{ height: `${steps.length * 100 + HOLD_VH * 2 + 100}vh` }}
    >
      <div
        ref={sectionReveal.ref}
        className={`sticky top-0 h-screen overflow-hidden ${bgClassName}`}
      >
        {/* Rhythm below the (now shorter, pt-4/pb-4) fixed SiteNav is one
            consistent 2rem (32px) gap, repeated three times: nav→progress
            (this top offset), progress→text (pt-[8.5rem] below == this
            top-[103px] + the bar's ~1px + 2rem), and text→image (the
            grid's row-gap). Nav's own rendered height varies slightly
            with content, so this is tuned to its current ~71px bottom
            edge rather than derived from a shared token. */}
        <StepProgress
          fillRef={fillRef}
          className={`absolute inset-x-0 top-[103px] mx-(--spacing-page) ${progressTextClassName}`}
        />

        <div
          ref={trackRef}
          className={`flex h-full ${sectionReveal.revealClassName}`}
          style={{ width: `${steps.length * 100}%`, willChange: "transform" }}
        >
          {steps.map((step) => (
            <div key={step.number} className="h-full shrink-0" style={{ width: `${100 / steps.length}%` }}>
              <FoldGrid
                className="h-full pt-[8.5rem] pb-8"
                // Row 1 is sized to the tallest realistic case — number +
                // gap + a 2-line-wrapped title (70 + 16 + 140 = 226px).
                gridClassName="grid-rows-[14.125rem_1fr] gap-y-8"
              >
                <span className="col-start-1 col-span-4 row-start-1 font-display text-h1">{step.number}</span>
                {/* Both number and title sit in the same grid cell
                    (row-start-1), stacked via margin rather than normal
                    flow — so this offset must clear the number's OWN
                    70px line box, not just the gap: 70px (number) + 16px
                    (gap) = 86px. */}
                <h3 className="col-start-1 col-span-4 row-start-1 mt-[5.375rem] font-display text-h1">
                  {step.title}
                </h3>
                <p className="col-start-5 col-span-3 row-start-1 font-body text-body">{step.body}</p>
                {/* min-h-0 overrides the grid item's automatic minimum
                    size — without it, an <img>'s intrinsic aspect ratio
                    inflates this 1fr row past the space actually
                    available, and the overflow-hidden sticky container
                    then clips the excess off the bottom, which reads as
                    the image being cropped from the top. */}
                <img
                  src={step.image}
                  alt=""
                  className="col-start-1 col-span-8 row-start-2 h-full w-full min-h-0 object-cover"
                />
              </FoldGrid>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

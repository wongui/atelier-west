"use client";

import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

/**
 * Apply Fold1 — hero (desktop). Full-bleed background photo behind the
 * heading/subhead, same construction as Fold6Cta (absolute bg image +
 * FoldGrid content on top). Mobile is a genuinely different layout — a
 * fixed panel that stacks below the nav rather than a full-viewport
 * overlay — so it's a full sibling component (ApplyHeroMobile), not a
 * breakpoint variant of this one; see ApplyHeroMobile.tsx.
 *
 * v2: no CTA here (per Figma) — Entry Criteria already carries the page's
 * CTA. min-h-[50vh] (down from 68vh) since the fold now only needs to
 * hold the headline/subhead, not a button too.
 *
 * The text block is centered via `flex justify-center` on the OUTER
 * wrapper, not `items-center` on FoldGrid's grid — FoldGrid's inner grid
 * is a single auto-sized row, so grid-level `items-center` has nothing to
 * center against (there's no extra row height to distribute); the same
 * issue as Footer's bottom-alignment. Centering the wrapper's one child
 * directly sidesteps that.
 */
export function ApplyHero() {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative min-h-[50vh] overflow-hidden bg-surface-light">
      <img
        src={withBasePath("/images/apply-hero-bg.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <FoldGrid className="relative flex min-h-[50vh] flex-col justify-center py-24">
        <div
          ref={text.ref}
          className={`col-start-1 col-span-3 flex flex-col items-start gap-6 ${text.revealClassName}`}
        >
          <h1 className="font-display text-h2 text-text-on-light">Shape what&rsquo;s next</h1>
          <p className="max-w-(--max-width-content) font-body text-body text-text-on-light">
            Apply for the inaugural cohort taking place between October 2026
            and January 2027.
          </p>
        </div>
      </FoldGrid>
    </div>
  );
}

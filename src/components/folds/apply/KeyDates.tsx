"use client";

import type { RefObject } from "react";
import { Divider } from "@/components/Divider";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";

const dates = [
  { date: "9/14/26", label: "Applications open" },
  { date: "10/11/26", label: "Applications close" },
  { date: "10/01 - 10/15", label: "Cohort selection" },
  { date: "10/26", label: "Cohort begins" },
];

/**
 * Apply Fold2 — Key Dates strip. Divider + eyebrow label above a row of
 * date/label pairs, same coupling as PartnersStrip's divider→label groups.
 * Stacked single column below `lg` (23px, per the Figma mobile frame —
 * the desktop 36px display size reads too heavy at phone width), 4-up
 * grid at `lg` and above — kept as one component with breakpoint classes
 * (not a split sibling) since the content and grouping are identical,
 * only the reflow changes, matching the About page's grid components.
 *
 * Exposes its wrapper via `sectionRef` — this is the page's one dark
 * fold, so SiteNav/MobileSiteNav watch it to swap to the on-dark
 * (cream) treatment while it's under the fixed nav, same mechanism as
 * ProgressionSection/ImageTextFold elsewhere.
 *
 * v2: hugs its content (`lg:py-16`) instead of forcing a fixed
 * `lg:min-h-[32vh]` — the fold no longer needs to pair with ApplyHero to
 * fill exactly one viewport, so its height is just whatever the content
 * needs. Mobile keeps its own natural `py-16` height, untouched.
 */
function KeyDateItem({ date, label }: { date: string; label: string }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div ref={reveal.ref} className={`flex flex-col gap-1 ${reveal.revealClassName}`}>
      <span className="font-display text-[23px] leading-[1.4] lg:text-h3 lg:leading-none">
        {date}
      </span>
      {/* Plain body copy per Figma (BentonSansF, 18px) at desktop — this
          previously matched the date's h3/display size, which Figma
          doesn't show for the label. Now applied at mobile too, for
          parity with the desktop update. */}
      <span className="font-body text-body">{label}</span>
    </div>
  );
}

export function KeyDates({ sectionRef }: { sectionRef?: RefObject<HTMLDivElement | null> }) {
  const eyebrow = useReveal<HTMLDivElement>();

  return (
    <FoldGrid
      ref={sectionRef}
      className="bg-surface-dark py-16 text-text-on-dark"
    >
      <div
        ref={eyebrow.ref}
        className={`col-start-1 col-span-8 flex flex-col gap-6 ${eyebrow.revealClassName}`}
      >
        <EyebrowLabel>Key Dates</EyebrowLabel>
        {/* Full opacity per Figma (solid #FBFAE4 stroke) — Divider's
            default opacity-20 is meant for StepProgress's faint
            background track, not a plain section-label rule like this
            one, which should read as a solid line. Below the label, not
            above it, per the updated wireframe. */}
        <Divider className="opacity-100" />
      </div>
      <div className="col-start-1 col-span-8 mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
        {dates.map((d) => (
          <KeyDateItem key={d.label} date={d.date} label={d.label} />
        ))}
      </div>
    </FoldGrid>
  );
}

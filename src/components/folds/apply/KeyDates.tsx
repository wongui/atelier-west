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
 * Desktop only: `lg:min-h-[32vh]` + `lg:content-center` so this fold and
 * ApplyHero's `min-h-[68vh]` together fill exactly one viewport
 * (68 + 32 = 100), content vertically centered in the remaining space —
 * mobile keeps its own natural `py-16` height, untouched.
 */
function KeyDateItem({ date, label }: { date: string; label: string }) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <div ref={reveal.ref} className={`flex flex-col ${reveal.revealClassName}`}>
      <span className="font-display text-[23px] leading-[1.4] lg:text-h3 lg:leading-none">
        {date}
      </span>
      <span className="font-display text-[23px] leading-[1.4] lg:text-h3 lg:leading-none">
        {label}
      </span>
    </div>
  );
}

export function KeyDates({ sectionRef }: { sectionRef?: RefObject<HTMLDivElement | null> }) {
  const eyebrow = useReveal<HTMLDivElement>();

  return (
    <FoldGrid
      ref={sectionRef}
      className="bg-surface-dark py-16 text-text-on-dark lg:min-h-[32vh] lg:content-center lg:py-0"
    >
      <div
        ref={eyebrow.ref}
        className={`col-start-1 col-span-8 flex flex-col gap-6 ${eyebrow.revealClassName}`}
      >
        <Divider />
        <EyebrowLabel>Key Dates</EyebrowLabel>
      </div>
      <div className="col-start-1 col-span-8 mt-10 flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
        {dates.map((d) => (
          <KeyDateItem key={d.label} date={d.date} label={d.label} />
        ))}
      </div>
    </FoldGrid>
  );
}

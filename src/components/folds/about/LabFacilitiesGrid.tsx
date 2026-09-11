"use client";

import type { RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

interface Lab {
  title: string;
  body: string;
  image: string;
}

interface LabFacilitiesGridProps {
  heading: string;
  intro: string;
  labs: Lab[];
  /** Exposes the section's wrapper so SiteNav can watch it and swap to
   * the on-dark treatment while it's the pinned backdrop. */
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * "Lab & Facilities Access" — intro copy (col1, per Figma) followed by
 * the six labs in a static two-row grid, three per row, rather than the
 * scroll carousel this briefly had — simpler and more legible for a
 * fixed, known count. New pattern, not covered by any existing component
 * (docs/FOUNDATIONS.md's "no Cards" call predates this wireframe) — kept
 * minimal: just this one grid, not a general Card family.
 */
function LabCard({ lab }: { lab: Lab }) {
  const photo = useReveal<HTMLImageElement>();
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-4">
      <img
        ref={photo.ref}
        src={withBasePath(lab.image)}
        alt=""
        // These render at their natural (unreserved) height, so each image
        // finishing its download shifts this section's total height —
        // without a refresh, SiteNav's dark-section ScrollTrigger keeps the
        // "bottom top" end position it measured before the images loaded,
        // so the nav flips back to the on-light treatment partway through
        // the section instead of staying on-dark for its whole real height.
        onLoad={() => ScrollTrigger.refresh()}
        className={`w-full h-auto ${photo.revealClassName}`}
      />
      <div ref={text.ref} style={{ transitionDelay: "100ms" }} className={`flex flex-col gap-1 ${text.revealClassName}`}>
        <h3 className="font-display text-[30px] leading-none lg:text-h3">{lab.title}</h3>
        <p className="font-body text-body">{lab.body}</p>
      </div>
    </div>
  );
}

export function LabFacilitiesGrid({ heading, intro, labs, sectionRef }: LabFacilitiesGridProps) {
  const introText = useReveal<HTMLDivElement>();

  return (
    <div ref={sectionRef} className="bg-surface-dark text-text-on-dark py-24">
      <FoldGrid>
        <div
          ref={introText.ref}
          className={`col-start-1 col-span-8 sm:col-span-4 flex flex-col gap-6 max-w-(--max-width-content) ${introText.revealClassName}`}
        >
          <h2 className="font-display text-[40px] leading-[50px] lg:text-h1">{heading}</h2>
          <p className="font-body text-body">{intro}</p>
        </div>
      </FoldGrid>

      {/* Same horizontal margins and gutter as FoldGrid (--spacing-page,
          gap-6), but a dedicated 3-column grid rather than subdividing
          FoldGrid's 8 columns — 8 doesn't split evenly into thirds, and
          three-per-row (wrapping the 6 labs into two even rows) is the
          point here, not alignment to the 8-col system's own breakpoints. */}
      <div className="mx-auto mt-16 grid max-w-(--max-width-page) grid-cols-1 gap-x-6 gap-y-16 px-(--spacing-page) sm:grid-cols-2 lg:grid-cols-3">
        {labs.map((lab) => (
          <LabCard key={lab.title} lab={lab} />
        ))}
      </div>
    </div>
  );
}

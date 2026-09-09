import type { RefObject } from "react";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

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
 * "Lab & Facilities Access" — intro copy (col1, per Figma) followed by an
 * even 5-up row of photo + title + body. New pattern, not covered by any
 * existing component (docs/FOUNDATIONS.md's "no Cards" call predates this
 * wireframe) — kept minimal: just this one grid, not a general Card family.
 */
export function LabFacilitiesGrid({ heading, intro, labs, sectionRef }: LabFacilitiesGridProps) {
  return (
    <div ref={sectionRef} className="bg-surface-dark text-text-on-dark py-24">
      <FoldGrid>
        <div className="col-start-1 col-span-4 flex flex-col gap-6 max-w-(--max-width-content)">
          <h2 className="font-display text-h1">{heading}</h2>
          <p className="font-body text-body">{intro}</p>
        </div>
      </FoldGrid>

      <div className="mt-16 grid grid-cols-1 gap-6 px-(--spacing-page) sm:grid-cols-2 lg:grid-cols-5">
        {labs.map((lab) => (
          <div key={lab.title} className="flex flex-col gap-4">
            <img
              src={withBasePath(lab.image)}
              alt=""
              className="aspect-[381/423] w-full object-cover"
            />
            <h3 className="font-display text-h3">{lab.title}</h3>
            <p className="font-body text-body">{lab.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

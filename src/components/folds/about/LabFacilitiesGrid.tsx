"use client";

import { useRef, type RefObject } from "react";
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
 * Standard arrow-right glyph, authored directly per the same reasoning as
 * TextLink's ArrowIcon — a generic universal icon, not a proprietary mark.
 */
function ArrowRightIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12H20" />
      <path d="M13 5L20 12L13 19" />
    </svg>
  );
}

/**
 * "Lab & Facilities Access" — intro copy (col1, per Figma) followed by a
 * horizontal, scroll-snapped carousel of photo + title + body cards
 * rather than a static grid: showing a partial next card at the edge (and
 * the hover-revealed arrow) signals there's more to scroll through, for a
 * lab count that may grow past what fits one row. New pattern, not
 * covered by any existing component (docs/FOUNDATIONS.md's "no Cards"
 * call predates this wireframe) — kept minimal: just this one carousel,
 * not a general Card/Carousel family, and no external carousel library
 * since scroll-snap + a native overflow scroller covers the whole ask.
 */
export function LabFacilitiesGrid({ heading, intro, labs, sectionRef }: LabFacilitiesGridProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollNext = () => {
    const scroller = scrollerRef.current;
    const firstCard = scroller?.firstElementChild as HTMLElement | null;
    if (!scroller || !firstCard) return;

    // Measure the actual rendered card width (it's a responsive fraction,
    // not a fixed px value) plus its gap, so one click advances by
    // exactly one card at any viewport size instead of a guessed amount.
    const gap = parseFloat(getComputedStyle(scroller).columnGap || "0");
    scroller.scrollBy({ left: firstCard.getBoundingClientRect().width + gap, behavior: "smooth" });
  };

  return (
    <div ref={sectionRef} className="group/carousel bg-surface-dark text-text-on-dark py-24">
      <FoldGrid>
        <div className="col-start-1 col-span-8 sm:col-span-4 flex flex-col gap-6 max-w-(--max-width-content)">
          <h2 className="font-display text-h1">{heading}</h2>
          <p className="font-body text-body">{intro}</p>
        </div>
      </FoldGrid>

      <div className="relative mt-16">
        <div
          ref={scrollerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth px-(--spacing-page) [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {labs.map((lab) => (
            <div
              key={lab.title}
              className="flex w-[78%] shrink-0 flex-col gap-4 sm:w-[45%] lg:w-[calc((100%-4*1.5rem)/4.5)]"
              style={{ scrollSnapAlign: "start" }}
            >
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

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Show more labs"
          className="absolute top-0 right-0 bottom-0 flex w-24 items-center justify-end bg-gradient-to-l from-surface-dark to-transparent pr-(--spacing-page) opacity-0 transition-opacity duration-300 group-hover/carousel:opacity-100"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-text-on-dark text-surface-dark transition-transform hover:scale-105">
            <ArrowRightIcon />
          </span>
        </button>
      </div>
    </div>
  );
}

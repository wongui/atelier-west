"use client";

import { Button } from "@/components/Button";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

/**
 * Fold6 — CTA. Full-viewport section with the frog render as a full-bleed
 * background image; text sits on top in col1-3, per Figma.
 */
export function Fold6Cta() {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative min-h-screen bg-surface-light">
      <img
        src={withBasePath("/images/fold-6-bg.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <FoldGrid className="relative h-full min-h-screen items-center py-24">
        <div
          ref={text.ref}
          className={`col-start-1 col-span-3 flex flex-col items-start gap-8 ${text.revealClassName}`}
        >
          <h2 className="font-display text-h1 text-text-on-light">
            Shape the future of Physical AI with us
          </h2>
          <p className="font-body text-body text-text-on-light">
            Designed for committed, ambitious teams building AI that
            operates in the physical world to solve validated problems,
            with proof of traction
          </p>
          <Button variant="cta" size="md">
            Apply
          </Button>
        </div>
      </FoldGrid>
    </div>
  );
}

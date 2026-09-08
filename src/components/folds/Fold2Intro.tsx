import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

/**
 * Fold2 — intro/fellowship statement. `fold-2.png` is already
 * pre-composed art (both photos already duotone-washed and blob-masked,
 * with real transparency) supplied directly — not a raw photo to run
 * through DuotoneImage's own grayscale/wash treatment. Image sits in
 * col1-3, text in col4-8, matching the Figma Fold2 frame.
 */
export function Fold2Intro() {
  return (
    <FoldGrid id="fold-2" className="bg-surface-light h-screen content-center">
      <img src={withBasePath("/images/fold-2.png")} alt="" className="col-start-1 col-span-3 self-center w-full" />
      <div className="col-start-4 col-span-5 self-center flex flex-col gap-6 max-w-(--max-width-content)">
        <h2 className="font-display text-h2 text-text-on-light">
          A fellowship for founders building machines with real specs and
          real instinct.
        </h2>
        <p className="font-body text-body text-text-on-light">
          Atelier West is a 12-week, cash- and equity-free, cohort-based
          residency based in San Francisco Mission Rock for Physical AI
          startups with lab access, expert mentorship, and enterprise
          partners, designed to give your technology a place to prove
          itself and scale.
        </p>
      </div>
    </FoldGrid>
  );
}

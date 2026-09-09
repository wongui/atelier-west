import { Button } from "@/components/Button";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

/**
 * Apply Fold1 — hero (desktop). Full-bleed background photo behind the
 * heading/subhead/CTA, same construction as Fold6Cta (absolute bg image +
 * FoldGrid content on top). Mobile is a genuinely different layout — a
 * fixed panel that stacks below the nav rather than a full-viewport
 * overlay — so it's a full sibling component (ApplyHeroMobile), not a
 * breakpoint variant of this one; see ApplyHeroMobile.tsx.
 *
 * min-h-[68vh], not a full viewport: per Figma metadata this fold is
 * 657px against the ~973px full-viewport reference height used elsewhere
 * (657/973 ≈ 68%) — deliberately shorter than the other full-bleed folds.
 */
export function ApplyHero() {
  return (
    <div className="relative min-h-[68vh] overflow-hidden bg-surface-light">
      <img
        src={withBasePath("/images/apply-hero-bg.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <FoldGrid className="relative min-h-[68vh] items-center py-24">
        <div className="col-start-1 col-span-4 flex flex-col items-start gap-6">
          <h1 className="font-display text-h2 text-text-on-light">Shape what&rsquo;s next</h1>
          <p className="max-w-(--max-width-content) font-display text-h3 text-text-on-light">
            Apply for the inaugural cohort taking place between October 2026
            and January 2027.
          </p>
          <Button variant="cta">Apply Now</Button>
        </div>
      </FoldGrid>
    </div>
  );
}

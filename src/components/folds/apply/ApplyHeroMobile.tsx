import { Button } from "@/components/Button";
import { withBasePath } from "@/lib/basePath";

/**
 * Mobile Fold1 — hero. Desktop lays the photo full-bleed behind the text;
 * mobile instead stacks a photo block on top that fades into the solid
 * background, with the heading/subhead/CTA sitting on that solid color
 * below it, per Figma's mobile frame — not just a resize of the desktop
 * treatment, so this is its own sibling component (see ApplyHero.tsx).
 */
export function ApplyHeroMobile() {
  return (
    <div className="flex flex-col bg-[#e1e0d6]">
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img
          src={withBasePath("/images/apply-hero-bg-mobile.png")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#e1e0d6]" />
      </div>
      <div className="flex flex-col items-start gap-4 px-(--spacing-page) pt-8 pb-16">
        <h1 className="font-display text-[40px] leading-[50px] text-text-on-light">
          Shape what&rsquo;s next
        </h1>
        <p className="font-display text-[23px] leading-[1.4] text-text-on-light">
          Apply for the inaugural cohort taking place between October 2026
          and January 2027.
        </p>
        <Button variant="cta" size="lg">
          Apply Now
        </Button>
      </div>
    </div>
  );
}

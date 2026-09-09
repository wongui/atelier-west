import { TextLink } from "@/components/TextLink";
import { withBasePath } from "@/lib/basePath";

/**
 * Mobile Fold8 — Belief. Desktop centers the brain render as a full-bleed
 * background with text at col6-8; mobile stacks the same treatment as
 * Fold6CtaMobile (full-bleed portrait background bleeding off the top,
 * text block sitting over a cream-tinted lower panel), per Figma's mobile
 * frame.
 */
export function Fold8BeliefMobile() {
  return (
    <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-surface-accent px-(--spacing-page) pb-16 pt-24">
      <img
        src={withBasePath("/images/fold-8-mobile.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-surface-accent/0 to-surface-accent" />

      <div className="relative flex flex-col items-start gap-6">
        <h2 className="font-display text-[30px] leading-[1.1] text-text-on-light">
          We believe that the future of AI is physical
        </h2>
        <p className="font-body text-body text-text-on-light">
          Atelier West is a 12-week, cash- and equity-free, cohort-based
          residency based in San Francisco Mission Rock for Physical AI
          startups with lab access, expert mentorship, and enterprise
          partners, designed to give your technology a place to prove
          itself and scale.
        </p>
        <TextLink href="#">
          Learn more about our commitment to Physical AI
        </TextLink>
      </div>
    </div>
  );
}

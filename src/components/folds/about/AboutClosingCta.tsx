import { Button } from "@/components/Button";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

interface AboutClosingCtaProps {
  heading: string;
  body: string[];
}

/**
 * About page's closing CTA — same full-bleed-photo-behind-copy shape as
 * the home page's Fold6Cta/Fold8Belief, reusing the same brain artwork
 * (already duotone-washed) as Fold8Belief's background, on the coral
 * surface-accent per Figma, with dark (on-light) text since this
 * background reads light enough for it, matching Fold8Belief's own
 * text-on-light choice on the same coral.
 */
export function AboutClosingCta({ heading, body }: AboutClosingCtaProps) {
  return (
    <div className="relative min-h-screen bg-surface-accent">
      <img
        src={withBasePath("/images/about-closing-cta-bg.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <FoldGrid className="relative h-full min-h-screen items-center py-24 text-text-on-light">
        <div className="col-start-1 col-span-3 flex flex-col items-start gap-8">
          <h2 className="font-display text-h2">{heading}</h2>
          <div className="flex flex-col gap-4">
            {body.map((paragraph, i) => (
              <p key={i} className="font-body text-body">
                {paragraph}
              </p>
            ))}
          </div>
          <Button variant="cta" size="md" href="/apply">
            Apply
          </Button>
        </div>
      </FoldGrid>
    </div>
  );
}

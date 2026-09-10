import type { RefObject } from "react";
import { EyebrowLabel } from "@/components/EyebrowLabel";
import { TextLink } from "@/components/TextLink";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

interface LogoMarkProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

/**
 * Fixed-size bounding box per logo, not just a height class — the marks
 * span very different native aspect ratios (Synapse's wordmark is
 * ~8:1, Capgemini's is ~4.5:1, frog's is ~1.7:1), so scaling all of
 * them to the same height alone still left the wide ones reading much
 * bigger than the tall ones. `object-contain` inside a shared box makes
 * every mark occupy the same visual footprint regardless of its native
 * proportions.
 */
function LogoMark({ src, alt, width, height, className = "" }: LogoMarkProps) {
  return (
    <span className={`flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full max-h-full w-full max-w-full object-contain"
      />
    </span>
  );
}

/**
 * Partner/credibility strip — sits right under Fold1's hero (per latest
 * Figma pass, node 721:463), not further down the page as the old
 * Fold7Partners did. Dark surface + a single row of 3 groups split by
 * hairline dividers at `lg` and up; the same 3 groups stack with
 * horizontal dividers below that, so this one component — no separate
 * mobile file — serves every breakpoint.
 *
 * The row layout only switches on at `lg` (1024px), not `md` (768px) —
 * three columns each carrying a label + a multi-logo row don't fit in
 * the 768–1024px range at their natural size, and squeezing them there
 * clipped the HSBC/AIE marks and crowded the divider lines. Below `lg`
 * they get the full-width stacked treatment instead, which has no such
 * ceiling.
 *
 * The cream (#FBFAE4) logo marks are dedicated assets exported from
 * Figma for this dark treatment — not the grayscale PNGs the
 * `/system` style-guide and PartnerLogoStrip still use, which were
 * authored for a light surface.
 */
interface PartnersStripProps {
  /** Passed through to SiteNav/MobileSiteNav's darkSectionRef(s) so the
   * nav switches to the on-dark (cream) treatment while this strip's dark
   * surface is under it — same idea as the ProgressionSection dark folds. */
  sectionRef?: RefObject<HTMLElement | null>;
}

export function PartnersStrip({ sectionRef }: PartnersStripProps) {
  return (
    <div ref={sectionRef as RefObject<HTMLDivElement>} className="bg-surface-dark text-text-on-dark">
      <FoldGrid className="py-12 lg:py-10">
        <div className="col-start-1 col-span-8 flex flex-col divide-y divide-current/20 lg:flex-row lg:divide-x lg:divide-y-0">
          <div className="flex min-w-0 flex-col items-center gap-6 pb-10 text-center lg:flex-1 lg:gap-8 lg:px-8 lg:pb-0 xl:px-10">
            <EyebrowLabel>Hosted by</EyebrowLabel>
            <LogoMark
              src={withBasePath("/images/logos/capgemini-cream.svg")}
              alt="Capgemini"
              width={209}
              height={46}
              className="h-10 w-32"
            />
            <TextLink href="#">Named a Market Shaper in Physical AI</TextLink>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-6 py-10 text-center lg:flex-1 lg:gap-8 lg:px-8 lg:py-0 xl:px-10">
            <EyebrowLabel>With support from</EyebrowLabel>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              <LogoMark
                src={withBasePath("/images/logos/nvidia-cream.svg")}
                alt="NVIDIA"
                width={150}
                height={28}
                className="h-10 w-32"
              />
              <LogoMark
                src={withBasePath("/images/logos/hsbc-cream.svg")}
                alt="HSBC"
                width={111}
                height={27}
                className="h-10 w-32"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-6 pt-10 text-center lg:flex-[1.15] lg:gap-8 lg:px-8 lg:pt-0 xl:px-10">
            <EyebrowLabel className="max-w-full lg:max-w-none">
              Together, our teams know how to build and bring new products to market:
            </EyebrowLabel>
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                <LogoMark
                  src={withBasePath("/images/logos/frog-cream.svg")}
                  alt="frog"
                  width={68}
                  height={41}
                  className="h-8 w-16"
                />
                <LogoMark
                  src={withBasePath("/images/logos/synapse-cream.svg")}
                  alt="Synapse"
                  width={156}
                  height={19}
                  className="h-8 w-24"
                />
                <LogoMark
                  src={withBasePath("/images/logos/aie-cream.svg")}
                  alt="Applied Innovation Exchange"
                  width={118}
                  height={44}
                  className="h-8 w-20"
                />
              </div>
              <LogoMark
                src={withBasePath("/images/logos/capgemini-engineering-cream.svg")}
                alt="Capgemini Engineering"
                width={249}
                height={40}
                className="h-7 w-32 opacity-70"
              />
            </div>
          </div>
        </div>
      </FoldGrid>
    </div>
  );
}

import { EyebrowLabel } from "@/components/EyebrowLabel";
import { TextLink } from "@/components/TextLink";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

/**
 * Partner/credibility strip — sits right under Fold1's hero (per latest
 * Figma pass, node 721:463), not further down the page as the old
 * Fold7Partners did. Dark surface + a single row of 3 groups split by
 * hairline dividers on desktop; the same 3 groups stack with horizontal
 * dividers on mobile (`divide-x`/`divide-y` swap at `md`, so this one
 * component — no separate mobile file — serves both, matching how the
 * old component worked before the redesign.
 *
 * The cream (#FBFAE4) logo marks are dedicated assets exported from
 * Figma for this dark treatment — not the grayscale PNGs the
 * `/system` style-guide and PartnerLogoStrip still use, which were
 * authored for a light surface.
 */
export function PartnersStrip() {
  return (
    <div className="bg-surface-dark text-text-on-dark">
      <FoldGrid className="py-12 md:py-10">
        <div className="col-start-1 col-span-8 flex flex-col divide-y divide-current/20 md:flex-row md:divide-x md:divide-y-0">
          <div className="flex flex-col items-center gap-6 pb-10 text-center md:flex-1 md:gap-8 md:px-10 md:pb-0">
            <EyebrowLabel>Hosted by</EyebrowLabel>
            <img
              src={withBasePath("/images/logos/capgemini-cream.svg")}
              alt="Capgemini"
              width={209}
              height={46}
              className="h-11 w-auto object-contain"
            />
            <TextLink href="#">Named a Market Shaper in Physical AI</TextLink>
          </div>

          <div className="flex flex-col items-center gap-6 py-10 text-center md:flex-1 md:gap-8 md:px-10 md:py-0">
            <EyebrowLabel>With support from</EyebrowLabel>
            <div className="flex items-center gap-10">
              <img
                src={withBasePath("/images/logos/nvidia-cream.svg")}
                alt="NVIDIA"
                width={150}
                height={28}
                className="h-9 w-auto object-contain"
              />
              <img
                src={withBasePath("/images/logos/hsbc-cream.svg")}
                alt="HSBC"
                width={111}
                height={27}
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-10 text-center md:flex-1 md:gap-8 md:px-10 md:pt-0">
            <EyebrowLabel className="max-w-[22ch]">
              Together, our teams know how to build and bring new products to market:
            </EyebrowLabel>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-8">
                <img
                  src={withBasePath("/images/logos/frog-cream.svg")}
                  alt="frog"
                  width={68}
                  height={41}
                  className="h-8 w-auto object-contain"
                />
                <img
                  src={withBasePath("/images/logos/synapse-cream.svg")}
                  alt="Synapse"
                  width={156}
                  height={19}
                  className="h-4 w-auto object-contain"
                />
                <img
                  src={withBasePath("/images/logos/aie-cream.svg")}
                  alt="Applied Innovation Exchange"
                  width={118}
                  height={44}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <img
                src={withBasePath("/images/logos/capgemini-engineering-cream.svg")}
                alt="Capgemini Engineering"
                width={249}
                height={40}
                className="h-7 w-auto object-contain opacity-70"
              />
            </div>
          </div>
        </div>
      </FoldGrid>
    </div>
  );
}

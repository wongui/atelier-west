import { PartnerLogoStrip } from "@/components/PartnerLogoStrip";
import { TextLink } from "@/components/TextLink";
import { Divider } from "@/components/Divider";
import { FoldGrid } from "@/components/FoldGrid";
import { withBasePath } from "@/lib/basePath";

/**
 * Fold7 — partner/credibility strip. Left-aligned within the grid
 * margins (not centered) — the eyebrows sit at col1 per Figma.
 *
 * The three groups (Hosted by / With support from / Together...) sit in
 * a 3-row grid with equal-height rows (`grid-rows-3`), not stacked with
 * organic content height — group 1 has an extra Gartner text link and
 * group 3 has 4 logos vs. group 2's 2, so letting each box size to its
 * own content made the three sections visibly uneven. Equal rows keep
 * the divider spacing proportional regardless of how much content is
 * in each group; each group's own content still starts right under its
 * divider (matches Figma's tight divider→label coupling) instead of
 * being centered in its box, so short groups just leave trailing space
 * before the next divider rather than drifting content around.
 *
 * min-h + items-center (not h-screen) centers the whole block per
 * Figma's 834px fold vs. the 973px full-viewport reference.
 */
export function Fold7Partners() {
  return (
    <FoldGrid className="min-h-[85vh] items-center bg-surface-light py-16 text-text-on-light">
      <div className="col-start-1 col-span-8 grid h-full grid-rows-3 gap-6 md:gap-10">
        <div className="flex flex-col gap-8 md:gap-10">
          <Divider />
          <PartnerLogoStrip
            label="Hosted by"
            partners={[{ name: "Capgemini", src: withBasePath("/images/logos/capgemini.png"), width: 209, height: 78 }]}
          />
          <TextLink href="#" className="self-center">
            Named a Market Shaper in Physical AI by Gartner
          </TextLink>
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          <Divider />
          <PartnerLogoStrip
            label="With support from"
            partners={[
              { name: "NVIDIA", src: withBasePath("/images/logos/nvidia.png"), width: 228, height: 47 },
              { name: "HSBC", src: withBasePath("/images/logos/hsbc.png"), width: 179, height: 47 },
            ]}
          />
        </div>

        <div className="flex flex-col gap-8 md:gap-10">
          <Divider />
          <PartnerLogoStrip
            label="Together, our teams know how to build and bring new products to market:"
            partners={[
              { name: "frog", src: withBasePath("/images/logos/frog.png"), width: 102, height: 62 },
              { name: "Synapse", src: withBasePath("/images/logos/synapse.png"), width: 260, height: 53 },
              { name: "Applied Innovation Exchange", src: withBasePath("/images/logos/aie.png"), width: 222, height: 69 },
              { name: "Capgemini Engineering", src: withBasePath("/images/logos/capgemini-engineering.png"), width: 374, height: 60 },
            ]}
          />
        </div>
      </div>
    </FoldGrid>
  );
}

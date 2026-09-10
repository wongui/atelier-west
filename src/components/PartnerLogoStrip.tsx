import { EyebrowLabel } from "./EyebrowLabel";

interface Partner {
  name: string;
  src: string;
  /** Intrinsic width/height so Next/Image-less <img> keeps aspect ratio at a fixed height. */
  width: number;
  height: number;
}

interface PartnerLogoStripProps {
  label: string;
  partners: Partner[];
  className?: string;
  /** Gap between the label and the logo row. Defaults to gap-8; the
   * "Together, our teams..." group passes a slightly larger value since
   * its label wraps to 2 lines, which otherwise reads as tighter than
   * the other two groups despite sharing the same gap value. */
  labelGap?: string;
}

/**
 * Eyebrow label + a centered row of partner logos at reduced opacity —
 * the recurring pattern behind Fold7's "Hosted by" / "With support
 * from" / "Together, our teams..." rows. The label stays left-aligned
 * (col1) but the logo row is centered across the full width, per Figma.
 */
export function PartnerLogoStrip({ label, partners, className = "", labelGap = "gap-8" }: PartnerLogoStripProps) {
  return (
    <div className={`flex flex-col items-start ${labelGap} ${className}`}>
      <EyebrowLabel>{label}</EyebrowLabel>
      <div className="flex w-full flex-wrap items-center justify-center gap-x-24 gap-y-6 opacity-50">
        {partners.map((partner) => (
          <img
            key={partner.name}
            src={partner.src}
            alt={partner.name}
            width={partner.width}
            height={partner.height}
            className="h-8 w-auto object-contain"
          />
        ))}
      </div>
    </div>
  );
}

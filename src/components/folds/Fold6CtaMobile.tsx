import { Button } from "@/components/Button";
import { withBasePath } from "@/lib/basePath";

/**
 * Mobile Fold6 — CTA. Desktop splits image/text side by side; mobile
 * stacks a dedicated portrait background image behind the text block, per
 * Figma's mobile frame (image bleeds off the top, text+button sit over a
 * cream-tinted lower panel).
 */
export function Fold6CtaMobile() {
  return (
    <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-surface-light px-(--spacing-page) pb-16 pt-24">
      <img
        src={withBasePath("/images/fold-6-mobile.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-surface-light/0 to-surface-light" />

      <div className="relative flex flex-col items-start gap-6">
        <h2 className="font-display text-[40px] leading-[50px] text-text-on-light">
          Shape the future of Physical AI with us
        </h2>
        <p className="font-body text-body text-text-on-light">
          Designed for committed, ambitious teams building AI that
          operates in the physical world to solve validated problems,
          with proof of traction.
        </p>
        <Button variant="cta" size="md">
          Apply
        </Button>
      </div>
    </div>
  );
}

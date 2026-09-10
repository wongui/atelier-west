"use client";

import { Button } from "@/components/Button";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

/**
 * Mobile Fold1 — hero. Same overlay construction as Fold6CtaMobile (bg
 * image absolute + text overlaid, anchored to the bottom) rather than the
 * earlier photo-fades-to-solid treatment — the image now fills the whole
 * fold, top-aligned (`object-top`) so nothing of the top of the frame gets
 * cropped. Unlike Fold6CtaMobile's image (which has its own quiet space
 * built in), this crop puts the subject right behind the text zone, so a
 * bottom-anchored scrim is added purely for legibility — it doesn't touch
 * the top two-thirds of the image, so the photo still reads as "full
 * space, top-aligned" rather than faded out like the old treatment. Same
 * 68vh height as desktop's ApplyHero (see that file for the Figma-derived
 * ratio) — this fold stays shorter than a full viewport on both
 * breakpoints, not just desktop.
 */
export function ApplyHeroMobile() {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative min-h-[68vh] overflow-hidden bg-surface-light">
      <img
        src={withBasePath("/images/apply-hero-bg-mobile.png")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-surface-light via-surface-light/70 to-transparent" />
      <div
        ref={text.ref}
        className={`relative flex min-h-[68vh] flex-col items-start justify-end gap-4 px-(--spacing-page) pt-24 pb-16 ${text.revealClassName}`}
      >
        <h1 className="font-display text-[40px] leading-[50px] text-text-on-light">
          Shape what&rsquo;s next
        </h1>
        <p className="font-display text-[23px] leading-[1.4] text-text-on-light">
          Apply for the inaugural cohort taking place between October 2026
          and January 2027.
        </p>
        <Button variant="cta">Apply Now</Button>
      </div>
    </div>
  );
}

"use client";

import { TextLink } from "@/components/TextLink";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

/**
 * Mobile Fold8 — Belief. Desktop centers the brain render as a full-bleed
 * background with text at col6-8; mobile instead caps the image to a fixed
 * viewport-relative band at the top, blending into the solid coral bg
 * behind the text below it — same treatment as the mobile hero's
 * image-to-bg blend.
 *
 * The image band is a fixed dvh height (not a % of the whole section) so
 * it stays a constant, "safe" size no matter how tall the copy below
 * runs — the section itself just grows to fit the text underneath. An
 * earlier version sized the image as a % of a min-height section, which
 * fell over once the copy grew past that minimum: percentage heights on
 * an absolutely-positioned child don't resolve reliably against an
 * intrinsically-sized (min-height only) ancestor, so the image and text
 * ended up overlapping.
 */
export function Fold8BeliefMobile() {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative flex flex-col overflow-hidden bg-surface-accent">
      <div className="relative h-[70dvh] w-full shrink-0">
        <img
          src={withBasePath("/images/fold-8-mobile.png")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Blends the image's bottom edge into the solid coral bg behind
            the text, same technique as Fold1HeroMobile's image-to-bg
            blend. */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-surface-accent/0 to-surface-accent" />
      </div>

      <div ref={text.ref} className={`relative flex flex-col items-start gap-6 px-(--spacing-page) pt-10 pb-16 ${text.revealClassName}`}>
        <h2 className="font-display text-[30px] leading-[1.1] text-text-on-light">
          The future of AI is physical
        </h2>
        <div className="flex flex-col gap-4">
          <p className="font-body text-body text-text-on-light">
            We are physical beings, in a physical world, with physical
            problems.
          </p>
          <p className="font-body text-body text-text-on-light">
            For years, AI got smarter on a screen, delivering better
            answers, faster and at scale. That mattered.
          </p>
          <p className="font-body text-body text-text-on-light">
            The next chapter is intelligence that acts, sensing its
            environment, understanding what&apos;s needed, and taking
            action in the physical world where people live, work, and
            move.
          </p>
          <p className="font-body text-body text-text-on-light">
            We believe the biggest opportunities emerge where Physical AI
            meets human need: factories, hospitals, warehouses, homes,
            infrastructure, and everything in between.
          </p>
          <p className="font-body text-body text-text-on-light">
            But that belief only means something once it&apos;s made
            real. So we built a place where founders, researchers,
            enterprises, and operators work side by side to build,
            validate, and deploy what comes next.
          </p>
          <p className="font-body text-body text-text-on-light">
            It&apos;s also why there&apos;s no equity or cash exchanged.
            Just access to the environments and expertise needed to
            jointly turn promising technology into real-world impact.
          </p>
        </div>
        <TextLink
          href="https://www.frog.co/designmind/design-mind-frogcast-ep-60-co-evolving-with-physical-ai"
          external
        >
          Learn more about our commitment
          <br />
          to Physical AI
        </TextLink>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/Button";
import { withBasePath } from "@/lib/basePath";
import { useReveal } from "@/lib/useReveal";

interface AboutClosingCtaMobileProps {
  heading: string;
  body: string[];
}

/**
 * Mobile About closing CTA — same shape as Fold8BeliefMobile: the image
 * caps at the top 70% of the section, blending into the solid coral bg
 * behind the text below it, reusing that fold's mobile artwork per
 * Figma's mobile frame.
 */
export function AboutClosingCtaMobile({ heading, body }: AboutClosingCtaMobileProps) {
  const text = useReveal<HTMLDivElement>();

  return (
    <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-surface-accent px-(--spacing-page) pb-16 pt-24">
      <img
        src={withBasePath("/images/fold-8-mobile.png")}
        alt=""
        className="absolute inset-x-0 top-0 h-[70%] w-full object-cover"
      />
      {/* Blends the image's bottom edge into the solid coral bg behind the
          text, same technique as Fold1HeroMobile's image-to-bg blend. */}
      <div className="absolute inset-x-0 top-[calc(70%-8rem)] h-32 bg-gradient-to-b from-surface-accent/0 to-surface-accent" />

      <div ref={text.ref} className={`relative flex flex-col items-start gap-6 ${text.revealClassName}`}>
        <h2 className="font-display text-[30px] leading-[1.1] text-text-on-light">{heading}</h2>
        <div className="flex flex-col gap-4">
          {body.map((paragraph, i) => (
            <p key={i} className="font-body text-body text-text-on-light">
              {paragraph}
            </p>
          ))}
        </div>
        <Button variant="cta" size="md" href="/apply">
          Apply
        </Button>
      </div>
    </div>
  );
}

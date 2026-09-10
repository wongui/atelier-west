"use client";

import type { RefObject } from "react";
import { useReveal } from "@/lib/useReveal";

type Bg = "light" | "dark";

const bgClassName: Record<Bg, string> = {
  light: "bg-surface-light text-text-on-light",
  dark: "bg-surface-dark text-text-on-dark",
};

interface ImageTextFoldMobileProps {
  id?: string;
  bg: Bg;
  image: string;
  imageAlt?: string;
  heading: string;
  body: string | string[];
  /** Exposes the section's wrapper — for `bg="dark"` instances, lets
   * MobileSiteNav watch it and swap to the on-dark treatment, same
   * mechanism as desktop ImageTextFold. */
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Mobile counterpart to ImageTextFold — image stacks above heading/body
 * (desktop is a side-by-side col1-3/col4-8 row), same shape as
 * Fold2IntroMobile's stacking of desktop's Fold2Intro. Own component so
 * desktop's file stays untouched.
 *
 * Renders the photo at its own natural aspect ratio (no forced box, no
 * object-cover crop, no organic mask) — see desktop ImageTextFold for why.
 */
export function ImageTextFoldMobile({
  id,
  bg,
  image,
  imageAlt = "",
  heading,
  body,
  sectionRef,
}: ImageTextFoldMobileProps) {
  const paragraphs = Array.isArray(body) ? body : [body];
  const photo = useReveal<HTMLImageElement>();
  const text = useReveal<HTMLDivElement>();

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`flex flex-col gap-9 px-(--spacing-page) py-16 ${bgClassName[bg]}`}
    >
      <img
        ref={photo.ref}
        src={image}
        alt={imageAlt}
        className={`w-full h-auto ${photo.revealClassName}`}
        style={{ transitionDelay: "100ms" }}
      />
      <div ref={text.ref} className={`flex flex-col gap-6 ${text.revealClassName}`}>
        <h2 className="font-display text-[30px] leading-[1.1]">{heading}</h2>
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="font-body text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

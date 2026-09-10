"use client";

import type { RefObject } from "react";
import { FoldGrid } from "@/components/FoldGrid";
import { useReveal } from "@/lib/useReveal";

type Bg = "light" | "dark";

const bgClassName: Record<Bg, string> = {
  light: "bg-surface-light text-text-on-light",
  dark: "bg-surface-dark text-text-on-dark",
};

interface ImageTextFoldProps {
  id?: string;
  bg: Bg;
  image: string;
  imageAlt?: string;
  heading: string;
  /** One paragraph, or several rendered with gaps between — matches the
   * blank-line-separated paragraphs in the Figma copy (e.g. Cost & Commitment). */
  body: string | string[];
  /** Exposes the section's wrapper — for `bg="dark"` instances, lets
   * SiteNav watch it and swap to the on-dark treatment while it's the
   * pinned backdrop, same mechanism as ProgressionSection. */
  sectionRef?: RefObject<HTMLDivElement | null>;
}

/**
 * Image (col1-3) + heading/body (col4-8) — the repeating About page
 * pattern behind Cost & Commitment, Events & Enterprise Access, Partner
 * Benefits, and the top intro statement. Same column split as the home
 * page's Fold2Intro, but parameterized (bg, image, copy) since each About
 * section needs its own image and can flip light/dark — kept as one
 * component, not four near-duplicates.
 *
 * Renders the photo at its own natural aspect ratio (no forced box, no
 * object-cover crop, no organic mask) — these are real photos supplied
 * as-is, not placeholder art meant for the duotone-mask treatment, and a
 * fixed aspect box cropped two of them since their native ratio didn't
 * match it.
 *
 * v2: hugs its content (`py-16`) instead of forcing a fixed `min-h-[65vh]`
 * — that fixed height left dead space below shorter sections (e.g. Cost &
 * Commitment). `gridClassName="items-center"` is dropped along with it:
 * FoldGrid's inner grid is a single auto-sized row, so grid-level
 * `items-center` had nothing to center against once the row wasn't being
 * forced taller than its content anyway (same non-effect as ApplyHero's
 * old centering, before that was fixed with `flex justify-center`) — not
 * needed here since content is top-of-row by default once the fold just
 * hugs it.
 */
export function ImageTextFold({
  id,
  bg,
  image,
  imageAlt = "",
  heading,
  body,
  sectionRef,
}: ImageTextFoldProps) {
  const paragraphs = Array.isArray(body) ? body : [body];
  const photo = useReveal<HTMLImageElement>();
  const text = useReveal<HTMLDivElement>();

  return (
    <FoldGrid
      ref={sectionRef}
      id={id}
      className={`py-16 ${bgClassName[bg]}`}
    >
      <img
        ref={photo.ref}
        src={image}
        alt={imageAlt}
        className={`col-start-1 col-span-3 self-center w-full h-auto ${photo.revealClassName}`}
      />
      <div
        ref={text.ref}
        style={{ transitionDelay: "100ms" }}
        className={`col-start-4 col-span-5 self-center flex flex-col gap-6 max-w-(--max-width-content) ${text.revealClassName}`}
      >
        <h2 className="font-display text-h2">{heading}</h2>
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph, i) => (
            <p key={i} className="font-body text-body">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </FoldGrid>
  );
}

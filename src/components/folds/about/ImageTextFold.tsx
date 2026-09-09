import type { RefObject } from "react";
import { DuotoneImage } from "@/components/DuotoneImage";
import { FoldGrid } from "@/components/FoldGrid";

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
  /** Omit for real photography — see DuotoneImage. */
  wash?: "warm" | "cool";
  shape?: "blob-a" | "blob-b";
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
 * section needs its own placeholder image and can flip light/dark — kept
 * as one component, not four near-duplicates, so swapping in real
 * photography later only ever means changing the `image` prop passed in
 * from the About page, not editing repeated markup.
 */
export function ImageTextFold({
  id,
  bg,
  image,
  imageAlt = "",
  wash,
  shape = "blob-a",
  heading,
  body,
  sectionRef,
}: ImageTextFoldProps) {
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <FoldGrid
      ref={sectionRef}
      id={id}
      className={`min-h-[65vh] items-center py-16 ${bgClassName[bg]}`}
    >
      <DuotoneImage
        src={image}
        alt={imageAlt}
        wash={wash}
        shape={shape}
        className="col-start-1 col-span-3 self-center aspect-[613/393]"
      />
      <div className="col-start-4 col-span-5 self-center flex flex-col gap-6 max-w-(--max-width-content)">
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

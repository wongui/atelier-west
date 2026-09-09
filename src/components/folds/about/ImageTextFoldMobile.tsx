import type { RefObject } from "react";
import { DuotoneImage } from "@/components/DuotoneImage";

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
  wash?: "warm" | "cool";
  shape?: "blob-a" | "blob-b";
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
 */
export function ImageTextFoldMobile({
  id,
  bg,
  image,
  imageAlt = "",
  wash = "warm",
  shape = "blob-a",
  heading,
  body,
  sectionRef,
}: ImageTextFoldMobileProps) {
  const paragraphs = Array.isArray(body) ? body : [body];

  return (
    <div
      ref={sectionRef}
      id={id}
      className={`flex flex-col gap-9 px-(--spacing-page) py-16 ${bgClassName[bg]}`}
    >
      <DuotoneImage
        src={image}
        alt={imageAlt}
        wash={wash}
        shape={shape}
        className="aspect-[613/393] w-full"
      />
      <div className="flex flex-col gap-6">
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

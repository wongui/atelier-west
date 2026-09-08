import Image from "next/image";

type Wash = "warm" | "cool";
type MaskShape = "blob-a" | "blob-b" | "none";

const washClassName: Record<Wash, string> = {
  warm: "bg-wash-warm",
  cool: "bg-wash-cool",
};

const maskClassName: Record<MaskShape, string> = {
  "blob-a": "mask-blob-a",
  "blob-b": "mask-blob-b",
  none: "",
};

interface DuotoneImageProps {
  src: string;
  alt: string;
  wash: Wash;
  shape?: MaskShape;
  className?: string;
}

/**
 * The recurring "organic mask + duotone wash" treatment used across
 * Fold2/Fold6/Fold8/Footer — reproduced with a grayscale filter + a
 * color-blend overlay instead of the WebGPU shaders in the Figma file
 * (see brief: those aren't renderable as real CSS/React).
 */
export function DuotoneImage({
  src,
  alt,
  wash,
  shape = "none",
  className = "",
}: DuotoneImageProps) {
  return (
    <div
      className={`relative overflow-hidden ${maskClassName[shape]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover grayscale"
      />
      <div
        aria-hidden
        className={`absolute inset-0 mix-blend-color ${washClassName[wash]}`}
      />
    </div>
  );
}

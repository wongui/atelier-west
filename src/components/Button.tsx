import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "cta" | "nav";
type Size = "md";

const baseClassName =
  "relative inline-flex items-center justify-center overflow-hidden " +
  "font-body text-ui uppercase tracking-wide group " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current";

const variantBgClassName: Record<Variant, string> = {
  cta: "bg-accent-cta",
  nav: "bg-accent-cta-alt",
};

// Both variants (and the inverted cream fill) always sweep to the same
// coral on hover — a fixed brand color, not a per-variant one, so hover
// reads consistently everywhere instead of sometimes brick, sometimes
// slate, sometimes charcoal.
const variantHoverClassName: Record<Variant, string> = {
  cta: "bg-accent-cta-hover",
  nav: "bg-accent-cta-alt-hover",
};

// md: px-6/py-3 (24/12px) — nav bar "Apply" and Fold6's "Apply", ~46px
// tall, matching Figma exactly for both. min-w keeps the button the same
// footprint it had with the longer "Apply now" label, now that the copy
// is shorter. The larger ~83px-tall buttons (Apply page hero/Entry
// Criteria) are ButtonXL, not a size here — see that component for why.
const sizeClassName: Record<Size, string> = {
  md: "px-6 py-3 min-w-[130px]",
};

interface ButtonProps {
  variant?: Variant;
  size?: Size;
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  /**
   * Swaps to a cream fill + charcoal label (hover still sweeps to coral,
   * label flips to cream on hover) — used by the nav "Apply" button
   * while it's over a dark/photo section (Folds 3-5), where the
   * variant's normal charcoal fill would blend into the dark backdrop
   * instead of standing out.
   */
  invert?: boolean;
}

/**
 * Rectangular button — the only button shape in the system (see
 * docs/FOUNDATIONS.md, Actions family). Squared off from the earlier
 * pill shape per the latest visual pass. Each variant sweeps to its own
 * hover fill via the same vertical bottom-to-top wipe as ButtonXL (see
 * that component for why: a circle needs the `scale` CSS property
 * animated via `transition-[scale]`, not `transition-transform`, and a
 * straight-edged fill stays crisp at any button width) — kept identical
 * across both components so every button on the site shares one hover
 * interaction, just at a different footprint.
 *
 * `cta` (primary, charcoal -> coral on hover — Fold6 "Apply")
 * `nav` (secondary, charcoal -> coral on hover — nav bar "Apply")
 */
export function Button({
  variant = "cta",
  size = "md",
  href,
  children,
  className = "",
  onClick,
  invert = false,
}: ButtonProps) {
  const bgClassName = invert ? "bg-surface-light" : variantBgClassName[variant];
  const textClassName = invert ? "text-text-on-light" : "text-text-on-dark";
  const hoverBgClassName = variantHoverClassName[variant];
  const classes = `${baseClassName} ${sizeClassName[size]} ${bgClassName} ${textClassName} ${className}`;

  const content = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom [scale:1_0] transition-[scale] duration-500 ease-out group-hover:[scale:1_1] ${hoverBgClassName}`}
      />
      <span className={`relative z-10 ${invert ? "group-hover:text-text-on-dark" : ""}`}>
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}

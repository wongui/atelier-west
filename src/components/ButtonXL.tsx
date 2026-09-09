import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonXLProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}

/**
 * Large-format button — Apply page's hero CTA and Entry Criteria CTA only
 * (Figma: ~83px tall, squared corners, no pill radius, no min-width
 * footprint — unlike Button, which is pill-shaped and much shorter).
 *
 * Button's hover is a small circle centered in the label, scaled up to
 * cover the whole fill on `:hover`. That breaks down at this footprint
 * two ways: (1) `transition-transform` never actually animates it —
 * Tailwind v4's `scale-*` utilities set the native CSS `scale` property,
 * a separate animatable property from `transform`, so the "transition"
 * is really an instant jump, which reads as a pixelated pop rather than
 * a smooth grow; (2) even once that's fixed, a circle wide enough to
 * reach the far corners of a long or full-width rectangular button needs
 * a huge scale factor, and on the full-width Entry Criteria button it
 * doesn't reach the corners at all — the sweep visibly stops partway.
 * A plain vertical wipe (full width already, only height animates,
 * bottom-anchored, transitioning the actual `scale` property) stays a
 * crisp straight edge at any button width, so this is a separate
 * component rather than a third Button size.
 */
export function ButtonXL({ href, children, className = "", onClick }: ButtonXLProps) {
  const classes =
    "group relative inline-flex h-[83px] items-center justify-center overflow-hidden " +
    "bg-accent-cta px-8 font-body text-ui uppercase tracking-wide text-text-on-dark " +
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current " +
    className;

  const content = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom [scale:1_0] bg-accent-cta-hover transition-[scale] duration-500 ease-out group-hover:[scale:1_1]"
      />
      <span className="relative z-10">{children}</span>
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

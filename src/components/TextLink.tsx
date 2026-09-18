import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Standard arrow-up-right glyph — authored directly since it's a generic
 * universal icon, not a proprietary brand mark. Unlike the blob masks
 * (which approximate a specific Figma shape and are flagged as such),
 * this one isn't standing in for anything more specific.
 */
function ArrowIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 14 14"
      className="size-[0.85em] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 10.5L10.5 3.5" />
      <path d="M4.5 3.5H10.5V9.5" />
    </svg>
  );
}

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Opens in a new tab (target="_blank") — for links off to another
   * site, so visitors don't lose their place on this one. */
  external?: boolean;
}

/**
 * Underlined text link with a trailing arrow — used for "Learn more"
 * (Fold8) and "Named a Market Shaper..." (Fold7).
 */
export function TextLink({ href, children, className = "", external = false }: TextLinkProps) {
  const classes = `inline-flex items-center gap-2 font-body text-body underline underline-offset-2 hover:opacity-80 transition-opacity ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <ArrowIcon />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

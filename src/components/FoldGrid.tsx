import type { ReactNode } from "react";

/**
 * The site's 8-column grid — full-bleed to the viewport edge minus
 * --spacing-page margins, 24px gutters, columns stretch (not fixed
 * width). Matches the grid guide in the Figma reference frame exactly;
 * see docs/FOUNDATIONS.md §3. Every fold's content should be placed via
 * col-start/col-span on this, not a separate centered max-w container.
 */
export function FoldGrid({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`grid grid-cols-8 gap-6 px-(--spacing-page) ${className}`}>
      {children}
    </div>
  );
}
